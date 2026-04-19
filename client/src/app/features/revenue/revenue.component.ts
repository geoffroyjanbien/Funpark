import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RevenueService, RevenueItem } from '../../services/revenue.service';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.css']
})
export class RevenueComponent implements OnInit {
  revenueItems: RevenueItem[] = [];
  filteredItems: RevenueItem[] = [];
  showForm = false;
  editingItem: RevenueItem | null = null;
  searchTerm = '';
  loading = false;
  error: string | null = null;

  revenueForm: FormGroup;

  constructor(
    private revenueService: RevenueService,
    private fb: FormBuilder
  ) {
    this.revenueForm = this.fb.group({
      date: ['', Validators.required],
      source: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadRevenue();
  }

  loadRevenue(): void {
    this.loading = true;
    this.error = null;
    this.revenueService.getAllRevenue().subscribe({
      next: (data) => {
        this.revenueItems = data;
        this.filteredItems = [...data];
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load revenue data';
        this.loading = false;
        console.error('Error loading revenue:', error);
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredItems = [...this.revenueItems];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredItems = this.revenueItems.filter(item =>
        item.source.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        item.amount.toString().includes(term)
      );
    }
  }

  openAddForm(): void {
    this.editingItem = null;
    this.revenueForm.reset();
    this.revenueForm.patchValue({
      date: new Date().toISOString().split('T')[0] // Today's date
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
    return this.revenueItems.reduce((total, item) => total + item.amount, 0);
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

  getSourceClass(source: string): string {
    return 'source-' + source.toLowerCase().replace(/\s+/g, '-');
  }
}
