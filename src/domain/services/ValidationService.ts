/**
 * Domain service for validation operations
 */

import { CriterionEntity } from '../entities/Criterion';

export interface ValidationService {
  /**
   * Validates if the provided data matches the criterion schema
   * @param criterion The criterion to validate against
   * @param data The data to validate
   * @returns true if the data is valid, false otherwise
   */
  validateCriterionData(criterion: CriterionEntity, data: Record<string, any>): boolean;

  /**
   * Validates an email address
   * @param email The email to validate
   * @returns true if the email is valid, false otherwise
   */
  validateEmail(email: string): boolean;

  /**
   * Validates a URL
   * @param url The URL to validate
   * @returns true if the URL is valid, false otherwise
   */
  validateUrl(url: string): boolean;
}

export class ValidationServiceImpl implements ValidationService {
  validateCriterionData(criterion: CriterionEntity, data: Record<string, any>): boolean {
    return criterion.validateData(data);
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}