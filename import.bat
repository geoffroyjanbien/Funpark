@echo off
echo.
echo ========================================
echo   Funpark Excel Import Helper
echo ========================================
echo.
echo The file "fun park - 10.xlsx" is password-protected.
echo Password: f123
echo.
echo INSTRUCTIONS:
echo 1. Open File Explorer
echo 2. Navigate to: Manager\Excel\
echo 3. Double-click "fun park - 10.xlsx"
echo 4. Enter password: f123
echo 5. In Excel: File ^> Save As
echo 6. Save as: "fun park - 10 - unlocked.xlsx"
echo 7. Close Excel
echo 8. Press any key here to run import
echo.
pause

echo.
echo Running import...
cd server
node importManager.js
echo.
pause
