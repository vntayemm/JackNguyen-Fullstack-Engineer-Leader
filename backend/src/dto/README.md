# DTO (Data Transfer Object) System

This directory contains all the DTO models for the DNS/Email Security Tool API. DTOs provide a structured way to validate, sanitize, and format request/response data.

## Structure

```
dto/
├── auth.dto.js          # Authentication DTOs
├── user.dto.js          # User management DTOs
├── domain.dto.js        # Domain and DNS DTOs
├── system.dto.js        # System DTOs
├── utils.js             # DTO utility functions
├── index.js             # Main export file
└── README.md            # This file
```

## Usage

### Importing DTOs

```javascript
// Import specific DTOs
const { RegisterRequestDTO, LoginResponseDTO } = require('./dto');

// Import utility functions
const { validateRequest, createResponse } = require('./dto/utils');
```

### Using Request DTOs

```javascript
// In your controller
const { RegisterRequestDTO } = require('../dto');
const { validateRequest, handleValidationErrors } = require('../dto/utils');

exports.register = async (req, res) => {
  // Validate request data
  const validation = validateRequest(RegisterRequestDTO, req.body);
  
  if (!validation.isValid) {
    return handleValidationErrors(res, validation.errors);
  }
  
  // Use the validated DTO
  const { dto } = validation;
  
  // Process registration...
  const user = await authService.register(dto);
  
  // Create response using DTO
  const response = new RegisterResponseDTO(user);
  res.status(201).json(response);
};
```

### Using Response DTOs

```javascript
// Create structured response
const response = new UserProfileDTO(user);
res.json(response);

// Or use utility function
const response = createResponse(UserProfileDTO, user);
res.json(response);
```

### Using Sanitization

```javascript
// Sanitize request data
const sanitizedData = sanitizeRequest(UpdateProfileRequestDTO, req.body);
const user = await userService.updateProfile(userId, sanitizedData);
```

## DTO Categories

### Authentication DTOs (`auth.dto.js`)

- **RegisterRequestDTO**: Validates registration data
- **RegisterResponseDTO**: Formats registration response
- **LoginRequestDTO**: Validates login data
- **LoginResponseDTO**: Formats login response with token
- **ForgotPasswordRequestDTO**: Validates forgot password request
- **ResetPasswordRequestDTO**: Validates password reset
- **VerifyEmailResponseDTO**: Formats email verification response

### User Management DTOs (`user.dto.js`)

- **UserProfileDTO**: Formats user profile data
- **UpdateProfileRequestDTO**: Validates profile update data
- **ChangePasswordRequestDTO**: Validates password change
- **SuccessResponseDTO**: Generic success response
- **ErrorResponseDTO**: Generic error response

### Domain and DNS DTOs (`domain.dto.js`)

- **DomainValidationResponseDTO**: Formats domain validation results
- **SPFAnalysisRequestDTO**: Validates SPF analysis requests
- **SPFAnalysisResponseDTO**: Formats SPF analysis results
- **DMARCAnalysisRequestDTO**: Validates DMARC analysis requests
- **DMARCAnalysisResponseDTO**: Formats DMARC analysis results
- **DNSRecordDTO**: Formats DNS record data
- **DNSResponseDTO**: Formats DNS query responses
- **DomainDTO**: Formats domain management data
- **AddDomainRequestDTO**: Validates domain addition requests

### System DTOs (`system.dto.js`)

- **HealthCheckResponseDTO**: Formats health check responses
- **APIStatusDTO**: Formats API status information
- **SystemInfoDTO**: Formats system information

## Validation Features

### Built-in Validation

Each request DTO includes a `validate()` method that returns an array of errors:

```javascript
const dto = new RegisterRequestDTO(req.body);
const errors = dto.validate();

if (errors.length > 0) {
  return res.status(400).json({ error: 'Validation failed', details: errors });
}
```

### Common Validations

- **Email**: Validates email format using regex
- **Password**: Ensures minimum length and strength
- **Domain**: Validates domain name format
- **Required Fields**: Checks for required properties
- **String Sanitization**: Trims whitespace and removes dangerous characters

### Custom Validation

You can extend DTOs with custom validation logic:

```javascript
class CustomRequestDTO {
  constructor(data) {
    this.field = data.field;
  }
  
  validate() {
    const errors = [];
    
    if (!this.field) {
      errors.push('Field is required');
    }
    
    // Custom validation logic
    if (this.field && this.field.length > 100) {
      errors.push('Field must be less than 100 characters');
    }
    
    return errors;
  }
}
```

## Utility Functions

### `validateRequest(DTOClass, data)`

Validates request data using a DTO class:

```javascript
const validation = validateRequest(RegisterRequestDTO, req.body);
if (!validation.isValid) {
  return handleValidationErrors(res, validation.errors);
}
```

### `createResponse(DTOClass, data)`

Creates a formatted response using a DTO:

```javascript
const response = createResponse(UserProfileDTO, user);
res.json(response);
```

### `sanitizeRequest(DTOClass, data)`

Sanitizes request data:

```javascript
const sanitizedData = sanitizeRequest(UpdateProfileRequestDTO, req.body);
```

### `handleValidationErrors(res, errors, statusCode)`

Handles validation errors with proper HTTP response:

```javascript
return handleValidationErrors(res, errors, 400);
```

### `sendSuccessResponse(res, data, statusCode)`

Sends a success response:

```javascript
sendSuccessResponse(res, data, 201);
```

### `sendErrorResponse(res, message, statusCode)`

Sends an error response:

```javascript
sendErrorResponse(res, 'User not found', 404);
```

## Best Practices

1. **Always validate**: Use DTOs to validate all incoming request data
2. **Sanitize inputs**: Use sanitization to clean user inputs
3. **Consistent responses**: Use response DTOs for consistent API responses
4. **Error handling**: Use utility functions for proper error responses
5. **Type safety**: DTOs provide a layer of type safety for your API

## Example Controller Implementation

```javascript
const { 
  RegisterRequestDTO, 
  RegisterResponseDTO,
  ErrorResponseDTO 
} = require('../dto');
const { 
  validateRequest, 
  handleValidationErrors,
  sendSuccessResponse 
} = require('../dto/utils');

exports.register = async (req, res) => {
  try {
    // Validate request
    const validation = validateRequest(RegisterRequestDTO, req.body);
    if (!validation.isValid) {
      return handleValidationErrors(res, validation.errors);
    }

    // Process registration
    const user = await authService.register(validation.dto);
    
    // Create response
    const response = new RegisterResponseDTO(user);
    return sendSuccessResponse(res, response, 201);
    
  } catch (error) {
    console.error('Registration error:', error);
    const errorResponse = new ErrorResponseDTO('Registration failed');
    return sendErrorResponse(res, errorResponse.error, 500);
  }
};
```

This DTO system provides a robust foundation for data validation, sanitization, and consistent API responses throughout the application. 