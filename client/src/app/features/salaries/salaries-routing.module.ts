import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalariesComponent } from './salaries.component';

const routes: Routes = [
  { path: '', component: SalariesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalariesRoutingModule { }
