import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RevenueItem {
  id?: string;
  date: string;
  source: string;
  amount: number;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RevenueService {
  private apiUrl = 'http://localhost:3000/api/revenue';

  constructor(private http: HttpClient) {}

  getAllRevenue(): Observable<RevenueItem[]> {
    return this.http.get<RevenueItem[]>(this.apiUrl);
  }

  getRevenueById(id: string): Observable<RevenueItem> {
    return this.http.get<RevenueItem>(`${this.apiUrl}/${id}`);
  }

  getRevenueWithLimit(limit: number): Observable<RevenueItem[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<RevenueItem[]>(this.apiUrl, { params });
  }

  createRevenue(revenue: Omit<RevenueItem, 'id'>): Observable<RevenueItem> {
    return this.http.post<RevenueItem>(this.apiUrl, revenue);
  }

  updateRevenue(id: string, revenue: Partial<RevenueItem>): Observable<RevenueItem> {
    return this.http.put<RevenueItem>(`${this.apiUrl}/${id}`, revenue);
  }

  deleteRevenue(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}