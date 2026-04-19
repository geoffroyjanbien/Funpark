## Plan: Implement Funpark Management Web Application

Build a full-stack web application that replicates the functionality of the funpark.xlsx Excel file, which manages daily operations for a kids playground and calculates profit as revenue minus expenses. The app will be in English, using CSV files for data storage, with support for dual ownership (30%/70%), investment-type allocations, and multi-currency (LL/USD) tracking.

Organized into 4 phases with explicit dependencies to enable parallel development and clear progression.

**Steps**

### Phase 1: Planning & Setup (no dependencies)
1. Define API endpoints and data validation rules.
   - Endpoints: POST/GET/PUT/DELETE /api/revenue, /api/expenses, /api/investments
   - Summary endpoints: GET /api/summaries/daily, /monthly, /yearly
   - Validation: amount ranges (positive, 2 decimals), dates (YYYY-MM-DD), required fields
   - Permissions: Both owners can create, read, update, delete all entries; both can export

2. Design CSV file structures and environment configuration.
   - revenue.csv: date, category, amount_ll, amount_usd
   - expense_entries.csv: date, main_category, subcategory, investment_type, amount_ll, amount_usd
   - investment_entries.csv: date, investment_type, description, amount_ll, amount_usd, owner_allocation
   - daily_summary.csv: date, daily_revenue_ll, daily_expenses_ll, daily_balance_ll, owner1_share_ll, owner2_share_ll
   - summary_views.csv: month, year, total_revenue_ll, total_expenses_ll, balance_ll, owner1_share_ll, owner2_share_ll
   - Create .env template: NODE_ENV, PORT, CSV_DATA_PATH, LOG_LEVEL, OWNER1_SHARE=30, OWNER2_SHARE=70

3. Design Excel import/migration strategy.
   - Plan CSV seeding from funpark.xlsx using xlsx package
   - Build validation and reconciliation process

### Phase 2: Backend Development (depends on Phase 1)
4. Set up Node.js + Express project structure.
   - Install: express@^4.18.0, csv-parser@^3.0.0, csv-writer@^1.6.0, dotenv@^16.0.0, winston@^3.8.0, cors@^2.8.5
   - Dev: jest@^29.0.0, supertest@^6.3.0, nodemon@^2.0.0
   - Create folders: src/routes, src/controllers, src/models, src/utils, src/middleware, tests

5. Implement data models and CSV file handling.
   - Models: Revenue, Expense, Investment, DailySummary classes
   - CSV handlers: read/write with atomic operations (temp file → move), error handling, logging

6. Build REST API endpoints for CRUD operations.
   - Routes for revenue, expenses, investments (all CRUD)
   - Summary endpoints with owner share calculations
   - Request validation middleware, standard JSON responses, proper HTTP status codes

7. Add profit calculation logic and owner share allocation.
   - Daily profit = sum(revenue) - sum(expenses)
   - Owner1 (30%): 30% of daily profit + 0% of Long Term investments
   - Owner2 (70%): 70% of daily profit + 100% of Long Term investments
   - Mid/Short Term: split 30%/70% between owners
   - Monthly/yearly: aggregate from daily summaries

8. Add error handling, logging, and data validation.
   - Centralized error handler middleware
   - Winston logger for all operations
   - Audit trail of all data modifications

9. Set up environment configuration (dev/staging/prod).
   - .env files with appropriate values for each environment

10. Build Excel data import utility.
    - Script to parse funpark.xlsx, convert to CSV, validate, seed files
    - Command: npm run seed-excel

### Phase 3: Frontend Development (depends on Phase 2)
11. Initialize Angular project with structure.
    - Create with routing and CSS; set up HttpClient service

12. Build data entry forms with validation.
    - Revenue form: category, amount_ll, amount_usd, date with validation messages
    - Expense form: main_category, subcategory, investment_type, amounts, date
    - Investment form: type, description, amounts, owner allocation

13. Create daily dashboard component.
    - Date selector, per-day revenue, expenses, balance, owner-specific shares
    - Detailed line items for revenue and expenses

14. Create monthly and yearly overview views.
    - Aggregated revenue, expenses, profits by month/year
    - Owner share distributions per period

15. Add charts and trends visualization.
    - Line chart: revenue/expense trends over time
    - Pie chart: owner share breakdown
    - Bar chart: monthly comparisons

16. Add dark theme support and theme toggle.
    - Define reusable dark theme styles using CSS variables
    - Ensure forms, dashboards, tables, cards, and charts adapt to dark mode
    - Add a theme toggle and persist preference in localStorage

17. Implement data export functionality.
    - Export to CSV and PDF

### Phase 4: Testing & Deployment (depends on Phase 2 & 3)
18. Write unit tests for backend calculations.
    - Jest tests for profit calculation, owner allocation, investment handling
    - Target: >90% code coverage

18. Write integration tests for API endpoints.
    - Supertest for CRUD operations end-to-end
    - Test summary generation

19. Perform end-to-end testing with sample data.
    - Compare app calculations with Excel sample data

20. Set up CI/CD pipeline (GitHub Actions).
    - Run tests on push, auto-deploy

21. Prepare Docker setup and deployment documentation.
    - Dockerfile, docker-compose.yml, deployment guide

**Relevant files**
- `copilot/plan.md` — This detailed phased plan
- `copilot/instructions.md` — Step-by-step implementation guide
- `client/src/styles.css` or `client/src/styles.scss` — Global theme variables and base styling
- `client/src/app/services/theme.service.ts` — Theme switcher logic
- `client/src/app/app.component.ts` / `app.component.html` — Theme toggle and body class binding
- `server/` — Node.js/Express backend (Phase 2)
  - `src/routes/` — API endpoint definitions
  - `src/controllers/` — Request handlers
  - `src/models/` — Data models (Revenue, Expense, Investment, DailySummary)
  - `src/utils/` — CSV handlers, calculations, validation, logging
  - `src/middleware/` — Error handling, validation
  - `tests/` — Jest unit and integration tests
  - `.env.example` — Environment variables template
- `client/` — Angular frontend (Phase 3)
  - `src/app/components/` — Form, dashboard, and chart components
  - `src/app/services/` — API communication services
  - `src/app/models/` — TypeScript interfaces
- `data/` — CSV data files (Phase 2)
  - `revenue.csv` — Daily revenue entries
  - `expense_entries.csv` — Daily expense entries
  - `investment_entries.csv` — Investment transactions
  - `daily_summary.csv` — Computed daily summaries
  - `summary_views.csv` — Monthly/yearly aggregates
- `docker-compose.yml` — Local development stack (Phase 4)
- `docker-compose.prod.yml` — Production deployment
- `.github/workflows/` — CI/CD pipeline definitions (Phase 4)
- `README.md` — Installation, setup, and usage guide

**Verification**
1. **Phase 1 Verification**: API spec and CSV schema documented; Excel import plan finalized
2. **Phase 2 Verification**: All unit tests pass (>90% coverage); backend integration tests pass; calculations match Excel formulas exactly
3. **Phase 3 Verification**: All forms validate correctly; dashboards display correct data; charts render properly; dark theme loads and renders consistently
4. **Phase 4 Verification**: 
   - End-to-end tests confirm all calculations match Excel sample data
   - CI/CD pipeline runs successfully on push
   - Docker containers start and communicate properly
   - Daily/monthly/yearly summaries are accurate
   - Owner share allocations (30%/70%) are correct
   - Investment-type allocations (Long Term: 100/0, Mid/Short Term: 30/70) are correct
   - CSV import from Excel completes successfully with validation

**Decisions**
- Tech stack: Angular 16+, Node.js 16+, Express 4.18+, CSV files (no SQL database initially)
- Permission model: Both owners (30%/70%) can create, read, update, delete all entries; both can export data
- Currencies: Dual LL/USD tracking with manual conversion rates (not live rates)
- Testing: Jest for unit tests, Supertest for integration tests, >90% code coverage target
- Deployment: Docker for consistency across dev/staging/prod environments
- CI/CD: GitHub Actions for automated testing and deployment
- Logging: Winston for structured logging and audit trails
- Error handling: Centralized error handler middleware with standardized JSON responses

**Dependencies & Blocking**
- Phase 1 must complete before Phases 2 and 3 begin
- Phase 2 (backend) must complete before Phase 3 integration tests
- Phases 2 and 3 can run in parallel after Phase 1 specs are finalized
- Phase 4 (testing/deployment) requires both Phase 2 and Phase 3 complete

**Data Storage & Backup**
- All data stored in CSV files in `/data` folder
- Implement daily backups to cloud storage (future: S3, Google Cloud)
- Design rollback/restore procedures for CSV files
- Timestamp all entries in UTC for consistency across LL and USD transactions

**Scalability Notes**
- CSV-based storage is sufficient for current daily operations scale
- If data grows significantly (millions of rows), consider migration to PostgreSQL/MongoDB
- API design supports future database swap without frontend changes