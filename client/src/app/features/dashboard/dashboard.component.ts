import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Summary {
  totalRevenue: number;
  totalExpenses: number;
  totalInvestments: number;
  netProfit: number;
  ownerShare: number;
  partnerShare: number;
}

interface RevenueItem {
  date: string;
  source: string;
  amount: number;
}

interface ExpenseItem {
  date: string;
  category: string;
  amount: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  summary: Summary | null = null;
  recentRevenue: RevenueItem[] = [];
  recentExpenses: ExpenseItem[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSummary();
    this.loadRecentRevenue();
    this.loadRecentExpenses();
  }

  loadSummary(): void {
    this.http.get<Summary>('http://localhost:3000/api/summary').subscribe({
      next: (data) => {
        this.summary = data;
      },
      error: (error) => {
        console.error('Error loading summary:', error);
      }
    });
  }

  loadRecentRevenue(): void {
    this.http.get<RevenueItem[]>('http://localhost:3000/api/revenue?limit=5').subscribe({
      next: (data) => {
        this.recentRevenue = data;
      },
      error: (error) => {
        console.error('Error loading recent revenue:', error);
      }
    });
  }

  loadRecentExpenses(): void {
    this.http.get<ExpenseItem[]>('http://localhost:3000/api/expenses?limit=5').subscribe({
      next: (data) => {
        this.recentExpenses = data;
      },
      error: (error) => {
        console.error('Error loading recent expenses:', error);
      }
    });
  }
}