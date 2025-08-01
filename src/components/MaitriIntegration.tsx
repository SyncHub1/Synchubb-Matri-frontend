import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

// Import pages
import TeamDiscovery from '@/pages/TeamDiscovery';
import TeamChat from '@/pages/TeamChat';
import TeamIDE from '@/pages/TeamIDE';
import TeamVideo from '@/pages/TeamVideo';
import TeamTasks from '@/pages/TeamTasks.jsx';
import TeamWhiteboard from '@/pages/TeamWhiteboard.jsx';
import TeamAnalytics from '@/pages/TeamAnalytics';
import CreateTeam from '@/pages/CreateTeam';
import NotFound from '@/pages/NotFound';

// Import components
import { AuthProvider } from '@/components/AuthProvider';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface MaitriIntegrationProps {
  basePath?: string;
  isEmbedded?: boolean;
  onNavigate?: (path: string) => void;
  userToken?: string;
  userData?: any;
}

const MaitriIntegration: React.FC<MaitriIntegrationProps> = ({
  basePath = '/dashboard/maitri',
  isEmbedded = true,
  onNavigate,
  userToken,
  userData
}) => {
  // If user token is provided from parent app, set it
  React.useEffect(() => {
    if (userToken) {
      localStorage.setItem('authToken', userToken);
    }
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [userToken, userData]);

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <TooltipProvider>
            <div className={`${isEmbedded ? 'h-full' : 'min-h-screen'} bg-background`}>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Redirect root to teams */}
                  <Route 
                    path="/" 
                    element={<Navigate to="/teams" replace />} 
                  />
                  
                  {/* Protected routes */}
                  <Route 
                    path="/teams" 
                    element={
                      <ProtectedRoute>
                        <TeamDiscovery />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/teams/create" 
                    element={
                      <ProtectedRoute>
                        <CreateTeam />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/teams/:id/chat" 
                    element={
                      <ProtectedRoute>
                        <TeamChat />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/teams/:id/ide" 
                    element={
                      <ProtectedRoute>
                        <TeamIDE />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/teams/:id/video" 
                    element={
                      <ProtectedRoute>
                        <TeamVideo />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/teams/:id/tasks" 
                    element={
                      <ProtectedRoute>
                        <TeamTasks />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/teams/:id/whiteboard" 
                    element={
                      <ProtectedRoute>
                        <TeamWhiteboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/teams/:id/analytics" 
                    element={
                      <ProtectedRoute>
                        <TeamAnalytics />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </div>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default MaitriIntegration; 