/**
 * User entity representing a platform user
 */

import { EntityId } from '../../common/types/GenericTypes';
import { Identifier } from '../../common/value-objects/Identifier';
import { EmailAddress } from '../../common/value-objects/EmailAddress';

export interface User {
  id: Identifier;
  email: EmailAddress;
  displayName: string;
  helpfulnessTotal: number;
  isLocked: boolean;
  createdAt: Date;
  chosenCriterionId?: Identifier;
}

export class UserEntity implements User {
  id: Identifier;
  email: EmailAddress;
  displayName: string;
  helpfulnessTotal: number;
  isLocked: boolean;
  createdAt: Date;
  chosenCriterionId?: Identifier;

  constructor(
    id: Identifier,
    email: EmailAddress,
    displayName: string,
    helpfulnessTotal: number,
    isLocked: boolean,
    createdAt: Date,
    chosenCriterionId?: Identifier
  ) {
    this.id = id;
    this.email = email;
    this.displayName = displayName;
    this.helpfulnessTotal = helpfulnessTotal;
    this.isLocked = isLocked;
    this.createdAt = createdAt;
    this.chosenCriterionId = chosenCriterionId;
  }

  /**
   * Checks if the user is locked based on their helpfulness score
   * @returns true if the user is locked, false otherwise
   */
  isUserLocked(): boolean {
    return this.isLocked || this.helpfulnessTotal < 0;
  }

  /**
   * Updates the user's helpfulness score
   * @param score The new helpfulness score
   */
  updateHelpfulnessScore(score: number): void {
    this.helpfulnessTotal = score;
  }

  /**
   * Locks the user account
   */
  lockUser(): void {
    this.isLocked = true;
  }

  /**
   * Unlocks the user account
   */
  unlockUser(): void {
    this.isLocked = false;
    if (this.helpfulnessTotal < 0) {
      this.helpfulnessTotal = 0;
    }
  }
}