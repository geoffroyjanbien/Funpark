import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDatePipe } from '../pipes/custom-date.pipe';
import { NormalizeKeyPipe } from '../pipes/normalize-key.pipe';

@NgModule({
  declarations: [CustomDatePipe, NormalizeKeyPipe],
  imports: [CommonModule],
  exports: [CustomDatePipe, NormalizeKeyPipe]
})
export class SharedModule { }
