/**
 * Utility functions for array operations
 */

/**
 * Groups an array of items by a key function
 * @param array The array to group
 * @param keyFn A function that returns the key to group by
 * @returns An object with keys as group identifiers and values as arrays of items
 */
export function groupBy<T, K extends string | number>(array: T[], keyFn: (item: T) => K): Record<K, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    (groups[key] = groups[key] || []).push(item);
    return groups;
  }, {} as Record<K, T[]>);
}

/**
 * Removes duplicate items from an array based on a key function
 * @param array The array to remove duplicates from
 * @param keyFn A function that returns the key to compare items by
 * @returns A new array with duplicates removed
 */
export function uniqueBy<T, K>(array: T[], keyFn: (item: T) => K): T[] {
  const seen = new Set<K>();
  return array.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}