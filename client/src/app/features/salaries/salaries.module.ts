import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SalariesRoutingModule } from './salaries-routing.module';
import { SalariesComponent } from './salaries.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    SalariesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    SalariesRoutingModule,
    SharedModule
  ]
})
export class SalariesModule { }
