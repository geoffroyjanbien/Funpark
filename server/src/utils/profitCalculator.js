const { readCSV } = require('./csvHandler');

/**
 * Profit Calculator for Funpark application
 * Handles profit calculations and owner share distributions
 */

/**
 * Calculate daily profit and owner shares for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} dataPath - Path to data directory
 * @returns {Object} Daily summary with profit and owner shares
 */
async function calculateDailyProfit(date, dataPath = './data') {
  // Get revenue for the date
  const revenues = await readCSV('REVENUE', dataPath);
  const dailyRevenues = revenues.filter(r => r.date === date);

  // Get expenses for the date
  const expenses = await readCSV('EXPENSE_ENTRIES', dataPath);
  const dailyExpenses = expenses.filter(e => e.date === date);

  // Get investments for the date (for Long Term allocation)
  const investments = await readCSV('INVESTMENT_ENTRIES', dataPath);
  const dailyInvestments = investments.filter(i => i.date === date);

  // Calculate totals
  const dailyRevenueLL = dailyRevenues.reduce((sum, r) => sum + parseFloat(r.amount_ll), 0);
  const dailyExpensesLL = dailyExpenses.reduce((sum, e) => sum + parseFloat(e.amount_ll), 0);
  const dailyBalanceLL = dailyRevenueLL - dailyExpensesLL;

  // Calculate owner shares based on profit
  // Owner1: 30% of daily profit
  // Owner2: 70% of daily profit
  const owner1ShareLL = dailyBalanceLL > 0 ? dailyBalanceLL * 0.3 : 0;
  const owner2ShareLL = dailyBalanceLL > 0 ? dailyBalanceLL * 0.7 : 0;

  // Add Long Term investment allocation (100% to Owner2)
  const longTermInvestments = dailyInvestments.filter(i => i.investment_type === 'Long Term');
  const longTermTotal = longTermInvestments.reduce((sum, i) => sum + parseFloat(i.amount_ll), 0);

  // Adjust owner shares for Long Term investments
  // Long Term investments are 100% allocated to Owner2
  const adjustedOwner2ShareLL = owner2ShareLL + longTermTotal;

  return {
    date,
    daily_revenue_ll: dailyRevenueLL.toFixed(2),
    daily_expenses_ll: dailyExpensesLL.toFixed(2),
    daily_balance_ll: dailyBalanceLL.toFixed(2),
    owner1_share_ll: owner1ShareLL.toFixed(2),
    owner2_share_ll: adjustedOwner2ShareLL.toFixed(2)
  };
}

/**
 * Calculate monthly summary for a specific month/year
 * @param {number} year - Year (YYYY)
 * @param {number} month - Month (1-12)
 * @param {string} dataPath - Path to data directory
 * @returns {Object} Monthly summary
 */
async function calculateMonthlySummary(year, month, dataPath = './data') {
  const dailySummaries = await readCSV('DAILY_SUMMARY', dataPath);

  // Filter for the specific month/year
  const monthStr = month.toString().padStart(2, '0');
  const yearStr = year.toString();
  const monthlyData = dailySummaries.filter(s => {
    const [sYear, sMonth] = s.date.split('-');
    return sYear === yearStr && sMonth === monthStr;
  });

  // Calculate totals
  const totalRevenueLL = monthlyData.reduce((sum, s) => sum + parseFloat(s.daily_revenue_ll), 0);
  const totalExpensesLL = monthlyData.reduce((sum, s) => sum + parseFloat(s.daily_expenses_ll), 0);
  const balanceLL = monthlyData.reduce((sum, s) => sum + parseFloat(s.daily_balance_ll), 0);
  const owner1ShareLL = monthlyData.reduce((sum, s) => sum + parseFloat(s.owner1_share_ll), 0);
  const owner2ShareLL = monthlyData.reduce((sum, s) => sum + parseFloat(s.owner2_share_ll), 0);

  return {
    month: monthStr,
    year: yearStr,
    total_revenue_ll: totalRevenueLL.toFixed(2),
    total_expenses_ll: totalExpensesLL.toFixed(2),
    balance_ll: balanceLL.toFixed(2),
    owner1_share_ll: owner1ShareLL.toFixed(2),
    owner2_share_ll: owner2ShareLL.toFixed(2)
  };
}

/**
 * Calculate yearly summary for a specific year
 * @param {number} year - Year (YYYY)
 * @param {string} dataPath - Path to data directory
 * @returns {Object} Yearly summary
 */
