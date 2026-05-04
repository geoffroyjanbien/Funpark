require('dotenv').config();
const supabase = require('../config/supabase');

/**
 * Categories Controller
 * Handles category management for revenue, expenses, and investments using Supabase
 */

/**
 * Get all categories
 */
const getAllCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('type', { ascending: true })
      .order('name_en', { ascending: true });
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data,
      count: data.length
    });
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve categories'
    });
  }
};

/**
 * Get categories by type
 */
const getCategoriesByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['revenue', 'expense', 'investment'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid type. Must be revenue, expense, or investment'
      });
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('type', type)
      .eq('is_active', true)
      .order('name_en', { ascending: true });
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data,
      count: data.length
    });
  } catch (error) {
    console.error('Error getting categories by type:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve categories'
    });
  }
};

/**
 * Get category by ID
 */
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error getting category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve category'
    });
  }
};

/**
 * Create new category
 */
const createCategory = async (req, res) => {
  try {
    const { type, name_en, name_ar, parent_category } = req.body;
    
    // Validation
    if (!type || !name_en || !name_ar) {
      return res.status(400).json({
        success: false,
        error: 'Type, English name, and Arabic name are required'
      });
    }

    if (!['revenue', 'expense', 'investment'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid type. Must be revenue, expense, or investment'
      });
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([{
        type,
        name_en,
        name_ar,
        parent_category: parent_category || null,
        is_active: true
      }])
      .select()
      .single();
    
    if (error) throw error;

    res.status(201).json({
      success: true,
      data: data,
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create category'
    });
  }
};

/**
 * Update category
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, name_en, name_ar, parent_category, is_active } = req.body;
    
    const updateData = {};
    if (type) updateData.type = type;
    if (name_en) updateData.name_en = name_en;
    if (name_ar) updateData.name_ar = name_ar;
    if (parent_category !== undefined) updateData.parent_category = parent_category || null;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: data,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update category'
    });
  }
};

/**
 * Delete category (soft delete by setting is_active to false)
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('categories')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete category'
    });
  }
};

/**
 * Permanently delete category
 */
const permanentDeleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;

    res.json({
      success: true,
      message: 'Category permanently deleted'
    });
  } catch (error) {
    console.error('Error permanently deleting category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to permanently delete category'
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoriesByType,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  permanentDeleteCategory
};