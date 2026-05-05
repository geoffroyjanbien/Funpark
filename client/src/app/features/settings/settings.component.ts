import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CategoryService, Category } from '../../services/category.service';
import { SalariesService, Employee } from '../../services/salaries.service';
import { AuthService } from '../../services/auth.service';

type SettingsTab = 'revenue' | 'expense' | 'investment' | 'employees' | 'general';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  activeTab: SettingsTab = 'revenue';
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  employees: Employee[] = [];
  loading = false;
  employeesLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  // Form state
  showForm = false;
  editMode = false;
  currentCategory: Partial<Category> = {};
  currentEmployee: Partial<Employee> = {};

  // Parent categories for hierarchical structure
  parentCategories: Category[] = [];

  // Selection for bulk delete
  selectedCategoryIds = new Set<string>();
  selectedEmployeeIds = new Set<string>();
  bulkDeleting = false;

  // General settings
  generalSettings = {
    ownerSharePercentage: 70,
    partnerSharePercentage: 30,
    defaultCurrency: 'LL',
    exchangeRate: 90000,
    fiscalYearStart: '01-01',
    companyName: 'Funpark',
    companyNameAr: 'فن بارك'
  };

  constructor(
    private categoryService: CategoryService,
    private salariesService: SalariesService,
    private translate: TranslateService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadEmployees();
    this.loadGeneralSettings();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.filterCategories();
        this.updateParentCategories();
        this.loading = false;
      },
      error: (err) => {
        this.error = this.translate.instant('SETTINGS.MESSAGES.LOAD_ERROR');
        this.loading = false;
        console.error('Error loading categories:', err);
      }
    });
  }

  loadEmployees(): void {
    this.employeesLoading = true;
    this.salariesService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data || [];
        this.employeesLoading = false;
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.employeesLoading = false;
      }
    });
  }

  loadGeneralSettings(): void {
    const saved = localStorage.getItem('generalSettings');
    if (saved) {
      this.generalSettings = JSON.parse(saved);
    }
  }

  saveGeneralSettings(): void {
    localStorage.setItem('generalSettings', JSON.stringify(this.generalSettings));
    this.showSuccessMessage(this.translate.instant('SETTINGS.MESSAGES.SETTINGS_SAVED'));
  }

  filterCategories(): void {
    if (this.activeTab === 'general' || this.activeTab === 'employees') {
      this.filteredCategories = [];
      return;
    }
    this.filteredCategories = this.categories.filter(
      cat => cat.type === this.activeTab && cat.is_active === true
    );
  }

  updateParentCategories(): void {
    if (this.activeTab === 'general' || this.activeTab === 'employees') {
      this.parentCategories = [];
      return;
    }
    this.parentCategories = this.categories.filter(
      cat => cat.type === this.activeTab && !cat.parent_category && cat.is_active === true
    );
  }

  onTabChange(tab: SettingsTab): void {
    this.activeTab = tab;
    this.filterCategories();
    this.updateParentCategories();
    this.cancelForm();
    this.clearMessages();
    this.selectedCategoryIds.clear();
    this.selectedEmployeeIds.clear();
  }

  openAddForm(): void {
    this.showForm = true;
    this.editMode = false;
    if (this.activeTab === 'employees') {
      this.currentEmployee = {
        name: '',
        position: '',
        monthly_salary: 0,
        hire_date: new Date().toISOString().split('T')[0],
        status: 'active'
      };
    } else {
      this.currentCategory = {
        type: this.activeTab as 'revenue' | 'expense' | 'investment',
        name_en: '',
        name_ar: '',
        parent_category: '',
        is_active: true
      };
    }
  }

  openEditForm(item: Category | Employee): void {
    this.showForm = true;
    this.editMode = true;
    if (this.activeTab === 'employees') {
      this.currentEmployee = { ...item as Employee };
    } else {
      this.currentCategory = { ...item as Category };
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.editMode = false;
    this.currentCategory = {};
    this.currentEmployee = {};
  }

  saveCategory(): void {
    if (this.activeTab === 'employees') {
      this.saveEmployee();
      return;
    }

    if (!this.currentCategory.name_en || !this.currentCategory.name_ar) {
      this.showErrorMessage(this.translate.instant('SETTINGS.VALIDATION.NAME_REQUIRED'));
      return;
    }

    this.loading = true;
    this.clearMessages();

    if (this.editMode && this.currentCategory.id) {
      this.categoryService.updateCategory(this.currentCategory.id, this.currentCategory).subscribe({
        next: () => {
          this.showSuccessMessage(this.translate.instant('SETTINGS.MESSAGES.CATEGORY_UPDATED'));
          this.loadCategories();
          this.cancelForm();
        },
        error: (err) => {
          this.showErrorMessage(this.translate.instant('SETTINGS.MESSAGES.UPDATE_ERROR'));
          this.loading = false;
          console.error('Error updating category:', err);
        }
      });
    } else {
      this.categoryService.createCategory(this.currentCategory).subscribe({
        next: () => {
          this.showSuccessMessage(this.translate.instant('SETTINGS.MESSAGES.CATEGORY_CREATED'));
          this.loadCategories();
          this.cancelForm();
        },
        error: (err) => {
          this.showErrorMessage(this.translate.instant('SETTINGS.MESSAGES.CREATE_ERROR'));
          this.loading = false;
          console.error('Error creating category:', err);
        }
      });
    }
  }

  deleteCategory(item: Category | Employee): void {
    if (this.activeTab === 'employees') {
      this.deleteEmployee(item as Employee);
      return;
    }

    const category = item as Category;
    if (!confirm(this.translate.instant('SETTINGS.DELETE_CONFIRM', { name: this.getCategoryName(category) }))) {
      return;
    }

    this.loading = true;
    this.clearMessages();

    this.categoryService.deleteCategory(category.id).subscribe({
      next: () => {
        this.showSuccessMessage(this.translate.instant('SETTINGS.MESSAGES.CATEGORY_DELETED'));
        this.loadCategories();
      },
      error: (err) => {
        this.showErrorMessage(this.translate.instant('SETTINGS.MESSAGES.DELETE_ERROR'));
        this.loading = false;
        console.error('Error deleting category:', err);
      }
    });
  }

  saveEmployee(): void {
    if (!this.currentEmployee.name || !this.currentEmployee.position) {
      this.showErrorMessage('Name and position are required');
      return;
    }

    this.loading = true;
    this.clearMessages();

    if (this.editMode && this.currentEmployee.id) {
      this.salariesService.updateEmployee(this.currentEmployee.id, this.currentEmployee).subscribe({
        next: () => {
          this.showSuccessMessage('Employee updated successfully');
          this.loadEmployees();
          this.cancelForm();
          this.loading = false;
        },
        error: () => {
          this.showErrorMessage('Failed to update employee');
          this.loading = false;
        }
      });
    } else {
      this.salariesService.createEmployee(this.currentEmployee as Omit<Employee, 'id'>).subscribe({
        next: () => {
          this.showSuccessMessage('Employee created successfully');
          this.loadEmployees();
          this.cancelForm();
          this.loading = false;
        },
        error: () => {
          this.showErrorMessage('Failed to create employee');
          this.loading = false;
        }
      });
    }
  }

  deleteEmployee(employee: Employee): void {
    if (!confirm(`Are you sure you want to delete ${employee.name}?`)) {
      return;
    }

    this.loading = true;
    this.clearMessages();

    this.salariesService.deleteEmployee(employee.id!).subscribe({
      next: () => {
        this.showSuccessMessage('Employee deleted successfully');
        this.loadEmployees();
        this.loading = false;
      },
      error: () => {
        this.showErrorMessage('Failed to delete employee');
        this.loading = false;
      }
    });
  }

  // --- Bulk delete: categories ---
  get allCategoriesSelected(): boolean {
    return this.filteredCategories.length > 0 && this.filteredCategories.every(c => this.selectedCategoryIds.has(c.id));
  }

  toggleSelectAllCategories(): void {
    if (this.allCategoriesSelected) {
      this.filteredCategories.forEach(c => this.selectedCategoryIds.delete(c.id));
    } else {
      this.filteredCategories.forEach(c => this.selectedCategoryIds.add(c.id));
    }
  }

  bulkDeleteCategories(): void {
    if (!this.selectedCategoryIds.size || !confirm(`Delete ${this.selectedCategoryIds.size} selected categories?`)) return;
    this.bulkDeleting = true;
    Promise.all(Array.from(this.selectedCategoryIds).map(id => this.categoryService.deleteCategory(id).toPromise()))
      .then(() => { this.selectedCategoryIds.clear(); this.loadCategories(); })
      .catch(() => this.showErrorMessage('Failed to delete some categories'))
      .finally(() => { this.bulkDeleting = false; });
  }

  // --- Bulk delete: employees ---
  get allEmployeesSelected(): boolean {
    return this.employees.length > 0 && this.employees.every(e => this.selectedEmployeeIds.has(e.id!));
  }

  toggleSelectAllEmployees(): void {
    if (this.allEmployeesSelected) {
      this.employees.forEach(e => this.selectedEmployeeIds.delete(e.id!));
    } else {
      this.employees.forEach(e => this.selectedEmployeeIds.add(e.id!));
    }
  }

  bulkDeleteEmployees(): void {
    if (!this.selectedEmployeeIds.size || !confirm(`Delete ${this.selectedEmployeeIds.size} selected employees?`)) return;
    this.bulkDeleting = true;
    Promise.all(Array.from(this.selectedEmployeeIds).map(id => this.salariesService.deleteEmployee(id).toPromise()))
      .then(() => { this.selectedEmployeeIds.clear(); this.loadEmployees(); })
      .catch(() => this.showErrorMessage('Failed to delete some employees'))
      .finally(() => { this.bulkDeleting = false; });
  }

  // --- Helpers ---
  getCategoryName(category: Category): string {
    return this.translate.currentLang === 'ar' ? category.name_ar : category.name_en;
  }

  getParentCategoryName(parentName: string): string {
    if (!parentName) return '';
    const parent = this.categories.find(cat => cat.name_en === parentName);
    return parent ? this.getCategoryName(parent) : parentName;
  }

  getChildCategories(parentCategory: Category): Category[] {
    return this.filteredCategories.filter(cat => cat.parent_category === parentCategory.name_en);
  }

  isParentCategory(category: Category): boolean {
    return !category.parent_category;
  }

  hasChildren(category: Category): boolean {
    return this.getChildCategories(category).length > 0;
  }

  getCategoryCount(type: 'revenue' | 'expense' | 'investment'): number {
    return this.categories.filter(cat => cat.type === type && cat.is_active === true).length;
  }

  showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.error = null;
    setTimeout(() => { this.successMessage = null; }, 3000);
  }

  showErrorMessage(message: string): void {
    this.error = message;
    this.successMessage = null;
  }

  clearMessages(): void {
    this.error = null;
    this.successMessage = null;
  }

  resetToDefaults(): void {
    if (!confirm(this.translate.instant('SETTINGS.RESET_CONFIRM'))) return;
    this.generalSettings = {
      ownerSharePercentage: 70,
      partnerSharePercentage: 30,
      defaultCurrency: 'LL',
      exchangeRate: 90000,
      fiscalYearStart: '01-01',
      companyName: 'Funpark',
      companyNameAr: 'فن بارك'
    };
    this.saveGeneralSettings();
  }
}
