import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SummaryService, YearlySummary } from '../../services/summary.service';

interface SummaryData {
  totalRevenue: number;
  totalExpenses: number;
  totalInvestments: number;
  netProfit: number;
  ownerShare: number;
  partnerShare: number;
}

interface MonthlyData {
  month: string;
  year: number;
  revenue: number;
  expenses: number;
  investments: number;
  profit: number;
}

interface YearlyData {
  year: number;
  revenue: number;
  expenses: number;
  investments: number;
  profit: number;
  months: MonthlyData[];
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  summary: SummaryData | null = null;
  yearlyData: YearlyData[] = [];
  selectedYear: number = 2026;
  selectedMonth: number = 3;
  viewMode: 'yearly' | 'monthly' = 'monthly';
  availableYears: number[] = [];
  availableMonths: string[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private summaryService: SummaryService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.generateAvailableYears();
    this.loadSummary();
    this.loadMonths();
    
    // Load data based on initial view mode
    if (this.viewMode === 'monthly') {
      this.loadMonthlyData();
    } else {
      this.loadYearlyData();
    }
    
    this.translate.onLangChange.subscribe(() => {
      this.loadMonths();
    });
  }

  loadMonths(): void {
    this.availableMonths = [
      this.translate.instant('MONTHS.JANUARY'),
      this.translate.instant('MONTHS.FEBRUARY'),
      this.translate.instant('MONTHS.MARCH'),
      this.translate.instant('MONTHS.APRIL'),
      this.translate.instant('MONTHS.MAY'),
      this.translate.instant('MONTHS.JUNE'),
      this.translate.instant('MONTHS.JULY'),
      this.translate.instant('MONTHS.AUGUST'),
      this.translate.instant('MONTHS.SEPTEMBER'),
      this.translate.instant('MONTHS.OCTOBER'),
      this.translate.instant('MONTHS.NOVEMBER'),
      this.translate.instant('MONTHS.DECEMBER')
    ];
  }

  generateAvailableYears(): void {
    const currentYear = new Date().getFullYear();
    this.availableYears = [];
    for (let year = currentYear - 5; year <= currentYear + 1; year++) {
      this.availableYears.push(year);
    }
  }

  loadSummary(): void {
    // Calculate summary from yearlyData when available
    if (this.yearlyData.length > 0) {
      const data = this.yearlyData[0];
      const netProfit = data.profit;
      
      this.summary = {
        totalRevenue: data.revenue,
        totalExpenses: data.expenses,
        totalInvestments: data.investments,
        netProfit: netProfit,
        ownerShare: netProfit > 0 ? netProfit * 0.7 : 0,
        partnerShare: netProfit > 0 ? netProfit * 0.3 : 0
      };
    } else {
      this.summary = {
        totalRevenue: 0,
        totalExpenses: 0,
        totalInvestments: 0,
        netProfit: 0,
        ownerShare: 0,
        partnerShare: 0
      };
    }
  }

  loadYearlyData(): void {
    this.loading = true;
    this.error = null;

    this.summaryService.getYearlySummary(this.selectedYear).subscribe({
      next: (data: any) => {
        if (data) {
          // Convert monthly breakdown if available
          const months: MonthlyData[] = [];
          if (data.months && data.months.length > 0) {
            data.months.forEach((m: any) => {
              const monthIndex = parseInt(m.month) - 1;
              months.push({
                month: this.availableMonths[monthIndex],
                year: parseInt(m.year),
                revenue: parseFloat(m.total_revenue_ll || '0'),
                expenses: parseFloat(m.total_expenses_ll || '0'),
                investments: 0,
                profit: parseFloat(m.balance_ll || '0')
              });
            });
          }

          this.yearlyData = [{
            year: parseInt(data.year),
            revenue: parseFloat(data.total_revenue_ll || '0'),
            expenses: parseFloat(data.total_expenses_ll || '0'),
            investments: 0,
            profit: parseFloat(data.balance_ll || '0'),
            months: months
          }];
          
          // Update summary with actual data
          this.loadSummary();
        } else {
          this.yearlyData = [];
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load yearly data';
        this.loading = false;
        console.error('Error loading yearly data:', error);
      }
    });
  }

  loadMonthlyData(): void {
    this.loading = true;
    this.error = null;

    console.log('Loading monthly data for:', this.selectedYear, 'month:', this.selectedMonth + 1);
    
    this.summaryService.getMonthlySummary(this.selectedYear, this.selectedMonth + 1).subscribe({
      next: (data: any) => {
        console.log('Monthly data received:', data);
        if (data) {
          // Store monthly data in yearlyData structure for compatibility
          this.yearlyData = [{
            year: this.selectedYear,
            revenue: parseFloat(data.total_revenue_ll || '0'),
            expenses: parseFloat(data.total_expenses_ll || '0'),
            investments: 0,
            profit: parseFloat(data.balance_ll || '0'),
            months: [{
              month: this.availableMonths[this.selectedMonth],
              year: this.selectedYear,
              revenue: parseFloat(data.total_revenue_ll || '0'),
              expenses: parseFloat(data.total_expenses_ll || '0'),
              investments: 0,
              profit: parseFloat(data.balance_ll || '0')
            }]
          }];
          console.log('Processed yearlyData:', this.yearlyData);
          
          // Update summary with actual data
          this.loadSummary();
        } else {
          console.log('No data returned');
          this.yearlyData = [];
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load monthly data';
        this.loading = false;
        console.error('Error loading monthly data:', error);
      }
    });
  }

  generateMonthlyData(summary: SummaryData): MonthlyData[] {
    const months: MonthlyData[] = [];
    // Distribute the totals across months for demonstration
    // In a real implementation, this would come from actual monthly aggregations
    for (let i = 0; i < 12; i++) {
      const monthlyRevenue = Math.round(summary.totalRevenue / 12);
      const monthlyExpenses = Math.round(summary.totalExpenses / 12);
      const monthlyInvestments = Math.round(summary.totalInvestments / 12);
      const monthlyProfit = monthlyRevenue - monthlyExpenses;

      months.push({
        month: this.availableMonths[i],
        year: this.selectedYear,
        revenue: monthlyRevenue,
        expenses: monthlyExpenses,
        investments: monthlyInvestments,
        profit: monthlyProfit
      });
    }
    return months;
  }

  onYearChange(): void {
    if (this.viewMode === 'monthly') {
      this.loadMonthlyData();
    } else {
      this.loadYearlyData();
    }
  }

  onMonthChange(): void {
    if (this.viewMode === 'monthly') {
      this.loadMonthlyData();
    }
  }

  onViewModeChange(): void {
    if (this.viewMode === 'monthly') {
      this.loadMonthlyData();
    } else {
      this.loadYearlyData();
    }
  }

  getCurrentYearData(): YearlyData | null {
    return this.yearlyData.length > 0 ? this.yearlyData[0] : null;
  }

  getCurrentMonthData(): MonthlyData | null {
    const yearData = this.getCurrentYearData();
    if (yearData && yearData.months && yearData.months.length > 0) {
      return yearData.months[0];
    }
    return null;
  }

  getProfitMargin(amount: number, total: number): number {
    return total > 0 ? (amount / total) * 100 : 0;
  }
}
