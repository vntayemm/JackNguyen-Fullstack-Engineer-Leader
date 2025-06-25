import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config.js';
import routes from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import oas from 'express-oas-generator';
import path from 'path';
import fs from 'fs';

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

// Use merged routes
app.use(config.API_PREFIX, routes);

// Serve the generated swagger.json file
app.get('/api-docs/swagger.json', (req, res) => {
  const swaggerPath = path.join(process.cwd(), 'swagger.json');
  if (fs.existsSync(swaggerPath)) {
    res.sendFile(swaggerPath);
  } else {
    res.status(404).json({ error: 'swagger.json not found. Make sure to hit your API endpoints first.' });
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, { swaggerUrl: '/api-docs/swagger.json' }));

app.get('/health', (req, res) => res.json({ 
  status: 'healthy',
  environment: config.NODE_ENV,
  timestamp: new Date().toISOString()
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: config.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

app.listen(config.PORT, () => {
  console.log(`NodeJS Backend running on port ${config.PORT}`);
  console.log(`Environment: ${config.NODE_ENV}`);
  console.log(`API Base: ${config.API_PREFIX}`);
  console.log(`Swagger UI: http://localhost:${config.PORT}/api-docs`);
}); 