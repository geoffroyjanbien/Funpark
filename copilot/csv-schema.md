# CSV Schema Definition

## Overview
The Funpark application uses CSV files for data storage. All files are stored in the `/data` directory with atomic write operations to prevent data corruption.

## File Structure

### revenue.csv
Daily revenue entries from various categories.

**Headers:**
- `date`: Date in YYYY-MM-DD format (required)
- `category`: Revenue category - one of: "Hookah", "Drinks", "Crepe", "Games", "Various" (required)
- `amount_ll`: Amount in Lebanese Lira (decimal, 2 places, >= 0) (required)
- `amount_usd`: Amount in US Dollars (decimal, 2 places, >= 0) (required)

**Example:**
```csv
date,category,amount_ll,amount_usd
2026-04-19,Hookah,1524.00,0.00
2026-04-19,Drinks,5077.00,0.00
2026-04-19,Crepe,1180.00,0.00
2026-04-19,Games,2151.00,0.00
2026-04-19,Various,1232.00,0.00
```

**Validation:**
- date: Valid YYYY-MM-DD format
- category: Must be one of the predefined categories
- amounts: Non-negative decimals with max 2 decimal places

### expense_entries.csv
Daily expense entries with categorization and investment types.

**Headers:**
- `date`: Date in YYYY-MM-DD format (required)
- `main_category`: Main expense category (string, required)
- `subcategory`: Expense subcategory (string, optional)
- `investment_type`: Investment type - one of: "Long Term", "Mid Term", "Short Term" (required)
- `amount_ll`: Amount in Lebanese Lira (decimal, 2 places, >= 0) (required)
- `amount_usd`: Amount in US Dollars (decimal, 2 places, >= 0) (required)

**Example:**
```csv
date,main_category,subcategory,investment_type,amount_ll,amount_usd
2026-04-19,Staff,Salaries,Short Term,2000.00,0.00
2026-04-19,Supplies,Food,Short Term,500.00,0.00
2026-04-19,Equipment,Maintenance,Mid Term,800.00,0.00
2026-04-19,Marketing,Advertising,Long Term,300.00,0.00
```

**Validation:**
- date: Valid YYYY-MM-DD format
- main_category: Non-empty string
- subcategory: Optional string
- investment_type: Must be one of the predefined types
- amounts: Non-negative decimals with max 2 decimal places

### investment_entries.csv
Investment transactions with owner allocation.

**Headers:**
- `date`: Date in YYYY-MM-DD format (required)
- `investment_type`: Investment type - one of: "Long Term", "Mid Term", "Short Term" (required)
- `description`: Investment description (string, required)
- `amount_ll`: Amount in Lebanese Lira (decimal, 2 places, >= 0) (required)
- `amount_usd`: Amount in US Dollars (decimal, 2 places, >= 0) (required)
- `owner_allocation`: Which owner - "Owner1", "Owner2", or "Both" (required)

**Example:**
```csv
date,investment_type,description,amount_ll,amount_usd,owner_allocation
2026-04-19,Long Term,New playground equipment,15000.00,0.00,Both
2026-04-19,Mid Term,Marketing campaign,5000.00,0.00,Owner2
2026-04-19,Short Term,Staff training,2000.00,0.00,Owner1
```

**Validation:**
- date: Valid YYYY-MM-DD format
- investment_type: Must be one of the predefined types
- description: Non-empty string
- amounts: Non-negative decimals with max 2 decimal places
- owner_allocation: Must be "Owner1", "Owner2", or "Both"

### daily_summary.csv
Computed daily summaries with profit calculations and owner shares.

**Headers:**
- `date`: Date in YYYY-MM-DD format (required, unique)
- `daily_revenue_ll`: Total daily revenue in LL (decimal, 2 places, computed)
- `daily_expenses_ll`: Total daily expenses in LL (decimal, 2 places, computed)
- `daily_balance_ll`: Daily profit (revenue - expenses) in LL (decimal, 2 places, computed)
- `owner1_share_ll`: Owner1 share in LL (decimal, 2 places, computed)
- `owner2_share_ll`: Owner2 share in LL (decimal, 2 places, computed)

**Example:**
```csv
date,daily_revenue_ll,daily_expenses_ll,daily_balance_ll,owner1_share_ll,owner2_share_ll
2026-04-19,11164.00,3600.00,7564.00,2269.20,5294.80
```

**Calculation Rules:**
- daily_revenue_ll = SUM(revenue.amount_ll) for the date
- daily_expenses_ll = SUM(expense_entries.amount_ll) for the date
- daily_balance_ll = daily_revenue_ll - daily_expenses_ll
- owner1_share_ll = 30% of daily_balance_ll + 0% of Long Term investments
- owner2_share_ll = 70% of daily_balance_ll + 100% of Long Term investments

**Notes:**
- This file is auto-generated from revenue.csv and expense_entries.csv
- Updated whenever revenue or expense data changes

### summary_views.csv
Monthly and yearly aggregated summaries.

**Headers:**
- `month`: Month as MM (01-12) (for monthly summaries)
- `year`: Year as YYYY (required)
- `total_revenue_ll`: Total revenue for period in LL (decimal, 2 places, computed)
- `total_expenses_ll`: Total expenses for period in LL (decimal, 2 places, computed)
- `balance_ll`: Total profit for period in LL (decimal, 2 places, computed)
- `owner1_share_ll`: Owner1 total share for period in LL (decimal, 2 places, computed)
- `owner2_share_ll`: Owner2 total share for period in LL (decimal, 2 places, computed)

**Example (Monthly):**
```csv
month,year,total_revenue_ll,total_expenses_ll,balance_ll,owner1_share_ll,owner2_share_ll
04,2026,335000.00,108000.00,227000.00,68100.00,158900.00
```

**Example (Yearly):**
```csv
month,year,total_revenue_ll,total_expenses_ll,balance_ll,owner1_share_ll,owner2_share_ll
,2026,4000000.00,1300000.00,2700000.00,810000.00,1890000.00
```

**Notes:**
- For yearly summaries, month field is empty
- Aggregated from daily_summary.csv
- Investment allocations applied per the rules above

## Data Integrity Rules

### Atomic Operations
- All CSV writes use atomic operations: write to temp file, then rename
- Prevents data corruption during concurrent access

### Unique Constraints
- revenue.csv, expense_entries.csv, investment_entries.csv: No duplicate (date, category/type) combinations
- daily_summary.csv: Unique dates
- summary_views.csv: Unique (month, year) combinations

### Referential Integrity
- All dates must be valid YYYY-MM-DD
- Categories and types must match predefined lists
- Amounts must be non-negative with max 2 decimal places

### Backup Strategy
- Daily automatic backups to cloud storage
- Manual rollback procedures available
- All timestamps in UTC

## Import/Export Considerations

### Excel Import
- funpark.xlsx will be parsed to populate initial CSV data
- Validation applied during import
- Reconciliation process to match Excel calculations

### Export Formats
- CSV export for all data
- PDF generation for summaries
- Data integrity maintained during exports