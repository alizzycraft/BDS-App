/**
 * Service interface for user-related operations
 */

import { UserEntity } from '../../domain/entities/User';
import { Identifier } from '../../common/value-objects/Identifier';
import { EmailAddress } from '../../common/value-objects/EmailAddress';

export interface UserService {
  /**
   * Registers a new user
   * @param email The user's email address
   * @param displayName The user's display name
   * @returns The registered user entity
   */
  registerUser(email: EmailAddress, displayName: string): Promise<UserEntity>;

  /**
   * Authenticates a user
   * @param email The user's email address
   * @param token The authentication token
   * @returns The authenticated user entity
   */
  authenticateUser(email: EmailAddress, token: string): Promise<UserEntity>;

  /**
   * Selects a criterion for a user
   * @param userId The ID of the user
   * @param criterionId The ID of the criterion to select
   */
  selectCriterion(userId: Identifier, criterionId: Identifier): Promise<void>;

  /**
   * Gets a user's helpfulness score
   * @param userId The ID of the user
   * @returns The user's helpfulness score
   */
  getHelpfulnessScore(userId: Identifier): Promise<number>;

  /**
   * Updates a user's helpfulness score
   * @param userId The ID of the user
   * @param score The new helpfulness score
   */
  updateHelpfulnessScore(userId: Identifier, score: number): Promise<void>;

  /**
   * Locks a user's account
   * @param userId The ID of the user to lock
   */
  lockUser(userId: Identifier): Promise<void>;

  /**
   * Unlocks a user's account
   * @param userId The ID of the user to unlock
   */
  unlockUser(userId: Identifier): Promise<void>;
}