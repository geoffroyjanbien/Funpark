import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './features/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
  { path: 'revenue', loadChildren: () => import('./features/revenue/revenue.module').then(m => m.RevenueModule), canActivate: [AuthGuard] },
  { path: 'expenses', loadChildren: () => import('./features/expenses/expenses.module').then(m => m.ExpensesModule), canActivate: [AuthGuard] },
  { path: 'investments', loadChildren: () => import('./features/investments/investments.module').then(m => m.InvestmentsModule), canActivate: [AuthGuard] },
  { path: 'salaries', loadChildren: () => import('./features/salaries/salaries.module').then(m => m.SalariesModule), canActivate: [AuthGuard] },
  { path: 'reports', loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule), canActivate: [AuthGuard] },
  { path: 'settings', loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule), canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }