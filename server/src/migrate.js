require('dotenv').config();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const supabase = require('./config/supabase');

// Helper function to read CSV file
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

// Migrate categories
async function migrateCategories() {
  console.log('Migrating categories...');
  const data = await readCSV(path.join(__dirname, '../data/categories.csv'));
  
  const categories = data.map(row => ({
    type: row.type,
    name_en: row.name_en,
    name_ar: row.name_ar,
    parent_category: row.parent_category || null,
    is_active: row.is_active === 'true'
  }));

  const { data: inserted, error } = await supabase
    .from('categories')
    .insert(categories);

  if (error) {
    console.error('Error migrating categories:', error);
  } else {
    console.log(`✓ Migrated ${categories.length} categories`);
  }
}

// Migrate revenue
async function migrateRevenue() {
  console.log('Migrating revenue...');
  const data = await readCSV(path.join(__dirname, '../data/revenue.csv'));
  
  const revenue = data
    .filter(row => {
      // Validate date
      const date = new Date(row.date);
      if (isNaN(date.getTime())) {
        console.log(`⚠ Skipping invalid date: ${row.date}`);
        return false;
      }
      return true;
    })
    .map(row => ({
      date: row.date,
      source: row.source,
      amount: parseFloat(row.amount),
      description: row.description || null
    }));

  if (revenue.length === 0) {
    console.log('⚠ No valid revenue entries to migrate');
    return;
  }

  const { data: inserted, error } = await supabase
    .from('revenue')
    .insert(revenue);

  if (error) {
    console.error('Error migrating revenue:', error);
  } else {
    console.log(`✓ Migrated ${revenue.length} revenue entries`);
  }
}

// Migrate expenses
async function migrateExpenses() {
  console.log('Migrating expenses...');
  const data = await readCSV(path.join(__dirname, '../data/expense_entries.csv'));
  
  const expenses = data
    .filter(row => {
      // Validate date
      const date = new Date(row.date);
      if (isNaN(date.getTime())) {
        console.log(`⚠ Skipping invalid date: ${row.date}`);
        return false;
      }
      return true;
    })
    .map(row => ({
      date: row.date,
      category: row.category,
      amount: parseFloat(row.amount),
      description: row.description || null
    }));

  if (expenses.length === 0) {
    console.log('⚠ No valid expense entries to migrate');
    return;
  }

  const { data: inserted, error } = await supabase
    .from('expense_entries')
    .insert(expenses);

  if (error) {
    console.error('Error migrating expenses:', error);
  } else {
    console.log(`✓ Migrated ${expenses.length} expense entries`);
  }
}

// Migrate investments
async function migrateInvestments() {
  console.log('Migrating investments...');
  const filePath = path.join(__dirname, '../data/investment_entries.csv');
  
  if (!fs.existsSync(filePath)) {
    console.log('⚠ No investment entries file found, skipping...');
    return;
  }
  
  const data = await readCSV(filePath);
  
  if (data.length === 0) {
    console.log('⚠ No investment entries to migrate');
    return;
  }
  
  const investments = data
    .filter(row => {
      // Validate date and amount
      const date = new Date(row.date);
      const amount = parseFloat(row.amount);
      if (isNaN(date.getTime())) {
        console.log(`⚠ Skipping invalid date: ${row.date}`);
        return false;
      }
      if (isNaN(amount) || !row.amount) {
        console.log(`⚠ Skipping entry with invalid amount`);
        return false;
      }
      return true;
    })
    .map(row => ({
      date: row.date,
      type: row.type,
      amount: parseFloat(row.amount),
      description: row.description || null
    }));

  if (investments.length === 0) {
    console.log('⚠ No valid investment entries to migrate');
    return;
  }

  const { data: inserted, error } = await supabase
    .from('investment_entries')
    .insert(investments);

  if (error) {
    console.error('Error migrating investments:', error);
  } else {
    console.log(`✓ Migrated ${investments.length} investment entries`);
  }
}

// Migrate employees
async function migrateEmployees() {
  console.log('Migrating employees...');
  const filePath = path.join(__dirname, '../data/employees.csv');
  
  if (!fs.existsSync(filePath)) {
    console.log('⚠ No employees file found, skipping...');
    return;
  }
  
  const data = await readCSV(filePath);
  
  if (data.length === 0) {
    console.log('⚠ No employees to migrate');
    return;
  }
  
  const employees = data.map(row => ({
    name: row.name,
    position: row.position,
    monthly_salary: parseFloat(row.monthly_salary || 0),
    hire_date: row.hire_date || null,
    status: row.status || 'active'
  }));

  const { data: inserted, error } = await supabase
    .from('employees')
    .insert(employees);

  if (error) {
    console.error('Error migrating employees:', error);
  } else {
    console.log(`✓ Migrated ${employees.length} employees`);
  }
}

// Migrate salary payments
async function migrateSalaryPayments() {
  console.log('Migrating salary payments...');
  const filePath = path.join(__dirname, '../data/salary_payments.csv');
  
  if (!fs.existsSync(filePath)) {
    console.log('⚠ No salary payments file found, skipping...');
    return;
  }
  
  const data = await readCSV(filePath);
  
  if (data.length === 0) {
    console.log('⚠ No salary payments to migrate');
    return;
  }
  
  // First, get all employees to map names to IDs
  const { data: employees, error: empError } = await supabase
    .from('employees')
    .select('id, name');
    
  if (empError) {
    console.error('Error fetching employees:', empError);
    return;
  }
  
  const employeeMap = {};
  employees.forEach(emp => {
    employeeMap[emp.name] = emp.id;
  });
  
  const payments = data.map(row => ({
    employee_id: employeeMap[row.employee_name],
    date: row.date,
    amount: parseFloat(row.amount),
    payment_type: row.payment_type || 'full',
    description: row.description || null
  })).filter(p => p.employee_id); // Only include payments with valid employee_id

  if (payments.length === 0) {
    console.log('⚠ No valid salary payments to migrate');
    return;
  }

  const { data: inserted, error } = await supabase
    .from('salary_payments')
    .insert(payments);

  if (error) {
    console.error('Error migrating salary payments:', error);
  } else {
    console.log(`✓ Migrated ${payments.length} salary payments`);
  }
}

// Main migration function
async function migrate() {
  console.log('🚀 Starting migration from CSV to Supabase...\n');
  
  try {
    await migrateCategories();
    await migrateRevenue();
    await migrateExpenses();
    await migrateInvestments();
    await migrateEmployees();
    await migrateSalaryPayments();
    
    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
  }
}

// Run migration
migrate();
