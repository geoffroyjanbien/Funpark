const fs = require('fs');
const path = require('path');

// Fix revenue.csv
const revenuePath = path.join(__dirname, '../data/revenue.csv');
let revenueData = fs.readFileSync(revenuePath, 'utf8');
revenueData = revenueData.replace(/2026-04-31/g, '2026-04-30');
fs.writeFileSync(revenuePath, revenueData);
console.log('✓ Fixed revenue.csv');

// Fix expense_entries.csv
const expensePath = path.join(__dirname, '../data/expense_entries.csv');
let expenseData = fs.readFileSync(expensePath, 'utf8');
expenseData = expenseData.replace(/2026-04-31/g, '2026-04-30');
fs.writeFileSync(expensePath, expenseData);
console.log('✓ Fixed expense_entries.csv');

console.log('\n✅ All CSV files fixed!');
