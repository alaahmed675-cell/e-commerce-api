const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validateCreateProduct, validateUpdateProduct } = require('../validators/productValidator');
const { validateMongoId, validatePagination, validate } = require('../validators/paramValidator');

// All product routes require authentication
// router.use(authMiddleware);

router.get('/', productController.getAll);
router.get('/:id', validateMongoId('id'), validate, productController.getById);
router.post('/', authorize('admin'), validateCreateProduct, productController.create);
router.put('/:id', authorize('admin'), validateMongoId('id'), validate, validateUpdateProduct, productController.update);
router.delete('/:id', authorize('admin'), validateMongoId('id'), validate, productController.remove);
router.post('/:id/upload-image', authorize('admin'), validateMongoId('id'), validate, upload.single('image'), productController.uploadImage);

module.exports = router;
