import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface ExpenseItem {
  id?: string;
  date: string;
  category: string;
  amount: number;
  description?: string;
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
export class ExpensesService {
  private apiUrl = 'http://localhost:3000/api/expenses';

  constructor(private http: HttpClient) {}

  getAllExpenses(): Observable<ExpenseItem[]> {
    return this.http.get<ApiResponse<ExpenseItem[]>>(this.apiUrl).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Expenses API error:', error);
        return throwError(() => error);
      })
    );
  }

  getExpenseById(id: string): Observable<ExpenseItem> {
    return this.http.get<ApiResponse<ExpenseItem>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Expenses API error:', error);
        return throwError(() => error);
      })
    );
  }

  getExpensesWithLimit(limit: number): Observable<ExpenseItem[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<ApiResponse<ExpenseItem[]>>(this.apiUrl, { params }).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Expenses API error:', error);
        return throwError(() => error);
      })
    );
  }

  createExpense(expense: Omit<ExpenseItem, 'id'>): Observable<ExpenseItem> {
    return this.http.post<ApiResponse<ExpenseItem>>(this.apiUrl, expense).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Expenses API error:', error);
        return throwError(() => error);
      })
    );
  }

  updateExpense(id: string, expense: Partial<ExpenseItem>): Observable<ExpenseItem> {
    return this.http.put<ApiResponse<ExpenseItem>>(`${this.apiUrl}/${id}`, expense).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Expenses API error:', error);
        return throwError(() => error);
      })
    );
  }

  deleteExpense(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => void 0),
      catchError(error => {
        console.error('Expenses API error:', error);
        return throwError(() => error);
      })
    );
  }
}