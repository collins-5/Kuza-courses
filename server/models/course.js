const mongoose = require('mongoose');

const noteBlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['heading', 'paragraph', 'code', 'tip', 'list'],
    },
    text: { type: String, default: undefined },
    items: { type: [String], default: undefined },
    lang: { type: String, default: undefined },
  },
  { _id: false }
);

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
    trim: true,
  },
  duration: { type: String, trim: true, default: '' },
  summary: { type: String, trim: true, maxlength: 500, default: '' },
  videoUrl: { type: String, trim: true, default: '' },
  notes: { type: [noteBlockSchema], default: [] },
  takeaways: { type: [String], default: [] },
});

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
    trim: true,
  },
  lectures: { type: [lectureSchema], default: [] },
});

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
    },
    instructor: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    level: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    modules: { type: [moduleSchema], default: [] },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Course', courseSchema);