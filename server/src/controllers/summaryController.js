const { readCSV } = require('../utils/csvHandler');
const { calculateDailyProfit, calculateMonthlySummary, calculateYearlySummary, recalculateAllSummaries } = require('../utils/profitCalculator');

/**
 * Summary Controller
 * Handles summary calculations and reporting
 */

/**
 * Get daily summary for a specific date
 */
const getDailySummary = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Date parameter is required (YYYY-MM-DD)'
      });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Expected YYYY-MM-DD'
      });
    }

    // Get daily summary
    const summary = await calculateDailyProfit(date);

    // Get detailed revenue and expense items for the date
    const revenues = await readCSV('REVENUE');
    const expenses = await readCSV('EXPENSE_ENTRIES');
    const investments = await readCSV('INVESTMENT_ENTRIES');

    const dailyRevenues = revenues.filter(r => r.date === date);
    const dailyExpenses = expenses.filter(e => e.date === date);
    const dailyInvestments = investments.filter(i => i.date === date);

    res.json({
      success: true,
      data: {
        ...summary,
        revenue_items: dailyRevenues,
        expense_items: dailyExpenses,
        investment_items: dailyInvestments
      }
    });
  } catch (error) {
    console.error('Error getting daily summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve daily summary'
    });
  }
};

/**
 * Get monthly summary
 */
const getMonthlySummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    console.log('getMonthlySummary called with:', { month, year });

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        error: 'Both month (MM) and year (YYYY) parameters are required'
      });
    }

    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    console.log('Parsed values:', { monthNum, yearNum });

    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        success: false,
        error: 'Invalid month. Must be between 01 and 12'
      });
    }

    const summary = await calculateMonthlySummary(yearNum, monthNum);
    console.log('Calculated summary:', summary);

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error getting monthly summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve monthly summary'
    });
  }
};

/**
 * Get yearly summary
 */
const getYearlySummary = async (req, res) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({
        success: false,
        error: 'Year parameter is required (YYYY)'
      });
    }

    const yearNum = parseInt(year);
    const summary = await calculateYearlySummary(yearNum);

    // Get monthly breakdown for the year
    const monthlyBreakdown = [];
    for (let month = 1; month <= 12; month++) {
      const monthlySummary = await calculateMonthlySummary(yearNum, month);
      // Only include months with data
      if (parseFloat(monthlySummary.total_revenue_ll) > 0 || parseFloat(monthlySummary.total_expenses_ll) > 0) {
        monthlyBreakdown.push(monthlySummary);
      }
    }

    res.json({
      success: true,
      data: {
        ...summary,
        months: monthlyBreakdown
      }
    });
  } catch (error) {
    console.error('Error getting yearly summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve yearly summary'
    });
  }
};

/**
 * Recalculate all summaries (useful after bulk data changes)
 */
const recalculateAllSummariesController = async (req, res) => {
  try {
    await recalculateAllSummaries();

    res.json({
      success: true,
      message: 'All summaries recalculated successfully'
    });
  } catch (error) {
    console.error('Error recalculating summaries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to recalculate summaries'
    });
  }
};

/**
 * Get summary views (monthly and yearly summaries)
 */
const getSummaryViews = async (req, res) => {
  try {
    const summaryViews = await readCSV('SUMMARY_VIEWS');

    res.json({
      success: true,
      data: summaryViews,
      count: summaryViews.length
    });
  } catch (error) {
    console.error('Error getting summary views:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve summary views'
    });
  }
};

module.exports = {
  getDailySummary,
  getMonthlySummary,
  getYearlySummary,
  recalculateAllSummaries: recalculateAllSummariesController,
  getSummaryViews
};