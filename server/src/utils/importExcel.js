const XlsxPopulate = require('xlsx-populate');
const fs = require('fs');
const path = require('path');

/**
 * Analyze all categories in the Excel file
 */
async function analyzeCategories() {
  try {
    const excelPath = path.join(__dirname, '../../../Manager/Excel/funpark.xlsx');

    console.log('Reading Excel file:', excelPath);
    const workbook = await XlsxPopulate.fromFileAsync(excelPath, { password: 'f123' });

    const revenueCategories = new Set();
    const expenseCategories = new Set();

    // Process sheets 1-31 (daily sheets)
    for (let day = 1; day <= 31; day++) {
      const sheetName = day.toString();
      try {
        const sheet = workbook.sheet(sheetName);
        const data = sheet.usedRange().value();

        // Revenue section (rows 5-9)
        for (let row = 5; row <= 9; row++) {
          if (data[row] && data[row][1]) {
            const category = data[row][1];
            const amountLL = data[row][2] ? parseFloat(data[row][2]) : 0;
            if (amountLL > 0) {
              revenueCategories.add(category);
            }
          }
        }

        // Expense section (rows 12-34)
        for (let row = 12; row <= 34; row++) {
          if (data[row]) {
            const mainCategory = data[row][0];
            const subCategory = data[row][1];
            const amountLL = data[row][2] ? parseFloat(data[row][2]) : 0;
            
            if (amountLL > 0 && (mainCategory || subCategory)) {
              const fullCategory = mainCategory && subCategory ? `${mainCategory} > ${subCategory}` : (subCategory || mainCategory);
              expenseCategories.add(fullCategory);
            }
          }
        }

      } catch (error) {
        // Skip missing sheets
      }
    }

    console.log('\n=== REVENUE CATEGORIES (Arabic) ===');
    Array.from(revenueCategories).sort().forEach(cat => console.log(`  - ${cat}`));

    console.log('\n=== EXPENSE CATEGORIES (Arabic) ===');
    Array.from(expenseCategories).sort().forEach(cat => console.log(`  - ${cat}`));

    console.log('\n=== MAPPING NEEDED ===');
    console.log('\nRevenue Categories:');
    console.log('اراكيل -> Hookah');
    console.log('مشروبات -> Drinks');
    console.log('كريب -> Crepe');
    console.log('العاب -> Games');
    console.log('مختلف -> Various');

    return { success: true };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: error.message };
  }
}

// Run the analysis
analyzeCategories();
