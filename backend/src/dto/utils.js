/**
 * DTO Utility Functions
 */

/**
 * Validate request data using DTO
 * @param {Object} DTOClass - The DTO class to use for validation
 * @param {Object} data - The request data to validate
 * @returns {Object} - { isValid: boolean, errors: Array, dto: Object }
 */
function validateRequest(DTOClass, data) {
  try {
    const dto = new DTOClass(data);
    const errors = dto.validate();
    
    return {
      isValid: errors.length === 0,
      errors,
      dto
    };
  } catch (error) {
    return {
      isValid: false,
      errors: ['Invalid request data format'],
      dto: null
    };
  }
}

/**
 * Create response using DTO
 * @param {Object} DTOClass - The DTO class to use for response
 * @param {Object} data - The data to create response from
 * @returns {Object} - The formatted response
 */
function createResponse(DTOClass, data) {
  try {
    return new DTOClass(data);
  } catch (error) {
    console.error('Error creating response DTO:', error);
    return {
      error: 'Failed to format response'
    };
  }
}

/**
 * Sanitize request data using DTO
 * @param {Object} DTOClass - The DTO class to use for sanitization
 * @param {Object} data - The request data to sanitize
 * @returns {Object} - The sanitized data
 */
function sanitizeRequest(DTOClass, data) {
  try {
    const dto = new DTOClass(data);
    return dto.sanitize ? dto.sanitize() : data;
  } catch (error) {
    console.error('Error sanitizing request data:', error);
    return data;
  }
}

/**
 * Handle validation errors and send response
 * @param {Object} res - Express response object
 * @param {Array} errors - Array of validation errors
 * @param {number} statusCode - HTTP status code (default: 400)
 */
function handleValidationErrors(res, errors, statusCode = 400) {
  return res.status(statusCode).json({
    error: 'Validation failed',
    details: errors
  });
}

/**
 * Create success response
 * @param {Object} res - Express response object
 * @param {Object} data - Response data
 * @param {number} statusCode - HTTP status code (default: 200)
 */
function sendSuccessResponse(res, data, statusCode = 200) {
  return res.status(statusCode).json(data);
}

/**
 * Create error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 */
function sendErrorResponse(res, message, statusCode = 500) {
  return res.status(statusCode).json({
    error: message
  });
}

/**
 * Validate domain name format
 * @param {string} domain - Domain name to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidDomain(domain) {
  if (!domain || typeof domain !== 'string') {
    return false;
  }
  
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return domainRegex.test(domain);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize string input
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeString(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - { isValid: boolean, errors: Array }
 */
function validatePassword(password) {
  const errors = [];
  
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export {
  validateRequest,
  createResponse,
  sanitizeRequest,
  handleValidationErrors,
  sendSuccessResponse,
  sendErrorResponse,
  isValidDomain,
  isValidEmail,
  sanitizeString,
  validatePassword
}; 