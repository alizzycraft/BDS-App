/**
 * Repository interface for User entities
 */

import { UserEntity } from '../entities/User';
import { Identifier } from '../../common/value-objects/Identifier';
import { EmailAddress } from '../../common/value-objects/EmailAddress';

export interface UserRepository {
  /**
   * Finds a user by their ID
   * @param id The user ID
   * @returns The user entity or null if not found
   */
  findById(id: Identifier): Promise<UserEntity | null>;

  /**
   * Finds a user by their email address
   * @param email The user's email address
   * @returns The user entity or null if not found
   */
  findByEmail(email: EmailAddress): Promise<UserEntity | null>;

  /**
   * Creates a new user
   * @param user The user entity to create
   * @returns The created user entity
   */
  create(user: Omit<UserEntity, 'id' | 'createdAt'>): Promise<UserEntity>;

  /**
   * Updates an existing user
   * @param id The ID of the user to update
   * @param updates The updates to apply
   * @returns The updated user entity
   */
  update(id: Identifier, updates: Partial<UserEntity>): Promise<UserEntity>;

  /**
   * Deletes a user
   * @param id The ID of the user to delete
   */
  delete(id: Identifier): Promise<void>;
}