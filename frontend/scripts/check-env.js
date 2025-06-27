#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found!');
  
  if (fs.existsSync(envExamplePath)) {
    console.log('📋 Copying env.example to .env...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created from env.example');
    console.log('🔧 Please update .env file with your configuration');
  } else {
    console.log('❌ env.example file not found!');
    process.exit(1);
  }
}

// Check required environment variables
const requiredEnvVars = [
  'REACT_APP_API_URL'
];

const missingVars = [];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    missingVars.push(envVar);
  }
}

if (missingVars.length > 0) {
  console.log('⚠️  Missing required environment variables:');
  missingVars.forEach(varName => console.log(`   - ${varName}`));
  console.log('🔧 Please add these variables to your .env file');
} else {
  console.log('✅ Environment variables check passed');
}

console.log('🚀 Starting build process...'); 