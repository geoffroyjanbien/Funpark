const { readCSV, appendToCSV, updateInCSV, deleteFromCSV } = require('../utils/csvHandler');
const { updateDailySummary } = require('../utils/profitCalculator');

/**
 * Expense Controller
 * Handles CRUD operations for expense entries
 */

/**
 * Get all expense entries with optional filtering
 */
const getAllExpenses = async (req, res) => {
  try {
    const { date, category } = req.query;
    let expenses = await readCSV('EXPENSE_ENTRIES');

    // Apply filters
    if (date) {
      expenses = expenses.filter(e => e.date === date);
    }
    if (category) {
      expenses = expenses.filter(e => e.category === category);
    }

    // Add IDs for frontend (using index as simple ID)
    const expensesWithIds = expenses.map((expense, index) => ({
      id: index + 1,
      date: expense.date,
      category: expense.main_category || expense.category || '', // Handle both old and new format
      amount: parseFloat(expense.amount_ll || expense.amount_usd || expense.amount || 0),
      description: expense.subcategory || expense.description || ''
    }));

    res.json({
      success: true,
      data: expensesWithIds,
      count: expensesWithIds.length
    });
  } catch (error) {
    console.error('Error getting expenses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve expense data'
    });
  }
};

/**
 * Get expense entry by ID
 */
const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const expenses = await readCSV('EXPENSE_ENTRIES');

    const expense = expenses[parseInt(id) - 1];
    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense entry not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: parseInt(id),
        ...expense
      }
    });
  } catch (error) {
    console.error('Error getting expense by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve expense entry'
    });
  }
};

/**
 * Create new expense entry
 */
const createExpense = async (req, res) => {
  try {
    const { date, category, amount, description } = req.body;

    // Validate required fields
    if (!date || !category || amount === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: date, category, amount'
      });
    }

    // Convert to CSV format matching the schema
    const expenseData = {
      date,
      main_category: category,
      subcategory: description || '',
      investment_type: 'Short Term', // Default to Short Term
      amount_ll: parseFloat(amount).toFixed(2),
      amount_usd: '0.00'
    };

    await appendToCSV('EXPENSE_ENTRIES', expenseData);

    // Update daily summary
    await updateDailySummary(date);

    res.status(201).json({
      success: true,
      data: {
        id: Date.now().toString(),
        date,
        category,
        amount: parseFloat(amount),
        description
      },
      message: 'Expense entry created successfully'
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create expense entry'
    });
  }
};

/**
 * Update expense entry
 */
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, category, amount, description } = req.body;

    const expenses = await readCSV('EXPENSE_ENTRIES');
    const expenseIndex = parseInt(id) - 1;

    if (expenseIndex < 0 || expenseIndex >= expenses.length) {
      return res.status(404).json({
        success: false,
        error: 'Expense entry not found'
      });
    }

    const originalDate = expenses[expenseIndex].date;

    const updates = {};
    if (date) updates.date = date;
    if (category) updates.main_category = category;
    if (description !== undefined) updates.subcategory = description;
    if (amount !== undefined) {
      updates.amount_ll = parseFloat(amount).toFixed(2);
      updates.amount_usd = '0.00';
    }

    await updateInCSV('EXPENSE_ENTRIES', expenses[expenseIndex], updates);

    // Update daily summaries for both original and new dates if date changed
    await updateDailySummary(originalDate);
    if (date && date !== originalDate) {
      await updateDailySummary(date);
    }

    res.json({
      success: true,
      data: {
        id: parseInt(id),
        date: updates.date || expenses[expenseIndex].date,
        category: updates.main_category || expenses[expenseIndex].main_category,
        amount: parseFloat(updates.amount_ll || expenses[expenseIndex].amount_ll),
        description: updates.subcategory || expenses[expenseIndex].subcategory || ''
      },
      message: 'Expense entry updated successfully'
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update expense entry'
    });
  }
};

/**
 * Delete expense entry
 */
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expenses = await readCSV('EXPENSE_ENTRIES');
    const expenseIndex = parseInt(id) - 1;

    if (expenseIndex < 0 || expenseIndex >= expenses.length) {
      return res.status(404).json({
        success: false,
        error: 'Expense entry not found'
      });
    }

    const date = expenses[expenseIndex].date;
    await deleteFromCSV('EXPENSE_ENTRIES', expenses[expenseIndex]);

    // Update daily summary
    await updateDailySummary(date);

    res.json({
      success: true,
      message: 'Expense entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete expense entry'
    });
  }
};

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
};