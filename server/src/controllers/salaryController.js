const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const EMPLOYEES_FILE = path.join(__dirname, '../../data/employees.csv');
const PAYMENTS_FILE = path.join(__dirname, '../../data/salary_payments.csv');

// Helper function to read CSV
async function readCSV(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const lines = data.trim().split('\n');
    if (lines.length <= 1) return [];
    
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const obj = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = values[index]?.trim() || '';
      });
      return obj;
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Helper function to write CSV
async function writeCSV(filePath, data, headers) {
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => row[h] || '').join(','))
  ].join('\n');
  
  await fs.writeFile(filePath, csvContent, 'utf8');
}

// Employee Controllers
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await readCSV(EMPLOYEES_FILE);
    res.json({
      success: true,
      data: employees,
      count: employees.length
    });
  } catch (error) {
    console.error('Error reading employees:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to read employees',
      error: error.message
    });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employees = await readCSV(EMPLOYEES_FILE);
    const employee = employees.find(e => e.id === req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error reading employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to read employee',
      error: error.message
    });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { name, position, monthly_salary, hire_date, status } = req.body;
    
    if (!name || !position || !monthly_salary || !hire_date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    const employees = await readCSV(EMPLOYEES_FILE);
    const newEmployee = {
      id: uuidv4(),
      name,
      position,
      monthly_salary: parseFloat(monthly_salary),
      hire_date,
      status: status || 'active'
    };
    
    employees.push(newEmployee);
    await writeCSV(EMPLOYEES_FILE, employees, ['id', 'name', 'position', 'monthly_salary', 'hire_date', 'status']);
    
    res.status(201).json({
      success: true,
      data: newEmployee,
      message: 'Employee created successfully'
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create employee',
      error: error.message
    });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const employees = await readCSV(EMPLOYEES_FILE);
    const index = employees.findIndex(e => e.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    employees[index] = { ...employees[index], ...req.body };
    await writeCSV(EMPLOYEES_FILE, employees, ['id', 'name', 'position', 'monthly_salary', 'hire_date', 'status']);
    
    res.json({
      success: true,
      data: employees[index],
      message: 'Employee updated successfully'
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee',
      error: error.message
    });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employees = await readCSV(EMPLOYEES_FILE);
    const filtered = employees.filter(e => e.id !== req.params.id);
    
    if (filtered.length === employees.length) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    await writeCSV(EMPLOYEES_FILE, filtered, ['id', 'name', 'position', 'monthly_salary', 'hire_date', 'status']);
    
    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee',
      error: error.message
    });
  }
};

// Payment Controllers
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await readCSV(PAYMENTS_FILE);
    const employees = await readCSV(EMPLOYEES_FILE);
    
    const paymentsWithNames = payments.map(payment => ({
      ...payment,
      amount: parseFloat(payment.amount),
      year: parseInt(payment.year),
      employee_name: employees.find(e => e.id === payment.employee_id)?.name || 'Unknown'
    }));
    
    console.log('Returning payments:', paymentsWithNames);
    
    res.json({
      success: true,
      data: paymentsWithNames,
      count: paymentsWithNames.length
    });
  } catch (error) {
    console.error('Error reading payments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to read payments',
      error: error.message
    });
  }
};

exports.getPaymentsByEmployee = async (req, res) => {
  try {
    const payments = await readCSV(PAYMENTS_FILE);
    const filtered = payments.filter(p => p.employee_id === req.params.employeeId);
    
    res.json({
      success: true,
      data: filtered,
      count: filtered.length
    });
  } catch (error) {
    console.error('Error reading payments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to read payments',
      error: error.message
    });
  }
};

exports.getPaymentsByMonth = async (req, res) => {
  try {
    const { year, month } = req.query;
    const payments = await readCSV(PAYMENTS_FILE);
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[parseInt(month) - 1];
    
    const filtered = payments.filter(p => 
      p.year === year && p.month === monthName
    );
    
    res.json({
      success: true,
      data: filtered,
      count: filtered.length
    });
  } catch (error) {
    console.error('Error reading payments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to read payments',
      error: error.message
    });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const { employee_id, amount, payment_date, payment_type, month, year, notes } = req.body;
    
    console.log('Creating payment with data:', req.body);
    
    if (!employee_id || !amount || !payment_date || !payment_type || !month || !year) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        received: req.body
      });
    }
    
    const payments = await readCSV(PAYMENTS_FILE);
    const newPayment = {
      id: uuidv4(),
      employee_id,
      amount: parseFloat(amount),
      payment_date,
      payment_type,
      month,
      year: parseInt(year),
      notes: notes || ''
    };
    
    console.log('New payment object:', newPayment);
    
    payments.push(newPayment);
    await writeCSV(PAYMENTS_FILE, payments, ['id', 'employee_id', 'amount', 'payment_date', 'payment_type', 'month', 'year', 'notes']);
    
    console.log('Payment saved successfully');
    
    res.status(201).json({
      success: true,
      data: newPayment,
      message: 'Payment created successfully'
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment',
      error: error.message
    });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const payments = await readCSV(PAYMENTS_FILE);
    const index = payments.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    payments[index] = { ...payments[index], ...req.body };
    await writeCSV(PAYMENTS_FILE, payments, ['id', 'employee_id', 'amount', 'payment_date', 'payment_type', 'month', 'year', 'notes']);
    
    res.json({
      success: true,
      data: payments[index],
      message: 'Payment updated successfully'
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment',
      error: error.message
    });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const payments = await readCSV(PAYMENTS_FILE);
    const filtered = payments.filter(p => p.id !== req.params.id);
    
    if (filtered.length === payments.length) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    await writeCSV(PAYMENTS_FILE, filtered, ['id', 'employee_id', 'amount', 'payment_date', 'payment_type', 'month', 'year', 'notes']);
    
    res.json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete payment',
      error: error.message
    });
  }
};

// Summary
exports.getSalarySummary = async (req, res) => {
  try {
    const { year, month } = req.query;
    const employees = await readCSV(EMPLOYEES_FILE);
    const payments = await readCSV(PAYMENTS_FILE);
    
    const activeEmployees = employees.filter(e => e.status === 'active');
    const totalMonthlySalaries = activeEmployees.reduce((sum, e) => sum + parseFloat(e.monthly_salary || 0), 0);
    
    let filteredPayments = payments;
    if (year && month) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December'];
      const monthName = monthNames[parseInt(month) - 1];
      filteredPayments = payments.filter(p => 
        p.year === year && p.month === monthName
      );
    }
    
    const totalPaidThisMonth = filteredPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    
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
    res.status(500).json({
      success: false,
      message: 'Failed to calculate summary',
      error: error.message
    });
  }
};
