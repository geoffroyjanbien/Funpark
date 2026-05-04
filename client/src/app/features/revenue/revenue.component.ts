import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { RevenueService, RevenueItem } from '../../services/revenue.service';
import { CategoryService, Category } from '../../services/category.service';
import { TableGroupingService, GroupedData } from '../../shared/table-grouping.service';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.css']
})
export class RevenueComponent implements OnInit {
  revenueItems: RevenueItem[] = [];
  filteredItems: RevenueItem[] = [];
  groupedData: GroupedData<RevenueItem>[] = [];
  groupByField: string = 'none';
  showForm = false;
  editingItem: RevenueItem | null = null;
  searchTerm = '';
  loading = false;
  error: string | null = null;
  selectedIds = new Set<string>();
  bulkDeleting = false;

  // Categories
  revenueCategories: Category[] = [];

  // Date filtering
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth();
  viewMode: 'all' | 'yearly' | 'monthly' | 'daily' = 'all';
  availableYears: number[] = [];
  availableMonths: string[] = [];

  revenueForm: FormGroup;

  constructor(
    private revenueService: RevenueService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.revenueForm = this.fb.group({
      date: ['', Validators.required],
      source: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.generateAvailableYears();
    this.loadMonths();
    this.loadCategories();
    this.loadRevenue();
    
    // Reload months when language changes
    this.translate.onLangChange.subscribe(() => {
      this.loadMonths();
      this.applyGrouping(); // Re-translate group values
    });
  }

  loadCategories(): void {
    this.categoryService.getCategoriesByType('revenue').subscribe({
      next: (data) => {
        this.revenueCategories = data;
      },
      error: (error) => {
        console.error('Error loading revenue categories:', error);
      }
    });
  }

  getCategoryName(category: Category): string {
    const currentLang = this.translate.currentLang;
    return currentLang === 'ar' ? category.name_ar : category.name_en;
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

  generateAvailableYears(): void {
    const currentYear = new Date().getFullYear();
    this.availableYears = [];
    for (let year = currentYear - 5; year <= currentYear + 1; year++) {
      this.availableYears.push(year);
    }
  }

  loadRevenue(): void {
    this.loading = true;
    this.error = null;
    this.revenueService.getAllRevenue().subscribe({
      next: (data) => {
        this.revenueItems = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load revenue data';
        this.loading = false;
        console.error('Error loading revenue:', error);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.revenueItems];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.source.toLowerCase().includes(term) ||
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

    this.filteredItems = filtered;
    this.applyGrouping();
  }

  applyGrouping(): void {
    this.groupedData = TableGroupingService.groupBy(this.filteredItems, this.groupByField);
    // Translate group values
    if (this.groupByField === 'source') {
      this.groupedData.forEach(group => {
        const normalizedKey = group.groupKey.toUpperCase().replace(/\s+/g, '_');
        group.groupValue = this.translate.instant('REVENUE.SOURCES.' + normalizedKey);
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

  toggleGroup(group: GroupedData<RevenueItem>): void {
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
    this.revenueForm.reset();
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    this.revenueForm.patchValue({
      date: `${year}-${month}-${day}`
    });
    this.showForm = true;
  }

  editItem(item: RevenueItem): void {
    this.editingItem = item;
    this.revenueForm.patchValue({
      date: item.date,
      source: item.source,
      amount: item.amount,
      description: item.description || ''
    });
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingItem = null;
    this.revenueForm.reset();
  }

  onSubmit(): void {
    if (this.revenueForm.valid) {
      const formValue = this.revenueForm.value;

      if (this.editingItem) {
        // Update existing item
        this.revenueService.updateRevenue(this.editingItem.id!, formValue).subscribe({
          next: () => {
            this.loadRevenue();
            this.cancelForm();
          },
          error: (error) => {
            this.error = 'Failed to update revenue item';
            console.error('Error updating revenue:', error);
          }
        });
      } else {
        // Create new item
        this.revenueService.createRevenue(formValue).subscribe({
          next: () => {
            this.loadRevenue();
            this.cancelForm();
          },
          error: (error) => {
            this.error = 'Failed to create revenue item';
            console.error('Error creating revenue:', error);
          }
        });
      }
    } else {
      this.revenueForm.markAllAsTouched();
    }
  }

  deleteItem(item: RevenueItem): void {
    if (confirm(`Are you sure you want to delete this ${item.source} revenue entry?`)) {
      this.revenueService.deleteRevenue(item.id!).subscribe({
        next: () => {
          this.loadRevenue();
        },
        error: (error) => {
          this.error = 'Failed to delete revenue item';
          console.error('Error deleting revenue:', error);
        }
      });
    }
  }

  getTotalRevenue(): number {
    return this.filteredItems.reduce((total, item) => total + item.amount, 0);
  }

  getFormFieldError(fieldName: string): string {
    const field = this.revenueForm.get(fieldName);
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

  trackById(index: number, item: RevenueItem): string {
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
    Promise.all(ids.map(id => this.revenueService.deleteRevenue(id).toPromise()))
      .then(() => { this.selectedIds.clear(); this.loadRevenue(); })
      .catch(() => { this.error = 'Failed to delete some items'; })
      .finally(() => { this.bulkDeleting = false; });
  }

  getSourceClass(source: string): string {
    return 'source-' + source.toLowerCase().replace(/\s+/g, '-');
  }
}
