import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'revenue', loadChildren: () => import('./features/revenue/revenue.module').then(m => m.RevenueModule) },
  { path: 'expenses', loadChildren: () => import('./features/expenses/expenses.module').then(m => m.ExpensesModule) },
  { path: 'investments', loadChildren: () => import('./features/investments/investments.module').then(m => m.InvestmentsModule) },
  { path: 'reports', loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule) },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }