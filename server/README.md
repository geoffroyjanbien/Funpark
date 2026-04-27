# Funpark Management System - Backend API

A comprehensive REST API for managing Funpark financial operations including revenue tracking, expense management, investment monitoring, and profit calculations.

## 🚀 Features

- **Revenue Management**: Track ticket sales, food & beverage, merchandise, games, and parking revenue
- **Expense Tracking**: Monitor operational costs and categorize spending
- **Investment Monitoring**: Track capital projects and long-term investments
- **Salary Management**: Employee database and salary payment tracking
- **Category Management**: Bilingual category system (English/Arabic)
- **Profit Calculations**: Automatic profit distribution (70% owner, 30% partner)
- **CSV Data Storage**: Atomic read/write operations for data persistence
- **Excel Import/Export**: Bulk data operations with Excel file support
- **RESTful API**: Complete CRUD operations for all data entities
- **CORS Enabled**: Flexible CORS with regex pattern matching for Vercel URLs
- **Winston Logging**: Comprehensive logging with file rotation
- **Health Check**: API status endpoint for monitoring

## 🛠️ Tech Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js 4.22+
- **Data Storage**: CSV files with atomic operations
- **File Processing**: xlsx, xlsx-populate
- **Logging**: Winston with file rotation
- **Validation**: Custom middleware and input validation
- **CORS**: Flexible origin validation with regex patterns
- **UUID**: Unique identifier generation
- **Environment**: dotenv for configuration
- **Deployment**: Render (free tier) with automatic deployments

## 📁 Project Structure

```
server/
├── src/
│   ├── controllers/          # API route handlers
│   │   ├── revenue.js       # Revenue CRUD operations
│   │   ├── expenses.js      # Expense CRUD operations
│   │   ├── investments.js   # Investment CRUD operations
│   │   ├── summary.js       # Financial summary calculations
│   │   └── excel.js         # Excel import/export functionality
│   ├── utils/
│   │   ├── csvHandler.js    # CSV file operations
│   │   └── profitCalculator.js # Profit distribution logic
│   └── index.js             # Main server file
├── data/                    # CSV data files
│   ├── revenue.csv
│   ├── expenses.csv
│   ├── investments.csv
│   └── summaries.csv
└── package.json
```

## 🚀 Installation

1. **Prerequisites**
   - Node.js (v14 or higher)
   - npm or yarn

2. **Clone and Install**
   ```bash
   cd server
   npm install
   ```

3. **Data Setup**
   The application will automatically create CSV files in the `data/` directory on first run.

## 🏃‍♂️ Running the Server

### Development Mode
```bash
npm start
# or with auto-reload
npm run dev
```
Server starts on `http://localhost:3000`

### Production Deployment
Deployed on Render: `https://funpark-api.onrender.com`

**Note**: Render free tier spins down after 15 minutes of inactivity. First request after spin-down takes ~30 seconds.

## 📡 API Endpoints

### Revenue Management
```
GET    /api/revenue           # Get all revenue entries
GET    /api/revenue/:id       # Get specific revenue entry
POST   /api/revenue           # Create new revenue entry
PUT    /api/revenue/:id       # Update revenue entry
DELETE /api/revenue/:id       # Delete revenue entry
GET    /api/revenue?limit=5   # Get limited number of entries
```

### Expense Management
```
GET    /api/expenses          # Get all expenses
GET    /api/expenses/:id      # Get specific expense
POST   /api/expenses          # Create new expense
PUT    /api/expenses/:id      # Update expense
DELETE /api/expenses/:id      # Delete expense
```

### Investment Tracking
```
GET    /api/investments       # Get all investments
GET    /api/investments/:id   # Get specific investment
POST   /api/investments       # Create new investment
PUT    /api/investments/:id   # Update investment
DELETE /api/investments/:id   # Delete investment
```

### Financial Summary
```
GET    /api/summaries         # Get financial overview
```

### Category Management
```
GET    /api/categories        # Get all categories
GET    /api/categories/type/:type  # Get categories by type
GET    /api/categories/:id    # Get specific category
POST   /api/categories        # Create new category
PUT    /api/categories/:id    # Update category
DELETE /api/categories/:id    # Soft delete category
DELETE /api/categories/:id/permanent  # Permanently delete
```

