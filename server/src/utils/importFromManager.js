const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { writeCSV } = require('./csvHandler');

/**
 * Import data from Manager Excel files
 * Clears existing data and imports fresh data from both Excel files
 */

class ManagerImporter {
  constructor(dataDir = './data') {
    this.dataDir = dataDir;
    this.managerDir = path.join(__dirname, '../../../Manager/Excel');
    this.stats = {
      revenue: 0,
      expenses: 0,
      investments: 0,
      errors: []
    };
  }

  async import() {
    try {
      console.log('Starting import from Manager Excel files...');
      
      // Clear existing data
      await this.clearExistingData();
      
      // Import from both files
      await this.importFunParkFile();
      await this.importInvestmentFile();
      
      console.log('Import completed successfully!');
      console.log('Stats:', this.stats);
      
      return { success: true, stats: this.stats };
    } catch (error) {
      console.error('Import failed:', error);
      this.stats.errors.push(error.message);
      return { success: false, error: error.message, stats: this.stats };
    }
  }

  async clearExistingData() {
    console.log('Clearing existing data...');
    
    const files = [
      'revenue.csv',
      'expense_entries.csv',
      'investment_entries.csv',
      'daily_summary.csv',
      'summary_views.csv'
    ];
    
    for (const file of files) {
      const filePath = path.join(this.dataDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted: ${file}`);
      }
    }
  }

  async importFunParkFile() {
    const filePath = path.join(this.managerDir, 'fun park - 10.xlsx');
    console.log(`Importing from: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    console.log(`Found ${data.length} rows in fun park file`);
    
    const revenueData = [];
    const expenseData = [];
    
    for (const row of data) {
      // Parse date
      const date = this.parseDate(row['Date'] || row['date'] || row['DATE']);
      if (!date) continue;
      
      // Check if it's revenue or expense based on columns
      if (row['Revenue'] || row['revenue'] || row['REVENUE']) {
        const amount = parseFloat(row['Revenue'] || row['revenue'] || row['REVENUE'] || 0);
        const source = row['Source'] || row['source'] || row['Category'] || 'Various';
        
        if (amount > 0) {
          revenueData.push({
            date,
            source,
            amount,
            description: row['Description'] || row['description'] || ''
          });
        }
      }
      
      if (row['Expense'] || row['expense'] || row['EXPENSE']) {
        const amount = parseFloat(row['Expense'] || row['expense'] || row['EXPENSE'] || 0);
        const category = row['Category'] || row['category'] || row['Type'] || 'Other';
        
        if (amount > 0) {
          expenseData.push({
            date,
            category,
            amount,
            description: row['Description'] || row['description'] || ''
          });
        }
      }
    }
    
    // Write to CSV
    if (revenueData.length > 0) {
      await writeCSV('REVENUE', revenueData, this.dataDir);
      this.stats.revenue = revenueData.length;
      console.log(`Imported ${revenueData.length} revenue entries`);
    }
    
    if (expenseData.length > 0) {
      await writeCSV('EXPENSE_ENTRIES', expenseData, this.dataDir);
      this.stats.expenses = expenseData.length;
      console.log(`Imported ${expenseData.length} expense entries`);
    }
  }

  async importInvestmentFile() {
    const filePath = path.join(this.managerDir, 'investment.xlsx');
    console.log(`Importing from: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      console.log('Investment file not found, skipping...');
      return;
    }
    
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    console.log(`Found ${data.length} rows in investment file`);
    
    const investmentData = [];
    
    for (const row of data) {
      const date = this.parseDate(row['Date'] || row['date'] || row['DATE']);
      if (!date) continue;
      
      const amount = parseFloat(row['Amount'] || row['amount'] || row['AMOUNT'] || 0);
      const type = row['Type'] || row['type'] || row['Investment Type'] || 'Long Term';
      const description = row['Description'] || row['description'] || row['DESCRIPTION'] || '';
      
      if (amount > 0) {
        investmentData.push({
          date,
          type,
          amount,
          description
        });
      }
    }
    
    if (investmentData.length > 0) {
      await writeCSV('INVESTMENT_ENTRIES', investmentData, this.dataDir);
      this.stats.investments = investmentData.length;
      console.log(`Imported ${investmentData.length} investment entries`);
    }
  }

  parseDate(dateValue) {
    if (!dateValue) return null;
    
    // Handle Excel date serial number
    if (typeof dateValue === 'number') {
      const date = XLSX.SSF.parse_date_code(dateValue);
      return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
    }
    
    // Handle string dates
    if (typeof dateValue === 'string') {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    }
    
    return null;
  }
}

// Run import
async function runImport() {
  const dataDir = process.env.CSV_DATA_PATH || './data';
  const importer = new ManagerImporter(dataDir);
  const result = await importer.import();
  
  if (result.success) {
    console.log('✅ Import completed successfully');
    process.exit(0);
  } else {
    console.error('❌ Import failed:', result.error);
    process.exit(1);
  }
}

module.exports = ManagerImporter;

if (require.main === module) {
  runImport();
}
