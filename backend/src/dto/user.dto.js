/**
 * User Management DTOs
 */

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

// Update Profile DTO
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

  sanitize() {
    return {
      firstName: this.firstName ? this.firstName.trim() : null,
      lastName: this.lastName ? this.lastName.trim() : null
    };
  }
}

// Change Password DTO
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
    
    if (this.oldPassword === this.newPassword) {
      this._errors.push('New password must be different from current password');
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

class ChangePasswordResponseDTO {
  constructor() {
    this.message = 'Password changed successfully';
  }
}

// Delete Account DTO
class DeleteAccountResponseDTO {
  constructor() {
    this.message = 'Account deleted successfully';
  }
}

// Success Response DTO
class SuccessResponseDTO {
  constructor(message) {
    this.message = message || 'Operation completed successfully';
  }
}

// Error Response DTO
class ErrorResponseDTO {
  constructor(error) {
    if (typeof error === 'string') {
      this.error = { message: error };
    } else {
      this.error = error || { message: 'An error occurred' };
    }
  }
}

export {
  UserProfileDTO,
  UpdateProfileRequestDTO,
  ChangePasswordRequestDTO,
  ChangePasswordResponseDTO,
  DeleteAccountResponseDTO,
  SuccessResponseDTO,
  ErrorResponseDTO
}; 