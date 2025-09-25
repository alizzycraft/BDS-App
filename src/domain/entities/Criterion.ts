/**
 * Criterion entity representing a type/schema for decision options
 */

import { Identifier } from '../../common/value-objects/Identifier';

export interface CriterionField {
  key: string;
  type: 'string' | 'text' | 'url' | 'enum' | 'number' | 'boolean';
  required?: boolean;
  values?: string[]; // For enum type
}

export interface CriterionSchema {
  fields: CriterionField[];
}

export interface Criterion {
  id: Identifier;
  key: string;
  name: string;
  schema: CriterionSchema;
  createdAt: Date;
}

export class CriterionEntity implements Criterion {
  id: Identifier;
  key: string;
  name: string;
  schema: CriterionSchema;
  createdAt: Date;

  constructor(
    id: Identifier,
    key: string,
    name: string,
    schema: CriterionSchema,
    createdAt: Date
  ) {
    this.id = id;
    this.key = key;
    this.name = name;
    this.schema = schema;
    this.createdAt = createdAt;
  }

  /**
   * Validates if the provided data matches the criterion schema
   * @param data The data to validate
   * @returns true if the data is valid, false otherwise
   */
  validateData(data: Record<string, any>): boolean {
    for (const field of this.schema.fields) {
      const value = data[field.key];
      
      // Check required fields
      if (field.required && (value === undefined || value === null)) {
        return false;
      }
      
      // Skip validation for optional fields that are not provided
      if (value === undefined || value === null) {
        continue;
      }
      
      // Type validation
      switch (field.type) {
        case 'string':
        case 'text':
          if (typeof value !== 'string') {
            return false;
          }
          break;
        case 'url':
          if (typeof value !== 'string' || !this.isValidUrl(value)) {
            return false;
          }
          break;
        case 'enum':
          if (!field.values || !field.values.includes(value)) {
            return false;
          }
          break;
        case 'number':
          if (typeof value !== 'number') {
            return false;
          }
          break;
        case 'boolean':
          if (typeof value !== 'boolean') {
            return false;
          }
          break;
      }
    }
    
    return true;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}