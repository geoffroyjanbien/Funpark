const supabase = require('../config/supabase');

// Employee Controllers
exports.getAllEmployees = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    res.json({ success: true, data, count: data.length });
  } catch (error) {
    console.error('Error reading employees:', error);
    res.status(500).json({ success: false, message: 'Failed to read employees', error: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Employee not found' });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error reading employee:', error);
    res.status(500).json({ success: false, message: 'Failed to read employee', error: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { name, position, monthly_salary, hire_date, status } = req.body;

    if (!name || !position || !monthly_salary || !hire_date) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('employees')
      .insert([{ name, position, monthly_salary: parseFloat(monthly_salary), hire_date, status: status || 'active' }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data, message: 'Employee created successfully' });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ success: false, message: 'Failed to create employee', error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { name, position, monthly_salary, hire_date, status } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (position) updateData.position = position;
    if (monthly_salary !== undefined) updateData.monthly_salary = parseFloat(monthly_salary);
    if (hire_date) updateData.hire_date = hire_date;
    if (status) updateData.status = status;

    const { data, error } = await supabase
      .from('employees')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Employee not found' });

    res.json({ success: true, data, message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ success: false, message: 'Failed to update employee', error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ success: false, message: 'Failed to delete employee', error: error.message });
  }
};

// Payment Controllers
// Maps DB field 'date' <-> frontend field 'payment_date' for compatibility
const mapPayment = (p) => ({
  ...p,
  payment_date: p.date,
  month: p.month || new Date(p.date).toLocaleString('en-US', { month: 'long' }),
  year: p.year || new Date(p.date).getFullYear()
});

exports.getAllPayments = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('salary_payments')
      .select('*, employees(name)')
      .order('date', { ascending: false });

    if (error) throw error;

    const payments = data.map(p => ({
      ...mapPayment(p),
      employee_name: p.employees?.name || 'Unknown',
      employees: undefined
    }));

    res.json({ success: true, data: payments, count: payments.length });
  } catch (error) {
    console.error('Error reading payments:', error);
    res.status(500).json({ success: false, message: 'Failed to read payments', error: error.message });
  }
};

exports.getPaymentsByEmployee = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('salary_payments')
      .select('*')
      .eq('employee_id', req.params.employeeId)
      .order('date', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data: data.map(mapPayment), count: data.length });
  } catch (error) {
    console.error('Error reading payments:', error);
    res.status(500).json({ success: false, message: 'Failed to read payments', error: error.message });
  }
};

exports.getPaymentsByMonth = async (req, res) => {
  try {
    const { year, month } = req.query;
    const monthNum = String(parseInt(month)).padStart(2, '0');
    const startDate = `${year}-${monthNum}-01`;
    const endDate = new Date(parseInt(year), parseInt(month), 0);
    const endDateStr = `${year}-${monthNum}-${String(endDate.getDate()).padStart(2, '0')}`;

    const { data, error } = await supabase
      .from('salary_payments')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDateStr);

    if (error) throw error;
    res.json({ success: true, data: data.map(mapPayment), count: data.length });
  } catch (error) {
    console.error('Error reading payments:', error);
    res.status(500).json({ success: false, message: 'Failed to read payments', error: error.message });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const { employee_id, amount, payment_date, payment_type, notes } = req.body;

    if (!employee_id || !amount || !payment_date || !payment_type) {
      return res.status(400).json({ success: false, message: 'Missing required fields', received: req.body });
    }

    const { data, error } = await supabase
      .from('salary_payments')
      .insert([{
        employee_id,
        amount: parseFloat(amount),
        date: payment_date,
        payment_type,
        description: notes || null
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data: mapPayment(data), message: 'Payment created successfully' });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment', error: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { amount, payment_date, payment_type, notes } = req.body;
    const updateData = {};
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (payment_date) updateData.date = payment_date;
    if (payment_type) updateData.payment_type = payment_type;
    if (notes !== undefined) updateData.description = notes;

    const { data, error } = await supabase
      .from('salary_payments')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Payment not found' });

    res.json({ success: true, data: mapPayment(data), message: 'Payment updated successfully' });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ success: false, message: 'Failed to update payment', error: error.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const { error } = await supabase
      .from('salary_payments')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ success: false, message: 'Failed to delete payment', error: error.message });
  }
};

