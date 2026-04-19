# Funpark Management System - Backend API

A comprehensive REST API for managing Funpark financial operations including revenue tracking, expense management, investment monitoring, and profit calculations.

## 🚀 Features

- **Revenue Management**: Track ticket sales, food & beverage, merchandise, games, and parking revenue
- **Expense Tracking**: Monitor operational costs and categorize spending
- **Investment Monitoring**: Track capital projects and long-term investments
- **Profit Calculations**: Automatic profit distribution (70% owner, 30% partner)
- **CSV Data Storage**: Atomic read/write operations for data persistence
- **Excel Import/Export**: Bulk data operations with Excel file support
- **RESTful API**: Complete CRUD operations for all data entities
- **CORS Enabled**: Ready for frontend integration

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Data Storage**: CSV files (revenue.csv, expenses.csv, investments.csv, summaries.csv)
- **File Processing**: xlsx library for Excel operations
- **Validation**: Input validation and error handling
- **CORS**: Cross-origin resource sharing support

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
```
Server starts on `http://localhost:3000`

### Production Mode
```bash
npm run prod
```

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
GET    /api/summary           # Get financial overview
```

### Excel Operations
```
POST   /api/excel/import      # Import data from Excel file
GET    /api/excel/export      # Export data to Excel file
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
- `revenue.csv`: Revenue entries
- `expenses.csv`: Expense entries
- `investments.csv`: Investment entries
- `summaries.csv`: Calculated financial summaries

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

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Set environment variables**
   ```bash
   export PORT=3000
   export NODE_ENV=production
   ```

3. **Start the server**
   ```bash
   npm run prod
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