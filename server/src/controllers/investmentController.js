const supabase = require('../config/supabase');

const getAllInvestments = async (req, res) => {
  try {
    const { date, type, limit } = req.query;

    let query = supabase
      .from('investment_entries')
      .select('*')
      .order('date', { ascending: false });

    if (date) query = query.eq('date', date);
    if (type) query = query.eq('type', type);
    if (limit) query = query.limit(parseInt(limit));

    const { data, error } = await query;
    if (error) throw error;

    res.json({ success: true, data, count: data.length });
  } catch (error) {
    console.error('Error getting investments:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve investment data' });
  }
};

const getInvestmentById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('investment_entries')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Investment entry not found' });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error getting investment by ID:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve investment entry' });
  }
};

const createInvestment = async (req, res) => {
  try {
    const { date, type, amount, description } = req.body;

    if (!date || !type || amount === undefined) {
      return res.status(400).json({ success: false, error: 'Missing required fields: date, type, amount' });
    }

    const { data, error } = await supabase
      .from('investment_entries')
      .insert([{ date, type, amount: parseFloat(amount), description: description || null }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data, message: 'Investment entry created successfully' });
  } catch (error) {
    console.error('Error creating investment:', error);
    res.status(500).json({ success: false, error: 'Failed to create investment entry' });
  }
};

const updateInvestment = async (req, res) => {
  try {
    const { date, type, amount, description } = req.body;
    const updateData = {};
    if (date) updateData.date = date;
    if (type) updateData.type = type;
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (description !== undefined) updateData.description = description;

    const { data, error } = await supabase
      .from('investment_entries')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Investment entry not found' });

    res.json({ success: true, data, message: 'Investment entry updated successfully' });
  } catch (error) {
    console.error('Error updating investment:', error);
    res.status(500).json({ success: false, error: 'Failed to update investment entry' });
  }
};

const deleteInvestment = async (req, res) => {
  try {
    const { error } = await supabase
      .from('investment_entries')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ success: true, message: 'Investment entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting investment:', error);
    res.status(500).json({ success: false, error: 'Failed to delete investment entry' });
  }
};

module.exports = { getAllInvestments, getInvestmentById, createInvestment, updateInvestment, deleteInvestment };
