const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/course');
const { ValidateCourse } = require('../lib/validate-course');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.send(courses);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send('Invalid course ID.');
    }

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
      createdBy: req.user._id,
    });

    const populated = await course.populate('createdBy', 'name email');
    res.status(201).send(populated);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put('/:id', protect, async (req, res) => {
  const { error } = ValidateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send('Invalid course ID.');
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        instructor: req.body.instructor,
        duration: req.body.duration,
        price: req.body.price,
        level: req.body.level,
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!course) return res.status(404).send('Course not found.');

    res.send(course);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send('Invalid course ID.');
    }

    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) return res.status(404).send('Course not found.');

    res.send(deletedCourse);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;