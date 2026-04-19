# Implementation Instructions

Follow the phased plan in `plan.md` to build the Funpark Management Web Application.

## Prerequisites
- Node.js 16+, npm 8+
- Angular CLI 16+
- Git, Docker

## Phase 1: Planning & Setup

1. **Create API Specification Document**:
   - List all endpoints with methods and parameters
   - Define validation rules per field (amount ranges, date format, required fields)
   - Document permission model (both owners: create, read, update, delete, export)

2. **Create CSV Schema Definition**:
   - revenue.csv headers: date, category, amount_ll, amount_usd
   - expense_entries.csv headers: date, main_category, subcategory, investment_type, amount_ll, amount_usd
   - investment_entries.csv headers: date, investment_type, description, amount_ll, amount_usd, owner_allocation
   - daily_summary.csv headers: date, daily_revenue_ll, daily_expenses_ll, daily_balance_ll, owner1_share_ll, owner2_share_ll
   - summary_views.csv headers: month, year, total_revenue_ll, total_expenses_ll, balance_ll, owner1_share_ll, owner2_share_ll

3. **Create .env Template** with: NODE_ENV, PORT=3000, CSV_DATA_PATH=./data, LOG_LEVEL=debug, OWNER1_SHARE=30, OWNER2_SHARE=70

4. **Plan Excel Import**: Script using xlsx package to read funpark.xlsx and seed CSV files with validation

## Phase 2: Backend Development

5. **Initialize Node.js Project**:
   ```bash
   mkdir server && cd server
   npm init -y
   npm install express@^4.18.0 csv-parser@^3.0.0 csv-writer@^1.6.0 dotenv@^16.0.0 winston@^3.8.0 cors@^2.8.5
   npm install --save-dev jest@^29.0.0 supertest@^6.3.0 nodemon@^2.0.0
   ```

6. **Create Folder Structure**:
   ```
   server/src/routes/  (revenue.js, expenses.js, investments.js, summaries.js)
   server/src/controllers/  (CRUD handlers)
   server/src/models/  (Revenue, Expense, Investment, DailySummary classes)
   server/src/utils/  (csvHandler.js, calculations.js, validation.js, logger.js)
   server/src/middleware/  (errorHandler.js, validation.js)
   server/tests/  (unit and integration tests)
   ```

7. **Implement CSV Handlers** (src/utils/csvHandler.js):
   - Read/write with atomic operations (write to temp file, then rename)
   - Include error handling and logging
   - Support all CSV files defined in Phase 1

8. **Implement Profit Calculations** (src/utils/calculations.js):
   - Formula: daily_profit = sum(daily_revenue) - sum(daily_expenses)
   - Owner1 (30%): 30% of daily_profit + 0% of Long Term investments
   - Owner2 (70%): 70% of daily_profit + 100% of Long Term investments
   - Mid Term / Short Term investments: split 30%/70%
   - Monthly/Yearly: aggregate from daily summaries

9. **Build REST API Routes**: Implement all CRUD endpoints with:
   - Request validation middleware
   - Standard JSON responses: {success: true/false, data: ..., error: ...}
   - Proper HTTP status codes (200 GET, 201 POST, 400 validation error, 404 not found, 500 server error)

10. **Add Error Handling**: Centralized error handler middleware, Winston logging, audit trail for all modifications

11. **Set Up Environment Configuration**: Create .env files for dev, staging, production

12. **Build Excel Import Utility** (src/utils/excelImport.js):
    - Parse funpark.xlsx using xlsx package
    - Convert data to CSV format matching schema
    - Validate imported data
    - Command: `npm run seed-excel`

## Phase 3: Frontend Development

13. **Initialize Angular**:
    ```bash
    ng new client --routing --style=css --skip-git
    cd client
    ```

14. **Create Folder Structure**:
    ```
    client/src/app/
    ├── components/ (revenue-form, expense-form, investment-form, daily-dashboard, monthly-overview, yearly-overview, charts)
    ├── services/ (api.service.ts, revenue.service.ts, expense.service.ts, investment.service.ts, summary.service.ts)
    ├── models/ (revenue.model.ts, expense.model.ts, investment.model.ts, summary.model.ts)
    ```

15. **Build Forms with Validation**:
    - Revenue form: category dropdown, amount_ll, amount_usd, date picker
    - Expense form: main_category, subcategory, investment_type, amounts, date
    - Investment form: investment_type, description, amounts, owner_allocation
    - All with real-time validation messages

16. **Create Daily Dashboard**:
    - Date selector
    - Display: daily_revenue_ll, daily_expenses_ll, daily_balance_ll
    - Show owner1_share_ll (30%) and owner2_share_ll (70%)
    - List all revenue and expense line items for selected date

17. **Add Dark Theme Support**:
    - Create `client/src/styles.css` or `client/src/styles.scss` with CSS variables for dark theme colors
    - Define `--bg`, `--surface`, `--text`, `--text-secondary`, `--border`, `--primary`, `--accent`, `--success`, `--danger`, `--shadow`
    - Create `client/src/app/services/theme.service.ts` to apply a `dark-theme` class and persist theme selection in localStorage
    - Add a toggle control in `client/src/app/app.component.html` or the main header
    - Ensure cards, forms, tables, charts, and panels use theme variables and render clearly in dark mode
    - Validate that theme preference persists after refresh

18. **Create Monthly/Yearly Overviews**:
    - Month/year selector
    - Aggregate all revenue, expenses, profits
    - Display owner share distributions

19. **Add Charts**:
    - Line chart: revenue/expense trends over time
    - Pie chart: owner share breakdown (30% / 70%)
    - Bar chart: monthly comparisons

20. **Implement Export**:
    - Export daily/monthly/yearly summaries to CSV
    - Basic PDF generation

## Phase 4: Testing & Deployment

21. **Write Unit Tests** (server/tests/calculations.test.js):
    - Test profit calculation formulas
    - Test owner share allocation (30%/70%)
    - Test investment-type allocation
    - Run: `npm test`
    - Target: >90% code coverage

22. **Write Integration Tests** (server/tests/api.test.js):
    - Supertest for all CRUD endpoints
    - Test daily/monthly/yearly summary generation
    - Run: `npm run test:integration`

23. **End-to-End Testing**:
    - Use Excel sample data
    - Verify app calculations match Excel output exactly
    - Test all user workflows

24. **Set Up CI/CD** (.github/workflows/):
    - GitHub Actions: run tests on every push
    - Auto-deploy on merge to main

25. **Docker Setup**:
    - Create Dockerfile for Node backend
    - Create docker-compose.yml for local development
    - Command: `docker-compose up`

26. **Documentation**:
    - README.md with installation, setup, API docs, calculation details, troubleshooting

## Commands Reference

```bash
# Backend
cd server
npm install
npm run seed-excel              # Import Excel data
npm test                        # Unit tests
npm run test:integration       # Integration tests
npm start                       # Run server (port 3000)

# Frontend
cd client
npm install
ng serve                        # Dev server (port 4200)
ng build --prod               # Production build

# Docker
docker-compose up              # Run full stack locally
docker-compose -f docker-compose.prod.yml up -d  # Production
```