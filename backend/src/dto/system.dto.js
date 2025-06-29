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

export {
  HealthCheckResponseDTO
}; 