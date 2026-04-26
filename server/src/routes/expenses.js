const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// GET /api/expenses - Get all expense entries
router.get('/', expenseController.getAllExpenses);

// GET /api/expenses/:id - Get specific expense entry
router.get('/:id', expenseController.getExpenseById);

// POST /api/expenses - Create new expense entry
router.post('/', expenseController.createExpense);

// PUT /api/expenses/:id - Update expense entry
router.put('/:id', expenseController.updateExpense);

// DELETE /api/expenses/:id - Delete expense entry
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;