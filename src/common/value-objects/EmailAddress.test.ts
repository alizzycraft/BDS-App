/**
 * Test file for EmailAddress value object
 */

import { EmailAddress } from './EmailAddress';

describe('EmailAddress', () => {
  it('should create an email address with a valid value', () => {
    const email = new EmailAddress('test@example.com');
    expect(email.toString()).toBe('test@example.com');
  });

  it('should throw an error when created with an invalid email', () => {
    expect(() => new EmailAddress('invalid-email')).toThrow('Invalid email address');
    expect(() => new EmailAddress('test@')).toThrow('Invalid email address');
    expect(() => new EmailAddress('@example.com')).toThrow('Invalid email address');
  });

  it('should convert email to lowercase', () => {
    const email = new EmailAddress('Test@Example.COM');
    expect(email.toString()).toBe('test@example.com');
  });

  it('should compare email addresses for equality', () => {
    const email1 = new EmailAddress('test@example.com');
    const email2 = new EmailAddress('TEST@EXAMPLE.COM');
    const email3 = new EmailAddress('other@example.com');

    expect(email1.equals(email2)).toBe(true);
    expect(email1.equals(email3)).toBe(false);
  });
});