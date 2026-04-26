import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDatePipe } from '../pipes/custom-date.pipe';

@NgModule({
  declarations: [CustomDatePipe],
  imports: [CommonModule],
  exports: [CustomDatePipe]
})
export class SharedModule { }
