const Joi = require('joi');
const AppError = require('../utils/AppError');

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).required(),
  description: Joi.string().trim().max(1000).allow('').optional(),
  price: Joi.number().positive().required(),
  categoryId: Joi.string().required(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).optional(),
  description: Joi.string().trim().max(1000).allow('').optional(),
  price: Joi.number().positive().optional(),
  categoryId: Joi.string().optional(),
}).min(1);

const validateCreateProduct = (req, res, next) => {
  const { error, value } = createProductSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((d) => d.message).join(', ');
    return next(new AppError(message, 400));
  }
  req.body = value;
  next();
};

const validateUpdateProduct = (req, res, next) => {
  const { error, value } = updateProductSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((d) => d.message).join(', ');
    return next(new AppError(message, 400));
  }
  req.body = value;
  next();
};

module.exports = { validateCreateProduct, validateUpdateProduct };
