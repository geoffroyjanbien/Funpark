const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');

// GET /api/investments - Get all investment entries
router.get('/', investmentController.getAllInvestments);

// GET /api/investments/:id - Get specific investment entry
router.get('/:id', investmentController.getInvestmentById);

// POST /api/investments - Create new investment entry
router.post('/', investmentController.createInvestment);

// PUT /api/investments/:id - Update investment entry
router.put('/:id', investmentController.updateInvestment);

// DELETE /api/investments/:id - Delete investment entry
router.delete('/:id', investmentController.deleteInvestment);

module.exports = router;