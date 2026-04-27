# API Specification Document

## Overview
The Funpark Management API provides RESTful endpoints for managing daily revenue, expenses, investments, salaries, categories, and profit summaries. All endpoints return JSON responses with a standard format.

## Base URL
- Development: `http://localhost:3000`
- Production: `https://funpark-api.onrender.com`

## Authentication
None required (single-user application)

## Response Format
All responses follow this structure:
```json
{
  "success": true|false,
  "data": { ... } | [],
  "message": "success message" | null,
  "count": number | null
}
```

## Endpoints

### Health Check
**GET /health**
- Check API server status
- Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-12-01T10:00:00.000Z",
  "environment": "production",
  "version": "1.0.0"
}
```

### Revenue Management
**GET /api/revenue**
- Get all revenue entries
- Query params: `limit` (optional, number)
- Response: Array of revenue objects

**GET /api/revenue/:id**
- Get specific revenue entry by ID
- Response: Single revenue object

**POST /api/revenue**
- Create new revenue entry
- Body:
```json
{
  "date": "2024-12-01",
  "source": "Tickets",
  "amount": 1000.00,
  "description": "Weekend ticket sales"
}
```
- Validation: date required, source required, amount >= 0

**PUT /api/revenue/:id**
- Update revenue entry
- Same body as POST

**DELETE /api/revenue/:id**
- Delete revenue entry

### Expense Management
**GET /api/expenses**
- Get all expense entries
- Query params: `limit` (optional, number)
- Response: Array of expense objects

**GET /api/expenses/:id**
- Get specific expense entry

**POST /api/expenses**
- Create new expense entry
- Body:
```json
{
  "date": "2024-12-01",
  "category": "Maintenance",
  "amount": 500.00,
  "description": "Ride maintenance"
}
```
- Validation: date required, category required, amount >= 0

**PUT /api/expenses/:id**
- Update expense entry

**DELETE /api/expenses/:id**
- Delete expense entry

### Investment Management
**GET /api/investments**
- Get all investment entries
- Query params: `limit` (optional, number)
- Response: Array of investment objects

**GET /api/investments/:id**
- Get specific investment entry

**POST /api/investments**
- Create new investment entry
- Body:
```json
{
  "date": "2024-12-01",
  "type": "Equipment",
  "amount": 10000.00,
  "description": "New roller coaster"
}
```
- Validation: date required, type required, amount >= 0

**PUT /api/investments/:id**
- Update investment entry

**DELETE /api/investments/:id**
- Delete investment entry

### Category Management
**GET /api/categories**
- Get all categories
- Response: Array of category objects

**GET /api/categories/type/:type**
- Get categories by type (revenue, expense, investment)
- Response: Array of category objects

**GET /api/categories/:id**
- Get specific category by ID

**POST /api/categories**
- Create new category
- Body:
```json
{
  "type": "revenue",
  "name_en": "Tickets",
  "name_ar": "تذاكر",
  "is_active": "1"
}
```

**PUT /api/categories/:id**
- Update category

**DELETE /api/categories/:id**
- Soft delete category (sets is_active to 0)

**DELETE /api/categories/:id/permanent**
- Permanently delete category

### Salary Management

#### Employees
**GET /api/salaries/employees**
- Get all employees
- Response: Array of employee objects

**GET /api/salaries/employees/:id**
- Get specific employee

**POST /api/salaries/employees**
- Create new employee
- Body:
```json
{
  "name": "John Doe",
  "position": "Manager",
  "monthly_salary": 2000.00,
  "hire_date": "2024-01-01",
  "status": "active"
}
```

**PUT /api/salaries/employees/:id**
- Update employee

**DELETE /api/salaries/employees/:id**
- Delete employee

#### Salary Payments
**GET /api/salaries/payments**
- Get all salary payments
- Response: Array of payment objects

**GET /api/salaries/payments/employee/:employeeId**
- Get payments for specific employee

**GET /api/salaries/payments/month**
- Get payments for specific month
- Query params: `year` (YYYY), `month` (1-12)

**POST /api/salaries/payments**
- Create new salary payment
- Body:
```json
{
  "employee_id": "emp-123",
  "amount": 2000.00,
  "payment_date": "2024-12-01",
  "payment_type": "full",
  "month": "December",
  "year": 2024,
  "notes": "Monthly salary"
}
```

**PUT /api/salaries/payments/:id**
- Update payment

**DELETE /api/salaries/payments/:id**
- Delete payment

**GET /api/salaries/summary**
- Get salary summary
- Query params: `year` (optional), `month` (optional)
- Response:
```json
{
  "totalEmployees": 10,
  "activeEmployees": 8,
  "totalMonthlySalaries": 20000.00,
  "totalPaidThisMonth": 18000.00,
  "pendingPayments": 2000.00
}
```

### Summary Endpoints
**GET /api/summaries**
- Get financial summary
- Response:
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

## Error Codes
- 200: Success (GET, PUT, DELETE)
- 201: Created (POST)
- 400: Bad Request (validation error)
- 404: Not Found
- 500: Internal Server Error

## Data Types
- Dates: YYYY-MM-DD format
- Amounts: Decimal numbers (e.g., 1234.56)
- IDs: Auto-generated UUIDs
- Status: "active" | "inactive"
- Payment Type: "full" | "partial" | "advance"

## CORS Configuration
- Accepts all Vercel deployment URLs: `https://funpark*.vercel.app`
- Accepts localhost: `http://localhost:4200`
- Uses regex pattern matching for flexible origin validation

## Rate Limiting
None implemented (single-user application)

## Versioning
API version 1.0 - no versioning in URLs

## Logging
- Winston logger with file rotation
- Error logs: `logs/error.log`
- Combined logs: `logs/combined.log`
- Request logging with IP and User-Agent