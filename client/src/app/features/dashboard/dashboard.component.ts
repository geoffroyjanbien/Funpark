import { Component, OnInit } from '@angular/core';
import { SummaryService } from '../../services/summary.service';
import { RevenueService, RevenueItem } from '../../services/revenue.service';
import { ExpensesService, ExpenseItem } from '../../services/expenses.service';
import { SalariesService } from '../../services/salaries.service';

interface Summary {
  totalRevenue: number;
  totalExpenses: number;
  totalInvestments: number;
  totalSalaries: number;
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
    private expensesService: ExpensesService,
    private salariesService: SalariesService
  ) {}

  ngOnInit(): void {
    this.loadSummary();
    this.loadRecentRevenue();
    this.loadRecentExpenses();
  }

  loadSummary(): void {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    this.summaryService.getYearlySummary(currentYear).subscribe({
      next: (data) => {
        this.summary = {
          totalRevenue: parseFloat(data?.total_revenue_ll || '0'),
          totalExpenses: parseFloat(data?.total_expenses_ll || '0'),
          totalInvestments: 0,
          totalSalaries: 0,
          netProfit: parseFloat(data?.balance_ll || '0'),
          ownerShare: parseFloat(data?.owner1_share_ll || '0'),
          partnerShare: parseFloat(data?.owner2_share_ll || '0')
        };
        
        // Load salaries summary
        this.salariesService.getSalarySummary(currentYear, currentMonth).subscribe({
          next: (salaryData) => {
            if (this.summary) {
              this.summary.totalSalaries = salaryData.totalPaidThisMonth || 0;
              // Recalculate net profit deducting salaries
              this.summary.netProfit = this.summary.totalRevenue - this.summary.totalExpenses - this.summary.totalSalaries;
              this.summary.ownerShare = this.summary.netProfit * 0.7;
              this.summary.partnerShare = this.summary.netProfit * 0.3;
            }
          },
          error: (error) => {
            console.error('Error loading salaries:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error loading summary:', error);
        this.summary = {
          totalRevenue: 0,
          totalExpenses: 0,
          totalInvestments: 0,
          totalSalaries: 0,
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
