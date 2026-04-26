# Globalization Implementation Guide

## Overview
The Funpark Management System now supports English and Arabic with full RTL support.

## What's Been Implemented

### 1. Translation Infrastructure ✅
- Installed `@ngx-translate/core` and `@ngx-translate/http-loader`
- Created translation files:
  - `src/assets/i18n/en.json` (English)
  - `src/assets/i18n/ar.json` (Arabic)
- Configured TranslateModule in app.module.ts
- Added TranslateModule to all feature modules

### 2. Language Switcher ✅
- Added language switcher buttons (English/العربية) in top-right corner
- Language preference saved in localStorage
- Automatic RTL/LTR direction switching
- Proper HTML lang and dir attributes

### 3. RTL Support ✅
- CSS updated for RTL layout
- Navigation adjusts for RTL
- Language switcher position adjusts for RTL

## How to Use Translations in Components

### In HTML Templates
Replace hardcoded text with translation pipes:

**Before:**
```html
<h1>Revenue Management</h1>
```

**After:**
```html
<h1>{{ 'REVENUE.TITLE' | translate }}</h1>
```

### Common Patterns

#### 1. Simple Text
```html
<button>{{ 'COMMON.ADD' | translate }}</button>
```

#### 2. Placeholders
```html
<input [placeholder]="'FILTERS.SEARCH_PLACEHOLDER' | translate">
```

#### 3. Dropdown Options
```html
<select>
  <option value="">{{ 'FORM.SELECT_SOURCE' | translate }}</option>
  <option value="Hookah">{{ 'REVENUE.SOURCES.HOOKAH' | translate }}</option>
</select>
```

#### 4. Conditional Messages
```html
<div *ngIf="error">{{ 'REVENUE.MESSAGES.LOAD_ERROR' | translate }}</div>
```

#### 5. Dynamic Parameters
```html
{{ 'FORM.VALIDATION.REQUIRED' | translate:{ field: 'Date' } }}
```

## Translation Keys Structure

### Navigation
- `NAV.DASHBOARD` - Dashboard
- `NAV.REVENUE` - Revenue
- `NAV.EXPENSES` - Expenses
- `NAV.INVESTMENTS` - Investments
- `NAV.REPORTS` - Reports

### Common Terms
- `COMMON.ADD` - Add
- `COMMON.EDIT` - Edit
- `COMMON.DELETE` - Delete
- `COMMON.CANCEL` - Cancel
- `COMMON.SAVE` - Save
- `COMMON.SEARCH` - Search
- `COMMON.DATE` - Date
- `COMMON.AMOUNT` - Amount
- `COMMON.DESCRIPTION` - Description

### Filters
- `FILTERS.VIEW_MODE` - View Mode
- `FILTERS.ALL_TIME` - All Time
- `FILTERS.YEARLY` - Yearly
- `FILTERS.MONTHLY` - Monthly
- `FILTERS.DAILY` - Today
- `FILTERS.YEAR` - Year
- `FILTERS.MONTH` - Month

### Revenue
- `REVENUE.TITLE` - Revenue Management
- `REVENUE.ADD_REVENUE` - Add Revenue
- `REVENUE.SOURCE` - Source
- `REVENUE.SOURCES.HOOKAH` - Hookah
- `REVENUE.SOURCES.DRINKS` - Drinks
- `REVENUE.SOURCES.CREPE` - Crepe
- `REVENUE.SOURCES.GAMES` - Games
- `REVENUE.SOURCES.VARIOUS` - Various

### Expenses
- `EXPENSES.TITLE` - Expenses Management
- `EXPENSES.ADD_EXPENSE` - Add Expense
- `EXPENSES.CATEGORY` - Category
- `EXPENSES.CATEGORIES.FOOD` - Food
- `EXPENSES.CATEGORIES.TRANSPORTATION` - Transportation
- etc.

### Investments
- `INVESTMENTS.TITLE` - Investments Management
- `INVESTMENTS.ADD_INVESTMENT` - Add Investment
- `INVESTMENTS.TYPE` - Investment Type
- `INVESTMENTS.TYPES.LONG_TERM` - Long Term
- `INVESTMENTS.TYPES.MID_TERM` - Mid Term
- `INVESTMENTS.TYPES.SHORT_TERM` - Short Term

