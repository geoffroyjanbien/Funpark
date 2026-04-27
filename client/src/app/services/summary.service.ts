import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export interface YearlySummary {
  month: string;
  year: string;
  total_revenue_ll: string;
  total_expenses_ll: string;
  balance_ll: string;
  owner1_share_ll: string;
  owner2_share_ll: string;
}

export interface MonthlySummary {
  month: string;
  year: number;
  total_revenue_ll: string;
  total_expenses_ll: string;
  balance_ll: string;
  owner1_share_ll: string;
  owner2_share_ll: string;
}

export interface DailySummary {
  date: string;
  total_revenue_ll: string;
  total_expenses_ll: string;
  balance_ll: string;
  owner1_share_ll: string;
  owner2_share_ll: string;
}

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  private apiUrl = `${environment.apiUrl}/summaries`;

  constructor(private http: HttpClient) {}

  getYearlySummary(year: number): Observable<YearlySummary | null> {
    const params = new HttpParams().set('year', year.toString());
    return this.http.get<ApiResponse<YearlySummary>>(`${this.apiUrl}/yearly`, { params }).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Summary API error:', error);
        return throwError(() => error);
      })
    );
  }

  getMonthlySummary(year: number, month: number): Observable<MonthlySummary> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());
    return this.http.get<ApiResponse<MonthlySummary>>(`${this.apiUrl}/monthly`, { params }).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Summary API error:', error);
        return throwError(() => error);
      })
    );
  }

  getDailySummary(date: string): Observable<DailySummary> {
    const params = new HttpParams().set('date', date);
    return this.http.get<ApiResponse<DailySummary>>(`${this.apiUrl}/daily`, { params }).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Summary API error:', error);
        return throwError(() => error);
      })
    );
  }

  recalculateSummaries(): Observable<{ message: string }> {
    return this.http.post<ApiResponse<{ message: string }>>(`${this.apiUrl}/recalculate`, {}).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Summary API error:', error);
        return throwError(() => error);
      })
    );
  }
}