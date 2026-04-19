# Excel Import Strategy

## Overview
The Funpark application will import initial data from the existing `funpark.xlsx` Excel file to seed the CSV data files. This one-time import process will validate data integrity and ensure calculations match the original Excel formulas.

## Requirements
- Parse `Manager/Excel/funpark.xlsx` using the `xlsx` npm package
- Extract revenue, expense, and investment data
- Validate all data against CSV schema rules
- Generate CSV files matching the defined schemas
- Verify calculations match Excel outputs
- Provide reconciliation report for any discrepancies

## Excel File Structure Analysis

Based on the provided Excel analysis, the file contains:

### Revenue Data
- Daily columns (1-31 for each month)
- Categories: Hookah, Drinks, Crepe, Games, Various
- Amounts in LL (Lebanese Lira)
- Example totals: Hookah: 1,524; Drinks: 5,077; Crepe: 1,180; Games: 2,151; Various: 1,232

### Expense Data
- Granular expense entries with categories and subcategories
- Investment types: Long Term, Mid Term, Short Term
- Mixed LL and potentially USD amounts
- Date-stamped entries

### Investment Data
- Investment transactions with descriptions
- Owner allocations (30%/70% split)
- Investment types affecting profit distribution

## Import Process

### Phase 1: Analysis and Planning
1. **Excel Structure Mapping**
   - Identify worksheets and data ranges
   - Map Excel columns to CSV schema fields
   - Document any data transformations needed

2. **Data Validation Rules**
   - Date format conversion (Excel serial dates to YYYY-MM-DD)
   - Category mapping to predefined lists
   - Amount validation (non-negative, 2 decimal places)
   - Investment type classification

3. **Calculation Verification**
   - Extract Excel formulas for profit calculations
   - Document owner share allocation rules
   - Plan reconciliation checks

### Phase 2: Implementation
1. **Dependency Installation**
   ```bash
   npm install xlsx@^0.18.5
   ```

2. **Import Script Structure**
   ```javascript
   // src/utils/excelImport.js
   const XLSX = require('xlsx');
   const fs = require('fs');
   const path = require('path');

   class ExcelImporter {
     constructor(excelPath, dataDir) {
       this.excelPath = excelPath;
       this.dataDir = dataDir;
     }

     async import() {
       // Load Excel file
       const workbook = XLSX.readFile(this.excelPath);

       // Process each sheet
       await this.processRevenue(workbook);
       await this.processExpenses(workbook);
       await this.processInvestments(workbook);

       // Generate summaries
       await this.generateSummaries();

       // Validate and reconcile
       await this.validateImport();
     }
   }
   ```

3. **Data Processing Functions**
   - `processRevenue()`: Extract daily revenue by category
   - `processExpenses()`: Parse expense entries with categorization
   - `processInvestments()`: Handle investment transactions
   - `generateSummaries()`: Create daily and period summaries

### Phase 3: Validation and Reconciliation
1. **Data Integrity Checks**
   - Verify all required fields present
   - Check data type constraints
   - Validate category/type enumerations
   - Ensure date ranges are valid

2. **Calculation Reconciliation**
   - Compare imported totals with Excel calculations
   - Verify owner share distributions
   - Check investment type allocations
   - Generate discrepancy report

3. **Error Handling**
   - Log validation failures
   - Provide detailed error messages
   - Allow partial import with warnings
   - Rollback capability for failed imports

## CSV Generation Strategy

### Atomic Writes
All CSV files will be written using atomic operations:
```javascript
// Write to temp file first
const tempPath = `${csvPath}.tmp`;
await fs.promises.writeFile(tempPath, csvContent, 'utf8');

// Then rename atomically
await fs.promises.rename(tempPath, csvPath);
```

### Data Transformation Rules
- **Dates**: Convert Excel serial numbers to YYYY-MM-DD format
- **Amounts**: Ensure 2 decimal places, handle currency conversion if needed
- **Categories**: Map Excel categories to standardized CSV values
- **Investment Types**: Classify based on Excel metadata or rules

### File Creation Order
1. `revenue.csv` - Basic revenue data
2. `expense_entries.csv` - Expense transactions
3. `investment_entries.csv` - Investment records
4. `daily_summary.csv` - Computed daily summaries
5. `summary_views.csv` - Monthly/yearly aggregates

## Validation and Testing

### Unit Tests for Import Logic
```javascript
// tests/excelImport.test.js
describe('Excel Import', () => {
  test('parses revenue data correctly', () => {
    // Test revenue extraction
  });

  test('validates expense categories', () => {
    // Test category validation
  });

  test('calculates summaries accurately', () => {
    // Test summary generation
  });
});
```

### Integration Testing
- Import sample Excel data
- Compare generated CSVs with expected outputs
- Verify calculation accuracy
- Test error handling scenarios

## Command Line Interface
```bash
# Run import
npm run seed-excel

# With options
npm run seed-excel -- --validate-only  # Validation without import
npm run seed-excel -- --reconcile      # Generate reconciliation report
```

## Risk Mitigation
- **Backup Original Data**: Create backup of Excel file before import
- **Incremental Import**: Allow resuming failed imports
- **Dry Run Mode**: Validate without writing files
- **Audit Trail**: Log all import operations and transformations

## Success Criteria
- All Excel data successfully imported to CSV format
- No data loss or corruption during import
- Calculations match Excel formulas exactly
- Validation passes for all data constraints
- Reconciliation report shows zero discrepancies

## Future Enhancements
- Support for multiple Excel files
- Scheduled automatic imports
- Web-based import interface
- Advanced data mapping and transformation rules