const Joi = require('joi');

const noteBlock = Joi.object({
  type: Joi.string()
    .valid('heading', 'paragraph', 'code', 'tip', 'list')
    .required(),
  text: Joi.string().allow('').max(5000),
  items: Joi.array().items(Joi.string().max(500)).max(50),
  lang: Joi.string().max(20),
});

const lecture = Joi.object({
  _id: Joi.string(),
  title: Joi.string().min(2).max(200).required(),
  duration: Joi.string()
    .pattern(/^\d{1,3}:\d{2}$/)
    .allow(''),
  summary: Joi.string().allow('').max(500),
  videoUrl: Joi.string().uri().allow(''),
  notes: Joi.array().items(noteBlock).max(200),
  takeaways: Joi.array().items(Joi.string().max(300)).max(20),
});

const courseModule = Joi.object({
  _id: Joi.string(),
  title: Joi.string().min(2).max(200).required(),
  lectures: Joi.array().items(lecture).max(100),
});

const modulesSchema = Joi.array().items(courseModule).max(50);

const courseSchema = Joi.object({
  name: Joi.string().min(3).required(),
  instructor: Joi.string().min(2).required(),
  duration: Joi.string().required(),
  price: Joi.number().min(0).required(),
  level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced').required(),
  modules: modulesSchema,
});

const coursePatchSchema = courseSchema
  .fork(['name', 'instructor', 'duration', 'price', 'level'], (field) =>
    field.optional()
  )
  .min(1)
  .messages({ 'object.min': 'Provide at least one field to update.' });

function ValidateCourse(body) {
  return courseSchema.validate(body);
}

function ValidateCoursePatch(body) {
  return coursePatchSchema.validate(body);
}

function ValidateModules(modules) {
  return modulesSchema.required().validate(modules);
}

module.exports = { ValidateCourse, ValidateCoursePatch, ValidateModules };