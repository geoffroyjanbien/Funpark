import { Component, OnInit } from '@angular/core';
import { SummaryService } from '../../services/summary.service';
import { RevenueService, RevenueItem } from '../../services/revenue.service';
import { ExpensesService, ExpenseItem } from '../../services/expenses.service';

interface Summary {
  totalRevenue: number;
  totalExpenses: number;
  totalInvestments: number;
  netProfit: number;
  ownerShare: number;
  partnerShare: number;
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

  constructor(
    private summaryService: SummaryService,
    private revenueService: RevenueService,
    private expensesService: ExpensesService
  ) {}

  ngOnInit(): void {
    this.loadSummary();
    this.loadRecentRevenue();
    this.loadRecentExpenses();
  }

  loadSummary(): void {
    // Load yearly summary for current year
    const currentYear = new Date().getFullYear();
    this.summaryService.getYearlySummary(currentYear).subscribe({
      next: (data) => {
        this.summary = {
          totalRevenue: parseFloat(data?.total_revenue_ll || '0'),
          totalExpenses: parseFloat(data?.total_expenses_ll || '0'),
          totalInvestments: 0,
          netProfit: parseFloat(data?.balance_ll || '0'),
          ownerShare: parseFloat(data?.owner1_share_ll || '0'),
          partnerShare: parseFloat(data?.owner2_share_ll || '0')
        };
      },
      error: (error) => {
        console.error('Error loading summary:', error);
        // Set default values if API fails
        this.summary = {
          totalRevenue: 0,
          totalExpenses: 0,
          totalInvestments: 0,
          netProfit: 0,
          ownerShare: 0,
          partnerShare: 0
        };
      }
    });
  }

  loadRecentRevenue(): void {
    this.revenueService.getRevenueWithLimit(5).subscribe({
      next: (data) => {
        this.recentRevenue = data;
      },
      error: (error) => {
        console.error('Error loading recent revenue:', error);
        this.recentRevenue = [];
      }
    });
  }

  loadRecentExpenses(): void {
    this.expensesService.getExpensesWithLimit(5).subscribe({
      next: (data) => {
        this.recentExpenses = data;
      },
      error: (error) => {
        console.error('Error loading recent expenses:', error);
        this.recentExpenses = [];
      }
    });
  }
}
