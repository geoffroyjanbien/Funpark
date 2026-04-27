const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

/**
 * Import Manager Excel Files
 * Run: node importManager.js
 */

const dataDir = path.join(__dirname, 'data');
const managerDir = path.join(__dirname, '..', 'Manager', 'Excel');

async function clearData() {
  console.log('🗑️  Clearing existing data...\n');
  
  const files = [
    'revenue.csv',
    'expense_entries.csv',
    'investment_entries.csv'
  ];
  
  for (const file of files) {
    const filePath = path.join(dataDir, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`   Deleted: ${file}`);
    }
  }
  console.log('');
}

function writeCSV(filename, data, headers) {
  const filePath = path.join(dataDir, filename);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => {
      const value = row[h] || '';
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    }).join(','))
  ].join('\n');
  
  fs.writeFileSync(filePath, csvContent, 'utf8');
  console.log(`   ✓ Wrote ${data.length} rows to ${filename}`);
}

function parseExcelDate(serial) {
  if (!serial || typeof serial !== 'number') return null;
  const date = new Date((serial - 25569) * 86400 * 1000);
  return date.toISOString().split('T')[0];
}

async function importInvestments() {
  console.log('📊 Importing investments...\n');
  
  const filePath = path.join(managerDir, 'investment.xlsx');
  
  if (!fs.existsSync(filePath)) {
    console.log('   ⚠️  investment.xlsx not found\n');
    return 0;
  }
  
  try {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    const investments = [];
    let id = 1;
    
    // Skip header row, process data rows
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0) continue;
      
      const description = row[0]; // First column is description
      const total = row[10]; // Column K is total
      const type = row[11]; // Column L is type (شراكة)
      
      if (description && total && !isNaN(parseFloat(total))) {
        investments.push({
          id: id++,
          date: '2026-01-01', // Default date since not in file
          type: type === 'شراكة' ? 'Long Term' : 'Long Term',
          amount: Math.round(parseFloat(total) / 90000), // Convert LL to USD
          description: description
        });
      }
    }
    
    if (investments.length > 0) {
      writeCSV('investment_entries.csv', investments, ['id', 'date', 'type', 'amount', 'description']);
    }
    
    console.log('');
    return investments.length;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
    return 0;
  }
}

