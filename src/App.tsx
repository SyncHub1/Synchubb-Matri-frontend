import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/AuthProvider";
import { MatriProvider } from "@/contexts/MatriContext";
import { Suspense, lazy, Component } from "react";

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">Please refresh the page or try again later.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Lazy load pages to reduce bundle size and fix chunk loading
const Health = lazy(() => import("./pages/Health"));
const TeamDiscovery = lazy(() => import("./pages/TeamDiscovery"));
const TeamChat = lazy(() => import("./pages/TeamChat"));
const TeamIDE = lazy(() => import("./pages/TeamIDE"));
const TeamVideo = lazy(() => import("./pages/TeamVideo"));
const TeamTasks = lazy(() => import("./pages/TeamTasks.jsx"));
const TeamWhiteboard = lazy(() => import("./pages/TeamWhiteboard.jsx"));
const TeamAnalytics = lazy(() => import("./pages/TeamAnalytics"));
const CreateTeam = lazy(() => import("./pages/CreateTeam"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <MatriProvider>
            <TooltipProvider>
              <div className="min-h-screen bg-background">
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                  {/* Public routes */}
                  <Route path="/health" element={<Health />} />
                  
                  {/* Root route - redirect to main Maitri dashboard */}
                  <Route 
                    path="/" 
                    element={<Navigate to="/dashboard/maitri" replace />} 
                  />
                  
                  {/* Main Maitri Dashboard - Entry Point */}
                  <Route 
                    path="/dashboard/maitri" 
                    element={<TeamDiscovery />} 
                  />
                  
                  {/* Maitri Dashboard Routes - All under /dashboard/maitri */}
                  <Route path="/dashboard/maitri/teams" element={<TeamDiscovery />} />
                  <Route path="/dashboard/maitri/teams/create" element={<CreateTeam />} />
                  <Route path="/dashboard/maitri/teams/:id/chat" element={<TeamChat />} />
                  <Route path="/dashboard/maitri/teams/:id/ide" element={<TeamIDE />} />
                  <Route path="/dashboard/maitri/teams/:id/video" element={<TeamVideo />} />
                  <Route path="/dashboard/maitri/teams/:id/tasks" element={<TeamTasks />} />
                  <Route path="/dashboard/maitri/teams/:id/whiteboard" element={<TeamWhiteboard />} />
                  <Route path="/dashboard/maitri/teams/:id/analytics" element={<TeamAnalytics />} />
                  
                  {/* Legacy routes for backward compatibility */}
                  <Route path="/teams" element={<Navigate to="/dashboard/maitri/teams" replace />} />
                  <Route path="/teams/create" element={<Navigate to="/dashboard/maitri/teams/create" replace />} />
                  <Route path="/teams/:id/chat" element={<Navigate to="/dashboard/maitri/teams/:id/chat" replace />} />
                  <Route path="/teams/:id/ide" element={<Navigate to="/dashboard/maitri/teams/:id/ide" replace />} />
                  <Route path="/teams/:id/video" element={<Navigate to="/dashboard/maitri/teams/:id/video" replace />} />
                  <Route path="/teams/:id/tasks" element={<Navigate to="/dashboard/maitri/teams/:id/tasks" replace />} />
                  <Route path="/teams/:id/whiteboard" element={<Navigate to="/dashboard/maitri/teams/:id/whiteboard" replace />} />
                  <Route path="/teams/:id/analytics" element={<Navigate to="/dashboard/maitri/teams/:id/analytics" replace />} />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                  </Suspense>
              </BrowserRouter>
            </div>
          </TooltipProvider>
        </MatriProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;