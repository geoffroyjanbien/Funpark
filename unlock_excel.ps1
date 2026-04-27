# Unlock Excel file using Excel COM automation
# This works on Windows with Excel installed

$password = "f123"
$inputFile = Join-Path $PSScriptRoot "Manager\Excel\fun park - 10 unlocked.xlsx"
$outputFile = Join-Path $PSScriptRoot "Manager\Excel\fun park - 10 unlocked.xlsx"

Write-Host "Unlocking Excel file..." -ForegroundColor Yellow
Write-Host "File: $inputFile"
Write-Host ""

try {
    # Create Excel COM object
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    
    # Open the password-protected file
    Write-Host "Opening password-protected file..." -ForegroundColor Cyan
    $workbook = $excel.Workbooks.Open($inputFile, [Type]::Missing, $false, [Type]::Missing, $password, $password)
    
    # Remove password and save
    Write-Host "Removing password and saving..." -ForegroundColor Cyan
    $workbook.Password = ""
    $workbook.Save()
    
    # Close workbook
    $workbook.Close($false)
    $excel.Quit()
    
    # Release COM objects
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($workbook) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    
    Write-Host ""
    Write-Host "Success! File unlocked" -ForegroundColor Green
    Write-Host ""
    Write-Host "Now running import..." -ForegroundColor Yellow
    
    # Run import
    Set-Location server
    node importManager.js
    
} catch {
    Write-Host ""
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    
    # Cleanup
    if ($excel) {
        try { $excel.Quit() } catch {}
        try { [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null } catch {}
    }
}
