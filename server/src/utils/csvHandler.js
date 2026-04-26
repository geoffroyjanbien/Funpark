const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const csvWriter = require('csv-writer').createObjectCsvWriter;

/**
 * CSV Handler for Funpark application
 * Provides atomic read/write operations for all CSV data files
 */

// File paths (relative to data directory)
const CSV_FILES = {
  REVENUE: 'revenue.csv',
  EXPENSE_ENTRIES: 'expense_entries.csv',
  INVESTMENT_ENTRIES: 'investment_entries.csv',
  DAILY_SUMMARY: 'daily_summary.csv',
  SUMMARY_VIEWS: 'summary_views.csv',
  CATEGORIES: 'categories.csv'
};

// Schema definitions for validation
const SCHEMAS = {
  REVENUE: {
    headers: ['date', 'category', 'amount_ll', 'amount_usd'],
    required: ['date', 'category', 'amount_ll', 'amount_usd'],
    validations: {
      category: ['Hookah', 'Drinks', 'Crepe', 'Games', 'Various'],
      amounts: ['amount_ll', 'amount_usd']
    }
  },
  EXPENSE_ENTRIES: {
    headers: ['date', 'main_category', 'subcategory', 'investment_type', 'amount_ll', 'amount_usd'],
    required: ['date', 'main_category', 'investment_type', 'amount_ll', 'amount_usd'],
    validations: {
      investment_type: ['Long Term', 'Mid Term', 'Short Term'],
      amounts: ['amount_ll', 'amount_usd']
    }
  },
  INVESTMENT_ENTRIES: {
    headers: ['date', 'investment_type', 'description', 'amount_ll', 'amount_usd', 'owner_allocation'],
    required: ['date', 'investment_type', 'description', 'amount_ll', 'amount_usd', 'owner_allocation'],
    validations: {
      investment_type: ['Long Term', 'Mid Term', 'Short Term'],
      owner_allocation: ['Owner1', 'Owner2', 'Both'],
      amounts: ['amount_ll', 'amount_usd']
    }
  },
  DAILY_SUMMARY: {
    headers: ['date', 'daily_revenue_ll', 'daily_expenses_ll', 'daily_balance_ll', 'owner1_share_ll', 'owner2_share_ll'],
    required: ['date', 'daily_revenue_ll', 'daily_expenses_ll', 'daily_balance_ll', 'owner1_share_ll', 'owner2_share_ll'],
    validations: {
      amounts: ['daily_revenue_ll', 'daily_expenses_ll', 'daily_balance_ll', 'owner1_share_ll', 'owner2_share_ll']
    }
  },
  SUMMARY_VIEWS: {
    headers: ['month', 'year', 'total_revenue_ll', 'total_expenses_ll', 'balance_ll', 'owner1_share_ll', 'owner2_share_ll'],
    required: ['year', 'total_revenue_ll', 'total_expenses_ll', 'balance_ll', 'owner1_share_ll', 'owner2_share_ll'],
    validations: {
      amounts: ['total_revenue_ll', 'total_expenses_ll', 'balance_ll', 'owner1_share_ll', 'owner2_share_ll']
    }
  },
  CATEGORIES: {
    headers: ['id', 'type', 'name_en', 'name_ar', 'parent_category', 'is_active'],
    required: ['id', 'type', 'name_en', 'name_ar', 'is_active'],
    validations: {
      type: ['revenue', 'expense', 'investment'],
      is_active: ['true', 'false']
    }
  }
};

/**
 * Ensure data directory exists
 */
function ensureDataDirectory(dataPath) {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
  }
}

/**
 * Atomic write operation - writes to temp file then renames
 */
function atomicWrite(filePath, data) {
  const tempPath = filePath + '.tmp';
  fs.writeFileSync(tempPath, data, 'utf8');
  fs.renameSync(tempPath, filePath);
}

/**
 * Validate record against schema
 */
