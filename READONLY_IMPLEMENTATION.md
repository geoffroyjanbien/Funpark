# Readonly Access Control - Complete Implementation

## Components TypeScript Files - Add AuthService

### investments.component.ts
Add import:
```typescript
import { AuthService } from '../../services/auth.service';
```

Update constructor (line 38):
```typescript
constructor(
  private investmentsService: InvestmentsService,
  private categoryService: CategoryService,
  private fb: FormBuilder,
  private translate: TranslateService,
  public authService: AuthService
) {
```

### salaries.component.ts
Add import:
```typescript
import { AuthService } from '../../services/auth.service';
```

Update constructor (line 57):
```typescript
constructor(
  private fb: FormBuilder,
  private salariesService: SalariesService,
  public authService: AuthService
) {}
```

### settings.component.ts
Add import:
```typescript
import { AuthService } from '../../services/auth.service';
```

Update constructor (line 45):
```typescript
constructor(
  private categoryService: CategoryService,
  private salariesService: SalariesService,
  private translate: TranslateService,
  public authService: AuthService
) {}
```

## HTML Templates - Hide Buttons for Readonly Users

### Pattern to Apply in ALL Templates:
1. Add buttons: `*ngIf="authService.isAdmin()"`
2. Edit/Delete buttons: `*ngIf="authService.isAdmin()"`
3. Bulk action toolbars: `*ngIf="selectedIds.size > 0 && authService.isAdmin()"`
4. Table checkbox columns: `*ngIf="authService.isAdmin()"`
5. Table actions columns: `*ngIf="authService.isAdmin()"`

### Files to Update:
- expenses.component.html
- investments.component.html
- salaries.component.html
- settings.component.html

## Summary
Readonly users (role='readonly') will only be able to VIEW data.
Admin users (role='admin') will have full access to add, edit, and delete.
