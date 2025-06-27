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
  DomainValidationResponseDTO,
  SPFAnalysisRequestDTO,
  SPFAnalysisResponseDTO,
  DMARCAnalysisRequestDTO,
  DMARCAnalysisResponseDTO,
  DNSRecordDTO,
  DNSResponseDTO,
  DomainDTO,
  AddDomainRequestDTO,
  DomainListResponseDTO,
  DomainTestResponseDTO
} from './domain.dto.js';

// System DTOs
import {
  HealthCheckResponseDTO,
  APIStatusDTO,
  SystemInfoDTO
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
  DomainValidationResponseDTO,
  SPFAnalysisRequestDTO,
  SPFAnalysisResponseDTO,
  DMARCAnalysisRequestDTO,
  DMARCAnalysisResponseDTO,
  DNSRecordDTO,
  DNSResponseDTO,
  DomainDTO,
  AddDomainRequestDTO,
  DomainListResponseDTO,
  DomainTestResponseDTO,
  
  // System
  HealthCheckResponseDTO,
  APIStatusDTO,
  SystemInfoDTO
}; 