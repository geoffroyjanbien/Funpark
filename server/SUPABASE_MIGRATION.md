# Supabase Migration Guide

This guide will help you migrate from CSV files to Supabase database.

## Step 1: Set up Supabase

1. Go to https://supabase.com and sign up
2. Create a new project
3. Wait for the project to be ready (takes ~2 minutes)

## Step 2: Get Your Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 3: Create Database Schema

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire content from `supabase-schema.sql`
4. Paste it into the SQL Editor
5. Click **Run** to create all tables

## Step 4: Configure Environment Variables

1. Create a `.env` file in the `server` directory:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```env
   PORT=3000
   NODE_ENV=development
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   ```

## Step 5: Run Migration Script

Run the migration script to transfer data from CSV to Supabase:

```bash
cd server
node src/migrate.js
```

You should see output like:
```
🚀 Starting migration from CSV to Supabase...

Migrating categories...
✓ Migrated 41 categories
Migrating revenue...
✓ Migrated 140 revenue entries
Migrating expenses...
✓ Migrated 145 expense entries
...

✅ Migration completed successfully!
```

## Step 6: Update Backend Controllers

The backend controllers need to be updated to use Supabase instead of CSV files. This includes:

- `src/controllers/revenueController.js`
- `src/controllers/expensesController.js`
- `src/controllers/investmentsController.js`
- `src/controllers/categoriesController.js`
- `src/controllers/employeesController.js`
- `src/controllers/salariesController.js`

## Step 7: Test the Application

1. Start the backend server:
   ```bash
   npm start
   ```

2. Test the API endpoints to ensure data is being fetched from Supabase

3. Start the frontend and verify everything works

## Verification

To verify the migration was successful:

1. Go to Supabase **Table Editor**
2. Check each table has data:
   - `categories`
   - `revenue`
   - `expense_entries`
   - `investment_entries`
   - `employees`
   - `salary_payments`

## Rollback

If you need to rollback:

1. Keep your CSV files as backup
2. In Supabase SQL Editor, run:
   ```sql
   DROP TABLE IF EXISTS salary_payments CASCADE;
   DROP TABLE IF EXISTS employees CASCADE;
   DROP TABLE IF EXISTS investment_entries CASCADE;
   DROP TABLE IF EXISTS expense_entries CASCADE;
   DROP TABLE IF EXISTS revenue CASCADE;
   DROP TABLE IF EXISTS categories CASCADE;
   DROP TABLE IF EXISTS daily_summary CASCADE;
   ```

## Benefits of Supabase

- ✅ Real-time data synchronization
- ✅ Better performance and scalability
- ✅ Built-in authentication (for future use)
- ✅ Automatic backups
- ✅ RESTful API auto-generated
- ✅ No file locking issues
- ✅ Concurrent user support
- ✅ Advanced querying capabilities

## Next Steps

After successful migration, you can:

1. Remove CSV file dependencies
2. Add user authentication
3. Implement real-time updates
4. Add data validation at database level
5. Create database views for complex queries
