import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config.js';
import swaggerUi from 'swagger-ui-express';
import oas from 'express-oas-generator';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import domainRoutes from './routes/domain.js';
import { HealthCheckResponseDTO, ErrorResponseDTO } from './dto/index.js';
import { sendSuccessResponse, sendErrorResponse } from './dto/utils.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

oas.init(app, {
  swaggerDocument: {
    openapi: '3.0.0',
    info: {
      title: 'DNS/Email Security API',
      version: '1.0.0',
      description: 'Auto-generated OpenAPI spec'
    }
  }
});

// Security middleware
if (config.HELMET_ENABLED) {
  app.use(helmet());
}

// CORS configuration
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json());

// Use auth and user routes
app.use(`${config.API_PREFIX}/auth`, authRoutes);
app.use(`${config.API_PREFIX}/user`, userRoutes);
app.use(`${config.API_PREFIX}/domains`, domainRoutes);

// Serve the generated swagger.json file
app.get(`${config.API_PREFIX}/docs/swagger.json`, (req, res) => {
  let swaggerPath = path.join(process.cwd(), 'swagger.json');
  if (!fs.existsSync(swaggerPath)) {
    swaggerPath = path.join(process.cwd(), 'backend/swagger.json');
  }
  console.log(swaggerPath);
  if (fs.existsSync(swaggerPath)) {
    res.sendFile(swaggerPath);
  } else {
    const errorResponse = new ErrorResponseDTO('swagger.json not found. Make sure to hit your API endpoints first.');
    return sendErrorResponse(res, errorResponse.error, 404);
  }
});

app.use(`${config.API_PREFIX}/docs`, swaggerUi.serve, swaggerUi.setup(null, { swaggerUrl: `${config.API_PREFIX}/docs/swagger.json` }));

app.get('/health', (req, res) => {
  try {
    // Create response using DTO
    const response = new HealthCheckResponseDTO(config.NODE_ENV);
    return sendSuccessResponse(res, response);
  } catch (error) {
    console.error('Health check error:', error);
    const errorResponse = new ErrorResponseDTO('Health check failed');
    return sendErrorResponse(res, errorResponse.error, 500);
  }
});

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Global error handler middleware
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`NodeJS Backend running on port ${config.PORT}`);
  console.log(`Environment: ${config.NODE_ENV}`);
  console.log(`API Base: ${config.API_PREFIX}`);
  console.log(`Swagger UI: http://localhost:${config.PORT}/api/docs`);
});