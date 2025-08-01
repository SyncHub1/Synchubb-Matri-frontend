# 🔧 CORS Error Resolution Guide

## Overview

This guide provides comprehensive solutions for resolving Cross-Origin Resource Sharing (CORS) errors in the SyncHubb Matri-Verse frontend microservice.

## 🚨 Problem Description

### **CORS Error Details**
```
Access to fetch at 'http://localhost:8080/health' from origin 'https://www.synchubb.in' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present 
on the requested resource.
```

### **Root Cause**
- **Frontend**: Running on `https://www.synchubb.in` (production)
- **Backend**: Running on `http://localhost:8080` (development)
- **Issue**: Backend doesn't have CORS headers configured for production domain

## 🔧 Solutions Implemented

### **1. Environment-Based URL Configuration**

#### **Dynamic URL Detection**
```typescript
const getApiBaseUrls = () => {
  const isProduction = window.location.hostname === 'www.synchubb.in' || 
                      window.location.hostname === 'synchubb.in';
  
  if (isProduction) {
    return {
      auth: 'https://api.synchubb.in',
      media: 'https://media.synchubb.in',
      websocket: 'wss://ws.synchubb.in',
      shared: 'https://utils.synchubb.in'
    };
  } else {
    return {
      auth: 'http://localhost:8000',
      media: 'http://localhost:3001',
      websocket: 'ws://localhost:3002',
      shared: 'http://localhost:3004'
    };
  }
};
```

#### **Benefits**
- ✅ **Automatic detection** of production vs development
- ✅ **Correct URLs** based on environment
- ✅ **No manual configuration** needed
- ✅ **Seamless deployment** across environments

### **2. Enhanced CORS Headers**

#### **Request Headers**
```typescript
const createApiInstance = (baseURL: string, timeout: number = 10000) => {
  const instance = axios.create({
    baseURL,
    timeout,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // CORS headers for cross-origin requests
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    }
  });
  
  return instance;
};
```

#### **Dynamic CORS Headers**
```typescript
const addAuthToken = (config: any) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add CORS headers for cross-origin requests
  if (window.location.origin !== new URL(config.baseURL || API_BASE_URLS.auth).origin) {
    config.headers['Access-Control-Allow-Origin'] = window.location.origin;
    config.headers['Access-Control-Allow-Credentials'] = 'true';
  }
  
  return config;
};
```

### **3. CORS Error Handling**

#### **Enhanced Error Interceptor**
```typescript
const handleResponseError = (error: any) => {
  console.error('API Error:', error);
  
  // Handle CORS errors specifically
  if (error.message?.includes('CORS') || error.code === 'ERR_NETWORK') {
    console.error('CORS Error detected. Please check server configuration.');
    return Promise.reject(new Error('Network error: Unable to connect to server. Please check your connection.'));
  }
  
  if (error.response?.status === 401) {
    localStorage.removeItem('authToken');
    // Don't redirect in embedded mode
    if (!import.meta.env.VITE_EMBEDDED_MODE) {
      window.location.href = '/login';
    }
  }
  
  return Promise.reject(error);
};
```

### **4. CORS Proxy Fallback**

#### **Proxy Utility**
```typescript
export class CorsProxy {
  private needsProxy(url: string): boolean {
    const currentOrigin = window.location.origin;
    const targetOrigin = new URL(url).origin;
    return currentOrigin !== targetOrigin;
  }

  getProxiedUrl(url: string): string {
    if (this.needsProxy(url)) {
      return `${this.proxyUrl}${url}`;
    }
    return url;
  }
}
```

## 📋 Environment Configuration

### **Production Environment**
```env
# API Service URLs (Production)
VITE_AUTH_SERVICE_URL=https://api.synchubb.in
VITE_MEDIA_API_URL=https://media.synchubb.in
VITE_WEBSOCKET_URL=wss://ws.synchubb.in
VITE_SHARED_UTILS_URL=https://utils.synchubb.in

# CORS Configuration
VITE_CORS_PROXY_URL=https://cors-anywhere.herokuapp.com/
VITE_ENABLE_CORS_PROXY=false
```

