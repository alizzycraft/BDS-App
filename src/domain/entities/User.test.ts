/**
 * Test file for User entity
 */

import { UserEntity } from './User';
import { Identifier } from '../../common/value-objects/Identifier';
import { EmailAddress } from '../../common/value-objects/EmailAddress';

describe('UserEntity', () => {
  it('should create a user entity', () => {
    const id = new Identifier('user-1');
    const email = new EmailAddress('test@example.com');
    const user = new UserEntity(
      id,
      email,
      'Test User',
      0,
      false,
      new Date()
    );

    expect(user.id).toBe(id);
    expect(user.email).toBe(email);
    expect(user.displayName).toBe('Test User');
    expect(user.helpfulnessTotal).toBe(0);
    expect(user.isLocked).toBe(false);
  });

  it('should lock a user when helpfulness score is negative', () => {
    const user = new UserEntity(
      new Identifier('user-1'),
      new EmailAddress('test@example.com'),
      'Test User',
      -5,
      false,
      new Date()
    );

    expect(user.isUserLocked()).toBe(true);
  });

  it('should update helpfulness score', () => {
    const user = new UserEntity(
      new Identifier('user-1'),
      new EmailAddress('test@example.com'),
      'Test User',
      0,
      false,
      new Date()
    );

    user.updateHelpfulnessScore(10);
    expect(user.helpfulnessTotal).toBe(10);
  });

  it('should lock and unlock user', () => {
    const user = new UserEntity(
      new Identifier('user-1'),
      new EmailAddress('test@example.com'),
      'Test User',
      0,
      false,
      new Date()
    );

    user.lockUser();
    expect(user.isLocked).toBe(true);

    user.unlockUser();
    expect(user.isLocked).toBe(false);
    expect(user.helpfulnessTotal).toBe(0);
  });
});