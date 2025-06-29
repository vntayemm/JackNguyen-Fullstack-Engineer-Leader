/**
 * DTO Index - Export all DTOs
 */

// Authentication DTOs
import {
  RegisterRequestDTO,
  RegisterResponseDTO,
  LoginRequestDTO,
  LoginResponseDTO,
  ForgotPasswordRequestDTO,
  ForgotPasswordResponseDTO,
  ResetPasswordRequestDTO,
  ResetPasswordResponseDTO,
  VerifyEmailResponseDTO
} from './auth.dto.js';

// User Management DTOs
import {
  UserProfileDTO,
  UpdateProfileRequestDTO,
  ChangePasswordRequestDTO,
  ChangePasswordResponseDTO,
  DeleteAccountResponseDTO,
  SuccessResponseDTO,
  ErrorResponseDTO
} from './user.dto.js';

// Domain and DNS DTOs
import {
  DomainDTO,
  AddDomainRequestDTO,
  DomainListResponseDTO
} from './domain.dto.js';

// System DTOs
import {
  HealthCheckResponseDTO
} from './system.dto.js';

export {
  // Authentication
  RegisterRequestDTO,
  RegisterResponseDTO,
  LoginRequestDTO,
  LoginResponseDTO,
  ForgotPasswordRequestDTO,
  ForgotPasswordResponseDTO,
  ResetPasswordRequestDTO,
  ResetPasswordResponseDTO,
  VerifyEmailResponseDTO,
  
  // User Management
  UserProfileDTO,
  UpdateProfileRequestDTO,
  ChangePasswordRequestDTO,
  ChangePasswordResponseDTO,
  DeleteAccountResponseDTO,
  SuccessResponseDTO,
  ErrorResponseDTO,
  
  // Domain and DNS
  DomainDTO,
  AddDomainRequestDTO,
  DomainListResponseDTO,
  
  // System
  HealthCheckResponseDTO
}; 