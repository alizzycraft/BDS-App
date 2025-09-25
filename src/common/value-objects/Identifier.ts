/**
 * A value object representing a unique identifier
 */

export class Identifier {
  private readonly value: string;
  
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Identifier cannot be empty');
    }
    this.value = value;
  }
  
  toString(): string {
    return this.value;
  }
  
  equals(other: Identifier): boolean {
    return this.value === other.value;
  }
}