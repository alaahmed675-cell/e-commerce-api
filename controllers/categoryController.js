const catchAsync = require('../utils/catchAsync');
const categoryService = require('../services/categoryService');

const getAll = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const result = await categoryService.getAllCategories(page, limit);

  res.json({
    success: true,
    count: result.categories.length,
    total: result.total,
    page: result.page,
    limit: result.limit,
    data: result.categories,
  });
});

const getById = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);

  res.json({
    success: true,
    data: category,
  });
});

const create = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);

  res.status(201).json({
    success: true,
    data: category,
  });
});

const update = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);

  res.json({
    success: true,
    data: category,
  });
});

const remove = catchAsync(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);

  res.json({
    success: true,
    message: 'Category deleted successfully',
  });
});

module.exports = { getAll, getById, create, update, remove };
