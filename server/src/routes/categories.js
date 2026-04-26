const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

/**
 * Categories Routes
 * Base path: /api/categories
 */

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get categories by type (revenue, expense, investment)
router.get('/type/:type', categoryController.getCategoriesByType);

// Get category by ID
router.get('/:id', categoryController.getCategoryById);

// Create new category
router.post('/', categoryController.createCategory);

// Update category
router.put('/:id', categoryController.updateCategory);

// Soft delete category
router.delete('/:id', categoryController.deleteCategory);

// Permanently delete category
router.delete('/:id/permanent', categoryController.permanentDeleteCategory);

module.exports = router;
