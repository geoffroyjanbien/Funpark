const { readCSV, writeCSV, appendToCSV, updateInCSV, deleteFromCSV } = require('../utils/csvHandler');

/**
 * Categories Controller
 * Handles category management for revenue, expenses, and investments
 */

/**
 * Get all categories
 */
const getAllCategories = async (req, res) => {
  try {
    const categories = await readCSV('CATEGORIES');
    
    res.json({
      success: true,
      data: categories,
      count: categories.length
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

    const categories = await readCSV('CATEGORIES');
    const filtered = categories.filter(cat => cat.type === type && cat.is_active === 'true');
    
    res.json({
      success: true,
      data: filtered,
      count: filtered.length
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
    const categories = await readCSV('CATEGORIES');
    const category = categories.find(cat => cat.id === id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      data: category
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

    // Get all categories to generate new ID
    const categories = await readCSV('CATEGORIES');
    const maxId = categories.reduce((max, cat) => Math.max(max, parseInt(cat.id) || 0), 0);
    
    const newCategory = {
      id: (maxId + 1).toString(),
      type,
      name_en,
      name_ar,
      parent_category: parent_category || '',
      is_active: 'true'
    };

    await appendToCSV('CATEGORIES', newCategory);

    res.status(201).json({
      success: true,
      data: newCategory,
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
    
    // Validation
    if (!type || !name_en || !name_ar) {
      return res.status(400).json({
        success: false,
        error: 'Type, English name, and Arabic name are required'
      });
    }

    const updatedCategory = {
      id,
      type,
      name_en,
      name_ar,
      parent_category: parent_category || '',
      is_active: is_active !== undefined ? is_active.toString() : 'true'
    };

    await updateInCSV('CATEGORIES', { id }, updatedCategory);

    res.json({
      success: true,
      data: updatedCategory,
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
    
    const categories = await readCSV('CATEGORIES');
    const category = categories.find(cat => cat.id === id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Soft delete
    const updatedCategory = {
      ...category,
      is_active: 'false'
    };

    await updateInCSV('CATEGORIES', { id }, updatedCategory);

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
    
    await deleteFromCSV('CATEGORIES', { id });

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
