import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'DNS/Email Security API',
    description: 'Auto-generated OpenAPI spec',
    version: '1.0.0'
  },
  host: '',
  basePath: '/api',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
};

const outputFile = 'swagger.json';
const endpointsFiles = ['src/routes/index.js'];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger spec generated at', outputFile);
});