### Salary Management
```
# Employees
GET    /api/salaries/employees     # Get all employees
GET    /api/salaries/employees/:id # Get specific employee
POST   /api/salaries/employees     # Create employee
PUT    /api/salaries/employees/:id # Update employee
DELETE /api/salaries/employees/:id # Delete employee

# Payments
GET    /api/salaries/payments      # Get all payments
GET    /api/salaries/payments/employee/:id  # Get employee payments
GET    /api/salaries/payments/month  # Get monthly payments
POST   /api/salaries/payments      # Create payment
PUT    /api/salaries/payments/:id  # Update payment
DELETE /api/salaries/payments/:id  # Delete payment

# Summary
GET    /api/salaries/summary       # Get salary summary
```

### Health Check
```
GET    /health                # API health status
```

## 📊 Data Formats

### Revenue Entry
```json
{
  "id": "unique-id",
  "date": "2024-01-15",
  "source": "Tickets",
  "amount": 2500.00,
  "description": "Weekend ticket sales"
}
```

### Expense Entry
```json
{
  "id": "unique-id",
  "date": "2024-01-15",
  "category": "Maintenance",
  "amount": 500.00,
  "description": "Ride maintenance"
}
```

### Investment Entry
```json
{
  "id": "unique-id",
  "date": "2024-01-15",
  "type": "Equipment",
  "amount": 10000.00,
  "description": "New roller coaster purchase"
}
```

### Financial Summary
```json
{
  "totalRevenue": 50000.00,
  "totalExpenses": 25000.00,
  "totalInvestments": 30000.00,
  "netProfit": 25000.00,
  "ownerShare": 17500.00,
  "partnerShare": 7500.00
}
```

## 🔧 Configuration

The server runs on port 3000 by default. You can modify this in `src/index.js`:

```javascript
const PORT = process.env.PORT || 3000;
```

## 📁 Data Storage

All data is stored in CSV format in the `data/` directory:
- `revenue.csv`: Revenue entries with UUID, date, source, amount, description
- `expense_entries.csv`: Expense entries with UUID, date, category, amount, description
- `investment_entries.csv`: Investment entries with UUID, date, type, amount, description
- `categories.csv`: Bilingual categories (English/Arabic) for revenue, expenses, investments
- `employees.csv`: Employee information with UUID, name, position, salary, hire date, status
- `salary_payments.csv`: Salary payment records with employee references
- `daily_summary.csv`: Computed daily financial summaries
- `summary_views.csv`: Monthly and yearly aggregated summaries

**Data Integrity:**
- Atomic write operations (temp file → rename)
- UUID-based unique identifiers
- Referential integrity for employee-payment relationships
- Winston logging for all operations

## 🧪 Testing the API

You can test the API using tools like:
- **Postman**: Import the API collection
- **curl**: Command line testing
- **Thunder Client**: VS Code extension

Example curl command:
```bash
curl -X GET http://localhost:3000/api/summary
```

## 🚀 Deployment

### Production Deployment
Deployed on Render with automatic deployments on git push.

**Live URL**: https://funpark-api.onrender.com

### Render Configuration
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables:
  - `NODE_ENV=production`
  - `CORS_ORIGIN=http://localhost:4200` (optional, regex handles Vercel URLs)

### CORS Configuration
The API accepts requests from:
- `http://localhost:4200` (development)
- All Vercel deployment URLs matching `https://funpark*.vercel.app` (production)
- Uses regex pattern matching for flexible origin validation

### Environment Variables
```bash
PORT=3000
NODE_ENV=production
CORS_ORIGIN=http://localhost:4200
CSV_DATA_PATH=./data
LOG_LEVEL=info
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues or questions:
1. Check the API documentation above
2. Review the server logs for error messages
3. Ensure all dependencies are installed
4. Verify CSV files exist in the data directory

---

**Built with ❤️ for Funpark Management**</content>
<parameter name="filePath">c:\Users\geoff\Desktop\dev\Funpark\server\README.md