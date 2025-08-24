export interface User {
  id?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  // password should not normally be returned by APIs, but included here for forms only (optional)
  password?: string;
  role?: UserRole;
  dob?: string; // ISO date string (yyyy-MM-dd)
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresAt: string;
}

// src/types/User.ts

/**
 * Frontend types for User domain (mirrors server-side model and DTOs)
 */

export type UserRole = 'ADMIN' | 'EDITOR' | 'USER' | 'VIEWER';

export interface UserRequest {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  dob?: string; // ISO date string (yyyy-MM-dd)
  role?: UserRole;
}

export interface UpdateUserRequest {
  id: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  password?: string; // optional: only when changing
  dob?: string;
  role?: UserRole;
}
