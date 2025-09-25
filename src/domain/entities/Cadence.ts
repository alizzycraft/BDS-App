/**
 * Cadence entity representing a decision cycle
 */

import { Identifier } from '../../common/value-objects/Identifier';

export interface CadenceConfig {
  name: string;
  frequency: 'weekly' | 'monthly' | 'custom';
  startDay?: number;
  durationDays?: number;
}

export interface Cadence {
  id: Identifier;
  name: string;
  windowStart: Date;
  windowEnd: Date;
  config: CadenceConfig;
  createdAt: Date;
}

export class CadenceEntity implements Cadence {
  id: Identifier;
  name: string;
  windowStart: Date;
  windowEnd: Date;
  config: CadenceConfig;
  createdAt: Date;

  constructor(
    id: Identifier,
    name: string,
    windowStart: Date,
    windowEnd: Date,
    config: CadenceConfig,
    createdAt: Date
  ) {
    this.id = id;
    this.name = name;
    this.windowStart = windowStart;
    this.windowEnd = windowEnd;
    this.config = config;
    this.createdAt = createdAt;
  }

  /**
   * Checks if the cadence is currently active
   * @param date The date to check against (defaults to current date)
   * @returns true if the cadence is active, false otherwise
   */
  isActive(date: Date = new Date()): boolean {
    return date >= this.windowStart && date <= this.windowEnd;
  }

  /**
   * Gets the duration of the cadence in days
   * @returns The duration in days
   */
  getDurationInDays(): number {
    const diffTime = Math.abs(this.windowEnd.getTime() - this.windowStart.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}