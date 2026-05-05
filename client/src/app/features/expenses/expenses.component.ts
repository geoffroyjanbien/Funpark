import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ExpensesService, ExpenseItem } from '../../services/expenses.service';
import { CategoryService, Category } from '../../services/category.service';
import { TableGroupingService, GroupedData } from '../../shared/table-grouping.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {
  expenseItems: ExpenseItem[] = [];
  filteredItems: ExpenseItem[] = [];
  groupedData: GroupedData<ExpenseItem>[] = [];
  groupByField: string = 'none';
  showForm = false;
  editingItem: ExpenseItem | null = null;
  searchTerm = '';
  loading = false;
  error: string | null = null;
  selectedIds = new Set<string>();
  bulkDeleting = false;

  // Categories
  expenseCategories: Category[] = [];

  // Date filtering
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth();
  viewMode: 'all' | 'yearly' | 'monthly' | 'daily' = 'all';
  availableYears: number[] = [];
  availableMonths: string[] = [];

  expenseForm: FormGroup;

  constructor(
    private expensesService: ExpensesService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private translate: TranslateService,
    public authService: AuthService
  ) {
    this.expenseForm = this.fb.group({
      date: ['', Validators.required],
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.generateAvailableYears();
    this.loadMonths();
    this.loadCategories();
    this.loadExpenses();
    
    this.translate.onLangChange.subscribe(() => {
      this.loadMonths();
      this.applyGrouping(); // Re-translate group values
    });
  }

  loadCategories(): void {
    this.categoryService.getCategoriesByType('expense').subscribe({
      next: (data) => {
        this.expenseCategories = data;
      },
      error: (error) => {
        console.error('Error loading expense categories:', error);
      }
    });
  }

  getCategoryName(category: Category): string {
    const currentLang = this.translate.currentLang;
    return currentLang === 'ar' ? category.name_ar : category.name_en;
  }

  getParentCategories(): Category[] {
    return this.expenseCategories.filter(cat => !cat.parent_category);
  }

  getChildCategories(parentName: string): Category[] {
    return this.expenseCategories.filter(cat => cat.parent_category === parentName);
  }

  loadMonths(): void {
    this.availableMonths = [
      this.translate.instant('MONTHS.JANUARY'),
      this.translate.instant('MONTHS.FEBRUARY'),
      this.translate.instant('MONTHS.MARCH'),
      this.translate.instant('MONTHS.APRIL'),
      this.translate.instant('MONTHS.MAY'),
      this.translate.instant('MONTHS.JUNE'),
      this.translate.instant('MONTHS.JULY'),
      this.translate.instant('MONTHS.AUGUST'),
      this.translate.instant('MONTHS.SEPTEMBER'),
      this.translate.instant('MONTHS.OCTOBER'),
      this.translate.instant('MONTHS.NOVEMBER'),
      this.translate.instant('MONTHS.DECEMBER')
    ];
  }

  loadExpenses(): void {
    this.loading = true;
    this.error = null;
    this.expensesService.getAllExpenses().subscribe({
      next: (data) => {
        this.expenseItems = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load expenses data';
        this.loading = false;
        console.error('Error loading expenses:', error);
      }
    });
  }

  generateAvailableYears(): void {
    const currentYear = new Date().getFullYear();
    this.availableYears = [];
    for (let year = currentYear - 5; year <= currentYear + 1; year++) {
      this.availableYears.push(year);
    }
  }

  applyFilters(): void {
    let filtered = [...this.expenseItems];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.category.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        item.amount.toString().includes(term)
      );
    }

    // Apply date filters based on view mode
    if (this.viewMode === 'yearly') {
      filtered = filtered.filter(item => {
        if (!item.date) return false;
        const itemDate = new Date(item.date);
        const itemYear = itemDate.getFullYear();
        return itemYear === this.selectedYear;
      });
    } else if (this.viewMode === 'monthly') {
      filtered = filtered.filter(item => {
        if (!item.date) return false;
        const itemDate = new Date(item.date);
        const itemYear = itemDate.getFullYear();
        const itemMonth = itemDate.getMonth();
        return itemYear === this.selectedYear && itemMonth === this.selectedMonth;
      });
    } else if (this.viewMode === 'daily') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter(item => {
        if (!item.date) return false;
        const itemDate = new Date(item.date);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate.getTime() === today.getTime();
      });
    }
    // If viewMode is 'all', no date filtering is applied

    this.filteredItems = filtered;
    this.applyGrouping();
  }

  applyGrouping(): void {
    this.groupedData = TableGroupingService.groupBy(this.filteredItems, this.groupByField);
    // Translate group values
    if (this.groupByField === 'category') {
      this.groupedData.forEach(group => {
        const normalizedKey = group.groupKey.toUpperCase().replace(/\s+/g, '_');
        group.groupValue = this.translate.instant('EXPENSES.CATEGORIES.' + normalizedKey);
      });
    } else if (this.groupByField === 'date') {
      this.groupedData.forEach(group => {
        if (group.groupKey !== 'all') {
          const date = new Date(group.groupKey);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          group.groupValue = `${day}/${month}/${year}`;
        }
      });
    }
  }

  onGroupByChange(): void {
    this.applyGrouping();
  }

  toggleGroup(group: GroupedData<ExpenseItem>): void {
    group.expanded = !group.expanded;
  }

  expandAll(): void {
    this.groupedData.forEach(group => group.expanded = true);
  }

  collapseAll(): void {
    this.groupedData.forEach(group => group.expanded = false);
  }

  onSearch(): void {
    this.applyFilters();
  }

  onViewModeChange(): void {
    this.applyFilters();
  }

  onYearChange(): void {
    this.applyFilters();
  }

  onMonthChange(): void {
    this.applyFilters();
  }

  openAddForm(): void {
    this.editingItem = null;
    this.expenseForm.reset();
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    this.expenseForm.patchValue({
      date: `${year}-${month}-${day}`
    });
    this.showForm = true;
  }

  editItem(item: ExpenseItem): void {
    this.editingItem = item;
    this.expenseForm.patchValue({
      date: item.date,
      category: item.category,
      amount: item.amount,
      description: item.description || ''
    });
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingItem = null;
    this.expenseForm.reset();
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      const formValue = this.expenseForm.value;

      if (this.editingItem) {
        // Update existing item
        this.expensesService.updateExpense(this.editingItem.id!, formValue).subscribe({
          next: () => {
            this.loadExpenses();
            this.cancelForm();
          },
          error: (error) => {
            this.error = 'Failed to update expense item';
            console.error('Error updating expense:', error);
          }
        });
      } else {
        // Create new item
        this.expensesService.createExpense(formValue).subscribe({
          next: () => {
            this.loadExpenses();
            this.cancelForm();
          },
          error: (error) => {
            this.error = 'Failed to create expense item';
            console.error('Error creating expense:', error);
          }
        });
      }
    } else {
      this.expenseForm.markAllAsTouched();
    }
  }

  deleteItem(item: ExpenseItem): void {
    if (confirm(`Are you sure you want to delete this ${item.category} expense?`)) {
      this.expensesService.deleteExpense(item.id!).subscribe({
        next: () => {
          this.loadExpenses();
        },
        error: (error) => {
          this.error = 'Failed to delete expense item';
          console.error('Error deleting expense:', error);
        }
      });
    }
  }

  getTotalExpenses(): number {
    return this.filteredItems.reduce((total, item) => total + item.amount, 0);
  }

  getFormFieldError(fieldName: string): string {
    const field = this.expenseForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['min']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be positive`;
      }
    }
    return '';
  }

  trackById(index: number, item: ExpenseItem): string {
    return item.id || index.toString();
  }

  toggleSelection(id: string): void {
    this.selectedIds.has(id) ? this.selectedIds.delete(id) : this.selectedIds.add(id);
  }

  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }

  get allVisibleSelected(): boolean {
    return this.filteredItems.length > 0 && this.filteredItems.every(i => this.selectedIds.has(i.id!));
  }

  toggleSelectAll(): void {
    if (this.allVisibleSelected) {
      this.filteredItems.forEach(i => this.selectedIds.delete(i.id!));
    } else {
      this.filteredItems.forEach(i => this.selectedIds.add(i.id!));
    }
  }

  bulkDelete(): void {
    if (!this.selectedIds.size || !confirm(`Delete ${this.selectedIds.size} selected items?`)) return;
    this.bulkDeleting = true;
    const ids = Array.from(this.selectedIds);
    Promise.all(ids.map(id => this.expensesService.deleteExpense(id).toPromise()))
      .then(() => { this.selectedIds.clear(); this.loadExpenses(); })
      .catch(() => { this.error = 'Failed to delete some items'; })
      .finally(() => { this.bulkDeleting = false; });
  }

  getCategoryClass(category: string): string {
    return 'category-' + category.toLowerCase().replace(/\s+/g, '-');
  }
}
