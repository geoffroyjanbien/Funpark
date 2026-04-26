# API Specification Document

## Overview
The Funpark Management API provides RESTful endpoints for managing daily revenue, expenses, investments, and profit summaries. All endpoints return JSON responses with a standard format.

## Base URL
- Development: `http://localhost:3000`
- Production: To be determined

## Authentication
None required (single-user application)

## Response Format
All responses follow this structure:
```json
{
  "success": true|false,
  "data": { ... } | null,
  "error": "error message" | null
}
```

## Endpoints

### Revenue Management
**GET /api/revenue**
- Get all revenue entries
- Query params: date (YYYY-MM-DD), category
- Response: Array of revenue objects

**GET /api/revenue/:id**
- Get specific revenue entry by ID
- Response: Single revenue object

**POST /api/revenue**
- Create new revenue entry
- Body:
```json
{
  "date": "2026-04-19",
  "category": "Hookah|Drinks|Crepe|Games|Various",
  "amount_ll": 1000.00,
  "amount_usd": 0.00
}
```
- Validation: date required, category required, amounts >= 0, 2 decimal places

**PUT /api/revenue/:id**
- Update revenue entry
- Same body as POST

**DELETE /api/revenue/:id**
- Delete revenue entry

### Expense Management
**GET /api/expenses**
- Get all expense entries
- Query params: date, main_category, subcategory, investment_type
- Response: Array of expense objects

**GET /api/expenses/:id**
- Get specific expense entry

**POST /api/expenses**
- Create new expense entry
- Body:
```json
{
  "date": "2026-04-19",
  "main_category": "string",
  "subcategory": "string",
  "investment_type": "Long Term|Mid Term|Short Term",
  "amount_ll": 500.00,
  "amount_usd": 0.00
}
```
- Validation: date required, amounts >= 0, 2 decimal places

**PUT /api/expenses/:id**
- Update expense entry

**DELETE /api/expenses/:id**
- Delete expense entry

### Investment Management
**GET /api/investments**
- Get all investment entries
- Query params: date, investment_type
- Response: Array of investment objects

**GET /api/investments/:id**
- Get specific investment entry

**POST /api/investments**
- Create new investment entry
- Body:
```json
{
  "date": "2026-04-19",
  "investment_type": "Long Term|Mid Term|Short Term",
  "description": "string",
  "amount_ll": 10000.00,
  "amount_usd": 0.00,
  "owner_allocation": "Owner1|Owner2|Both"
}
```
- Validation: date required, type required, amounts >= 0, 2 decimal places

**PUT /api/investments/:id**
- Update investment entry

**DELETE /api/investments/:id**
- Delete investment entry

### Summary Endpoints
**GET /api/summaries/daily**
- Get daily summary for specific date
- Query params: date (required, YYYY-MM-DD)
- Response:
```json
{
  "date": "2026-04-19",
  "daily_revenue_ll": 5000.00,
  "daily_expenses_ll": 3000.00,
  "daily_balance_ll": 2000.00,
  "owner1_share_ll": 600.00,
  "owner2_share_ll": 1400.00,
  "revenue_items": [...],
  "expense_items": [...]
}
```

**GET /api/summaries/monthly**
- Get monthly summary
- Query params: month (MM), year (YYYY)
- Response: Aggregated monthly data with owner shares

**GET /api/summaries/yearly**
- Get yearly summary
- Query params: year (YYYY)
- Response: Aggregated yearly data with owner shares

## Error Codes
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 404: Not Found
- 500: Internal Server Error

## Data Types
- Dates: YYYY-MM-DD format
- Amounts: Decimal with 2 places (e.g., 1234.56)
- Categories: Predefined strings as listed
- IDs: Auto-generated unique identifiers

## Rate Limiting
None implemented (single-user application)

## Versioning
API version 1.0 - no versioning in URLs