// Summary
exports.getSalarySummary = async (req, res) => {
  try {
    const { year, month } = req.query;

    const { data: employees, error: empError } = await supabase
      .from('employees')
      .select('monthly_salary, status');
    if (empError) throw empError;

    const activeEmployees = employees.filter(e => e.status === 'active');
    const totalMonthlySalaries = activeEmployees.reduce((sum, e) => sum + parseFloat(e.monthly_salary || 0), 0);

    let paymentsQuery = supabase.from('salary_payments').select('amount');
    if (year && month) {
      const monthNum = String(parseInt(month)).padStart(2, '0');
      const startDate = `${year}-${monthNum}-01`;
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      const endDateStr = `${year}-${monthNum}-${String(endDate.getDate()).padStart(2, '0')}`;
      paymentsQuery = paymentsQuery.gte('date', startDate).lte('date', endDateStr);
    }

    const { data: payments, error: payError } = await paymentsQuery;
    if (payError) throw payError;

    const totalPaidThisMonth = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

    res.json({
      success: true,
      data: {
        totalEmployees: employees.length,
        activeEmployees: activeEmployees.length,
        totalMonthlySalaries,
        totalPaidThisMonth,
        pendingPayments: totalMonthlySalaries - totalPaidThisMonth
      }
    });
  } catch (error) {
    console.error('Error calculating summary:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate summary', error: error.message });
  }
};

exports.getEmployeePaymentSummary = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ success: false, message: 'Year and month are required' });
    }

    const monthNum = String(parseInt(month)).padStart(2, '0');
    const startDate = `${year}-${monthNum}-01`;
    const endDate = new Date(parseInt(year), parseInt(month), 0);
    const endDateStr = `${year}-${monthNum}-${String(endDate.getDate()).padStart(2, '0')}`;
    const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('en-US', { month: 'long' });

    const { data: employees, error: empError } = await supabase.from('employees').select('*');
    if (empError) throw empError;

    const { data: payments, error: payError } = await supabase
      .from('salary_payments')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDateStr);
    if (payError) throw payError;

    const employeeSummaries = employees.map(employee => {
      const employeePayments = payments.filter(p => p.employee_id === employee.id);
      const totalPaid = employeePayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
      const monthlySalary = parseFloat(employee.monthly_salary || 0);
      const remaining = monthlySalary - totalPaid;

      return {
        employee_id: employee.id,
        employee_name: employee.name,
        position: employee.position,
        status: employee.status,
        monthly_salary: monthlySalary,
        total_paid: totalPaid,
        remaining,
        is_fully_paid: remaining <= 0,
        payment_percentage: monthlySalary > 0 ? parseFloat((totalPaid / monthlySalary * 100).toFixed(2)) : 0,
        payment_count: employeePayments.length,
        payments: employeePayments.map(p => ({
          id: p.id,
          amount: parseFloat(p.amount),
          payment_date: p.date,
          payment_type: p.payment_type,
          notes: p.description
        }))
      };
    });

    const totals = {
      total_employees: employees.length,
      active_employees: employees.filter(e => e.status === 'active').length,
      total_monthly_salaries: employees.reduce((sum, e) => sum + parseFloat(e.monthly_salary || 0), 0),
      total_paid: employeeSummaries.reduce((sum, e) => sum + e.total_paid, 0),
      total_remaining: employeeSummaries.reduce((sum, e) => sum + Math.max(0, e.remaining), 0),
      fully_paid_count: employeeSummaries.filter(e => e.is_fully_paid).length
    };

    res.json({
      success: true,
      data: { year: parseInt(year), month: parseInt(month), month_name: monthName, employees: employeeSummaries, totals }
    });
  } catch (error) {
    console.error('Error calculating employee payment summary:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate employee payment summary', error: error.message });
  }
};
