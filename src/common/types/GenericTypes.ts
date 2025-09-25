/**
 * Generic types that can be used across all layers of the application
 */

export type EntityId = string;
export type EmailAddress = string;
export type UrlString = string;
export type DateTime = Date;

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };