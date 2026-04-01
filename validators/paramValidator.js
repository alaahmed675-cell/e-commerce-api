const { param, query, validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

const validateMongoId = (paramName) => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName} format`),
];

const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map((e) => e.msg).join(', ');
    return next(new AppError(message, 400));
  }
  next();
};

module.exports = { validateMongoId, validatePagination, validate };
