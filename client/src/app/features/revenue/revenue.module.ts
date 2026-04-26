import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RevenueComponent } from './revenue.component';
import { RevenueRoutingModule } from './revenue-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [RevenueComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RevenueRoutingModule,
    TranslateModule,
    SharedModule
  ]
})
export class RevenueModule { }
