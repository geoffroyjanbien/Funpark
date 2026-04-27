# 🎢 Funpark Management System

A complete full-stack web application for managing Funpark financial operations with real-time data tracking, profit calculations, and comprehensive reporting.

![Funpark Management](https://img.shields.io/badge/Funpark-Management-blue?style=for-the-badge)
![Angular](https://img.shields.io/badge/Angular-16+-red?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The Funpark Management System is a comprehensive full-stack solution for tracking and managing all financial aspects of amusement park operations. From ticket sales and food revenue to operational expenses and capital investments, this system provides real-time insights and automated profit calculations with owner-partner distribution.

### Key Highlights
- **Real-time Financial Tracking**: Live updates of revenue, expenses, and profits
- **Automated Profit Sharing**: 70% owner / 30% partner distribution calculations
- **Multi-language Support**: English and Arabic (RTL) with @ngx-translate
- **Salary Management**: Employee tracking and salary payment system
- **Category Management**: Flexible revenue/expense categorization
- **Excel Integration**: Import/export capabilities for bulk data operations
- **Responsive Dark Theme**: Professional UI optimized for business use
- **RESTful API**: Complete backend API for all operations
- **CSV Data Storage**: Reliable file-based data persistence
- **Cloud Deployment**: Production-ready on Vercel (frontend) and Render (backend)

## ✨ Features

### 💰 Revenue Management
- Track multiple revenue streams (tickets, food & beverage, merchandise, games, parking)
- Flexible category system with bilingual support
- Real-time revenue calculations and totals
- Advanced search, filter, and grouping capabilities
- Date-based filtering (daily, monthly, yearly)
- Add, edit, delete revenue entries with validation

### 💸 Expense Tracking
- Categorize operational expenses with custom categories
- Monitor spending patterns by category and date
- Cost analysis and reporting
- Expense history and trends
- Grouping by category, date, or custom fields

### 📈 Investment Monitoring
- Track capital projects and equipment purchases
- Investment type categorization
- Investment history and planning
- Long-term financial planning
- Grouping and filtering by type and date

### 📊 Financial Dashboard
- Real-time financial overview with live data
- Key performance indicators (KPIs)
- Profit distribution visualization (70%/30%)
- Recent activity tracking
- Quick access to all features
- Responsive card-based layout

### 📋 Reports & Analytics
- Comprehensive profit & loss statements
- Owner/partner share calculations (70%/30%)
- Financial trend analysis
- Daily, monthly, and yearly summaries
- Exportable reports (CSV, Excel)
- Visual charts and graphs

### 🔄 Data Management
- Excel import/export functionality
- CSV data persistence with atomic operations
- Data validation and integrity checks
- Backup and recovery options
- Audit logging with Winston

### 👥 Salary Management
- Employee database with status tracking
- Salary payment recording
- Payment history by employee
- Monthly salary summaries
- Payment type tracking (full, partial, advance)

### 🌍 Internationalization
- English and Arabic language support
- RTL (Right-to-Left) layout for Arabic
- Bilingual category names
- Date and number formatting per locale
- Language switcher in settings

## 🛠️ Tech Stack

### Frontend
- **Framework**: Angular 16+
- **Language**: TypeScript 5.0+
- **Styling**: CSS with Dark Theme Variables
- **Internationalization**: @ngx-translate/core
- **State Management**: Component-based with services
- **Build Tool**: Angular CLI
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express.js 4.22+
- **Data Storage**: CSV files with atomic operations
- **File Processing**: xlsx, xlsx-populate
- **Logging**: Winston
- **Validation**: Custom middleware
- **API**: RESTful endpoints with CORS
- **Deployment**: Render (free tier)

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Code Editor**: VS Code
- **Testing**: Angular testing utilities

## 📁 Project Structure

```
funpark-management/
├── client/                    # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/    # Shared components
│   │   │   │   └── navigation/  # Main navigation
│   │   │   ├── features/      # Feature modules
│   │   │   │   ├── dashboard/   # Main dashboard
│   │   │   │   ├── revenue/     # Revenue management
│   │   │   │   ├── expenses/    # Expense tracking
│   │   │   │   ├── investments/ # Investment monitoring
│   │   │   │   ├── salaries/    # Salary management
│   │   │   │   ├── reports/     # Financial reports
│   │   │   │   └── settings/    # App settings
│   │   │   ├── services/      # API services
│   │   │   ├── pipes/         # Custom pipes
│   │   │   └── shared/        # Shared utilities
│   │   ├── assets/            # Static assets
│   │   │   └── i18n/          # Translation files
│   │   ├── environments/      # Environment configs
│   │   └── styles.css         # Global styles
│   ├── angular.json           # Angular config
│   ├── vercel.json            # Vercel deployment config
│   ├── package.json           # Frontend dependencies
│   └── README.md              # Frontend documentation
├── server/                    # Express backend
│   ├── src/
│   │   ├── controllers/       # API route handlers
│   │   ├── routes/            # API routes
│   │   ├── models/            # Data models
│   │   ├── middleware/        # Custom middleware
│   │   ├── utils/             # Utility functions
│   │   └── index.js           # Server entry point
│   ├── data/                  # CSV data files
│   │   ├── revenue.csv
│   │   ├── expense_entries.csv
│   │   ├── investment_entries.csv
│   │   ├── categories.csv
│   │   ├── employees.csv
│   │   ├── salary_payments.csv
│   │   └── daily_summary.csv
│   ├── logs/                  # Winston logs
│   ├── render.yaml            # Render deployment config
│   ├── package.json           # Backend dependencies
│   └── README.md              # Backend documentation
├── copilot/                   # Development documentation
│   ├── api-spec.md            # API specifications
│   ├── csv-schema.md          # CSV file schemas
│   ├── excel-import.md        # Excel import guide
│   ├── instructions.md        # Implementation guide
│   ├── plan.md                # Project plan
│   └── progress.md            # Development progress
├── .gitignore                 # Git ignore rules
├── DEPLOYMENT.md              # Deployment guide
├── DEPLOYMENT_URLS.md         # Live URLs
├── GLOBALIZATION_GUIDE.md     # i18n documentation
└── README.md                  # Main project README
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### One-Command Setup
```bash
# Clone the repository
git clone https://github.com/geoffroyjanbien/Funpark.git
cd Funpark

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Start both servers
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd client
npm start
```

Navigate to `http://localhost:4200` to access the application!

### Live Demo
- **Frontend**: https://funpark-57exoneln-geoffroyjanbien-4204s-projects.vercel.app
- **Backend API**: https://funpark-api.onrender.com
- **API Health**: https://funpark-api.onrender.com/health

## 📦 Installation

### Backend Setup
```bash
cd server
npm install
npm start
```
Server runs on `http://localhost:3000`

### Frontend Setup
```bash
cd client
npm install
npm start
```
Application runs on `http://localhost:4200`

## 💻 Usage

### First Time Setup
1. **Start Backend**: `cd server && npm start`
2. **Start Frontend**: `cd client && npm start`
3. **Access Application**: Open `http://localhost:4200`
4. **Add Sample Data**: Use the UI to add revenue, expenses, and investments

### Daily Operations
1. **Dashboard**: View financial overview and key metrics
2. **Revenue**: Add daily ticket sales, food sales, etc.
3. **Expenses**: Track operational costs and maintenance
4. **Investments**: Monitor capital projects
5. **Reports**: Generate financial reports and profit distributions

### Data Management
- **Import**: Use Excel files to bulk import data
- **Export**: Export financial data for external analysis
- **Backup**: CSV files serve as automatic backups

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Revenue
- `GET /revenue` - Get all revenue entries
- `POST /revenue` - Create revenue entry
- `PUT /revenue/:id` - Update revenue entry
- `DELETE /revenue/:id` - Delete revenue entry

#### Expenses
- `GET /expenses` - Get all expenses
- `POST /expenses` - Create expense entry
- `PUT /expenses/:id` - Update expense entry
- `DELETE /expenses/:id` - Delete expense entry

#### Investments
- `GET /investments` - Get all investments
- `POST /investments` - Create investment entry
- `PUT /investments/:id` - Update investment entry
- `DELETE /investments/:id` - Delete investment entry

#### Summary
- `GET /summary` - Get financial summary

#### Excel Operations
- `POST /excel/import` - Import from Excel
- `GET /excel/export` - Export to Excel

See [Backend README](./server/README.md) for detailed API documentation.

## 🔧 Configuration

### Environment Variables
Create `.env` file in server directory:
```env
PORT=3000
NODE_ENV=development
```

### Data Storage
Data is stored in CSV files in `server/data/`:
- `revenue.csv`
- `expenses.csv`
- `investments.csv`
- `summaries.csv`

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd client
npm test
```

### End-to-End Tests
```bash
cd client
npm run e2e
```

## 🚀 Deployment

### Production Build
```bash
# Backend
cd server
npm run build

# Frontend
cd client
npm run build --prod
```

### Docker Deployment (Future)
```dockerfile
# Multi-stage build for both frontend and backend
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow Angular and Express.js best practices
- Write clear, documented code
- Add tests for new features
- Update documentation as needed
- Ensure responsive design

## 📊 Performance

- **Frontend**: Lazy-loaded modules, optimized bundles
- **Backend**: Efficient CSV operations, minimal overhead
- **Database**: File-based storage for simplicity and reliability

## 🔒 Security

- Input validation on both frontend and backend
- CORS configuration for API security
- No sensitive data in client-side code
- Secure file operations

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Angular Team** for the excellent frontend framework
- **Express.js** for the robust backend framework
- **Open Source Community** for inspiration and tools
- **Funpark Operators** for the domain expertise

## 📞 Support

### Getting Help
1. Check the [Frontend README](./client/README.md)
2. Check the [Backend README](./server/README.md)
3. Review browser/server console for errors
4. Check network connectivity between frontend and backend

### Common Issues
- **Port Conflicts**: Ensure ports 3000 and 4200 are available
- **CORS Errors**: Backend must be running for frontend to work
- **Data Not Loading**: Check CSV files exist in server/data/
- **Build Errors**: Clear node_modules and reinstall dependencies

## 🗺️ Roadmap

### Phase 4: Enhanced Features
- [ ] Advanced reporting with charts and graphs
- [ ] User authentication and authorization
- [ ] Multi-park support
- [ ] Automated backups
- [ ] Mobile app companion

### Phase 5: Analytics & AI
- [ ] Predictive analytics for revenue forecasting
- [ ] AI-powered expense optimization
- [ ] Automated financial insights
- [ ] Machine learning for trend analysis

---

## 🎉 Let's Build Something Amazing!

The Funpark Management System is designed to make financial management as fun as the parks themselves. Whether you're managing a single location or a chain of amusement parks, this system provides the tools you need for success.

**Ready to get started?** Follow the [Quick Start](#quick-start) guide above!

---

**Built with ❤️ for Funpark Operators Worldwide** 🎢🌟</content>
<parameter name="filePath">c:\Users\geoff\Desktop\dev\Funpark\README.md