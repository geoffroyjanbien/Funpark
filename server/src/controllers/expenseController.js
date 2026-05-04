require('dotenv').config();
const supabase = require('../config/supabase');

/**
 * Expense Controller
 * Handles CRUD operations for expense entries using Supabase
 */

/**
 * Get all expense entries with optional filtering
 */
const getAllExpenses = async (req, res) => {
  try {
    const { date, category, limit } = req.query;
    
    let query = supabase
      .from('expense_entries')
      .select('*')
      .order('date', { ascending: false });
    
    if (date) {
      query = query.eq('date', date);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data,
      count: data.length
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
    
    const { data, error } = await supabase
      .from('expense_entries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Expense entry not found'
      });
    }
    
    res.json({
      success: true,
      data: data
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

    const { data, error } = await supabase
      .from('expense_entries')
      .insert([{
        date,
        category,
        amount: parseFloat(amount),
        description: description || null
      }])
      .select()
      .single();
    
    if (error) throw error;

    res.status(201).json({
      success: true,
      data: data,
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

    const updateData = {};
    if (date) updateData.date = date;
    if (category) updateData.category = category;
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (description !== undefined) updateData.description = description;

    const { data, error } = await supabase
      .from('expense_entries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Expense entry not found'
      });
    }

    res.json({
      success: true,
      data: data,
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

    const { error } = await supabase
      .from('expense_entries')
      .delete()
      .eq('id', id);
    
    if (error) throw error;

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