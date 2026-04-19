import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestmentsComponent } from './investments.component';
import { InvestmentsRoutingModule } from './investments-routing.module';

@NgModule({
  declarations: [InvestmentsComponent],
  imports: [CommonModule, InvestmentsRoutingModule]
})
export class InvestmentsModule { }
