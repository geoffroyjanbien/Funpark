import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'roleTranslate',
  pure: false
})
export class RoleTranslatePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(role: string): string {
    if (!role) return '';
    const key = 'ROLES.' + role.toUpperCase();
    return this.translate.instant(key);
  }
}
