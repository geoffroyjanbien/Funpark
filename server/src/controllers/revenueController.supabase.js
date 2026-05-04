const supabase = require('../config/supabase');

// Get all revenue entries
exports.getAllRevenue = async (req, res) => {
  try {
    const { limit } = req.query;
    
    let query = supabase
      .from('revenue')
      .select('*')
      .order('date', { ascending: false });
    
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
    console.error('Error fetching revenue:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue',
      error: error.message
    });
  }
};

// Get revenue by ID
exports.getRevenueById = async (req, res) => {
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
        message: 'Revenue entry not found'
      });
    }
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue',
      error: error.message
    });
  }
};

// Create new revenue entry
exports.createRevenue = async (req, res) => {
  try {
    const { date, source, amount, description } = req.body;
    
    // Validation
    if (!date || !source || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Date, source, and amount are required'
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
      message: 'Error creating revenue',
      error: error.message
    });
  }
};

// Update revenue entry
exports.updateRevenue = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, source, amount, description } = req.body;
    
    const updateData = {};
    if (date) updateData.date = date;
    if (source) updateData.source = source;
    if (amount) updateData.amount = parseFloat(amount);
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
        message: 'Revenue entry not found'
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
      message: 'Error updating revenue',
      error: error.message
    });
  }
};

// Delete revenue entry
exports.deleteRevenue = async (req, res) => {
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
      message: 'Error deleting revenue',
      error: error.message
    });
  }
};

// Get revenue summary by date range
exports.getRevenueSummary = async (req, res) => {
  try {
    const { startDate, endDate, groupBy } = req.query;
    
    let query = supabase
      .from('revenue')
      .select('date, source, amount');
    
    if (startDate) {
      query = query.gte('date', startDate);
    }
    
    if (endDate) {
      query = query.lte('date', endDate);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Calculate totals
    const total = data.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    
    // Group by source
    const bySource = data.reduce((acc, item) => {
      if (!acc[item.source]) {
        acc[item.source] = 0;
      }
      acc[item.source] += parseFloat(item.amount);
      return acc;
    }, {});
    
    res.json({
      success: true,
      data: {
        total,
        bySource,
        entries: data
      }
    });
  } catch (error) {
    console.error('Error fetching revenue summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue summary',
      error: error.message
    });
  }
};
