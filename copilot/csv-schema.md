# CSV Schema Definition

## Overview
The Funpark application uses CSV files for data storage. All files are stored in the `server/data/` directory with atomic write operations to prevent data corruption.

## File Structure

### revenue.csv
Daily revenue entries from various sources.

**Headers:**
- `id`: Unique identifier (UUID, auto-generated)
- `date`: Date in YYYY-MM-DD format (required)
- `source`: Revenue source (required)
- `amount`: Amount in currency (decimal, >= 0) (required)
- `description`: Optional description (string, optional)

**Example:**
```csv
id,date,source,amount,description
550e8400-e29b-41d4-a716-446655440000,2024-12-01,Tickets,2500.00,Weekend ticket sales
550e8400-e29b-41d4-a716-446655440001,2024-12-01,Food & Beverage,1800.00,Concession stand
550e8400-e29b-41d4-a716-446655440002,2024-12-01,Merchandise,450.00,Gift shop sales
```

**Validation:**
- id: Valid UUID format
- date: Valid YYYY-MM-DD format
- source: Non-empty string
- amount: Non-negative decimal
- description: Optional string

### expense_entries.csv
Daily expense entries with categorization.

**Headers:**
- `id`: Unique identifier (UUID, auto-generated)
- `date`: Date in YYYY-MM-DD format (required)
- `category`: Expense category (string, required)
- `amount`: Amount in currency (decimal, >= 0) (required)
- `description`: Optional description (string, optional)

**Example:**
```csv
id,date,category,amount,description
650e8400-e29b-41d4-a716-446655440000,2024-12-01,Salaries,2000.00,Staff salaries
650e8400-e29b-41d4-a716-446655440001,2024-12-01,Maintenance,500.00,Ride maintenance
650e8400-e29b-41d4-a716-446655440002,2024-12-01,Utilities,300.00,Electricity bill
```

**Validation:**
- id: Valid UUID format
- date: Valid YYYY-MM-DD format
- category: Non-empty string
- amount: Non-negative decimal
- description: Optional string

### investment_entries.csv
Investment transactions and capital projects.

**Headers:**
- `id`: Unique identifier (UUID, auto-generated)
- `date`: Date in YYYY-MM-DD format (required)
- `type`: Investment type (string, required)
- `amount`: Amount in currency (decimal, >= 0) (required)
- `description`: Investment description (string, required)

**Example:**
```csv
id,date,type,amount,description
750e8400-e29b-41d4-a716-446655440000,2024-12-01,Equipment,15000.00,New roller coaster
750e8400-e29b-41d4-a716-446655440001,2024-12-01,Facility,5000.00,Parking lot expansion
750e8400-e29b-41d4-a716-446655440002,2024-12-01,Technology,2000.00,POS system upgrade
```

**Validation:**
- id: Valid UUID format
- date: Valid YYYY-MM-DD format
- type: Non-empty string
- amount: Non-negative decimal
- description: Non-empty string

### categories.csv
Bilingual category definitions for revenue, expenses, and investments.

**Headers:**
- `id`: Unique identifier (UUID, auto-generated)
- `type`: Category type - "revenue", "expense", or "investment" (required)
- `name_en`: English name (string, required)
- `name_ar`: Arabic name (string, required)
- `parent_category`: Parent category ID (UUID, optional)
- `is_active`: Active status - "1" (active) or "0" (inactive) (required)

**Example:**
```csv
id,type,name_en,name_ar,parent_category,is_active
cat-001,revenue,Tickets,تذاكر,,1
cat-002,revenue,Food & Beverage,الأطعمة والمشروبات,,1
cat-003,expense,Salaries,الرواتب,,1
cat-004,expense,Maintenance,الصيانة,,1
cat-005,investment,Equipment,معدات,,1
```

**Validation:**
- id: Valid UUID format
- type: Must be "revenue", "expense", or "investment"
- name_en: Non-empty string
- name_ar: Non-empty string
- parent_category: Valid UUID or empty
- is_active: Must be "1" or "0"

### employees.csv
Employee information for salary management.

**Headers:**
- `id`: Unique identifier (UUID, auto-generated)
- `name`: Employee name (string, required)
- `position`: Job position (string, required)
- `monthly_salary`: Monthly salary amount (decimal, >= 0) (required)
- `hire_date`: Hire date in YYYY-MM-DD format (required)
- `status`: Employment status - "active" or "inactive" (required)

**Example:**
```csv
id,name,position,monthly_salary,hire_date,status
emp-001,John Doe,Manager,2500.00,2024-01-01,active
emp-002,Jane Smith,Cashier,1500.00,2024-02-15,active
emp-003,Bob Johnson,Maintenance,1800.00,2024-03-01,inactive
```

**Validation:**
- id: Valid UUID format
- name: Non-empty string
- position: Non-empty string
- monthly_salary: Non-negative decimal
- hire_date: Valid YYYY-MM-DD format
- status: Must be "active" or "inactive"

### salary_payments.csv
Salary payment records.

**Headers:**
- `id`: Unique identifier (UUID, auto-generated)
- `employee_id`: Employee ID reference (UUID, required)
- `amount`: Payment amount (decimal, >= 0) (required)
- `payment_date`: Payment date in YYYY-MM-DD format (required)
- `payment_type`: Payment type - "full", "partial", or "advance" (required)
- `month`: Month name (string, required)
- `year`: Year (integer, required)
- `notes`: Optional notes (string, optional)

**Example:**
```csv
id,employee_id,amount,payment_date,payment_type,month,year,notes
pay-001,emp-001,2500.00,2024-12-01,full,December,2024,Monthly salary
pay-002,emp-002,1500.00,2024-12-01,full,December,2024,Monthly salary
pay-003,emp-001,500.00,2024-11-15,advance,November,2024,Advance payment
```

**Validation:**
- id: Valid UUID format
- employee_id: Valid UUID format
- amount: Non-negative decimal
- payment_date: Valid YYYY-MM-DD format
- payment_type: Must be "full", "partial", or "advance"
- month: Non-empty string
- year: Valid year (integer)
- notes: Optional string

### daily_summary.csv
Computed daily summaries with profit calculations.

**Headers:**
- `date`: Date in YYYY-MM-DD format (required, unique)
- `total_revenue`: Total daily revenue (decimal, computed)
- `total_expenses`: Total daily expenses (decimal, computed)
- `total_investments`: Total daily investments (decimal, computed)
- `net_profit`: Daily profit (revenue - expenses) (decimal, computed)
- `owner_share`: Owner share (70% of net profit) (decimal, computed)
- `partner_share`: Partner share (30% of net profit) (decimal, computed)

**Example:**
```csv
date,total_revenue,total_expenses,total_investments,net_profit,owner_share,partner_share
2024-12-01,11164.00,3600.00,15000.00,7564.00,5294.80,2269.20
```

**Calculation Rules:**
- total_revenue = SUM(revenue.amount) for the date
- total_expenses = SUM(expense_entries.amount) for the date
- total_investments = SUM(investment_entries.amount) for the date
- net_profit = total_revenue - total_expenses
- owner_share = 70% of net_profit
- partner_share = 30% of net_profit

**Notes:**
- This file is auto-generated from revenue.csv and expense_entries.csv
- Updated whenever revenue or expense data changes

### summary_views.csv
Monthly and yearly aggregated summaries.

**Headers:**
- `period`: Period identifier ("YYYY-MM" for monthly, "YYYY" for yearly)
- `total_revenue`: Total revenue for period (decimal, computed)
- `total_expenses`: Total expenses for period (decimal, computed)
- `total_investments`: Total investments for period (decimal, computed)
- `net_profit`: Total profit for period (decimal, computed)
- `owner_share`: Owner total share for period (decimal, computed)
- `partner_share`: Partner total share for period (decimal, computed)

**Example:**
```csv
period,total_revenue,total_expenses,total_investments,net_profit,owner_share,partner_share
2024-12,335000.00,108000.00,45000.00,227000.00,158900.00,68100.00
2024,4000000.00,1300000.00,500000.00,2700000.00,1890000.00,810000.00
```

**Notes:**
- Aggregated from daily_summary.csv
- Monthly summaries have format YYYY-MM
- Yearly summaries have format YYYY

## Data Integrity Rules

### Atomic Operations
- All CSV writes use atomic operations: write to temp file, then rename
- Prevents data corruption during concurrent access
- Implemented in csvHandler.js utility

### Unique Constraints
- All entries have unique UUID identifiers
- daily_summary.csv: Unique dates
- summary_views.csv: Unique periods

### Referential Integrity
- All dates must be valid YYYY-MM-DD
- Employee IDs in salary_payments must reference valid employees
- Category IDs must be valid UUIDs
- Amounts must be non-negative decimals

### Backup Strategy
- Manual backup recommended before major operations
- CSV files can be versioned with git
- All timestamps in local timezone

## Import/Export Considerations

### Excel Import
- funpark.xlsx can be parsed to populate initial CSV data
- Validation applied during import
- Import utility: `npm run seed-excel`

### Export Formats
- CSV export for all data (native format)
- Excel export available through API
- Future: PDF generation for summaries

## Internationalization

### Bilingual Support
- Categories have both English (name_en) and Arabic (name_ar) names
- Frontend displays appropriate language based on user selection
- RTL (Right-to-Left) layout supported for Arabic

### Translation Keys
- Frontend uses @ngx-translate for UI translations
- Translation files: client/src/assets/i18n/en.json and ar.json
- 200+ translation keys covering all UI elements