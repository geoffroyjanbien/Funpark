# Excel Import Instructions

## Current Status
✅ Investment data imported: 27 entries
❌ Fun park data: File is password-protected

## Password
The password for "fun park - 10.xlsx" is: **f123**

## How to Import Fun Park Data

### Option 1: Manual Unlock (Recommended)
1. Navigate to: `Manager/Excel/`
2. Open `fun park - 10.xlsx` in Microsoft Excel
3. Enter password: `f123`
4. Go to: File > Info > Protect Workbook > Encrypt with Password
5. Delete the password (leave blank)
6. Click OK
7. Save the file (Ctrl+S)
8. Run the import script:
   ```bash
   cd server
   node importManager.js
   ```

### Option 2: Save As Unlocked Version
1. Open `fun park - 10.xlsx` in Excel
2. Enter password: `f123`
3. Go to: File > Save As
4. Choose location: Same folder (Manager/Excel/)
5. File name: `fun park - 10 - unlocked.xlsx`
6. Format: Excel Workbook (*.xlsx)
7. Save
8. Update the import script to use the new filename
9. Run: `node importManager.js`

### Option 3: Use Python Script (Advanced)
If you have Python installed with `msoffcrypto-tool`:
```bash
pip install msoffcrypto-tool
python unlock_excel.py
```

## What Gets Imported

### From investment.xlsx
- Investment entries with descriptions, amounts, and types
- Automatically categorized as Long Term investments

### From fun park - 10.xlsx (once unlocked)
- Revenue entries (sales, income)
- Expense entries (costs, payments)
- Automatically parsed by date and category

## After Import
The script will:
1. Clear all existing data
2. Import fresh data from both Excel files
3. Create CSV files in `server/data/`:
   - revenue.csv
   - expense_entries.csv
   - investment_entries.csv

## Troubleshooting

### "File not found" error
- Check that Excel files are in `Manager/Excel/` folder
- Verify file names match exactly

### "Password-protected" error
- Follow Option 1 or 2 above to unlock the file
- Ensure you saved after removing the password

### Import shows 0 entries
- Check that the Excel file has data
- Verify the sheet structure matches expected format
- Check console output for specific errors

## Need Help?
Run the import script to see detailed status:
```bash
cd server
node importManager.js
```
