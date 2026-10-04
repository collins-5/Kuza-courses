require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Course = require('./models/course');
const User = require('./models/user');
const { ValidateModules } = require('./lib/validate-course');

const COURSE = {
  name: 'CSS Animation Studio',
  instructor: 'Lena Mwangi',
  price: 0,
  level: 'Beginner',
};

function totalDuration(modules) {
  let seconds = 0;
  for (const m of modules) {
    for (const l of m.lectures) {
      const [min, sec] = (l.duration || '0:00').split(':').map(Number);
      seconds += min * 60 + sec;
    }
  }
  const minutes = Math.round(seconds / 60);
  const h = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (h === 0) return `${rest} minutes`;
  return rest === 0 ? `${h} hours` : `${h}h ${rest}m`;
}

async function findOwner(email) {
  if (email) return User.findOne({ email: email.toLowerCase() });
  return User.findOne().sort({ createdAt: 1 });
}

async function main() {
  const ownerEmail = process.argv[2] || process.env.SEED_OWNER_EMAIL;
  const file = path.join(__dirname, 'curriculum.json');

  const modules = JSON.parse(fs.readFileSync(file, 'utf8'));
  const { error } = ValidateModules(modules);
  if (error) {
    process.stderr.write(`Invalid curriculum: ${error.details[0].message}\n`);
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    process.stderr.write(
      'No database URL found. Set MONGODB_URI (or MONGO_URI) in your .env file.\n'
    );
    process.exit(1);
  }

  await mongoose.connect(uri);

  let course = await Course.findOne({ name: COURSE.name });
  const duration = totalDuration(modules);

  if (course) {
    course.modules = modules;
    course.duration = duration;
    await course.save();
    process.stdout.write(`Updated "${course.name}" with the curriculum.\n`);
  } else {
    const owner = await findOwner(ownerEmail);
    if (!owner) {
      process.stderr.write(
        ownerEmail
          ? `No user found with email ${ownerEmail}.\n`
          : 'No users exist yet. Register an account first, then run this again.\n'
      );
      await mongoose.disconnect();
      process.exit(1);
    }

    course = await Course.create({
      ...COURSE,
      duration,
      modules,
      createdBy: owner._id,
    });
    process.stdout.write(
      `Created "${course.name}" owned by ${owner.email}.\n`
    );
  }

  const count = modules.reduce((n, m) => n + m.lectures.length, 0);
  process.stdout.write(
    `${modules.length} modules, ${count} lectures, ${duration}. Course ID: ${course._id}\n`
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  process.stderr.write(`${err.message}\n`);
  process.exit(1);
});