async function importFunPark() {
  console.log('📊 Importing fun park data...\n');
  
  // Try different unlocked file name variations
  const possibleFiles = [
    'fun park - 10 unlocked.xlsx',
    'fun park - 10 - unlocked.xlsx',
    'fun park - 10.xlsx'
  ];
  
  let filePath = null;
  for (const filename of possibleFiles) {
    const testPath = path.join(managerDir, filename);
    if (fs.existsSync(testPath)) {
      filePath = testPath;
      console.log(`   Found file: ${filename}`);
      break;
    }
  }
  
  if (!filePath) {
    console.log('   ⚠️  fun park file not found\n');
    return { revenue: 0, expenses: 0 };
  }
  
  try {
    const workbook = XLSX.readFile(filePath);
    console.log(`   Found ${workbook.SheetNames.length} sheets`);
    
    const revenueData = [];
    const expenseData = [];
    let revenueId = 1;
    let expenseId = 1;
    
    // Process day sheets (1-31)
    const daySheets = workbook.SheetNames.filter(name => /^\d+$/.test(name.trim()));
    console.log(`   Processing ${daySheets.length} day sheets...`);
    
    for (const sheetName of daySheets) {
      const day = parseInt(sheetName.trim());
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
      
      // Assume current month/year (you can adjust this)
      const date = `2026-04-${String(day).padStart(2, '0')}`;
      
      // Parse revenue (rows 5-9: اراكيل, مشروبات, كريب, العاب, مختلف)
      const revenueCategories = [
        { row: 5, source: 'Hookah', arabicName: 'اراكيل' },
        { row: 6, source: 'Drinks', arabicName: 'مشروبات' },
        { row: 7, source: 'Crepe', arabicName: 'كريب' },
        { row: 8, source: 'Games', arabicName: 'العاب' },
        { row: 9, source: 'Various', arabicName: 'مختلف' }
      ];
      
      for (const cat of revenueCategories) {
        const row = data[cat.row];
        if (row && row[2]) {
          const amountLL = parseFloat(row[2]) || 0;
          if (amountLL > 0) {
            revenueData.push({
              id: revenueId++,
              date,
              source: cat.source,
              amount: Math.round(amountLL / 90000), // Convert LL to USD
              description: ''
            });
          }
        }
      }
      
      // Parse expenses (starting from row 12)
      const expenseMapping = {
        'معسل': 'Molasses',
        'فحم': 'Charcoal',
        'نرابيج و لوازم': 'Hookah Accessories',
        'فواكهة': 'Fruits',
        'عسل': 'Honey',
        'نسلة': 'Nestle',
        'شوكولا': 'Chocolate',
        'حليب': 'Milk',
        'مشروبات غازية': 'Soft Drinks',
        'نيسكافيه و كابتشينو': 'Nescafe Cappuccino',
        'قهوة مكنة': 'Machine Coffee',
        'لوازم أخرى': 'Other Supplies',
        'كبيايات': 'Cups',
        'محارم': 'Tissues',
        'مواد تنظيف': 'Cleaning Materials',
        'مختلف': 'Various',
        'مازوت': 'Diesel',
        'صيانة': 'Maintenance',
        'اقتناء أصول': 'Asset Acquisition',
        'سلف موظفين': 'Staff Advances',
        'بنزين': 'Gasoline',
        'نقل': 'Transport',
        'رواتب': 'Salaries'
      };
      
      for (let i = 12; i < 35 && i < data.length; i++) {
        const row = data[i];
        if (row && row[1] && row[2]) {
          const arabicName = row[1].toString().trim();
          const amountLL = parseFloat(row[2]) || 0;
          
          if (amountLL > 0 && expenseMapping[arabicName]) {
            expenseData.push({
              id: expenseId++,
              date,
              category: expenseMapping[arabicName],
              amount: Math.round(amountLL / 90000), // Convert LL to USD
              description: ''
            });
          }
        }
      }
    }
    
    // Write CSVs
    if (revenueData.length > 0) {
      writeCSV('revenue.csv', revenueData, ['id', 'date', 'source', 'amount', 'description']);
    }
    
    if (expenseData.length > 0) {
      writeCSV('expense_entries.csv', expenseData, ['id', 'date', 'category', 'amount', 'description']);
    }
    
    console.log('');
    return { revenue: revenueData.length, expenses: expenseData.length };
    
  } catch (error) {
    if (error.message.includes('password-protected')) {
      console.log('   ❌ File is password-protected!\n');
      console.log('   📝 Please unlock manually:');
      console.log('      1. Open "fun park - 10.xlsx" in Excel');
      console.log('      2. Enter password: f123');
      console.log('      3. File > Save As');
      console.log('      4. Name: "fun park - 10 - unlocked.xlsx"');
      console.log('      5. Save (no password)\n');
    } else {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
    return { revenue: 0, expenses: 0 };
  }
}

async function main() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   Funpark Manager Data Import Tool    ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  // Clear existing data
  await clearData();
  
  // Import investments
  const investmentCount = await importInvestments();
  
  // Try to import fun park data
  const { revenue, expenses } = await importFunPark();
  
  // Summary
  console.log('╔════════════════════════════════════════╗');
  console.log('║           Import Summary               ║');
  console.log('╠════════════════════════════════════════╣');
  console.log(`║  Revenue entries:     ${String(revenue).padStart(16)} ║`);
  console.log(`║  Expense entries:     ${String(expenses).padStart(16)} ║`);
  console.log(`║  Investment entries:  ${String(investmentCount).padStart(16)} ║`);
  console.log('╚════════════════════════════════════════╝\n');
  
  if (revenue === 0 && expenses === 0) {
    console.log('⚠️  Note: Revenue and expense data not imported due to password protection\n');
  }
}

main().catch(console.error);
