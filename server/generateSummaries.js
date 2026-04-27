const fs = require('fs');
const path = require('path');

/**
 * Generate summary data from imported revenue and expenses
 */

const dataDir = path.join(__dirname, 'data');

function parseCSV(filename) {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) return [];
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = values[i] || '';
    });
    return obj;
  });
}

function writeCSV(filename, data, headers) {
  const filePath = path.join(dataDir, filename);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => row[h] || '').join(','))
  ].join('\n') + '\n';
  
  fs.writeFileSync(filePath, csvContent, 'utf8');
}

function generateSummaries() {
  console.log('Generating summaries from imported data...\n');
  
  // Read revenue and expenses
  const revenue = parseCSV('revenue.csv');
  const expenses = parseCSV('expense_entries.csv');
  
  console.log(`  Revenue entries: ${revenue.length}`);
  console.log(`  Expense entries: ${expenses.length}\n`);
  
  // Group by date
  const dailyData = {};
  
  revenue.forEach(entry => {
    const date = entry.date;
    if (!dailyData[date]) {
      dailyData[date] = { revenue: 0, expenses: 0 };
    }
    dailyData[date].revenue += parseFloat(entry.amount) || 0;
  });
  
  expenses.forEach(entry => {
    const date = entry.date;
    if (!dailyData[date]) {
      dailyData[date] = { revenue: 0, expenses: 0 };
    }
    dailyData[date].expenses += parseFloat(entry.amount) || 0;
  });
  
  // Generate daily summary
  const dailySummary = Object.keys(dailyData).sort().map(date => {
    const data = dailyData[date];
    const balance = data.revenue - data.expenses;
    const owner1Share = balance * 0.7;
    const owner2Share = balance * 0.3;
    
    return {
      date,
      daily_revenue_ll: data.revenue.toFixed(2),
      daily_expenses_ll: data.expenses.toFixed(2),
      daily_balance_ll: balance.toFixed(2),
      owner1_share_ll: owner1Share.toFixed(2),
      owner2_share_ll: owner2Share.toFixed(2)
    };
  });
  
  writeCSV('daily_summary.csv', dailySummary, [
    'date',
    'daily_revenue_ll',
    'daily_expenses_ll',
    'daily_balance_ll',
    'owner1_share_ll',
    'owner2_share_ll'
  ]);
  
  console.log(`  ✓ Generated ${dailySummary.length} daily summaries`);
  
  // Generate monthly/yearly summary
  const monthlyData = {};
  
  dailySummary.forEach(day => {
    const [year, month] = day.date.split('-');
    const key = `${month}-${year}`;
    
    if (!monthlyData[key]) {
      monthlyData[key] = {
        month,
        year,
        total_revenue_ll: 0,
        total_expenses_ll: 0,
        balance_ll: 0,
        owner1_share_ll: 0,
        owner2_share_ll: 0
      };
    }
    
    monthlyData[key].total_revenue_ll += parseFloat(day.daily_revenue_ll);
    monthlyData[key].total_expenses_ll += parseFloat(day.daily_expenses_ll);
    monthlyData[key].balance_ll += parseFloat(day.daily_balance_ll);
    monthlyData[key].owner1_share_ll += parseFloat(day.owner1_share_ll);
    monthlyData[key].owner2_share_ll += parseFloat(day.owner2_share_ll);
  });
  
  const monthlySummary = Object.values(monthlyData).map(data => ({
    month: data.month,
    year: data.year,
    total_revenue_ll: data.total_revenue_ll.toFixed(2),
    total_expenses_ll: data.total_expenses_ll.toFixed(2),
    balance_ll: data.balance_ll.toFixed(2),
    owner1_share_ll: data.owner1_share_ll.toFixed(2),
    owner2_share_ll: data.owner2_share_ll.toFixed(2)
  }));
  
  writeCSV('summary_views.csv', monthlySummary, [
    'month',
    'year',
    'total_revenue_ll',
    'total_expenses_ll',
    'balance_ll',
    'owner1_share_ll',
    'owner2_share_ll'
  ]);
  
  console.log(`  ✓ Generated ${monthlySummary.length} monthly summaries\n`);
  
  // Display summary
  console.log('Summary Statistics:');
  console.log('═══════════════════════════════════════');
  monthlySummary.forEach(m => {
    console.log(`\n${m.year}-${m.month}:`);
    console.log(`  Total Revenue:  ${parseFloat(m.total_revenue_ll).toLocaleString()} LL`);
    console.log(`  Total Expenses: ${parseFloat(m.total_expenses_ll).toLocaleString()} LL`);
    console.log(`  Balance:        ${parseFloat(m.balance_ll).toLocaleString()} LL`);
    console.log(`  Owner 1 (70%):  ${parseFloat(m.owner1_share_ll).toLocaleString()} LL`);
    console.log(`  Owner 2 (30%):  ${parseFloat(m.owner2_share_ll).toLocaleString()} LL`);
  });
  console.log('\n');
}

// Run
try {
  generateSummaries();
  console.log('✅ Summary generation completed\n');
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
