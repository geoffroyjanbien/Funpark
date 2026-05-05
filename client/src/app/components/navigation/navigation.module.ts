import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { NavigationComponent } from './navigation.component';
import { RoleTranslatePipe } from '../../pipes/role-translate.pipe';

@NgModule({
  declarations: [NavigationComponent, RoleTranslatePipe],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule
  ],
  exports: [NavigationComponent]
})
export class NavigationModule { }