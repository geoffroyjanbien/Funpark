import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Category {
  id: string;
  type: 'revenue' | 'expense' | 'investment';
  name_en: string;
  name_ar: string;
  parent_category?: string;
  is_active: boolean;
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
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  getCategoriesByType(type: 'revenue' | 'expense' | 'investment'): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/type/${type}`).pipe(
      map(response => response.data)
    );
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<ApiResponse<Category>>(this.apiUrl, category).pipe(
      map(response => response.data)
    );
  }

  updateCategory(id: string, category: Partial<Category>): Observable<Category> {
    return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/${id}`, category).pipe(
      map(response => response.data)
    );
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => undefined)
    );
  }

  permanentDeleteCategory(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}/permanent`).pipe(
      map(() => undefined)
    );
  }
}
