import User from '../models/user.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import {
  UserProfileDTO,
  UpdateProfileRequestDTO,
  ChangePasswordRequestDTO,
  ChangePasswordResponseDTO,
  DeleteAccountResponseDTO,
  ErrorResponseDTO
} from '../dto/index.js';
import {
  validateRequest,
  handleValidationErrors,
  sendSuccessResponse,
  sendErrorResponse,
  sanitizeRequest
} from '../dto/utils.js';

export async function getProfile(req, res) {
  try {
    const user = await User.findByPk(req.user.id, { 
      attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'is_verified', 'createdAt'] 
    });
    
    if (!user) {
      const errorResponse = new ErrorResponseDTO('User not found');
      return sendErrorResponse(res, errorResponse.error, 404);
    }
    
    // Transform the response to match frontend expectations
    const userProfile = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      isVerified: user.is_verified,
      createdAt: user.createdAt
    };
    
    // Create response using DTO
    const response = new UserProfileDTO(userProfile);
    return sendSuccessResponse(res, response);
  } catch (error) {
    console.error('Error fetching profile:', error);
    const errorResponse = new ErrorResponseDTO('Failed to fetch profile');
    return sendErrorResponse(res, errorResponse.error, 500);
  }
}

export async function updateProfile(req, res) {
  try {
    // Validate and sanitize request data
    const validation = validateRequest(UpdateProfileRequestDTO, req.body);
    if (!validation.isValid) {
      return handleValidationErrors(res, validation.errors);
    }

    // Sanitize the data
    const sanitizedData = sanitizeRequest(UpdateProfileRequestDTO, req.body);
    
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      const errorResponse = new ErrorResponseDTO('User not found');
      return sendErrorResponse(res, errorResponse.error, 404);
    }
    
    // Update fields if provided
    if (sanitizedData.firstName !== undefined) user.first_name = sanitizedData.firstName;
    if (sanitizedData.lastName !== undefined) user.last_name = sanitizedData.lastName;
    
    await user.save();
    
    // Return updated profile
    const updatedProfile = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      isVerified: user.is_verified,
      createdAt: user.createdAt
    };
    
    // Create response using DTO
    const response = new UserProfileDTO(updatedProfile);
    return sendSuccessResponse(res, response);
  } catch (error) {
    console.error('Error updating profile:', error);
    const errorResponse = new ErrorResponseDTO('Failed to update profile');
    return sendErrorResponse(res, errorResponse.error, 500);
  }
}

export async function changePassword(req, res) {
  try {
    // Validate request data
    const validation = validateRequest(ChangePasswordRequestDTO, req.body);
    if (!validation.isValid) {
      return handleValidationErrors(res, validation.errors);
    }

    const { oldPassword, newPassword } = validation.dto;
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      const errorResponse = new ErrorResponseDTO('User not found');
      return sendErrorResponse(res, errorResponse.error, 404);
    }
    
    if (!await comparePassword(oldPassword, user.password_hash)) {
      const errorResponse = new ErrorResponseDTO('Old password incorrect');
      return sendErrorResponse(res, errorResponse.error, 400);
    }
    
    user.password_hash = await hashPassword(newPassword);
    await user.save();
    
    // Create response using DTO
    const response = new ChangePasswordResponseDTO();
    return sendSuccessResponse(res, response);
  } catch (error) {
    console.error('Error changing password:', error);
    const errorResponse = new ErrorResponseDTO('Failed to change password');
    return sendErrorResponse(res, errorResponse.error, 500);
  }
}

export async function deleteAccount(req, res) {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      const errorResponse = new ErrorResponseDTO('User not found');
      return sendErrorResponse(res, errorResponse.error, 404);
    }
    
    await User.destroy({ where: { id: req.user.id } });
    
    // Create response using DTO
    const response = new DeleteAccountResponseDTO();
    return sendSuccessResponse(res, response);
  } catch (error) {
    console.error('Error deleting account:', error);
    const errorResponse = new ErrorResponseDTO('Failed to delete account');
    return sendErrorResponse(res, errorResponse.error, 500);
  }
} 