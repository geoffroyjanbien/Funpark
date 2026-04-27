const { readCSV, appendToCSV, updateInCSV, deleteFromCSV } = require('../utils/csvHandler');
const { updateDailySummary } = require('../utils/profitCalculator');

/**
 * Investment Controller
 * Handles CRUD operations for investment entries
 */

/**
 * Get all investment entries with optional filtering
 */
const getAllInvestments = async (req, res) => {
  try {
    const { date, type } = req.query;
    let investments = await readCSV('INVESTMENT_ENTRIES');

    // Apply filters
    if (date) {
      investments = investments.filter(i => i.date === date);
    }
    if (type) {
      investments = investments.filter(i => i.type === type);
    }

    // Sort latest first
    investments.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Add IDs for frontend (using index as simple ID)
    const investmentsWithIds = investments.map((investment, index) => ({
      id: index + 1,
      date: investment.date,
      type: investment.investment_type || investment.type || '', // Handle both old and new format
      amount: parseFloat(investment.amount_ll || investment.amount_usd || investment.amount || 0),
      description: investment.description || ''
    }));

    res.json({
      success: true,
      data: investmentsWithIds,
      count: investmentsWithIds.length
    });
  } catch (error) {
    console.error('Error getting investments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve investment data'
    });
  }
};

/**
 * Get investment entry by ID
 */
const getInvestmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const investments = await readCSV('INVESTMENT_ENTRIES');

    const investment = investments[parseInt(id) - 1];
    if (!investment) {
      return res.status(404).json({
        success: false,
        error: 'Investment entry not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: parseInt(id),
        ...investment
      }
    });
  } catch (error) {
    console.error('Error getting investment by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve investment entry'
    });
  }
};

/**
 * Create new investment entry
 */
const createInvestment = async (req, res) => {
  try {
    const { date, type, amount, description } = req.body;

    // Validate required fields
    if (!date || !type || amount === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: date, type, amount'
      });
    }

    // Convert to CSV format matching the schema
    const investmentData = {
      date,
      investment_type: type,
      description: description || 'Investment', // Provide default description
      amount_ll: parseFloat(amount).toFixed(2),
      amount_usd: '0.00',
      owner_allocation: 'Both' // Default to Both
    };

    await appendToCSV('INVESTMENT_ENTRIES', investmentData);

    // Update daily summary
    await updateDailySummary(date);

    res.status(201).json({
      success: true,
      data: {
        id: Date.now().toString(),
        date,
        type,
        amount: parseFloat(amount),
        description
      },
      message: 'Investment entry created successfully'
    });
  } catch (error) {
    console.error('Error creating investment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create investment entry'
    });
  }
};

/**
 * Update investment entry
 */
const updateInvestment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, type, amount, description } = req.body;

    const investments = await readCSV('INVESTMENT_ENTRIES');
    const investmentIndex = parseInt(id) - 1;

    if (investmentIndex < 0 || investmentIndex >= investments.length) {
      return res.status(404).json({
        success: false,
        error: 'Investment entry not found'
      });
    }

    const originalDate = investments[investmentIndex].date;

    const updates = {};
    if (date) updates.date = date;
    if (type) updates.investment_type = type;
    if (description !== undefined) updates.description = description || 'Investment';
    if (amount !== undefined) {
      updates.amount_ll = parseFloat(amount).toFixed(2);
      updates.amount_usd = '0.00';
    }

    await updateInCSV('INVESTMENT_ENTRIES', investments[investmentIndex], updates);

    // Update daily summaries for both original and new dates if date changed
    await updateDailySummary(originalDate);
    if (date && date !== originalDate) {
      await updateDailySummary(date);
    }

    res.json({
      success: true,
      data: {
        id: parseInt(id),
        date: updates.date || investments[investmentIndex].date,
        type: updates.investment_type || investments[investmentIndex].investment_type,
        amount: parseFloat(updates.amount_ll || investments[investmentIndex].amount_ll),
        description: updates.description || investments[investmentIndex].description
      },
      message: 'Investment entry updated successfully'
    });
  } catch (error) {
    console.error('Error updating investment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update investment entry'
    });
  }
};

/**
 * Delete investment entry
 */
const deleteInvestment = async (req, res) => {
  try {
    const { id } = req.params;
    const investments = await readCSV('INVESTMENT_ENTRIES');
    const investmentIndex = parseInt(id) - 1;

    if (investmentIndex < 0 || investmentIndex >= investments.length) {
      return res.status(404).json({
        success: false,
        error: 'Investment entry not found'
      });
    }

    const date = investments[investmentIndex].date;
    await deleteFromCSV('INVESTMENT_ENTRIES', investments[investmentIndex]);

    // Update daily summary
    await updateDailySummary(date);

    res.json({
      success: true,
      message: 'Investment entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting investment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete investment entry'
    });
  }
};

module.exports = {
  getAllInvestments,
  getInvestmentById,
  createInvestment,
  updateInvestment,
  deleteInvestment
};