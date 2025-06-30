import authService from '../services/authService.js';
import {
  UserProfileDTO,
  UpdateProfileRequestDTO,
  ChangePasswordRequestDTO,
  ChangePasswordResponseDTO,
  DeleteAccountResponseDTO,
} from '../dto/index.js';
import {
  sendSuccessResponse
} from '../dto/utils.js';
import { asyncHandler, AuthenticationError, ValidationError } from '../middleware/errorHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }

  const result = await authService.getProfile(userId);
  const response = new UserProfileDTO(result);
  
  return sendSuccessResponse(res, response);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const updateData = new UpdateProfileRequestDTO(req.body);
  
  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }
  
  if (!updateData.isValid()) {
    throw new ValidationError('Invalid profile data', updateData.getErrors());
  }

  const result = await authService.updateProfile(userId, updateData);
  const response = new UserProfileDTO(result);
  
  return sendSuccessResponse(res, response);
});

export const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const changePasswordData = new ChangePasswordRequestDTO(req.body);
  
  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }
  
  if (!changePasswordData.isValid()) {
    throw new ValidationError('Invalid password data', changePasswordData.getErrors());
  }

  const result = await authService.changePassword(userId, changePasswordData);
  const response = new ChangePasswordResponseDTO(result);
  
  return sendSuccessResponse(res, response);
});

export const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }

  const result = await authService.deleteAccount(userId);
  const response = new DeleteAccountResponseDTO(result);
  
  return sendSuccessResponse(res, response);
}); 