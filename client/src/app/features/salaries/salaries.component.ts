import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalariesService, Employee, SalaryPayment } from '../../services/salaries.service';

@Component({
  selector: 'app-salaries',
  templateUrl: './salaries.component.html',
  styleUrls: ['./salaries.component.css']
})
export class SalariesComponent implements OnInit {
  activeTab: 'employees' | 'payments' | 'summary' = 'employees';
  
  // Employees
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  employeeForm!: FormGroup;
  showEmployeeForm = false;
  editingEmployee: Employee | null = null;
  
  // Payments
  payments: SalaryPayment[] = [];
  filteredPayments: SalaryPayment[] = [];
  paymentForm!: FormGroup;
  showPaymentForm = false;
  editingPayment: SalaryPayment | null = null;
  
  // Filters
  searchTerm = '';
  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth();
  statusFilter = 'all';
  
  // UI State
  loading = false;
  error: string | null = null;
  selectedEmployeeIds = new Set<string>();
  selectedPaymentIds = new Set<string>();
  bulkDeleting = false;
  
  // Summary
  summary = {
    totalEmployees: 0,
    activeEmployees: 0,
    totalMonthlySalaries: 0,
    totalPaidThisMonth: 0,
    pendingPayments: 0
  };

  employeePaymentSummary: any = null;

  availableYears: number[] = [];
  availableMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(
    private fb: FormBuilder,
    private salariesService: SalariesService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.generateYears();
    this.loadData();
  }

