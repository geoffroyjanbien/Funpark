import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { InvestmentsComponent } from './investments.component';
import { InvestmentsRoutingModule } from './investments-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [InvestmentsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InvestmentsRoutingModule,
    TranslateModule,
    SharedModule
  ]
})
export class InvestmentsModule { }
