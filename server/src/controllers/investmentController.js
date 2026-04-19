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
    const { date, investment_type } = req.query;
    let investments = await readCSV('INVESTMENT_ENTRIES');

    // Apply filters
    if (date) {
      investments = investments.filter(i => i.date === date);
    }
    if (investment_type) {
      investments = investments.filter(i => i.investment_type === investment_type);
    }

    // Add IDs for frontend (using index as simple ID)
    const investmentsWithIds = investments.map((investment, index) => ({
      id: index + 1,
      ...investment
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
    const { date, investment_type, description, amount_ll, amount_usd, owner_allocation } = req.body;

    // Validate required fields
    if (!date || !investment_type || !description || !owner_allocation || amount_ll === undefined || amount_usd === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: date, investment_type, description, owner_allocation, amount_ll, amount_usd'
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

    // Validate owner allocation
    const validAllocations = ['Owner1', 'Owner2', 'Both'];
    if (!validAllocations.includes(owner_allocation)) {
      return res.status(400).json({
        success: false,
        error: `Invalid owner_allocation. Must be one of: ${validAllocations.join(', ')}`
      });
    }

    const newInvestment = {
      date,
      investment_type,
      description,
      amount_ll: parseFloat(amount_ll).toFixed(2),
      amount_usd: parseFloat(amount_usd).toFixed(2),
      owner_allocation
    };

    await appendToCSV('INVESTMENT_ENTRIES', newInvestment);

    // Update daily summary (for Long Term investments that affect owner shares)
    await updateDailySummary(date);

    res.status(201).json({
      success: true,
      data: newInvestment,
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
    const { date, investment_type, description, amount_ll, amount_usd, owner_allocation } = req.body;

    const investments = await readCSV('INVESTMENT_ENTRIES');
    const investmentIndex = parseInt(id) - 1;

    if (investmentIndex < 0 || investmentIndex >= investments.length) {
      return res.status(404).json({
        success: false,
        error: 'Investment entry not found'
      });
    }

    const originalDate = investments[investmentIndex].date;

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

    // Validate owner allocation if provided
    if (owner_allocation) {
      const validAllocations = ['Owner1', 'Owner2', 'Both'];
      if (!validAllocations.includes(owner_allocation)) {
        return res.status(400).json({
          success: false,
          error: `Invalid owner_allocation. Must be one of: ${validAllocations.join(', ')}`
        });
      }
    }

    const updates = {};
    if (date) updates.date = date;
    if (investment_type) updates.investment_type = investment_type;
    if (description) updates.description = description;
    if (amount_ll !== undefined) updates.amount_ll = parseFloat(amount_ll).toFixed(2);
    if (amount_usd !== undefined) updates.amount_usd = parseFloat(amount_usd).toFixed(2);
    if (owner_allocation) updates.owner_allocation = owner_allocation;

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
        ...investments[investmentIndex],
        ...updates
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