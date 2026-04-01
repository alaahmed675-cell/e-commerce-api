const catchAsync = require('../utils/catchAsync');
const productService = require('../services/productService');
const AppError = require('../utils/AppError');

const getAll = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const filters = {};
  if (req.query.categoryId) {
    filters.categoryId = req.query.categoryId;
  }

  const result = await productService.getAllProducts(filters, page, limit);

  res.json({
    success: true,
    count: result.products.length,
    total: result.total,
    page: result.page,
    limit: result.limit,
    data: result.products,
  });
});

const getById = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  res.json({
    success: true,
    data: product,
  });
});

const create = catchAsync(async (req, res) => {
  const data = {
    ...req.body,
    createdBy: req.user.id,
  };
  const product = await productService.createProduct(data);

  res.status(201).json({
    success: true,
    data: product,
  });
});

const update = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);

  res.json({
    success: true,
    data: product,
  });
});

const remove = catchAsync(async (req, res) => {
  await productService.deleteProduct(req.params.id);

  res.json({
    success: true,
    message: 'Product deleted successfully',
  });
});

const uploadImage = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError('No image file provided', 400);
  }

  const imagePath = `/uploads/${req.file.filename}`;
  const product = await productService.updateProductImage(req.params.id, imagePath);

  res.json({
    success: true,
    data: product,
  });
});

module.exports = { getAll, getById, create, update, remove, uploadImage };
