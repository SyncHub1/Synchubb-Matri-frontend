# 🚀 Deploying SyncHubb Matri-Verse to Vercel

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **Node.js**: Version 16 or higher
4. **Vercel CLI**: Install globally

## 🛠️ Installation Steps

### **1. Install Vercel CLI**
```bash
npm install -g vercel
```

### **2. Login to Vercel**
```bash
vercel login
```

### **3. Navigate to Maitri Service**
```bash
cd sync-hubb-matri-verse
```

### **4. Build the Project**
```bash
npm run build
```

### **5. Deploy to Vercel**
```bash
vercel
```

## 🔧 Configuration

### **Environment Variables Setup**

When prompted during deployment, set these environment variables:

```env
# Application Settings
VITE_APP_NAME=SyncHubb Matri-Verse
VITE_EMBEDDED_MODE=true
VITE_USE_EXTERNAL_AUTH=true
VITE_BYPASS_LOGIN_IF_AUTHENTICATED=true

# Main Application Integration
VITE_MAIN_APP_URL=https://www.synchubb.in
VITE_MAIN_APP_ORIGIN=https://www.synchubb.in

# API Service URLs (Production)
VITE_API_BASE_URL=https://api.synchubb.in
VITE_AUTH_SERVICE_URL=https://auth.synchubb.in
VITE_MEDIA_SERVICE_URL=https://media.synchubb.in
VITE_WEBSOCKET_SERVICE_URL=wss://ws.synchubb.in
VITE_WORKER_SERVICE_URL=https://worker.synchubb.in
```

### **Vercel Configuration**

The `vercel.json` file is already configured with:
- ✅ **Build command**: `npm run build`
- ✅ **Output directory**: `dist`
- ✅ **Framework**: `vite`
- ✅ **SPA routing**: All routes redirect to `index.html`
- ✅ **CORS headers**: Configured for iframe embedding

## 🌐 Deployment Options

### **Option 1: Deploy via Vercel Dashboard (Recommended)**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `sync-hubb-matri-verse` directory

3. **Configure Environment Variables**
   - Add all environment variables from the list above
   - Set Framework Preset to "Vite"
   - Set Build Command to `npm run build`
   - Set Output Directory to `dist`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### **Option 2: Deploy via CLI**

```bash
# Navigate to project
cd sync-hubb-matri-verse

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? [your-account]
# - Link to existing project? N
# - Project name? synchubb-matri-verse
# - Directory? ./
# - Override settings? N
```

## 🔗 Update Main Frontend

### **Update Environment Variables**

After deployment, update your main frontend's environment variables:

```env
# In frontend/.env
REACT_APP_MAITRI_URL=https://your-vercel-app.vercel.app
VITE_MAITRI_URL=https://your-vercel-app.vercel.app
```

### **Update MaitriIframe Component**

The MaitriIframe component will automatically use the new URL.

## 🧪 Testing Deployment

### **1. Test Direct Access**
- Visit your Vercel URL: `https://your-app.vercel.app`
- Should show Maitri service landing page
- Navigate to: `https://your-app.vercel.app/dashboard/maitri`
- Should show Team Discovery page

### **2. Test Integration**
- Open main frontend: `https://www.synchubb.in`
- Login to the application
- Click on "Maitri" in navigation
- Should load Maitri service in iframe

### **3. Test Features**
- ✅ Team Discovery
- ✅ Team Creation
- ✅ Team Chat
- ✅ Whiteboard
- ✅ Video Calls
- ✅ File Upload

## 🔧 Troubleshooting

### **Build Errors**
```bash
# Check build locally first
npm run build

# If successful, deploy
vercel
```

### **CORS Issues**
- Verify `vercel.json` has correct CORS headers
- Check environment variables are set correctly
- Ensure main app URL is in CORS allowed origins

### **Routing Issues**
- Verify `vercel.json` has SPA routing configuration
- Check that all routes redirect to `index.html`

### **Environment Variables**
- Verify all variables are set in Vercel dashboard
- Check variable names start with `VITE_`
- Ensure no typos in variable names

## 📊 Monitoring

### **Vercel Dashboard**
- **Analytics**: View traffic and performance
- **Functions**: Monitor serverless functions
- **Logs**: Check build and runtime logs

### **Custom Domain (Optional)**
1. Go to Vercel dashboard
2. Select your project
3. Go to "Settings" > "Domains"
4. Add custom domain: `maitri.synchubb.in`

## 🚀 Production Checklist

- ✅ **Code pushed to GitHub**
- ✅ **Environment variables configured**
- ✅ **Build successful**
- ✅ **Deployment completed**
- ✅ **Direct access working**
- ✅ **Iframe integration working**
- ✅ **All features tested**
- ✅ **Main frontend updated**

## 🎉 Success!

Your Maitri service is now deployed and accessible at:
`https://your-vercel-app.vercel.app`

The main SyncHubb application can now embed the Maitri service via iframe when users click on the "Maitri" section! 