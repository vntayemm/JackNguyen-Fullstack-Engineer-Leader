/**
 * Authentication DTOs
 */

// Register DTO
class RegisterRequestDTO {
  constructor(data) {
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this._errors = [];
  }

  validate() {
    this._errors = [];
    
    if (!this.username || this.username.length < 3) {
      this._errors.push('Username must be at least 3 characters long');
    }
    
    if (!this.email || !this.isValidEmail(this.email)) {
      this._errors.push('Valid email address is required');
    }
    
    if (!this.password || this.password.length < 6) {
      this._errors.push('Password must be at least 6 characters long');
    }
    
    return this._errors;
  }

  isValid() {
    return this.validate().length === 0;
  }

  getErrors() {
    return this._errors;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

class RegisterResponseDTO {
  constructor(user) {
    this.message = 'Registration successful! Please check your email to verify your account.';
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
  }
}

// Login DTO
class LoginRequestDTO {
  constructor(data) {
    this.username = data.username;
    this.password = data.password;
    this._errors = [];
  }

  validate() {
    this._errors = [];
    
    if (!this.username) {
      this._errors.push('Username is required');
    }
    
    if (!this.password) {
      this._errors.push('Password is required');
    }
    
    return this._errors;
  }

  isValid() {
    return this.validate().length === 0;
  }

  getErrors() {
    return this._errors;
  }
}

class LoginResponseDTO {
  constructor(result) {
    this.token = result.token;
    this.user = result.user;
  }
}

// Forgot Password DTO
class ForgotPasswordRequestDTO {
  constructor(data) {
    this.email = data.email;
    this._errors = [];
  }

  validate() {
    this._errors = [];
    
    if (!this.email || !this.isValidEmail(this.email)) {
      this._errors.push('Valid email address is required');
    }
    
    return this._errors;
  }

  isValid() {
    return this.validate().length === 0;
  }

  getErrors() {
    return this._errors;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

class ForgotPasswordResponseDTO {
  constructor(result) {
    this.message = result.message || 'If an account with this email exists, a password reset link has been sent.';
  }
}

// Reset Password DTO
class ResetPasswordRequestDTO {
  constructor(data) {
    this.password = data.password;
    this._errors = [];
  }

  validate() {
    this._errors = [];
    
    if (!this.password || this.password.length < 6) {
      this._errors.push('Password must be at least 6 characters long');
    }
    
    return this._errors;
  }

  isValid() {
    return this.validate().length === 0;
  }

  getErrors() {
    return this._errors;
  }
}

class ResetPasswordResponseDTO {
  constructor(result) {
    this.message = result.message || 'Password updated successfully';
  }
}

// Verify Email Response DTO
class VerifyEmailResponseDTO {
  constructor(result) {
    this.message = result.message || 'Email verified successfully! You can now log in.';
  }
}

// User Profile DTO
class UserProfileDTO {
  constructor(user) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.isVerified = user.isVerified;
    this.createdAt = user.createdAt;
  }
}

// Update Profile Request DTO
class UpdateProfileRequestDTO {
  constructor(data) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this._errors = [];
  }

  validate() {
    this._errors = [];
    
    if (this.firstName !== undefined && (!this.firstName || this.firstName.trim().length === 0)) {
      this._errors.push('First name cannot be empty');
    }
    
    if (this.lastName !== undefined && (!this.lastName || this.lastName.trim().length === 0)) {
      this._errors.push('Last name cannot be empty');
    }
    
    return this._errors;
  }

  isValid() {
    return this.validate().length === 0;
  }

  getErrors() {
    return this._errors;
  }
}

// Change Password Request DTO
class ChangePasswordRequestDTO {
  constructor(data) {
    this.oldPassword = data.oldPassword;
    this.newPassword = data.newPassword;
    this._errors = [];
  }

  validate() {
    this._errors = [];
    
    if (!this.oldPassword) {
      this._errors.push('Current password is required');
    }
    
    if (!this.newPassword || this.newPassword.length < 6) {
      this._errors.push('New password must be at least 6 characters long');
    }
    
    return this._errors;
  }

  isValid() {
    return this.validate().length === 0;
  }

  getErrors() {
    return this._errors;
  }
}

// Change Password Response DTO
class ChangePasswordResponseDTO {
  constructor(result) {
    this.message = result.message || 'Password changed successfully';
  }
}

// Delete Account Response DTO
class DeleteAccountResponseDTO {
  constructor(result) {
    this.message = result.message || 'Account deleted successfully';
  }
}

export {
  RegisterRequestDTO,
  RegisterResponseDTO,
  LoginRequestDTO,
  LoginResponseDTO,
  ForgotPasswordRequestDTO,
  ForgotPasswordResponseDTO,
  ResetPasswordRequestDTO,
  ResetPasswordResponseDTO,
  VerifyEmailResponseDTO,
  UserProfileDTO,
  UpdateProfileRequestDTO,
  ChangePasswordRequestDTO,
  ChangePasswordResponseDTO,
  DeleteAccountResponseDTO
}; 