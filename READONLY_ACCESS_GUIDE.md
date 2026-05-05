# Readonly User Access Control - Implementation Guide

## Summary
Hide all add, edit, delete buttons and bulk actions for readonly users across all pages.
Only admin users should see these buttons.

## Pattern to Apply
Add `*ngIf="authService.isAdmin()"` to all action buttons.

## Files to Update

### 1. expenses.component.html
- Add button in header: `*ngIf="authService.isAdmin()"`
- Bulk toolbar div: `*ngIf="selectedIds.size > 0 && authService.isAdmin()"`
- Empty state add button: `*ngIf="!searchTerm && authService.isAdmin()"`
- Table checkbox column (th and td): `*ngIf="authService.isAdmin()"`
- Table actions column (th and td): `*ngIf="authService.isAdmin()"`

### 2. investments.component.html
- Same pattern as expenses

### 3. salaries.component.html
- Add Employee button: `*ngIf="authService.isAdmin()"`
- Add Payment button: `*ngIf="authService.isAdmin()"`
- Edit/Delete buttons in tables: `*ngIf="authService.isAdmin()"`

### 4. settings.component.html
- Add Category button: `*ngIf="authService.isAdmin()"`
- Edit/Delete buttons: `*ngIf="authService.isAdmin()"`
- All form inputs: `[disabled]="authService.isReadOnly()"`
- Save buttons: `*ngIf="authService.isAdmin()"`

## TypeScript Files Already Updated
✅ revenue.component.ts - AuthService added
✅ expenses.component.ts - AuthService added

## TypeScript Files Still Need AuthService
- investments.component.ts
- salaries.component.ts  
- settings.component.ts

Add to constructor:
```typescript
public authService: AuthService
```

And import:
```typescript
import { AuthService } from '../../services/auth.service';
```
