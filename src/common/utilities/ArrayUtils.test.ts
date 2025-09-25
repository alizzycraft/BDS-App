/**
 * Test file for ArrayUtils
 */

import { groupBy, uniqueBy } from './ArrayUtils';

describe('ArrayUtils', () => {
  describe('groupBy', () => {
    it('should group items by a key function', () => {
      const items = [
        { name: 'Alice', department: 'Engineering' },
        { name: 'Bob', department: 'Engineering' },
        { name: 'Charlie', department: 'Marketing' },
        { name: 'David', department: 'Marketing' }
      ];

      const grouped = groupBy(items, item => item.department);

      expect(grouped).toEqual({
        Engineering: [
          { name: 'Alice', department: 'Engineering' },
          { name: 'Bob', department: 'Engineering' }
        ],
        Marketing: [
          { name: 'Charlie', department: 'Marketing' },
          { name: 'David', department: 'Marketing' }
        ]
      });
    });
  });

  describe('uniqueBy', () => {
    it('should remove duplicate items based on a key function', () => {
      const items = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 1, name: 'Alice Duplicate' },
        { id: 3, name: 'Charlie' }
      ];

      const unique = uniqueBy(items, item => item.id);

      expect(unique).toEqual([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' }
      ]);
    });
  });
});