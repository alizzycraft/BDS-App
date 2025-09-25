/**
 * A value object representing an email address
 */

export class EmailAddress {
  private readonly value: string;
  
  constructor(value: string) {
    if (!this.isValidEmail(value)) {
      throw new Error('Invalid email address');
    }
    this.value = value.toLowerCase();
  }
  
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  toString(): string {
    return this.value;
  }
  
  equals(other: EmailAddress): boolean {
    return this.value === other.value;
  }
}