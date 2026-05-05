# Custom Authentication Setup Guide

## Backend Setup Complete ✅

The backend is ready with:
- User authentication with JWT tokens
- Password hashing with bcrypt
- Role-based access control (Admin & Read-Only)
- Auth middleware for protected routes

## Step 1: Create Users Table in Supabase

1. Go to: https://supabase.com/dashboard/project/vnvlptqwasacbramhlbx/sql/new
2. Copy the entire content from `server/users-schema.sql`
3. Paste and click **Run**

This will create:
- `users` table with username, password_hash, role, etc.
- Two initial users:
  - **Admin**: username=`admin`, password=`admin123`
  - **Viewer**: username=`viewer`, password=`viewer123`

## Step 2: Test the Backend

Start the server:
```bash
cd server
npm start
```

Test login endpoint:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

You should get a response with a JWT token.

## Step 3: Frontend Implementation (Next)

We need to create:
1. Login page with username/password form
2. Auth service to handle login/logout
3. Auth guard to protect routes
4. Store user role and show/hide features based on role

## User Roles

### Admin Role
- Full access to all features
- Can create, edit, delete all data
- Can view all reports

### Read-Only Role
- Can view all data
- Cannot create, edit, or delete
- Can view reports
- All write buttons will be hidden/disabled

## API Endpoints

### Public Endpoints
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/hash-password` - Utility to generate password hashes

### Protected Endpoints
- `GET /api/auth/verify` - Verify JWT token

All other API endpoints will require authentication token in header:
```
Authorization: Bearer <your-jwt-token>
```

## Adding New Users

To add new users manually in Supabase:

1. Generate password hash:
```bash
cd server
node src/generate-hashes.js
```

2. Or use the API endpoint:
```bash
curl -X POST http://localhost:3000/api/auth/hash-password \
  -H "Content-Type: application/json" \
  -d '{"password":"your-password-here"}'
```

3. Insert into Supabase users table:
```sql
INSERT INTO users (username, password_hash, full_name, role) 
VALUES ('newuser', 'hash-from-step-1', 'Full Name', 'admin');
-- role can be 'admin' or 'readonly'
```

## Security Notes

- JWT tokens expire after 24 hours
- Passwords are hashed with bcrypt (10 rounds)
- Change default passwords immediately!
- Update JWT_SECRET in production
- All API routes will be protected (except login)

## Next: Frontend Login Page

Ready to implement the frontend login page?
