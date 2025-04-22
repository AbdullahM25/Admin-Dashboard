import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform<T>(
    items: T[],
    term: string,
    field: keyof T
  ): T[] {
    if (!term) return items;
    const lowerTerm = term.toLowerCase();
    return items.filter(item => {
      const value = String(item[field]).toLowerCase();
      // For status field, require exact match
      if (field === 'status') {
        return value === lowerTerm;
      }
      // Otherwise, substring match
      return value.includes(lowerTerm);
    });
  }
}
