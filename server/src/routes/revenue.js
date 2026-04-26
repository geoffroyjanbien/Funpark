const express = require('express');
const router = express.Router();
const revenueController = require('../controllers/revenueController');

// GET /api/revenue - Get all revenue entries
router.get('/', revenueController.getAllRevenue);

// GET /api/revenue/:id - Get specific revenue entry
router.get('/:id', revenueController.getRevenueById);

// POST /api/revenue - Create new revenue entry
router.post('/', revenueController.createRevenue);

// PUT /api/revenue/:id - Update revenue entry
router.put('/:id', revenueController.updateRevenue);

// DELETE /api/revenue/:id - Delete revenue entry
router.delete('/:id', revenueController.deleteRevenue);

module.exports = router;