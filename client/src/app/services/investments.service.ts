import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface InvestmentItem {
  id?: string;
  date: string;
  type: string;
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
export class InvestmentsService {
  private apiUrl = `${environment.apiUrl}/investments`;

  constructor(private http: HttpClient) {}

  getAllInvestments(): Observable<InvestmentItem[]> {
    return this.http.get<ApiResponse<InvestmentItem[]>>(this.apiUrl).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Investments API error:', error);
        return throwError(() => error);
      })
    );
  }

  getInvestmentById(id: string): Observable<InvestmentItem> {
    return this.http.get<ApiResponse<InvestmentItem>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Investments API error:', error);
        return throwError(() => error);
      })
    );
  }

  getInvestmentsWithLimit(limit: number): Observable<InvestmentItem[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<ApiResponse<InvestmentItem[]>>(this.apiUrl, { params }).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Investments API error:', error);
        return throwError(() => error);
      })
    );
  }

  createInvestment(investment: Omit<InvestmentItem, 'id'>): Observable<InvestmentItem> {
    return this.http.post<ApiResponse<InvestmentItem>>(this.apiUrl, investment).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Investments API error:', error);
        return throwError(() => error);
      })
    );
  }

  updateInvestment(id: string, investment: Partial<InvestmentItem>): Observable<InvestmentItem> {
    return this.http.put<ApiResponse<InvestmentItem>>(`${this.apiUrl}/${id}`, investment).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Investments API error:', error);
        return throwError(() => error);
      })
    );
  }

  deleteInvestment(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => void 0),
      catchError(error => {
        console.error('Investments API error:', error);
        return throwError(() => error);
      })
    );
  }
}