# 🔧 Vercel Environment Variables Setup

## 📋 Required Environment Variables

When deploying to Vercel, you need to set these environment variables in the Vercel dashboard:

### **Application Settings**
```env
VITE_APP_NAME=SyncHubb Matri-Verse
VITE_EMBEDDED_MODE=true
VITE_USE_EXTERNAL_AUTH=true
VITE_BYPASS_LOGIN_IF_AUTHENTICATED=true
```

### **Main Application Integration**
```env
VITE_MAIN_APP_URL=https://www.synchubb.in
VITE_MAIN_APP_ORIGIN=https://www.synchubb.in
```

### **API Service URLs (Production)**
```env
VITE_API_BASE_URL=https://api.synchubb.in
VITE_AUTH_SERVICE_URL=https://auth.synchubb.in
VITE_MEDIA_SERVICE_URL=https://media.synchubb.in
VITE_WEBSOCKET_SERVICE_URL=wss://ws.synchubb.in
VITE_WORKER_SERVICE_URL=https://worker.synchubb.in
```

### **WebSocket Configuration**
```env
VITE_WS_RECONNECT_ATTEMPTS=5
VITE_WS_RECONNECT_DELAY=1000
```

### **Feature Flags**
```env
VITE_ENABLE_WHITEBOARD=true
VITE_ENABLE_VIDEO_CALLS=true
VITE_ENABLE_SCREEN_SHARING=true
VITE_ENABLE_FILE_UPLOAD=true
VITE_ENABLE_TEAM_ANALYTICS=true
```

## 🛠️ How to Set Environment Variables in Vercel

### **Method 1: Vercel Dashboard**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Settings" tab
4. Click "Environment Variables"
5. Add each variable:
   - **Name**: `VITE_APP_NAME`
   - **Value**: `SyncHubb Matri-Verse`
   - **Environment**: Production, Preview, Development
6. Click "Add"
7. Repeat for all variables

### **Method 2: Vercel CLI**

```bash
# Set environment variables via CLI
vercel env add VITE_APP_NAME production
vercel env add VITE_EMBEDDED_MODE production
vercel env add VITE_USE_EXTERNAL_AUTH production
vercel env add VITE_BYPASS_LOGIN_IF_AUTHENTICATED production
vercel env add VITE_MAIN_APP_URL production
vercel env add VITE_MAIN_APP_ORIGIN production
vercel env add VITE_API_BASE_URL production
vercel env add VITE_AUTH_SERVICE_URL production
vercel env add VITE_MEDIA_SERVICE_URL production
vercel env add VITE_WEBSOCKET_SERVICE_URL production
vercel env add VITE_WORKER_SERVICE_URL production
vercel env add VITE_WS_RECONNECT_ATTEMPTS production
vercel env add VITE_WS_RECONNECT_DELAY production
vercel env add VITE_ENABLE_WHITEBOARD production
vercel env add VITE_ENABLE_VIDEO_CALLS production
vercel env add VITE_ENABLE_SCREEN_SHARING production
vercel env add VITE_ENABLE_FILE_UPLOAD production
vercel env add VITE_ENABLE_TEAM_ANALYTICS production
```

### **Method 3: .env.production File**

Create a `.env.production` file in your project root:

```env
VITE_APP_NAME=SyncHubb Matri-Verse
VITE_EMBEDDED_MODE=true
VITE_USE_EXTERNAL_AUTH=true
VITE_BYPASS_LOGIN_IF_AUTHENTICATED=true
VITE_MAIN_APP_URL=https://www.synchubb.in
VITE_MAIN_APP_ORIGIN=https://www.synchubb.in
VITE_API_BASE_URL=https://api.synchubb.in
VITE_AUTH_SERVICE_URL=https://auth.synchubb.in
VITE_MEDIA_SERVICE_URL=https://media.synchubb.in
VITE_WEBSOCKET_SERVICE_URL=wss://ws.synchubb.in
VITE_WORKER_SERVICE_URL=https://worker.synchubb.in
VITE_WS_RECONNECT_ATTEMPTS=5
VITE_WS_RECONNECT_DELAY=1000
VITE_ENABLE_WHITEBOARD=true
VITE_ENABLE_VIDEO_CALLS=true
VITE_ENABLE_SCREEN_SHARING=true
VITE_ENABLE_FILE_UPLOAD=true
VITE_ENABLE_TEAM_ANALYTICS=true
```

## 🔍 Verification

### **Check Environment Variables**

After setting up, verify they're working:

1. **Deploy your project**
2. **Check build logs** in Vercel dashboard
3. **Test the application** - environment variables should be available

### **Debug Environment Variables**

Add this to your component to debug:

```javascript
console.log('Environment Variables:', {
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  VITE_EMBEDDED_MODE: import.meta.env.VITE_EMBEDDED_MODE,
  VITE_MAIN_APP_URL: import.meta.env.VITE_MAIN_APP_URL,
  // ... other variables
});
```

## ⚠️ Important Notes

1. **Variable Names**: Must start with `VITE_` to be accessible in the browser
2. **Case Sensitivity**: Variable names are case-sensitive
3. **No Spaces**: Don't include spaces around the `=` sign
4. **Quotes**: Use quotes for values with spaces
5. **Redeploy**: After adding environment variables, redeploy your project

## 🚀 Quick Setup Script

```bash
#!/bin/bash

# Quick environment variables setup
echo "Setting up Vercel environment variables..."

vercel env add VITE_APP_NAME production <<< "SyncHubb Matri-Verse"
vercel env add VITE_EMBEDDED_MODE production <<< "true"
vercel env add VITE_USE_EXTERNAL_AUTH production <<< "true"
vercel env add VITE_BYPASS_LOGIN_IF_AUTHENTICATED production <<< "true"
vercel env add VITE_MAIN_APP_URL production <<< "https://www.synchubb.in"
vercel env add VITE_MAIN_APP_ORIGIN production <<< "https://www.synchubb.in"
vercel env add VITE_API_BASE_URL production <<< "https://api.synchubb.in"
vercel env add VITE_AUTH_SERVICE_URL production <<< "https://auth.synchubb.in"
vercel env add VITE_MEDIA_SERVICE_URL production <<< "https://media.synchubb.in"
vercel env add VITE_WEBSOCKET_SERVICE_URL production <<< "wss://ws.synchubb.in"
vercel env add VITE_WORKER_SERVICE_URL production <<< "https://worker.synchubb.in"

echo "Environment variables set successfully!"
echo "Redeploy your project to apply changes."
``` 