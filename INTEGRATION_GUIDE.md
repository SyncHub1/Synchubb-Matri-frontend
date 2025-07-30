# Maitri Collaboration Platform Integration Guide

## Overview
This guide helps you integrate the Maitri collaboration platform into your existing website at `https://www.synchubb.in/dashboard/maitri`.

## Files to Copy

### 1. Main Component
- `src/components/MaitriCollaboration.tsx` - The main entry point

### 2. Pages (copy entire src/pages folder)
- `src/pages/TeamDiscovery.tsx`
- `src/pages/TeamChat.tsx`
- `src/pages/TeamIDE.tsx`
- `src/pages/TeamVideo.tsx`
- `src/pages/TeamTasks.jsx`
- `src/pages/TeamWhiteboard.jsx`
- `src/pages/TeamAnalytics.tsx`
- `src/pages/CreateTeam.tsx`

### 3. UI Components (copy entire src/components/ui folder)
All shadcn/ui components in `src/components/ui/`

### 4. Utility Components
- `src/components/FloatingActionButton.jsx`
- `src/components/KeyboardShortcuts.jsx`
- `src/components/MobileNavigation.tsx`
- `src/components/QuickActions.jsx`
- `src/components/StatusIndicator.jsx`

### 5. Styles
- `src/index.css` - Contains all the design system tokens
- `tailwind.config.ts` - Tailwind configuration

### 6. Utilities
- `src/lib/utils.ts`
- `src/hooks/use-mobile.tsx`
- `src/hooks/use-toast.ts`

## Required Dependencies

Add these to your package.json:

```json
{
  "dependencies": {
    "@hookform/resolvers": "^3.9.0",
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-alert-dialog": "^1.1.1",
    "@radix-ui/react-aspect-ratio": "^1.1.0",
    "@radix-ui/react-avatar": "^1.1.0",
    "@radix-ui/react-checkbox": "^1.1.1",
    "@radix-ui/react-collapsible": "^1.1.0",
    "@radix-ui/react-context-menu": "^2.2.1",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-hover-card": "^1.1.1",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-menubar": "^1.1.1",
    "@radix-ui/react-navigation-menu": "^1.2.0",
    "@radix-ui/react-popover": "^1.1.1",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.2.0",
    "@radix-ui/react-scroll-area": "^1.1.0",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.1",
    "@radix-ui/react-toggle": "^1.1.0",
    "@radix-ui/react-toggle-group": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.4",
    "@tanstack/react-query": "^5.56.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.0",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.3.0",
    "fabric": "^6.7.1",
    "input-otp": "^1.2.4",
    "lucide-react": "^0.462.0",
    "next-themes": "^0.3.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.53.0",
    "react-resizable-panels": "^2.1.3",
    "react-router-dom": "^6.26.2",
    "recharts": "^2.12.7",
    "sonner": "^1.5.0",
    "tailwind-merge": "^2.5.2",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.3",
    "zod": "^3.23.8"
  }
}
```

## Integration Steps

### Step 1: Install Dependencies
```bash
npm install [all dependencies listed above]
```

### Step 2: Copy Files
Copy all the files listed in the "Files to Copy" section to your project.

### Step 3: Update Your Routing
In your main website, update the route for `/dashboard/maitri` to render the MaitriCollaboration component:

```tsx
import MaitriCollaboration from './path/to/MaitriCollaboration';

// In your router
<Route path="/dashboard/maitri/*" element={<MaitriCollaboration />} />
```

### Step 4: Update Tailwind Config
Make sure your tailwind.config.js includes the paths to the new components and uses the configuration from this project.

### Step 5: Import Styles
Make sure to import the index.css file in your main application.

## Usage

Once integrated, users can access the Maitri collaboration platform at:
- `https://www.synchubb.in/dashboard/maitri/teams` - Team discovery
- `https://www.synchubb.in/dashboard/maitri/teams/create` - Create new team
- `https://www.synchubb.in/dashboard/maitri/teams/{id}/chat` - Team chat
- `https://www.synchubb.in/dashboard/maitri/teams/{id}/ide` - Collaborative IDE
- `https://www.synchubb.in/dashboard/maitri/teams/{id}/video` - Video conferencing
- `https://www.synchubb.in/dashboard/maitri/teams/{id}/tasks` - Task management
- `https://www.synchubb.in/dashboard/maitri/teams/{id}/whiteboard` - Collaborative whiteboard
- `https://www.synchubb.in/dashboard/maitri/teams/{id}/analytics` - Team analytics

## Notes

- The component is self-contained and includes its own routing
- All state management is handled internally
- The design system is fully customizable through the CSS variables in index.css
- The component supports dark mode out of the box
- All features are responsive and mobile-friendly

## Support

If you need any modifications or have questions about the integration, please let me know!