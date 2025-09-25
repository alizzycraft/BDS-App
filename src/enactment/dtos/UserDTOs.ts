/**
 * Data Transfer Objects for user-related operations
 */

export interface RegisterUserRequest {
  email: string;
  displayName: string;
}

export interface RegisterUserResponse {
  userId: string;
  email: string;
  displayName: string;
  createdAt: Date;
}

export interface AuthenticateUserRequest {
  email: string;
  token: string;
}

export interface AuthenticateUserResponse {
  userId: string;
  email: string;
  displayName: string;
  isAuthenticated: boolean;
}

export interface UserHelpfulnessResponse {
  userId: string;
  helpfulnessScore: number;
  isLocked: boolean;
}