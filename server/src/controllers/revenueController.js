const { readCSV, appendToCSV, updateInCSV, deleteFromCSV } = require('../utils/csvHandler');
const { updateDailySummary } = require('../utils/profitCalculator');

/**
 * Revenue Controller
 * Handles CRUD operations for revenue entries
 */

/**
 * Get all revenue entries with optional filtering
 */
const getAllRevenue = async (req, res) => {
  try {
    const { date, category } = req.query;
    let revenues = await readCSV('REVENUE');

    // Apply filters
    if (date) {
      revenues = revenues.filter(r => r.date === date);
    }
    if (category) {
      revenues = revenues.filter(r => r.category === category);
    }

    // Add IDs for frontend (using index as simple ID)
    const revenuesWithIds = revenues.map((revenue, index) => ({
      id: index + 1,
      ...revenue
    }));

    res.json({
      success: true,
      data: revenuesWithIds,
      count: revenuesWithIds.length
    });
  } catch (error) {
    console.error('Error getting revenue:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve revenue data'
    });
  }
};

/**
 * Get revenue entry by ID
 */
const getRevenueById = async (req, res) => {
  try {
    const { id } = req.params;
    const revenues = await readCSV('REVENUE');

    const revenue = revenues[parseInt(id) - 1];
    if (!revenue) {
      return res.status(404).json({
        success: false,
        error: 'Revenue entry not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: parseInt(id),
        ...revenue
      }
    });
  } catch (error) {
    console.error('Error getting revenue by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve revenue entry'
    });
  }
};

/**
 * Create new revenue entry
 */
const createRevenue = async (req, res) => {
  try {
    const { date, category, amount_ll, amount_usd } = req.body;

    // Validate required fields
    if (!date || !category || amount_ll === undefined || amount_usd === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: date, category, amount_ll, amount_usd'
      });
    }

    // Validate category
    const validCategories = ['Hookah', 'Drinks', 'Crepe', 'Games', 'Various'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      });
    }

    const newRevenue = {
      date,
      category,
      amount_ll: parseFloat(amount_ll).toFixed(2),
      amount_usd: parseFloat(amount_usd).toFixed(2)
    };

    await appendToCSV('REVENUE', newRevenue);

    // Update daily summary
    await updateDailySummary(date);

    res.status(201).json({
      success: true,
      data: newRevenue,
      message: 'Revenue entry created successfully'
    });
  } catch (error) {
    console.error('Error creating revenue:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create revenue entry'
    });
  }
};

/**
 * Update revenue entry
 */
const updateRevenue = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, category, amount_ll, amount_usd } = req.body;

    const revenues = await readCSV('REVENUE');
    const revenueIndex = parseInt(id) - 1;

    if (revenueIndex < 0 || revenueIndex >= revenues.length) {
      return res.status(404).json({
        success: false,
        error: 'Revenue entry not found'
      });
    }

    const originalDate = revenues[revenueIndex].date;

    // Validate category if provided
    if (category) {
      const validCategories = ['Hookah', 'Drinks', 'Crepe', 'Games', 'Various'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          error: `Invalid category. Must be one of: ${validCategories.join(', ')}`
        });
      }
    }

    const updates = {};
    if (date) updates.date = date;
    if (category) updates.category = category;
    if (amount_ll !== undefined) updates.amount_ll = parseFloat(amount_ll).toFixed(2);
    if (amount_usd !== undefined) updates.amount_usd = parseFloat(amount_usd).toFixed(2);

    await updateInCSV('REVENUE', revenues[revenueIndex], updates);

    // Update daily summaries for both original and new dates if date changed
    await updateDailySummary(originalDate);
    if (date && date !== originalDate) {
      await updateDailySummary(date);
    }

    res.json({
      success: true,
      data: {
        id: parseInt(id),
        ...revenues[revenueIndex],
        ...updates
      },
      message: 'Revenue entry updated successfully'
    });
  } catch (error) {
    console.error('Error updating revenue:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update revenue entry'
    });
  }
};

/**
 * Delete revenue entry
 */
const deleteRevenue = async (req, res) => {
  try {
    const { id } = req.params;
    const revenues = await readCSV('REVENUE');
    const revenueIndex = parseInt(id) - 1;

    if (revenueIndex < 0 || revenueIndex >= revenues.length) {
      return res.status(404).json({
        success: false,
        error: 'Revenue entry not found'
      });
    }

    const date = revenues[revenueIndex].date;
    await deleteFromCSV('REVENUE', revenues[revenueIndex]);

    // Update daily summary
    await updateDailySummary(date);

    res.json({
      success: true,
      message: 'Revenue entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting revenue:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete revenue entry'
    });
  }
};

module.exports = {
  getAllRevenue,
  getRevenueById,
  createRevenue,
  updateRevenue,
  deleteRevenue
};