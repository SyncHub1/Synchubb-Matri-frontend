# Maitri Collaboration Platform Integration Guide

## Overview
This guide helps you integrate the Maitri collaboration platform into your existing website at `https://www.synchubb.in/dashboard/maitri`.

The entire Maitri platform is self-contained in the `MaitriCollaboration` component, making integration straightforward.

## Quick Start

1. **Copy all files** listed below to your main website
2. **Install dependencies** from the list below
3. **Add the route** in your main router
4. **Import styles** and you're done!

## Files to Copy

### 📁 Main Component
```
src/components/MaitriCollaboration.tsx
```

### 📁 Pages Directory (copy entire folder)
```
src/pages/
├── TeamDiscovery.tsx
├── TeamChat.tsx
├── TeamIDE.tsx
├── TeamVideo.tsx
├── TeamTasks.jsx
├── TeamWhiteboard.jsx
├── TeamAnalytics.tsx
├── CreateTeam.tsx
├── Index.tsx
└── NotFound.tsx
```

### 📁 UI Components (copy entire folder)
```
src/components/ui/
├── accordion.tsx
├── alert-dialog.tsx
├── alert.tsx
├── avatar.tsx
├── badge.tsx
├── breadcrumb.tsx
├── button.tsx
├── calendar.tsx
├── card.tsx
├── checkbox.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── form.tsx
├── input.tsx
├── label.tsx
├── popover.tsx
├── select.tsx
├── separator.tsx
├── slider.tsx
├── switch.tsx
├── tabs.tsx
├── textarea.tsx
├── toast.tsx
├── toaster.tsx
├── tooltip.tsx
└── ... (all other UI components)
```

### 📁 Whiteboard Components
```
src/components/whiteboard/
├── WhiteboardCanvas.tsx
├── Toolbar.tsx
├── ColorPicker.tsx
├── StrokeControls.tsx
├── CanvasControls.tsx
├── CollaborationPanel.tsx
├── CollaboratorCursors.tsx
├── ThemeToggle.tsx
└── WhiteboardMenu.tsx
```

### 📁 Utility Components
```
src/components/
├── FloatingActionButton.jsx
├── KeyboardShortcuts.jsx
├── MobileNavigation.tsx
├── QuickActions.jsx
└── StatusIndicator.jsx
```

### 📁 Hooks & Utilities
```
src/hooks/
├── use-mobile.tsx
└── use-toast.ts

src/lib/
└── utils.ts
```

### 📁 Styles & Configuration
```
src/index.css
tailwind.config.ts
```

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
import MaitriCollaboration from './path/to/components/MaitriCollaboration';

// In your main router (App.tsx or wherever your routes are defined)
<Routes>
  {/* Your existing routes */}
  <Route path="/dashboard/maitri/*" element={<MaitriCollaboration />} />
</Routes>
```

### Step 4: Update Tailwind Config
Merge the tailwind.config.ts from this project with your existing config:

```typescript
// In your tailwind.config.js/ts
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Add paths to Maitri components
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Copy the theme extensions from the provided tailwind.config.ts
      colors: {
        // Add all color definitions from the project
      },
      // Add other theme extensions
    },
  },
  plugins: [
    // Include all plugins from the project
  ],
}
```

### Step 5: Import Styles
Import the index.css in your main application entry point:

```tsx
// In your main.tsx or index.tsx
import './index.css'; // Make sure this includes all Maitri styles
```

### Step 6: Environment Setup (Optional)
If you want to use Supabase features, make sure to set up your environment variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing the Integration

After completing the integration:

1. **Verify routing**: Navigate to `https://www.synchubb.in/dashboard/maitri` 
2. **Check console**: Ensure no missing dependency errors
3. **Test functionality**: Try creating a team and accessing different modules
4. **Responsive design**: Test on different screen sizes

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

## Key Features

✅ **Self-contained**: No external dependencies on your existing code  
✅ **Responsive**: Works perfectly on desktop, tablet, and mobile  
✅ **Dark mode**: Built-in theme switching  
✅ **Real-time collaboration**: Chat, whiteboard, and more  
✅ **Modern UI**: Beautiful design with smooth animations  
✅ **TypeScript**: Full type safety  

## Troubleshooting

### Common Issues

**1. Style conflicts**: If styles look off, ensure index.css is imported properly
**2. Route not working**: Make sure the route path ends with `/*` for nested routing  
**3. Missing icons**: Verify lucide-react is installed and imported correctly  
**4. Build errors**: Check that all dependencies are installed with correct versions  

### Quick Fixes

```bash
# Clear cache and reinstall
npm run build --clear-cache
npm install

# Verify all dependencies
npm list --depth=0
```

## Advanced Configuration

### Custom Styling
Modify variables in `index.css` to match your brand:

```css
:root {
  --primary: 220 90% 56%; /* Your brand color */
  --secondary: 220 14.3% 95.9%;
  /* ... other variables */
}
```

### Environment Variables
```env
# Optional Supabase configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Support

If you need any modifications or have questions about the integration, please let me know!

---

**🚀 Ready to integrate? Just copy-paste the files and follow the 6 simple steps above!**