require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./lib/db');
const Course = require('./models/course');

const seedCourses = [
  { name: 'React for Beginners', instructor: 'Sarah Jenkins', duration: '12 hours', price: 49.99, level: 'Beginner' },
  { name: 'Advanced Node.js & Express', instructor: 'Alex Rivera', duration: '18 hours', price: 79.99, level: 'Advanced' },
  { name: 'TypeScript Mastery', instructor: 'Emma Watson', duration: '8 hours', price: 29.99, level: 'Intermediate' },
  { name: 'Full-Stack Next.js Applications', instructor: 'Sarah Jenkins', duration: '24 hours', price: 99.99, level: 'Advanced' },
  { name: 'Vue.js Essentials', instructor: 'Liam Smith', duration: '10 hours', price: 39.99, level: 'Beginner' },
  { name: 'Introduction to PostgreSQL', instructor: 'David Kim', duration: '10 hours', price: 39.99, level: 'Beginner' },
];

(async () => {
  await connectDB();
  await Course.deleteMany({});
  await Course.insertMany(seedCourses);
  console.log('✅ Database seeded');
  mongoose.connection.close();
})();