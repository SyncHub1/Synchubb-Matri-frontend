import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/AuthProvider";

// Import pages
import Health from "./pages/Health";
import TeamDiscovery from "./pages/TeamDiscovery";
import TeamChat from "./pages/TeamChat";
import TeamIDE from "./pages/TeamIDE";
import TeamVideo from "./pages/TeamVideo";
import TeamTasks from "./pages/TeamTasks.jsx";
import TeamWhiteboard from "./pages/TeamWhiteboard.jsx";
import TeamAnalytics from "./pages/TeamAnalytics";
import CreateTeam from "./pages/CreateTeam";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Sonner />
            <BrowserRouter>
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
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;