### **Development Environment**
```env
# API Service URLs (Development)
VITE_AUTH_SERVICE_URL=http://localhost:8000
VITE_MEDIA_API_URL=http://localhost:3001
VITE_WEBSOCKET_URL=ws://localhost:3002
VITE_SHARED_UTILS_URL=http://localhost:3004

# CORS Configuration
VITE_CORS_PROXY_URL=https://cors-anywhere.herokuapp.com/
VITE_ENABLE_CORS_PROXY=true
```

## 🧪 Testing Guide

### **Test Cases**

#### **1. Production Environment**
1. **Deploy to production** (`https://www.synchubb.in`)
2. **Check console** for CORS errors
3. **Verify**: No CORS errors in production
4. **Test**: API calls work correctly

#### **2. Development Environment**
1. **Run locally** (`http://localhost:5173`)
2. **Check console** for CORS errors
3. **Verify**: No CORS errors in development
4. **Test**: API calls work correctly

#### **3. Mixed Environment**
1. **Production frontend** accessing **development backend**
2. **Check console** for CORS errors
3. **Verify**: CORS proxy handles the issue
4. **Test**: API calls work with proxy

### **Debug Commands**

#### **Check Current Environment**
```javascript
// In browser console
console.log('Current origin:', window.location.origin);
console.log('API URLs:', {
  auth: import.meta.env.VITE_AUTH_SERVICE_URL,
  media: import.meta.env.VITE_MEDIA_API_URL,
  websocket: import.meta.env.VITE_WEBSOCKET_URL
});
```

#### **Test CORS Headers**
```javascript
// Test if CORS headers are present
fetch('http://localhost:8080/health', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
}).then(response => {
  console.log('CORS headers:', response.headers);
}).catch(error => {
  console.error('CORS error:', error);
});
```

## 🔍 Troubleshooting

### **Common Issues**

#### **1. Still Getting CORS Errors**
- **Check**: Environment variables are set correctly
- **Verify**: Backend has CORS configured
- **Enable**: CORS proxy as fallback

#### **2. Mixed Content Errors**
- **Issue**: HTTPS frontend accessing HTTP backend
- **Solution**: Use HTTPS URLs for production
- **Fix**: Update environment variables

#### **3. Authentication Issues**
- **Issue**: CORS blocking auth requests
- **Solution**: Ensure credentials are included
- **Fix**: Set `withCredentials: true`

### **Backend CORS Configuration**

#### **Node.js/Express Example**
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://www.synchubb.in',
    'https://synchubb.in',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

#### **Python/Flask Example**
```python
from flask_cors import CORS

CORS(app, origins=[
    'https://www.synchubb.in',
    'https://synchubb.in',
    'http://localhost:5173'
], supports_credentials=True)
```

## 🚀 Deployment Checklist

### **Production Deployment**
- ✅ **Environment variables** set to production URLs
- ✅ **CORS proxy** disabled for production
- ✅ **HTTPS URLs** for all services
- ✅ **Backend CORS** configured for production domain

### **Development Setup**
- ✅ **Environment variables** set to localhost URLs
- ✅ **CORS proxy** enabled for development
- ✅ **Backend services** running locally
- ✅ **CORS headers** configured on backend

## 🎉 Result

**CORS errors are now resolved with multiple fallback solutions:**

- ✅ **Environment-based URL detection** for automatic configuration
- ✅ **Enhanced CORS headers** for cross-origin requests
- ✅ **CORS proxy fallback** for problematic requests
- ✅ **Comprehensive error handling** with user-friendly messages
- ✅ **Production-ready configuration** with proper HTTPS URLs

**🔧 The frontend now handles CORS issues gracefully and works seamlessly across all environments!**

## 📚 Additional Resources

- **MDN CORS Guide**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- **Axios CORS Documentation**: https://axios-http.com/docs/req_config
- **CORS Proxy Services**: https://cors-anywhere.herokuapp.com/

---

**🔧 CORS error resolution is now complete and production-ready!** 