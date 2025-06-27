/**
 * System DTOs
 */

// Health Check DTO
class HealthCheckResponseDTO {
  constructor(environment = 'development') {
    this.status = 'healthy';
    this.environment = environment;
    this.timestamp = new Date().toISOString();
  }
}

// API Status DTO
class APIStatusDTO {
  constructor(status, message, timestamp) {
    this.status = status;
    this.message = message;
    this.timestamp = timestamp || new Date().toISOString();
  }
}

// System Info DTO
class SystemInfoDTO {
  constructor() {
    this.version = '1.0.0';
    this.name = 'DNS/Email Security Tool API';
    this.description = 'Comprehensive API for DNS validation, SPF analysis, DMARC analysis, and user authentication';
    this.environment = process.env.NODE_ENV || 'development';
    this.timestamp = new Date().toISOString();
  }
}

export {
  HealthCheckResponseDTO,
  APIStatusDTO,
  SystemInfoDTO
}; 