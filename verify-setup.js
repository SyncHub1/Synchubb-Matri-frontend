#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying Authentication Bypass Setup...\n');

// Check 1: .env file exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file exists');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'VITE_USE_EXTERNAL_AUTH=true',
    'VITE_BYPASS_LOGIN_IF_AUTHENTICATED=true',
    'VITE_MAIN_APP_URL=https://www.synchubb.in'
  ];
  
  let allVarsPresent = true;
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`✅ ${varName}`);
    } else {
      console.log(`❌ Missing: ${varName}`);
      allVarsPresent = false;
    }
  });
  
  if (!allVarsPresent) {
    console.log('\n⚠️  Some required environment variables are missing.');
    console.log('   Run: npm run setup');
  }
} else {
  console.log('❌ .env file not found');
  console.log('   Run: npm run setup');
}

// Check 2: Required files exist
const requiredFiles = [
  'src/hooks/useAuth.ts',
  'src/components/AuthProvider.tsx',
  'src/components/ProtectedRoute.tsx',
  'src/App.tsx',
  'integration-components/MaitriIframe.jsx',
  'AUTHENTICATION_BYPASS_GUIDE.md'
];

console.log('\n📁 Checking required files:');
requiredFiles.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${filePath}`);
  } else {
    console.log(`❌ Missing: ${filePath}`);
  }
});

// Check 3: Verify useAuth.ts has external auth handling
const useAuthPath = path.join(__dirname, 'src/hooks/useAuth.ts');
if (fs.existsSync(useAuthPath)) {
  const useAuthContent = fs.readFileSync(useAuthPath, 'utf8');
  const externalAuthChecks = [
    'set-auth-token',
    'set-user-data',
    'addEventListener(\'message\'',
    'handleExternalAuth'
  ];
  
  console.log('\n🔐 Checking useAuth.ts external auth handling:');
  externalAuthChecks.forEach(check => {
    if (useAuthContent.includes(check)) {
      console.log(`✅ ${check}`);
    } else {
      console.log(`❌ Missing: ${check}`);
    }
  });
}

// Check 4: Verify App.tsx routing
const appPath = path.join(__dirname, 'src/App.tsx');
if (fs.existsSync(appPath)) {
  const appContent = fs.readFileSync(appPath, 'utf8');
  const routingChecks = [
    'Navigate to="/teams"',
    'ProtectedRoute',
    '/dashboard/maitri'
  ];
  
  console.log('\n🛣️  Checking App.tsx routing:');
  routingChecks.forEach(check => {
    if (appContent.includes(check)) {
      console.log(`✅ ${check}`);
    } else {
      console.log(`❌ Missing: ${check}`);
    }
  });
}

// Check 5: Verify MaitriIframe component
const iframePath = path.join(__dirname, 'integration-components/MaitriIframe.jsx');
if (fs.existsSync(iframePath)) {
  const iframeContent = fs.readFileSync(iframePath, 'utf8');
  const iframeChecks = [
    'set-auth-token',
    'set-user-data',
    'postMessage',
    'localStorage.getItem'
  ];
  
  console.log('\n🖼️  Checking MaitriIframe component:');
  iframeChecks.forEach(check => {
    if (iframeContent.includes(check)) {
      console.log(`✅ ${check}`);
    } else {
      console.log(`❌ Missing: ${check}`);
    }
  });
}

console.log('\n🎯 Setup Summary:');
console.log('   The authentication bypass system is configured to:');
console.log('   1. Listen for external auth tokens from main app');
console.log('   2. Automatically authenticate users');
console.log('   3. Redirect to content (bypassing login)');
console.log('   4. Handle user data sharing');

console.log('\n📋 Next Steps:');
console.log('   1. Start Maitri service: npm run dev');
console.log('   2. In main app, use MaitriIframe component');
console.log('   3. Ensure main app stores authToken in localStorage');
console.log('   4. Test by clicking "Maitri" in main app');

console.log('\n📚 Documentation:');
console.log('   - AUTHENTICATION_BYPASS_GUIDE.md (this guide)');
console.log('   - MAIN_APP_SETUP.md (main app integration)');
console.log('   - TROUBLESHOOTING.md (common issues)');

console.log('\n🚀 Ready to test!'); 