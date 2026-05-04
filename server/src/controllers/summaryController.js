require('dotenv').config();
const supabase = require('../config/supabase');

/**
 * Summary Controller
 * Handles summary calculations and reporting using Supabase
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

    // Get revenue for the date
    const { data: revenues, error: revError } = await supabase
      .from('revenue')
      .select('*')
      .eq('date', date);
    
    if (revError) throw revError;

    // Get expenses for the date
    const { data: expenses, error: expError } = await supabase
      .from('expense_entries')
      .select('*')
      .eq('date', date);
    
    if (expError) throw expError;

    // Get investments for the date
    const { data: investments, error: invError } = await supabase
      .from('investment_entries')
      .select('*')
      .eq('date', date);
    
    if (invError) throw invError;

    // Calculate totals
    const totalRevenue = revenues.reduce((sum, r) => sum + parseFloat(r.amount), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const totalInvestments = investments.reduce((sum, i) => sum + parseFloat(i.amount), 0);
    const balance = totalRevenue - totalExpenses - totalInvestments;
    const owner1Share = balance * 0.7;
    const owner2Share = balance * 0.3;

    res.json({
      success: true,
      data: {
        date,
        total_revenue_ll: totalRevenue.toFixed(2),
        total_expenses_ll: totalExpenses.toFixed(2),
        total_investments_ll: totalInvestments.toFixed(2),
        balance_ll: balance.toFixed(2),
        owner1_share_ll: owner1Share.toFixed(2),
        owner2_share_ll: owner2Share.toFixed(2),
        revenue_items: revenues,
        expense_items: expenses,
        investment_items: investments
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

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        error: 'Both month (MM) and year (YYYY) parameters are required'
      });
    }

    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        success: false,
        error: 'Invalid month. Must be between 01 and 12'
      });
    }

    // Create date range for the month
    const startDate = `${yearNum}-${String(monthNum).padStart(2, '0')}-01`;
    const endDate = new Date(yearNum, monthNum, 0);
    const endDateStr = `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

    // Get revenue for the month
    const { data: revenues, error: revError } = await supabase
      .from('revenue')
      .select('amount')
      .gte('date', startDate)
      .lte('date', endDateStr);
    
    if (revError) throw revError;

    // Get expenses for the month
    const { data: expenses, error: expError } = await supabase
      .from('expense_entries')
      .select('amount')
      .gte('date', startDate)
      .lte('date', endDateStr);
    
    if (expError) throw expError;

    // Get investments for the month
    const { data: investments, error: invError } = await supabase
      .from('investment_entries')
      .select('amount')
      .gte('date', startDate)
      .lte('date', endDateStr);
    
    if (invError) throw invError;

    // Calculate totals
    const totalRevenue = revenues.reduce((sum, r) => sum + parseFloat(r.amount), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const totalInvestments = investments.reduce((sum, i) => sum + parseFloat(i.amount), 0);
    const balance = totalRevenue - totalExpenses - totalInvestments;
    const owner1Share = balance * 0.7;
    const owner2Share = balance * 0.3;

    res.json({
      success: true,
      data: {
        month: monthNum,
        year: yearNum,
        total_revenue_ll: totalRevenue.toFixed(2),
        total_expenses_ll: totalExpenses.toFixed(2),
        total_investments_ll: totalInvestments.toFixed(2),
        balance_ll: balance.toFixed(2),
        owner1_share_ll: owner1Share.toFixed(2),
        owner2_share_ll: owner2Share.toFixed(2)
      }
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
    const startDate = `${yearNum}-01-01`;
    const endDate = `${yearNum}-12-31`;

    // Get revenue for the year
    const { data: revenues, error: revError } = await supabase
      .from('revenue')
      .select('amount')
      .gte('date', startDate)
      .lte('date', endDate);
    
    if (revError) throw revError;

    // Get expenses for the year
    const { data: expenses, error: expError } = await supabase
      .from('expense_entries')
      .select('amount')
      .gte('date', startDate)
      .lte('date', endDate);
    
    if (expError) throw expError;

    // Get investments for the year
    const { data: investments, error: invError } = await supabase
      .from('investment_entries')
      .select('amount')
      .gte('date', startDate)
      .lte('date', endDate);
    
    if (invError) throw invError;

    // Calculate totals
    const totalRevenue = revenues.reduce((sum, r) => sum + parseFloat(r.amount), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const totalInvestments = investments.reduce((sum, i) => sum + parseFloat(i.amount), 0);
    const balance = totalRevenue - totalExpenses - totalInvestments;
    const owner1Share = balance * 0.7;
    const owner2Share = balance * 0.3;

    res.json({
      success: true,
      data: {
        year: yearNum,
        total_revenue_ll: totalRevenue.toFixed(2),
        total_expenses_ll: totalExpenses.toFixed(2),
        total_investments_ll: totalInvestments.toFixed(2),
        balance_ll: balance.toFixed(2),
        owner1_share_ll: owner1Share.toFixed(2),
        owner2_share_ll: owner2Share.toFixed(2)
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
 * Recalculate all summaries (not needed with Supabase - calculations are done on-the-fly)
 */
const recalculateAllSummariesController = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Summaries are calculated on-the-fly with Supabase'
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
    const { data, error } = await supabase
      .from('daily_summary')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;

    res.json({
      success: true,
      data: data,
      count: data.length
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