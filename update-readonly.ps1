# Update salaries.component.html
$salariesPath = "C:\Users\geoff\Desktop\dev\Funpark\client\src\app\features\salaries\salaries.component.html"
$content = Get-Content $salariesPath -Raw

# Update add buttons
$content = $content -replace '\*ngIf="activeTab === ''employees''" \(click\)="openEmployeeForm\(\)"', '*ngIf="activeTab === ''employees'' && authService.isAdmin()" (click)="openEmployeeForm()"'
$content = $content -replace '\*ngIf="activeTab === ''payments''" \(click\)="openPaymentForm\(\)"', '*ngIf="activeTab === ''payments'' && authService.isAdmin()" (click)="openPaymentForm()"'

# Update edit/delete buttons
$content = $content -replace '<button \(click\)="openEmployeeForm\(employee\)"', '<button *ngIf="authService.isAdmin()" (click)="openEmployeeForm(employee)"'
$content = $content -replace '<button \(click\)="deleteEmployee\(employee\)"', '<button *ngIf="authService.isAdmin()" (click)="deleteEmployee(employee)"'
$content = $content -replace '<button \(click\)="openPaymentForm\(payment\)"', '<button *ngIf="authService.isAdmin()" (click)="openPaymentForm(payment)"'
$content = $content -replace '<button \(click\)="deletePayment\(payment\)"', '<button *ngIf="authService.isAdmin()" (click)="deletePayment(payment)"'

Set-Content $salariesPath -Value $content

# Update settings.component.html
$settingsPath = "C:\Users\geoff\Desktop\dev\Funpark\client\src\app\features\settings\settings.component.html"
$content = Get-Content $settingsPath -Raw

# Update add category button
$content = $content -replace '<button \(click\)="openAddForm\(\)" class="btn btn-add">', '<button *ngIf="authService.isAdmin()" (click)="openAddForm()" class="btn btn-add">'

# Update edit/delete buttons
$content = $content -replace '<button \(click\)="openEditForm\(', '<button *ngIf="authService.isAdmin()" (click)="openEditForm('
$content = $content -replace '<button \(click\)="deleteCategory\(', '<button *ngIf="authService.isAdmin()" (click)="deleteCategory('
$content = $content -replace '<button \(click\)="deleteEmployee\(', '<button *ngIf="authService.isAdmin()" (click)="deleteEmployee('

# Update save buttons
$content = $content -replace '<button type="submit"', '<button *ngIf="authService.isAdmin()" type="submit"'
$content = $content -replace '<button \(click\)="saveCategory\(\)"', '<button *ngIf="authService.isAdmin()" (click)="saveCategory()"'
$content = $content -replace '<button \(click\)="saveGeneralSettings\(\)"', '<button *ngIf="authService.isAdmin()" (click)="saveGeneralSettings()"'

Set-Content $settingsPath -Value $content

Write-Host "Files updated successfully!"