## Next Steps to Complete Implementation

### 1. Update Navigation Component
File: `src/app/components/navigation/navigation.component.html`

Replace menu items with translations:
```html
<a routerLink="/dashboard">{{ 'NAV.DASHBOARD' | translate }}</a>
<a routerLink="/revenue">{{ 'NAV.REVENUE' | translate }}</a>
<a routerLink="/expenses">{{ 'NAV.EXPENSES' | translate }}</a>
<a routerLink="/investments">{{ 'NAV.INVESTMENTS' | translate }}</a>
<a routerLink="/reports">{{ 'NAV.REPORTS' | translate }}</a>
```

### 2. Update Revenue Component
File: `src/app/features/revenue/revenue.component.html`

Key replacements:
- Page title: `{{ 'REVENUE.TITLE' | translate }}`
- Add button: `{{ 'REVENUE.ADD_REVENUE' | translate }}`
- Search placeholder: `[placeholder]="'REVENUE.SEARCH_PLACEHOLDER' | translate"`
- Table headers: `{{ 'COMMON.DATE' | translate }}`, etc.
- Dropdown options: Use `REVENUE.SOURCES.*` keys

### 3. Update Expenses Component
File: `src/app/features/expenses/expenses.component.html`

Similar pattern using `EXPENSES.*` keys

### 4. Update Investments Component
File: `src/app/features/investments/investments.component.html`

Similar pattern using `INVESTMENTS.*` keys

### 5. Update Dashboard Component
File: `src/app/features/dashboard/dashboard.component.html`

Use `DASHBOARD.*` keys for all labels

### 6. Update Reports Component
File: `src/app/features/reports/reports.component.html`

Use `REPORTS.*` keys for all labels

### 7. Update Month Arrays in Components
In TypeScript files, replace hardcoded month arrays:

**Before:**
```typescript
availableMonths: string[] = ['January', 'February', ...];
```

**After:**
```typescript
import { TranslateService } from '@ngx-translate/core';

constructor(private translate: TranslateService) {}

ngOnInit() {
  this.loadMonths();
}

loadMonths() {
  this.availableMonths = [
    this.translate.instant('MONTHS.JANUARY'),
    this.translate.instant('MONTHS.FEBRUARY'),
    // ... etc
  ];
}
```

## Testing

1. **Switch to English**: Click "English" button - all text should be in English
2. **Switch to Arabic**: Click "العربية" button - all text should be in Arabic and layout should flip to RTL
3. **Refresh Page**: Language preference should persist
4. **Check All Pages**: Navigate through all pages to ensure translations work everywhere

## RTL Considerations

When Arabic is selected:
- Layout flips to right-to-left
- Navigation moves to the right side
- Language switcher moves to the left
- Text alignment adjusts automatically
- All margins and paddings flip

## Adding New Translations

To add new text:
1. Add key to both `en.json` and `ar.json`
2. Use the key in HTML with translate pipe
3. Test in both languages

Example:
```json
// en.json
"NEW_FEATURE": {
  "TITLE": "New Feature"
}

// ar.json
"NEW_FEATURE": {
  "TITLE": "ميزة جديدة"
}
```

```html
<h1>{{ 'NEW_FEATURE.TITLE' | translate }}</h1>
```

## Current Status

✅ Translation infrastructure setup complete
✅ Language switcher implemented
✅ RTL support added
✅ All translation keys defined
✅ All modules configured

⏳ Pending: Apply translation pipes to all component templates (manual step-by-step replacement needed)

## Quick Reference

| English | Arabic | Key |
|---------|--------|-----|
| Dashboard | لوحة التحكم | NAV.DASHBOARD |
| Revenue | الإيرادات | NAV.REVENUE |
| Expenses | المصروفات | NAV.EXPENSES |
| Investments | الاستثمارات | NAV.INVESTMENTS |
| Reports | التقارير | NAV.REPORTS |
| Add | إضافة | COMMON.ADD |
| Edit | تعديل | COMMON.EDIT |
| Delete | حذف | COMMON.DELETE |
| Search | بحث | COMMON.SEARCH |