  initializeForms(): void {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      position: ['', Validators.required],
      monthly_salary: ['', [Validators.required, Validators.min(0)]],
      hire_date: ['', Validators.required],
      status: ['active', Validators.required]
    });

    this.paymentForm = this.fb.group({
      employee_id: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      payment_date: ['', Validators.required],
      payment_type: ['partial', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      notes: ['']
    });
  }

  generateYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      this.availableYears.push(i);
    }
  }

  loadData(): void {
    this.loadEmployees();
    this.loadPayments();
    this.loadSummary();
  }

  loadEmployees(): void {
    this.loading = true;
    this.salariesService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data || [];
        this.applyEmployeeFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.error = 'Failed to load employees. Please add employees in Settings first.';
        this.employees = [];
        this.filteredEmployees = [];
        this.loading = false;
      }
    });
  }

  loadPayments(): void {
    this.loading = true;
    this.salariesService.getAllPayments().subscribe({
      next: (data) => {
        this.payments = data || [];
        this.applyPaymentFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.error = 'Failed to load payments';
        this.payments = [];
        this.filteredPayments = [];
        this.loading = false;
      }
    });
  }

  loadSummary(): void {
    this.salariesService.getSalarySummary(this.selectedYear, this.selectedMonth + 1).subscribe({
      next: (data) => {
        this.summary = data || {
          totalEmployees: 0,
          activeEmployees: 0,
          totalMonthlySalaries: 0,
          totalPaidThisMonth: 0,
          pendingPayments: 0
        };
      },
      error: (error) => {
        console.error('Failed to load summary:', error);
        this.summary = {
          totalEmployees: 0,
          activeEmployees: 0,
          totalMonthlySalaries: 0,
          totalPaidThisMonth: 0,
          pendingPayments: 0
        };
      }
    });

    // Load detailed employee payment summary
    this.salariesService.getEmployeePaymentSummary(this.selectedYear, this.selectedMonth + 1).subscribe({
      next: (data) => {
        this.employeePaymentSummary = data;
      },
      error: (error) => {
        console.error('Failed to load employee payment summary:', error);
        this.employeePaymentSummary = null;
      }
    });
  }

  // Employee Methods
  openEmployeeForm(employee?: Employee): void {
    this.editingEmployee = employee || null;
    if (employee) {
      this.employeeForm.patchValue(employee);
    } else {
      this.employeeForm.reset({ status: 'active' });
    }
    this.showEmployeeForm = true;
  }

  closeEmployeeForm(): void {
    this.showEmployeeForm = false;
    this.editingEmployee = null;
    this.employeeForm.reset();
  }

  submitEmployee(): void {
    if (this.employeeForm.invalid) return;

    const employeeData = this.employeeForm.value;
    
    if (this.editingEmployee) {
      this.salariesService.updateEmployee(this.editingEmployee.id!, employeeData).subscribe({
        next: () => {
          this.loadData();
          this.closeEmployeeForm();
        },
        error: (error) => {
          this.error = 'Failed to update employee';
        }
      });
    } else {
      this.salariesService.createEmployee(employeeData).subscribe({
        next: () => {
          this.loadData();
          this.closeEmployeeForm();
        },
        error: (error) => {
          this.error = 'Failed to create employee';
        }
      });
    }
  }

  deleteEmployee(employee: Employee): void {
    if (!confirm(`Are you sure you want to delete ${employee.name}?`)) return;
    
    this.salariesService.deleteEmployee(employee.id!).subscribe({
      next: () => { this.loadData(); },
      error: () => { this.error = 'Failed to delete employee'; }
    });
  }

  bulkDeleteEmployees(): void {
    if (!this.selectedEmployeeIds.size || !confirm(`Delete ${this.selectedEmployeeIds.size} employees?`)) return;
    this.bulkDeleting = true;
    Promise.all(Array.from(this.selectedEmployeeIds).map(id => this.salariesService.deleteEmployee(id).toPromise()))
      .then(() => { this.selectedEmployeeIds.clear(); this.loadData(); })
      .catch(() => { this.error = 'Failed to delete some employees'; })
      .finally(() => { this.bulkDeleting = false; });
  }

  get allEmployeesSelected(): boolean {
    return this.filteredEmployees.length > 0 && this.filteredEmployees.every(e => this.selectedEmployeeIds.has(e.id!));
  }

  toggleSelectAllEmployees(): void {
    if (this.allEmployeesSelected) {
      this.filteredEmployees.forEach(e => this.selectedEmployeeIds.delete(e.id!));
    } else {
      this.filteredEmployees.forEach(e => this.selectedEmployeeIds.add(e.id!));
    }
  }

  // Payment Methods
  openPaymentForm(payment?: SalaryPayment): void {
    this.editingPayment = payment || null;
    if (payment) {
      this.paymentForm.patchValue(payment);
    } else {
      const today = new Date().toISOString().split('T')[0];
      this.paymentForm.reset({
        payment_date: today,
        payment_type: 'partial',
        month: this.availableMonths[this.selectedMonth],
        year: this.selectedYear
      });
    }
    this.showPaymentForm = true;
  }

  closePaymentForm(): void {
    this.showPaymentForm = false;
    this.editingPayment = null;
    this.paymentForm.reset();
  }

  submitPayment(): void {
    if (this.paymentForm.invalid) {
      console.log('Form invalid:', this.paymentForm.errors);
      return;
    }

    const paymentData = this.paymentForm.value;
    console.log('Submitting payment:', paymentData);
    
    if (this.editingPayment) {
      this.salariesService.updatePayment(this.editingPayment.id!, paymentData).subscribe({
        next: (response) => {
          console.log('Payment updated:', response);
          this.loadData();
          this.closePaymentForm();
        },
        error: (error) => {
          console.error('Update error:', error);
          this.error = 'Failed to update payment';
        }
      });
    } else {
      this.salariesService.createPayment(paymentData).subscribe({
        next: (response) => {
          console.log('Payment created:', response);
          this.loadData();
          this.closePaymentForm();
        },
        error: (error) => {
          console.error('Create error:', error);
          this.error = 'Failed to create payment';
        }
      });
    }
  }

  deletePayment(payment: SalaryPayment): void {
    if (!confirm('Are you sure you want to delete this payment?')) return;
    
    this.salariesService.deletePayment(payment.id!).subscribe({
      next: () => { this.loadData(); },
      error: () => { this.error = 'Failed to delete payment'; }
    });
  }

  bulkDeletePayments(): void {
    if (!this.selectedPaymentIds.size || !confirm(`Delete ${this.selectedPaymentIds.size} payments?`)) return;
    this.bulkDeleting = true;
    Promise.all(Array.from(this.selectedPaymentIds).map(id => this.salariesService.deletePayment(id).toPromise()))
      .then(() => { this.selectedPaymentIds.clear(); this.loadData(); })
      .catch(() => { this.error = 'Failed to delete some payments'; })
      .finally(() => { this.bulkDeleting = false; });
  }

  get allPaymentsSelected(): boolean {
    return this.filteredPayments.length > 0 && this.filteredPayments.every(p => this.selectedPaymentIds.has(p.id!));
  }

  toggleSelectAllPayments(): void {
    if (this.allPaymentsSelected) {
      this.filteredPayments.forEach(p => this.selectedPaymentIds.delete(p.id!));
    } else {
      this.filteredPayments.forEach(p => this.selectedPaymentIds.add(p.id!));
    }
  }

  // Filters
  applyEmployeeFilters(): void {
    this.filteredEmployees = this.employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           emp.position.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.statusFilter === 'all' || emp.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  applyPaymentFilters(): void {
    this.filteredPayments = this.payments.filter(payment => {
      const paymentYear = typeof payment.year === 'string' ? parseInt(payment.year) : payment.year;
      const matchesYear = paymentYear === this.selectedYear;
      const matchesMonth = payment.month === this.availableMonths[this.selectedMonth];
      return matchesYear && matchesMonth;
    });
    console.log('Filtered payments:', this.filteredPayments);
    console.log('All payments:', this.payments);
    console.log('Selected year:', this.selectedYear, 'Selected month:', this.availableMonths[this.selectedMonth]);
  }

  onSearch(): void {
    if (this.activeTab === 'employees') {
      this.applyEmployeeFilters();
    }
  }

  onFilterChange(): void {
    if (this.activeTab === 'employees') {
      this.applyEmployeeFilters();
    } else {
      this.applyPaymentFilters();
      this.loadSummary();
    }
  }

  switchTab(tab: 'employees' | 'payments' | 'summary'): void {
    this.activeTab = tab;
    this.searchTerm = '';
  }

  getEmployeeName(employeeId: string): string {
    const employee = this.employees.find(e => e.id === employeeId);
    return employee ? employee.name : 'Unknown';
  }

  getTotalPaidForEmployee(employeeId: string): number {
    return this.filteredPayments
      .filter(p => p.employee_id === employeeId)
      .reduce((sum, p) => sum + p.amount, 0);
  }

  trackById(index: number, item: any): string {
    return item.id;
  }
}
