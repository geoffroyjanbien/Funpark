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
    const { date, main_category, subcategory, investment_type } = req.query;
    let expenses = await readCSV('EXPENSE_ENTRIES');

    // Apply filters
    if (date) {
      expenses = expenses.filter(e => e.date === date);
    }
    if (main_category) {
      expenses = expenses.filter(e => e.main_category === main_category);
    }
    if (subcategory) {
      expenses = expenses.filter(e => e.subcategory === subcategory);
    }
    if (investment_type) {
      expenses = expenses.filter(e => e.investment_type === investment_type);
    }

    // Add IDs for frontend (using index as simple ID)
    const expensesWithIds = expenses.map((expense, index) => ({
      id: index + 1,
      ...expense
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
    const { date, main_category, subcategory, investment_type, amount_ll, amount_usd } = req.body;

    // Validate required fields
    if (!date || !main_category || !investment_type || amount_ll === undefined || amount_usd === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: date, main_category, investment_type, amount_ll, amount_usd'
      });
    }

    // Validate investment type
    const validTypes = ['Long Term', 'Mid Term', 'Short Term'];
    if (!validTypes.includes(investment_type)) {
      return res.status(400).json({
        success: false,
        error: `Invalid investment_type. Must be one of: ${validTypes.join(', ')}`
      });
    }

    const newExpense = {
      date,
      main_category,
      subcategory: subcategory || '',
      investment_type,
      amount_ll: parseFloat(amount_ll).toFixed(2),
      amount_usd: parseFloat(amount_usd).toFixed(2)
    };

    await appendToCSV('EXPENSE_ENTRIES', newExpense);

    // Update daily summary
    await updateDailySummary(date);

    res.status(201).json({
      success: true,
      data: newExpense,
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
    const { date, main_category, subcategory, investment_type, amount_ll, amount_usd } = req.body;

    const expenses = await readCSV('EXPENSE_ENTRIES');
    const expenseIndex = parseInt(id) - 1;

    if (expenseIndex < 0 || expenseIndex >= expenses.length) {
      return res.status(404).json({
        success: false,
        error: 'Expense entry not found'
      });
    }

    const originalDate = expenses[expenseIndex].date;

    // Validate investment type if provided
    if (investment_type) {
      const validTypes = ['Long Term', 'Mid Term', 'Short Term'];
      if (!validTypes.includes(investment_type)) {
        return res.status(400).json({
          success: false,
          error: `Invalid investment_type. Must be one of: ${validTypes.join(', ')}`
        });
      }
    }

    const updates = {};
    if (date) updates.date = date;
    if (main_category) updates.main_category = main_category;
    if (subcategory !== undefined) updates.subcategory = subcategory || '';
    if (investment_type) updates.investment_type = investment_type;
    if (amount_ll !== undefined) updates.amount_ll = parseFloat(amount_ll).toFixed(2);
    if (amount_usd !== undefined) updates.amount_usd = parseFloat(amount_usd).toFixed(2);

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
        ...expenses[expenseIndex],
        ...updates
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