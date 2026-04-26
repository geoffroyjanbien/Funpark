export interface GroupedData<T> {
  groupKey: string;
  groupValue: any;
  items: T[];
  total?: number;
  expanded?: boolean;
}

export class TableGroupingService {
  static groupBy<T>(items: T[], groupByField: string | null): GroupedData<T>[] {
    if (!groupByField || groupByField === 'none') {
      return [{
        groupKey: 'all',
        groupValue: 'All Items',
        items: items,
        total: items.reduce((sum, item: any) => sum + (item.amount || 0), 0),
        expanded: true
      }];
    }

    const groups = new Map<any, T[]>();
    
    items.forEach(item => {
      const value = (item as any)[groupByField];
      const key = value || 'N/A';
      
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(item);
    });

    const result: GroupedData<T>[] = [];
    groups.forEach((groupItems, key) => {
      result.push({
        groupKey: key,
        groupValue: key,
        items: groupItems,
        total: groupItems.reduce((sum, item: any) => sum + (item.amount || 0), 0),
        expanded: true
      });
    });

    return result.sort((a, b) => a.groupKey.localeCompare(b.groupKey));
  }
}
