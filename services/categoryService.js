const Category = require('../models/Category');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');

const getAllCategories = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const categories = await Category.find().skip(skip).limit(limit).sort({ createdAt: -1 });
  const total = await Category.countDocuments();

  return { categories, total, page, limit };
};

const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  return category;
};

const createCategory = async (data) => {
  const category = await Category.create(data);
  return category;
};

const updateCategory = async (id, data) => {
  const category = await Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  // Check for associated products
  const productCount = await Product.countDocuments({ categoryId: id });
  if (productCount > 0) {
    throw new AppError('Cannot delete category with associated products', 400);
  }

  await Category.findByIdAndDelete(id);
  return category;
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
