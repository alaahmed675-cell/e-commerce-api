const Joi = require('joi');
const AppError = require('../utils/AppError');

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().max(500).allow('').optional(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  description: Joi.string().trim().max(500).allow('').optional(),
}).min(1);

const validateCreateCategory = (req, res, next) => {
  const { error, value } = createCategorySchema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((d) => d.message).join(', ');
    return next(new AppError(message, 400));
  }
  req.body = value;
  next();
};

const validateUpdateCategory = (req, res, next) => {
  const { error, value } = updateCategorySchema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((d) => d.message).join(', ');
    return next(new AppError(message, 400));
  }
  req.body = value;
  next();
};

module.exports = { validateCreateCategory, validateUpdateCategory };
