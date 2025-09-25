/**
 * Test file for Identifier value object
 */

import { Identifier } from './Identifier';

describe('Identifier', () => {
  it('should create an identifier with a valid value', () => {
    const identifier = new Identifier('user-123');
    expect(identifier.toString()).toBe('user-123');
  });

  it('should throw an error when created with an empty value', () => {
    expect(() => new Identifier('')).toThrow('Identifier cannot be empty');
    expect(() => new Identifier('   ')).toThrow('Identifier cannot be empty');
  });

  it('should compare identifiers for equality', () => {
    const id1 = new Identifier('user-123');
    const id2 = new Identifier('user-123');
    const id3 = new Identifier('user-456');

    expect(id1.equals(id2)).toBe(true);
    expect(id1.equals(id3)).toBe(false);
  });
});