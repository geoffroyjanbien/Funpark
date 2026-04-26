import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CategoryService, Category } from '../../services/category.service';

type SettingsTab = 'revenue' | 'expense' | 'investment' | 'general';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  activeTab: SettingsTab = 'revenue';
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;
  
  // Form state
  showForm = false;
  editMode = false;
  currentCategory: Partial<Category> = {};
  
  // Parent categories for hierarchical structure
  parentCategories: Category[] = [];

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
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
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
      error: (error) => {
        this.error = this.translate.instant('SETTINGS.MESSAGES.LOAD_ERROR');
        this.loading = false;
        console.error('Error loading categories:', error);
      }
    });
  }

  loadGeneralSettings(): void {
    // Load from localStorage or API
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
    if (this.activeTab === 'general') {
      this.filteredCategories = [];
      return;
    }
    
    this.filteredCategories = this.categories.filter(
      cat => cat.type === this.activeTab && cat.is_active === 'true'
    );
  }

  updateParentCategories(): void {
    if (this.activeTab === 'general') {
      this.parentCategories = [];
      return;
    }

    this.parentCategories = this.categories.filter(
      cat => cat.type === this.activeTab && !cat.parent_category && cat.is_active === 'true'
    );
  }

  onTabChange(tab: SettingsTab): void {
    this.activeTab = tab;
    this.filterCategories();
    this.updateParentCategories();
    this.cancelForm();
    this.clearMessages();
  }

  openAddForm(): void {
    this.showForm = true;
    this.editMode = false;
    this.currentCategory = {
      type: this.activeTab as 'revenue' | 'expense' | 'investment',
      name_en: '',
      name_ar: '',
      parent_category: '',
      is_active: 'true'
    };
  }

  openEditForm(category: Category): void {
    this.showForm = true;
    this.editMode = true;
    this.currentCategory = { ...category };
  }

  cancelForm(): void {
    this.showForm = false;
    this.editMode = false;
    this.currentCategory = {};
  }

  saveCategory(): void {
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
        error: (error) => {
          this.showErrorMessage(this.translate.instant('SETTINGS.MESSAGES.UPDATE_ERROR'));
          this.loading = false;
          console.error('Error updating category:', error);
        }
      });
    } else {
      this.categoryService.createCategory(this.currentCategory).subscribe({
        next: () => {
          this.showSuccessMessage(this.translate.instant('SETTINGS.MESSAGES.CATEGORY_CREATED'));
          this.loadCategories();
          this.cancelForm();
        },
        error: (error) => {
          this.showErrorMessage(this.translate.instant('SETTINGS.MESSAGES.CREATE_ERROR'));
          this.loading = false;
          console.error('Error creating category:', error);
        }
      });
    }
  }

  deleteCategory(category: Category): void {
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
      error: (error) => {
        this.showErrorMessage(this.translate.instant('SETTINGS.MESSAGES.DELETE_ERROR'));
        this.loading = false;
        console.error('Error deleting category:', error);
      }
    });
  }

  getCategoryName(category: Category): string {
    const currentLang = this.translate.currentLang;
    return currentLang === 'ar' ? category.name_ar : category.name_en;
  }

  getParentCategoryName(parentName: string): string {
    if (!parentName) return '';
    const parent = this.categories.find(cat => cat.name_en === parentName);
    return parent ? this.getCategoryName(parent) : parentName;
  }

  getChildCategories(parentCategory: Category): Category[] {
    return this.filteredCategories.filter(
      cat => cat.parent_category === parentCategory.name_en
    );
  }

  isParentCategory(category: Category): boolean {
    return !category.parent_category;
  }

  hasChildren(category: Category): boolean {
    return this.getChildCategories(category).length > 0;
  }

  showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.error = null;
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
  }

  showErrorMessage(message: string): void {
    this.error = message;
    this.successMessage = null;
  }

  clearMessages(): void {
    this.error = null;
    this.successMessage = null;
  }

  getCategoryCount(type: 'revenue' | 'expense' | 'investment'): number {
    return this.categories.filter(cat => cat.type === type && cat.is_active === 'true').length;
  }

  resetToDefaults(): void {
    if (!confirm(this.translate.instant('SETTINGS.RESET_CONFIRM'))) {
      return;
    }

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
