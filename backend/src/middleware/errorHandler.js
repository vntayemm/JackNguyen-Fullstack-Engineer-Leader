/**
 * Error Handler Middleware
 * Handles all errors and formats them consistently using DTOs
 */

import { sendErrorResponse } from '../dto/utils.js';
import config from '../config.js';

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error class
 */
export class ValidationError extends APIError {
  constructor(message, errors = []) {
    super(message, 400);
    this.errors = errors;
  }
}

/**
 * Authentication error class
 */
export class AuthenticationError extends APIError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

/**
 * Authorization error class
 */
export class AuthorizationError extends APIError {
  constructor(message = 'Access denied') {
    super(message, 403);
  }
}

/**
 * Not found error class
 */
export class NotFoundError extends APIError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * Conflict error class
 */
export class ConflictError extends APIError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
  }
}

/**
 * Domain conflict error class for business exceptions
 */
export class BusinessException extends APIError {
  constructor(message = 'Domain already exists in your list') {
    super(message, 409);
  }
}

/**
 * Rate limit error class
 */
export class RateLimitError extends APIError {
  constructor(message = 'Too many requests') {
    super(message, 429);
  }
}

/**
 * Main error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors = [];

  // Ensure err is an Error object
  if (typeof err === 'string') {
    err = new Error(err);
  }

  // Log error details
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Handle different types of errors
  if (err instanceof APIError) {
    statusCode = err.statusCode;
    message = err.message;
    
    // Handle validation errors
    if (err instanceof ValidationError) {
      errors = err.errors;
    }
  } else if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = 'Validation error';
    errors = err.errors.map(e => ({
      field: e.path,
      message: e.message,
      value: e.value
    }));
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'Resource already exists';
    errors = err.errors.map(e => ({
      field: e.path,
      message: e.message,
      value: e.value
    }));
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = 'Invalid reference';
  } else if (err.name === 'SequelizeDatabaseError') {
    statusCode = 500;
    message = 'Database error';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (err.name === 'SyntaxError' && err.status === 400) {
    statusCode = 400;
    message = 'Invalid JSON';
  } else if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request entity too large';
  } else if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = 'File too large';
  } else if (err.code === 'ENOTFOUND') {
    statusCode = 503;
    message = 'Service unavailable';
  } else if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'Service unavailable';
  } else if (err.code === 'ETIMEDOUT') {
    statusCode = 408;
    message = 'Request timeout';
  } else {
    // Handle regular Error objects - show the actual error message
    // Check if it's a known error message that should be shown to users
    const knownErrors = [
      'Invalid or expired verification token',
      'Email already verified',
      'Invalid credentials',
      'Please verify your email address before logging in. Check your email for the verification link.',
      'Invalid or expired reset token',
      'User not found',
      'Current password is incorrect',
      'Domain already exists in your list'
    ];
    
    if (knownErrors.includes(err.message)) {
      message = err.message;
      // Set appropriate status codes for different error types
      if (err.message.includes('verification token') || err.message.includes('reset token')) {
        statusCode = 400;
      } else if (err.message.includes('credentials') || err.message.includes('verify your email') || err.message.includes('Current password is incorrect')) {
        statusCode = 401;
      } else if (err.message.includes('already verified')) {
        statusCode = 409;
      } else if (err.message.includes('User not found')) {
        statusCode = 404;
      } else if (err.message.includes('Domain already exists')) {
        statusCode = 409;
      }
    } else {
      // For unknown errors, use generic message in production
      message = config.NODE_ENV === 'development' ? err.message : 'Internal server error';
    }
  }

  // Send error response with the appropriate message
  return sendErrorResponse(res, message, statusCode);
};

/**
 * 404 handler for unmatched routes
 */
export const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

/**
 * Async error wrapper for route handlers
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Request validation middleware
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        const validationError = new ValidationError(
          'Validation failed',
          error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value
          }))
        );
        return next(validationError);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

/**
 * Rate limiting error handler
 */
export const rateLimitErrorHandler = (err, req, res, next) => {
  if (err.status === 429) {
    const error = new RateLimitError('Too many requests, please try again later');
    return next(error);
  }
  next(err);
};

/**
 * CORS error handler
 */
export const corsErrorHandler = (err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    const error = new AuthorizationError('CORS policy violation');
    return next(error);
  }
  next(err);
};

export default errorHandler; 