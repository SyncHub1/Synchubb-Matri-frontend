# 🚀 SyncHubb Matri-Verse Microservice

> **Collaborative Team Management & Whiteboard Platform**

A modern, responsive React microservice for team collaboration, featuring real-time whiteboard capabilities, team management, and seamless integration with the SyncHubb ecosystem.

## 📋 Table of Contents

- [Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🔧 Development](#-development)
- [🏗️ Architecture](#️-architecture)
- [🔗 Integration](#-integration)
- [📱 Responsive Design](#-responsive-design)
- [🎨 UI Components](#-ui-components)
- [🔐 Authentication](#-authentication)
- [📊 API Services](#-api-services)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [📚 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🎯 Overview

**SyncHubb Matri-Verse** is a comprehensive team collaboration microservice that provides:

- **Team Discovery & Management**: Create, join, and manage teams with advanced filtering
- **Real-time Whiteboard**: Collaborative drawing and brainstorming tools
- **Member Invitations**: Search authenticated users and send email invitations
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Microservice Architecture**: Seamless integration with SyncHubb ecosystem

## ✨ Features

### 🏢 **Team Management**
- ✅ **Team Creation**: Rich form with categories, skills, and member limits
- ✅ **Team Discovery**: Advanced filtering by category, visibility, and skills
- ✅ **Member Invitations**: Search authenticated users and email invitations
- ✅ **Team Chat**: Real-time collaboration with integrated tools
- ✅ **Responsive Design**: Works perfectly on all devices

### 🎨 **Whiteboard Collaboration**
- ✅ **Real-time Drawing**: Fabric.js powered canvas with multiple tools
- ✅ **Collaborative Cursors**: See other users' cursors in real-time
- ✅ **Tool Selection**: Pen, shapes, text, arrows, and more
- ✅ **Color & Stroke Controls**: Customizable drawing parameters
- ✅ **Export & Import**: Save and load whiteboard sessions

### 🔧 **Advanced Features**
- ✅ **Keyboard Shortcuts**: Power user shortcuts for efficiency
- ✅ **Theme Support**: Light, dark, and system themes
- ✅ **Responsive UI**: Mobile-first design approach
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Loading States**: Smooth user experience

## 🛠️ Tech Stack

### **Frontend Framework**
- **React 18.3.1** - Modern UI library with hooks
- **TypeScript 5.5.3** - Type-safe development
- **Vite 5.4.1** - Fast build tool and dev server

### **UI & Styling**
- **Tailwind CSS 3.4.11** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### **State Management & Data**
- **React Router DOM 6.26.2** - Client-side routing
- **TanStack Query 5.84.1** - Server state management
- **React Hook Form 7.53.0** - Form handling
- **Zod 3.23.8** - Schema validation

### **Real-time & Communication**
- **Socket.IO Client 4.8.1** - Real-time communication
- **Axios 1.11.0** - HTTP client for API calls

### **Whiteboard & Graphics**
- **Fabric.js 6.7.1** - Canvas manipulation library
- **Recharts 2.12.7** - Data visualization

### **Development Tools**
- **ESLint 9.9.0** - Code linting
- **PostCSS 8.4.47** - CSS processing
- **Autoprefixer 10.4.20** - CSS vendor prefixes

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ and npm
- Git

### **Clone & Install**
```bash
# Clone the repository
git clone <repository-url>
cd sync-hubb-matri-verse

# Install dependencies
npm install

# Setup environment
npm run setup

# Start development server
npm run dev
```

### **Verify Setup**
```bash
# Run verification script
npm run verify
```

## 📦 Installation

### **1. Environment Setup**
```bash
# Copy environment template
cp env.example .env

# Or run the setup script
npm run setup
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Start Development**
```bash
npm run dev
```

### **4. Build for Production**
```bash
npm run build
```

## ⚙️ Configuration

### **Environment Variables**
```env
# API Service URLs
VITE_AUTH_SERVICE_URL=http://localhost:8000
VITE_MEDIA_API_URL=http://localhost:3001
VITE_WEBSOCKET_URL=ws://localhost:3002
VITE_SHARED_UTILS_URL=http://localhost:3004

# Application Settings
VITE_EMBEDDED_MODE=true
VITE_APP_NAME=SyncHubb Matri-Verse
```

### **Development Configuration**
- **Port**: 5173 (default)
- **Hot Reload**: Enabled
- **TypeScript**: Strict mode
- **ESLint**: Configured for React/TypeScript

## 🔧 Development

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run setup        # Setup environment
npm run verify       # Verify setup
```

### **Project Structure**
```
sync-hubb-matri-verse/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   └── whiteboard/     # Whiteboard components
│   ├── pages/              # Page components
│   ├── lib/                # Utilities and API services
│   ├── hooks/              # Custom React hooks
│   └── config/             # Configuration files
├── public/                 # Static assets
├── integration-components/  # Integration examples
└── docs/                   # Documentation
```

## 🏗️ Architecture

### **Microservice Design**
- **Frontend Microservice**: Independent React application
- **API Communication**: RESTful APIs with Axios
- **Real-time Features**: WebSocket connections
- **State Management**: Local state with React hooks

### **Component Architecture**
- **Atomic Design**: Components, pages, and layouts
- **TypeScript**: Full type safety
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components

## 🔗 Integration

### **SyncHubb Ecosystem**
- **Main Application**: Embedded via iframe
- **Authentication**: Shared via localStorage/postMessage
- **Routing**: `/dashboard/maitri` base path
- **Communication**: postMessage API

### **API Services**
- **Auth Service**: User authentication and management
- **Media API**: File uploads and media handling
- **WebSocket Service**: Real-time communication
- **Shared Utils**: Common utilities and helpers

## 📱 Responsive Design

### **Breakpoints**
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### **Features**
- ✅ **Mobile-first**: Optimized for mobile devices
- ✅ **Touch-friendly**: Proper touch interactions
- ✅ **Responsive navigation**: Adaptive menu systems
- ✅ **Flexible layouts**: Grid and flexbox layouts

## 🎨 UI Components

### **Design System**
- **Color Palette**: Dark theme with purple accents
- **Typography**: Modern, readable fonts
- **Spacing**: Consistent spacing system
- **Shadows**: Subtle depth and elevation

### **Component Library**
- **shadcn/ui**: High-quality React components
- **Radix UI**: Accessible primitives
- **Custom Components**: Tailored for specific needs

## 🔐 Authentication

### **Embedded Mode**
- **External Authentication**: Handled by main app
- **Token Sharing**: Via localStorage/postMessage
- **Seamless Experience**: No login prompts
- **Secure Communication**: Encrypted token transfer

### **Security Features**
- **CORS Protection**: Proper cross-origin handling
- **Token Validation**: Secure token verification
- **Error Handling**: Graceful authentication failures

## 📊 API Services

### **Team Service**
```typescript
// Create team with members
teamService.createTeam({
  name: "Team Name",
  description: "Team description",
  category: "Web Development",
  visibility: "public",
  maxMembers: 5,
  location: "Remote",
  skills: ["React", "Node.js"],
  members: selectedMembers,
  emailInvites: emailAddresses
});

// Search authenticated users
teamService.searchUsers("query");

// Send email invitations
teamService.sendEmailInvitations(emails, teamId, teamName);
```

### **Whiteboard Service**
```typescript
// Real-time collaboration
wsService.connect(userId, token);

// Canvas operations
fabricCanvas.add(new fabric.Rect({...}));
fabricCanvas.renderAll();
```

## 🧪 Testing

### **Manual Testing**
1. **Team Creation**: Test form validation and submission
2. **Team Discovery**: Test filtering and search
3. **Whiteboard**: Test drawing tools and collaboration
4. **Responsive**: Test on different screen sizes

### **Browser Testing**
- **Chrome**: Latest version
- **Firefox**: Latest version
- **Safari**: Latest version
- **Edge**: Latest version

## 🚀 Deployment

### **Build Process**
```bash
# Production build
npm run build

# Development build
npm run build:dev
```

### **Deployment Options**
- **Vercel**: Recommended for React apps
- **Netlify**: Static site hosting
- **Docker**: Containerized deployment
- **CDN**: Static asset optimization

### **Environment Setup**
```bash
# Production environment
VITE_AUTH_SERVICE_URL=https://api.synchubb.in
VITE_MEDIA_API_URL=https://media.synchubb.in
VITE_WEBSOCKET_URL=wss://ws.synchubb.in
```

## 📚 Documentation

### **Available Guides**
- **Setup Guide**: Initial project setup
- **Integration Guide**: SyncHubb integration
- **API Documentation**: Service endpoints
- **Component Library**: UI component usage

### **Code Documentation**
- **TypeScript**: Full type definitions
- **JSDoc**: Function documentation
- **README**: Component usage examples

## 🤝 Contributing

### **Development Workflow**
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### **Code Standards**
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured rules
- **Prettier**: Code formatting
- **Git Hooks**: Pre-commit checks

## 📄 License

This project is part of the **SyncHubb Ecosystem** and is licensed under the MIT License.

---

## 🎉 **Ready to Collaborate?**

**SyncHubb Matri-Verse** is ready for production use with comprehensive team management, real-time whiteboard collaboration, and seamless integration capabilities.

**🚀 Start building amazing teams today!**

---

**Built with ❤️ by the SyncHubb Team**
