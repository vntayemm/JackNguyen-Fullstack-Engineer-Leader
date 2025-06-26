import { 
  verifyEmail as verifyEmailService,
  registerUser,
  loginUser,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService,
  getProfile as getProfileService,
  updateProfile as updateProfileService,
  changePassword as changePasswordService,
  deleteAccount as deleteAccountService
} from '../services/authService.js';
import {
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
} from '../dto/index.js';
import {
  validateRequest,
  handleValidationErrors,
  sendSuccessResponse,
  sendErrorResponse,
  sanitizeRequest
} from '../dto/utils.js';
import { asyncHandler, AuthenticationError, ValidationError, NotFoundError } from '../middleware/errorHandler.js';

export const register = asyncHandler(async (req, res) => {
  const registerData = new RegisterRequestDTO(req.body);
  
  if (!registerData.isValid()) {
    throw new ValidationError('Invalid registration data', registerData.getErrors());
  }

  const result = await registerUser(registerData);
  const response = new RegisterResponseDTO(result);
  
  return sendSuccessResponse(res, response, 201);
});

export const login = asyncHandler(async (req, res) => {
  const loginData = new LoginRequestDTO(req.body);
  
  if (!loginData.isValid()) {
    throw new ValidationError('Invalid login data', loginData.getErrors());
  }

  const result = await loginUser(loginData);
  const response = new LoginResponseDTO(result);
  
  return sendSuccessResponse(res, response);
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  
  if (!token) {
    throw new ValidationError('Token is required');
  }

  const result = await verifyEmailService(token);
  const response = new VerifyEmailResponseDTO(result);
  
  return sendSuccessResponse(res, response);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const forgotPasswordData = new ForgotPasswordRequestDTO(req.body);
  
  if (!forgotPasswordData.isValid()) {
    throw new ValidationError('Invalid email', forgotPasswordData.getErrors());
  }

  const result = await forgotPasswordService(forgotPasswordData);
  const response = new ForgotPasswordResponseDTO(result);
  
  return sendSuccessResponse(res, response);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const resetPasswordData = new ResetPasswordRequestDTO(req.body);
  
  if (!resetPasswordData.isValid()) {
    throw new ValidationError('Invalid password data', resetPasswordData.getErrors());
  }

  const result = await resetPasswordService(token, resetPasswordData);
  const response = new ResetPasswordResponseDTO(result);
  
  return sendSuccessResponse(res, response);
});

export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }

  const result = await getProfileService(userId);
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

  const result = await updateProfileService(userId, updateData);
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

  const result = await changePasswordService(userId, changePasswordData);
  const response = new ChangePasswordResponseDTO(result);
  
  return sendSuccessResponse(res, response);
});

export const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }

  const result = await deleteAccountService(userId);
  const response = new DeleteAccountResponseDTO(result);
  
  return sendSuccessResponse(res, response);
}); 