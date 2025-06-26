#!/usr/bin/env node

/**
 * Swagger Documentation Generator
 * Generates OpenAPI specification from controllers and DTOs
 */

import { autoGenerateSwagger } from '../src/swagger-generator.js';
import path from 'path';
import fs from 'fs';

console.log('🚀 Generating OpenAPI specification...');

try {
  // Generate the OpenAPI specification
  const spec = autoGenerateSwagger();
  
  console.log('✅ OpenAPI specification generated successfully!');
  console.log(`📄 File saved to: ${path.join(process.cwd(), 'swagger.json')}`);
  console.log(`📊 Total endpoints: ${Object.keys(spec.paths).length}`);
  console.log(`🏷️  Total tags: ${spec.tags.length}`);
  console.log(`📋 Total schemas: ${Object.keys(spec.components.schemas).length}`);
  
  // Display some statistics
  const tagStats = {};
  Object.values(spec.paths).forEach(path => {
    Object.values(path).forEach(method => {
      if (method.tags && method.tags.length > 0) {
        method.tags.forEach(tag => {
          tagStats[tag] = (tagStats[tag] || 0) + 1;
        });
      }
    });
  });
  
  console.log('\n📈 Endpoints by tag:');
  Object.entries(tagStats).forEach(([tag, count]) => {
    console.log(`  ${tag}: ${count} endpoints`);
  });
  
  console.log('\n🎯 Next steps:');
  console.log('  1. Start your server: npm start');
  console.log('  2. Visit Swagger UI: http://localhost:8080/docs');
  console.log('  3. Test your API endpoints');
  
} catch (error) {
  console.error('❌ Error generating OpenAPI specification:', error.message);
  process.exit(1);
} 