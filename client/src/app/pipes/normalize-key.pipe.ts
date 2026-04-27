import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'normalizeKey'
})
export class NormalizeKeyPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    return value.toUpperCase().replace(/\s+/g, '_');
  }
}
