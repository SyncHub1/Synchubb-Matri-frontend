#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = `# SyncHubb Matri Frontend Environment Variables

# API Service URLs
VITE_AUTH_SERVICE_URL=http://localhost:8000
VITE_MEDIA_API_URL=http://localhost:3001
VITE_WEBSOCKET_URL=ws://localhost:3002
VITE_SHARED_UTILS_URL=http://localhost:3004

# Frontend Configuration
VITE_APP_TITLE=SyncHubb Matri
VITE_APP_VERSION=1.0.0

# Development Settings
VITE_DEV_MODE=true
VITE_ENABLE_LOGGING=true

# Integration Settings
VITE_EMBEDDED_MODE=true
VITE_USE_EXTERNAL_AUTH=true
VITE_MAIN_APP_URL=https://www.synchubb.in
VITE_BYPASS_LOGIN_IF_AUTHENTICATED=true

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=false

# External Services (Optional)
VITE_GOOGLE_ANALYTICS_ID=
VITE_SENTRY_DSN=

# WebSocket Configuration
VITE_WS_RECONNECT_ATTEMPTS=5
VITE_WS_RECONNECT_DELAY=1000

# Upload Configuration
VITE_MAX_FILE_SIZE=100MB
VITE_ALLOWED_FILE_TYPES=image/*,video/*,audio/*

# Authentication
VITE_AUTH_TOKEN_KEY=authToken
VITE_AUTH_REFRESH_INTERVAL=300000

# API Timeouts
VITE_API_TIMEOUT=10000
VITE_UPLOAD_TIMEOUT=30000
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('📁 Location:', envPath);
  console.log('\n🔐 Authentication Bypass Configuration:');
  console.log('   ✅ VITE_USE_EXTERNAL_AUTH=true');
  console.log('   ✅ VITE_BYPASS_LOGIN_IF_AUTHENTICATED=true');
  console.log('   ✅ VITE_MAIN_APP_URL=https://www.synchubb.in');
  console.log('\n🚀 You can now start the development server:');
  console.log('   npm run dev');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  console.log('\n📝 Please create a .env file manually with the following content:');
  console.log(envContent);
} 