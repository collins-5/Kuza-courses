const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/course');
const { ValidateCourse, ValidateModules } = require('../lib/validate-course');
const { protect } = require('../middleware/auth');

function checkId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Invalid course ID.');
  }
  next();
}

function isOwner(course, user) {
  return course.createdBy.equals(user._id);
}

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .select('-modules')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.send(courses);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/:id', checkId, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );
    if (!course) return res.status(404).send('Course not found.');

    res.send(course);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/', protect, async (req, res) => {
  const { error } = ValidateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const course = await Course.create({
      name: req.body.name,
      instructor: req.body.instructor,
      duration: req.body.duration,
      price: req.body.price,
      level: req.body.level,
      modules: req.body.modules || [],
      createdBy: req.user._id,
    });

    const populated = await course.populate('createdBy', 'name email');
    res.status(201).send(populated);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put('/:id', protect, checkId, async (req, res) => {
  const { error } = ValidateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send('Course not found.');
    if (!isOwner(course, req.user)) {
      return res.status(403).send('Only the course owner can edit this course.');
    }

    course.set({
      name: req.body.name,
      instructor: req.body.instructor,
      duration: req.body.duration,
      price: req.body.price,
      level: req.body.level,
    });
    if (req.body.modules !== undefined) course.modules = req.body.modules;

    await course.save();
    const populated = await course.populate('createdBy', 'name email');
    res.send(populated);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put('/:id/modules', protect, checkId, async (req, res) => {
  const { error, value } = ValidateModules(req.body.modules);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send('Course not found.');
    if (!isOwner(course, req.user)) {
      return res.status(403).send('Only the course owner can edit this course.');
    }

    course.modules = value;
    await course.save();
    const populated = await course.populate('createdBy', 'name email');
    res.send(populated);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.delete('/:id', protect, checkId, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send('Course not found.');
    if (!isOwner(course, req.user)) {
      return res
        .status(403)
        .send('Only the course owner can delete this course.');
    }

    await course.deleteOne();
    res.send(course);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;