import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Employee {
  id?: string;
  name: string;
  position: string;
  monthly_salary: number;
  hire_date: string;
  status: 'active' | 'inactive';
}

export interface SalaryPayment {
  id?: string;
  employee_id: string;
  employee_name?: string;
  amount: number;
  payment_date: string;  // maps to 'date' in DB
  payment_type: 'full' | 'partial' | 'advance';
  month?: string;        // derived from date
  year?: number;         // derived from date
  notes?: string;        // maps to 'description' in DB
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalariesService {
  private apiUrl = `${environment.apiUrl}/salaries`;

  constructor(private http: HttpClient) {}

  // Employee Management
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<ApiResponse<Employee[]>>(`${this.apiUrl}/employees`).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Salaries API error:', error);
        return throwError(() => error);
      })
    );
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.http.get<ApiResponse<Employee>>(`${this.apiUrl}/employees/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Salaries API error:', error);
        return throwError(() => error);
      })
    );
  }

  createEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    return this.http.post<ApiResponse<Employee>>(`${this.apiUrl}/employees`, employee).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Salaries API error:', error);
        return throwError(() => error);
      })
    );
  }

  updateEmployee(id: string, employee: Partial<Employee>): Observable<Employee> {
    return this.http.put<ApiResponse<Employee>>(`${this.apiUrl}/employees/${id}`, employee).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Salaries API error:', error);
        return throwError(() => error);
      })
    );
  }

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/employees/${id}`).pipe(
      map(() => void 0),
      catchError(error => {
        console.error('Salaries API error:', error);
        return throwError(() => error);
      })
    );
  }

  // Salary Payments
  getAllPayments(): Observable<SalaryPayment[]> {
    return this.http.get<ApiResponse<SalaryPayment[]>>(`${this.apiUrl}/payments`).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Salaries API error:', error);
        return throwError(() => error);
      })
    );
  }

  getPaymentsByEmployee(employeeId: string): Observable<SalaryPayment[]> {
    return this.http.get<ApiResponse<SalaryPayment[]>>(`${this.apiUrl}/payments/employee/${employeeId}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Salaries API error:', error);
        return throwError(() => error);
      })
    );
  }

  getPaymentsByMonth(year: number, month: number): Observable<SalaryPayment[]> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());
    return this.http.get<ApiResponse<SalaryPayment[]>>(`${this.apiUrl}/payments/month`, { params }).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Salaries API error:', error);
        return throwError(() => error);
      })
    );
  }

  createPayment(payment: Omit<SalaryPayment, 'id'>): Observable<SalaryPayment> {
    return this.http.post<ApiResponse<SalaryPayment>>(`${this.apiUrl}/payments`, payment).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Salaries API error:', error);
        return throwError(() => error);
      })
    );
  }

  updatePayment(id: string, payment: Partial<SalaryPayment>): Observable<SalaryPayment> {
    return this.http.put<ApiResponse<SalaryPayment>>(`${this.apiUrl}/payments/${id}`, payment).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Salaries API error:', error);
        return throwError(() => error);
      })
    );
  }

  deletePayment(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/payments/${id}`).pipe(
      map(() => void 0),
      catchError(error => {
        console.error('Salaries API error:', error);
        return throwError(() => error);
      })
    );
  }

  // Summary
  getSalarySummary(year?: number, month?: number): Observable<any> {
    let params = new HttpParams();
    if (year) params = params.set('year', year.toString());
    if (month) params = params.set('month', month.toString());
    
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/summary`, { params }).pipe(
      map(response => response.data || { totalEmployees: 0, activeEmployees: 0, totalMonthlySalaries: 0, totalPaidThisMonth: 0, pendingPayments: 0 }),
      catchError(error => {
        console.error('Salaries API error:', error);
        return throwError(() => error);
      })
    );
  }

  getEmployeePaymentSummary(year: number, month: number): Observable<any> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());
    
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/employee-summary`, { params }).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Salaries API error:', error);
        return throwError(() => error);
      })
    );
  }
}
