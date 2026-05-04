require('dotenv').config();
const supabase = require('../config/supabase');

/**
 * Revenue Controller
 * Handles CRUD operations for revenue entries using Supabase
 */

/**
 * Get all revenue entries with optional filtering
 */
const getAllRevenue = async (req, res) => {
  try {
    const { date, category, limit } = req.query;
    
    let query = supabase
      .from('revenue')
      .select('*')
      .order('date', { ascending: false });
    
    if (date) {
      query = query.eq('date', date);
    }
    if (category) {
      query = query.eq('source', category);
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
    
    const { data, error } = await supabase
      .from('revenue')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Revenue entry not found'
      });
    }
    
    res.json({
      success: true,
      data: data
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
    const { date, source, amount, description } = req.body;

    // Validate required fields
    if (!date || !source || amount === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: date, source, amount'
      });
    }

    const { data, error } = await supabase
      .from('revenue')
      .insert([{
        date,
        source,
        amount: parseFloat(amount),
        description: description || null
      }])
      .select()
      .single();
    
    if (error) throw error;

    res.status(201).json({
      success: true,
      data: data,
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
    const { date, source, amount, description } = req.body;

    const updateData = {};
    if (date) updateData.date = date;
    if (source) updateData.source = source;
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (description !== undefined) updateData.description = description;

    const { data, error } = await supabase
      .from('revenue')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Revenue entry not found'
      });
    }

    res.json({
      success: true,
      data: data,
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

    const { error } = await supabase
      .from('revenue')
      .delete()
      .eq('id', id);
    
    if (error) throw error;

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