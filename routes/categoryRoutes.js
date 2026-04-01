const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { validateCreateCategory, validateUpdateCategory } = require('../validators/categoryValidator');
const { validateMongoId, validatePagination, validate } = require('../validators/paramValidator');

// All category routes require authentication
router.use(authMiddleware);

router.get('/', validatePagination, validate, categoryController.getAll);
router.get('/:id', validateMongoId('id'), validate, categoryController.getById);
router.post('/', authorize('admin'), validateCreateCategory, categoryController.create);
router.put('/:id', authorize('admin'), validateMongoId('id'), validate, validateUpdateCategory, categoryController.update);
router.delete('/:id', authorize('admin'), validateMongoId('id'), validate, categoryController.remove);

module.exports = router;
