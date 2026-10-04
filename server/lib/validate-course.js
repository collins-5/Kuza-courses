const Joi = require('joi');

const ValidateCourse = (course) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        instructor: Joi.string().min(2).required(),
        duration: Joi.string().required(),
        price: Joi.number().min(0).required(),
        level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced').required()
    });

    return schema.validate(course);
};

exports.ValidateCourse = ValidateCourse;