function validateRecord(record, schema) {
  // Check required fields
  for (const field of schema.required) {
    if (!record[field] && record[field] !== 0) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validate enum fields
  if (schema.validations) {
    for (const [field, allowedValues] of Object.entries(schema.validations)) {
      if (field !== 'amounts' && record[field] && !allowedValues.includes(record[field])) {
        throw new Error(`Invalid value for ${field}: ${record[field]}. Allowed: ${allowedValues.join(', ')}`);
      }
    }

    // Validate amounts (non-negative decimals with max 2 decimal places)
    if (schema.validations.amounts) {
      for (const amountField of schema.validations.amounts) {
        const value = parseFloat(record[amountField]);
        if (isNaN(value)) {
          throw new Error(`Invalid amount for ${amountField}: ${record[amountField]}. Must be a number.`);
        }
        // Allow negative values for balance fields (profit can be negative)
        if (value < 0 && !amountField.includes('balance') && !amountField.includes('share')) {
          throw new Error(`Invalid amount for ${amountField}: ${record[amountField]}. Must be non-negative number.`);
        }
        // Check decimal places - allow up to 2 decimal places
        const decimalPart = (record[amountField].toString().split('.')[1] || '').length;
        if (decimalPart > 2) {
          throw new Error(`Invalid decimal places for ${amountField}: ${record[amountField]}. Max 2 decimal places allowed.`);
        }
      }
    }
  }

  // Validate date format
  if (record.date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(record.date)) {
      throw new Error(`Invalid date format: ${record.date}. Expected YYYY-MM-DD.`);
    }
  }
}

/**
 * Read CSV file and return parsed data
 */
async function readCSV(fileType, dataPath = './data') {
  const filePath = path.join(dataPath, CSV_FILES[fileType]);
  const schema = SCHEMAS[fileType];

  if (!fs.existsSync(filePath)) {
    return [];
  }

  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Validate each record
        try {
          validateRecord(data, schema);
          results.push(data);
        } catch (error) {
          reject(new Error(`Validation error in ${fileType}: ${error.message}`));
        }
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', reject);
  });
}

/**
 * Write data to CSV file atomically
 */
async function writeCSV(fileType, data, dataPath = './data') {
  ensureDataDirectory(dataPath);
  const filePath = path.join(dataPath, CSV_FILES[fileType]);
  const schema = SCHEMAS[fileType];

  // Validate all records
  for (const record of data) {
    validateRecord(record, schema);
  }

  // Create CSV writer
  const writer = csvWriter({
    path: filePath + '.tmp',
    header: schema.headers.map(header => ({ id: header, title: header }))
  });

  // Write data
  await writer.writeRecords(data);

  // Atomic rename
  fs.renameSync(filePath + '.tmp', filePath);
}

/**
 * Append single record to CSV file
 */
async function appendToCSV(fileType, record, dataPath = './data') {
  const existingData = await readCSV(fileType, dataPath);
  existingData.push(record);
  await writeCSV(fileType, existingData, dataPath);
}

/**
 * Update record in CSV file (by finding matching criteria)
 */
async function updateInCSV(fileType, criteria, updates, dataPath = './data') {
  const data = await readCSV(fileType, dataPath);
  let found = false;

  for (let i = 0; i < data.length; i++) {
    let matches = true;
    for (const [key, value] of Object.entries(criteria)) {
      if (data[i][key] !== value) {
        matches = false;
        break;
      }
    }

    if (matches) {
      Object.assign(data[i], updates);
      found = true;
      break;
    }
  }

  if (!found) {
    throw new Error(`Record not found for criteria: ${JSON.stringify(criteria)}`);
  }

  await writeCSV(fileType, data, dataPath);
}

/**
 * Delete record from CSV file
 */
async function deleteFromCSV(fileType, criteria, dataPath = './data') {
  const data = await readCSV(fileType, dataPath);
  const filteredData = data.filter(record => {
    for (const [key, value] of Object.entries(criteria)) {
      if (record[key] !== value) {
        return true;
      }
    }
    return false;
  });

  if (filteredData.length === data.length) {
    throw new Error(`Record not found for criteria: ${JSON.stringify(criteria)}`);
  }

  await writeCSV(fileType, filteredData, dataPath);
}

module.exports = {
  CSV_FILES,
  SCHEMAS,
  readCSV,
  writeCSV,
  appendToCSV,
  updateInCSV,
  deleteFromCSV,
  validateRecord
};