async function calculateYearlySummary(year, dataPath = './data') {
  const dailySummaries = await readCSV('DAILY_SUMMARY', dataPath);

  // Filter for the specific year
  const yearStr = year.toString();
  const yearlyData = dailySummaries.filter(s => s.date.startsWith(yearStr));

  // Calculate totals
  const totalRevenueLL = yearlyData.reduce((sum, s) => sum + parseFloat(s.daily_revenue_ll), 0);
  const totalExpensesLL = yearlyData.reduce((sum, s) => sum + parseFloat(s.daily_expenses_ll), 0);
  const balanceLL = yearlyData.reduce((sum, s) => sum + parseFloat(s.daily_balance_ll), 0);
  const owner1ShareLL = yearlyData.reduce((sum, s) => sum + parseFloat(s.owner1_share_ll), 0);
  const owner2ShareLL = yearlyData.reduce((sum, s) => sum + parseFloat(s.owner2_share_ll), 0);

  return {
    month: '', // Empty for yearly summaries
    year: yearStr,
    total_revenue_ll: totalRevenueLL.toFixed(2),
    total_expenses_ll: totalExpensesLL.toFixed(2),
    balance_ll: balanceLL.toFixed(2),
    owner1_share_ll: owner1ShareLL.toFixed(2),
    owner2_share_ll: owner2ShareLL.toFixed(2)
  };
}

/**
 * Update daily summary for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} dataPath - Path to data directory
 * @returns {Object} Updated daily summary
 */
async function updateDailySummary(date, dataPath = './data') {
  const { writeCSV, updateInCSV } = require('./csvHandler');

  const summary = await calculateDailyProfit(date, dataPath);

  try {
    // Try to update existing record
    await updateInCSV('DAILY_SUMMARY', { date }, summary, dataPath);
  } catch (error) {
    // If record doesn't exist, append it
    const { appendToCSV } = require('./csvHandler');
    await appendToCSV('DAILY_SUMMARY', summary, dataPath);
  }

  return summary;
}

/**
 * Update monthly summary for a specific month/year
 * @param {number} year - Year (YYYY)
 * @param {number} month - Month (1-12)
 * @param {string} dataPath - Path to data directory
 * @returns {Object} Updated monthly summary
 */
async function updateMonthlySummary(year, month, dataPath = './data') {
  const { writeCSV, updateInCSV } = require('./csvHandler');

  const summary = await calculateMonthlySummary(year, month, dataPath);
  const criteria = { year: summary.year, month: summary.month };

  try {
    // Try to update existing record
    await updateInCSV('SUMMARY_VIEWS', criteria, summary, dataPath);
  } catch (error) {
    // If record doesn't exist, append it
    const { appendToCSV } = require('./csvHandler');
    await appendToCSV('SUMMARY_VIEWS', summary, dataPath);
  }

  return summary;
}

/**
 * Update yearly summary for a specific year
 * @param {number} year - Year (YYYY)
 * @param {string} dataPath - Path to data directory
 * @returns {Object} Updated yearly summary
 */
async function updateYearlySummary(year, dataPath = './data') {
  const { writeCSV, updateInCSV } = require('./csvHandler');

  const summary = await calculateYearlySummary(year, dataPath);
  const criteria = { year: summary.year, month: '' };

  try {
    // Try to update existing record
    await updateInCSV('SUMMARY_VIEWS', criteria, summary, dataPath);
  } catch (error) {
    // If record doesn't exist, append it
    const { appendToCSV } = require('./csvHandler');
    await appendToCSV('SUMMARY_VIEWS', summary, dataPath);
  }

  return summary;
}

/**
 * Recalculate all summaries (useful after bulk data changes)
 * @param {string} dataPath - Path to data directory
 */
async function recalculateAllSummaries(dataPath = './data') {
  const revenues = await readCSV('REVENUE', dataPath);
  const dates = [...new Set(revenues.map(r => r.date))];

  // Update daily summaries
  for (const date of dates) {
    await updateDailySummary(date, dataPath);
  }

  // Update monthly and yearly summaries
  const years = [...new Set(dates.map(d => d.split('-')[0]))];
  const months = [...new Set(dates.map(d => {
    const [, month] = d.split('-');
    return parseInt(month);
  }))];

  for (const year of years) {
    await updateYearlySummary(parseInt(year), dataPath);
    for (const month of months) {
      await updateMonthlySummary(parseInt(year), month, dataPath);
    }
  }
}

module.exports = {
  calculateDailyProfit,
  calculateMonthlySummary,
  calculateYearlySummary,
  updateDailySummary,
  updateMonthlySummary,
  updateYearlySummary,
  recalculateAllSummaries
};