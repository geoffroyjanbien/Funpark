import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RevenueComponent } from './revenue.component';
import { RevenueRoutingModule } from './revenue-routing.module';

@NgModule({
  declarations: [RevenueComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RevenueRoutingModule
  ]
})
export class RevenueModule { }
