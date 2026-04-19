## Plan: Implement Funpark Management Web Application

Build a full-stack web application that replicates the functionality of the funpark.xlsx Excel file, which manages daily operations for a kids playground and calculates profit as revenue minus expenses. The app will be in English, using CSV files for data storage.

**Steps**
1. Build the application from the Excel analysis, capturing its revenue categories, granular expense categories, daily tracking, and summary calculations.
   - Revenue streams: Hookah (shisha services), Drinks (beverages), Crepe (food), Games (entertainment), Various (miscellaneous).
   - Expenses: Hookah Supplies (molasses, charcoal, hoses), Food & Beverage Supplies (juices, fruits, coffee types), General Supplies (cups, tissues), Operations & Maintenance (fuel oil, gasoline, maintenance, salaries, transportation).
   - Formulas: Total Revenue = sum of all revenue categories; Total Expenses = sum of all expense categories; Current Balance = Total Revenue - Total Expenses.
   - Daily model: data is recorded per day across a monthly table, with daily totals for each revenue category and daily expense totals.
   - Currencies: Lebanese Lira (LL) and US Dollars (USD), with separate balances.
   - Additional: External income, equipment costs, negative adjustments.
2. Design CSV file structures to store daily operational data, including files for revenue items, expenses, and profit summaries.
   - revenue.csv: columns - date (YYYY-MM-DD), category (Hookah, Drinks, Crepe, Games, Various), amount_ll (number), amount_usd (number)
   - expense_entries.csv: columns - date, main_category (Hookah Supplies, Food & Beverage Supplies, General Supplies, Operations & Maintenance), subcategory (e.g., molasses, charcoal), investment_type (Long Term, Mid Term, Short Term), amount_ll, amount_usd
   - investment_entries.csv: optional file for tracking investments separately, with columns - date, investment_type (Long Term, Mid Term, Short Term), description, amount_ll, amount_usd, owner_allocation (30/70 or 100/0)
   - daily_summary.csv: columns - date, daily_revenue_ll, daily_expenses_ll, daily_balance_ll, daily_revenue_count, daily_expenses_count, owner1_share_ll, owner2_share_ll
   - summary_views.csv: optional precomputed monthly and yearly summary rows for easy reporting, including month, year, total_revenue_ll, total_expenses_ll, balance_ll, owner1_share_ll, owner2_share_ll
   - profit.csv: monthly and yearly summary rows can be derived from daily_summary.csv or computed on demand.
   - Include fields for external income, equipment costs, and adjustments as separate entries in revenue or expenses.
   - Include ownership share percentages, for example owner1 at 30% and owner2 at 70%, so profit can be allocated accordingly.
   - Investment allocation rules: Long Term investments are assigned fully to the 70% owner; Mid Term and Short Term investments share profit/loss across both owners at 30% and 70%.
3. Set up the backend using Node.js with Express, implementing RESTful APIs for CRUD operations on CSV data, profit calculations, owner share allocation, and investment-type allocation rules.
4. Initialize the Angular frontend project with proper folder structure (e.g., components for data entry, reports; services for API calls).
5. Implement frontend forms for inputting daily revenue and expense data, with validation.
6. Add a daily dashboard in Angular that displays per-day revenue, per-day expenses, daily balance summaries, and the owner-specific profit shares.
7. Add monthly and yearly overview views in Angular to show aggregated revenue, expenses, profits, trends, and owner share distributions.
8. Add profit calculation logic in the backend, ensuring it matches the Excel's method.
9. Create dashboard views in Angular to display daily, monthly, and yearly profit reports.
10. Test the application with sample data to verify calculations align with expected outputs.

**Relevant files**
- `server/` — Backend code (Node.js, Express, CSV handling logic)
- `src/app/` — Angular components and services
- `data/` — Folder for CSV files (e.g., revenue.csv, expenses.csv)
- `README.md` — Project setup and usage instructions

**Verification**
1. Run unit tests for profit calculation functions to ensure accuracy.
2. Perform end-to-end tests simulating daily data entry and verifying profit display.
3. Compare calculated profits with sample data from the Excel file provided by the user.

**Decisions**
- Tech stack: Angular for frontend, Node.js/Express for backend, CSV files for data storage.
- Profit calculation: Revenue minus expenses, with details to be refined from Excel analysis.
- Code structure: Modular, with separation of concerns (frontend/backend), well-organized folders.
- Language: English for the app UI.

**Further Considerations**
1. Confirm specific CSV structures based on Excel analysis.