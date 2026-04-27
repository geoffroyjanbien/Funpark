import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface RevenueItem {
  id?: string;
  date: string;
  source: string;
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
export class RevenueService {
  private apiUrl = `${environment.apiUrl}/revenue`;

  constructor(private http: HttpClient) {}

  getAllRevenue(): Observable<RevenueItem[]> {
    return this.http.get<ApiResponse<RevenueItem[]>>(this.apiUrl).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Revenue API error:', error);
        return throwError(() => error);
      })
    );
  }

  getRevenueById(id: string): Observable<RevenueItem> {
    return this.http.get<ApiResponse<RevenueItem>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Revenue API error:', error);
        return throwError(() => error);
      })
    );
  }

  getRevenueWithLimit(limit: number): Observable<RevenueItem[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<ApiResponse<RevenueItem[]>>(this.apiUrl, { params }).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Revenue API error:', error);
        return throwError(() => error);
      })
    );
  }

  createRevenue(revenue: Omit<RevenueItem, 'id'>): Observable<RevenueItem> {
    return this.http.post<ApiResponse<RevenueItem>>(this.apiUrl, revenue).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Revenue API error:', error);
        return throwError(() => error);
      })
    );
  }

  updateRevenue(id: string, revenue: Partial<RevenueItem>): Observable<RevenueItem> {
    return this.http.put<ApiResponse<RevenueItem>>(`${this.apiUrl}/${id}`, revenue).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Revenue API error:', error);
        return throwError(() => error);
      })
    );
  }

  deleteRevenue(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => void 0),
      catchError(error => {
        console.error('Revenue API error:', error);
        return throwError(() => error);
      })
    );
  }
}