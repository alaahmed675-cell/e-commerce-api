const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');

const getAllProducts = async (filters = {}, page = 1, limit = 10) => {
  const query = {};
  if (filters.categoryId) {
    query.categoryId = filters.categoryId;
  }

  const skip = (page - 1) * limit;
  const products = await Product.find(query)
    .populate('categoryId', 'name description')
    .populate('createdBy', 'name email')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(query);

  return { products, total, page, limit };
};
const getProductById = async (id) => {
  const product = await Product.findById(id)
    .populate('categoryId', 'name description')
    .populate('createdBy', 'name email');

  if (!product) {
    throw new AppError('Product not found', 404);
  }
  return product;
};

const createProduct = async (data) => {
  const product = await Product.create(data);
  return product.populate([
    { path: 'categoryId', select: 'name description' },
    { path: 'createdBy', select: 'name email' },
  ]);
};

const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate('categoryId', 'name description')
    .populate('createdBy', 'name email');

  if (!product) {
    throw new AppError('Product not found', 404);
  }
  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Delete associated image file if it exists
  if (product.image) {
    const imagePath = path.join(__dirname, '..', product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  await Product.findByIdAndDelete(id);
  return product;
};

const updateProductImage = async (id, imagePath) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Delete old image if it exists
  if (product.image) {
    const oldImagePath = path.join(__dirname, '..', product.image);
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }

  product.image = imagePath;
  await product.save();

  return product.populate([
    { path: 'categoryId', select: 'name description' },
    { path: 'createdBy', select: 'name email' },
  ]);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductImage,
};
