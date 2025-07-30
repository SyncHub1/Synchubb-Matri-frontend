import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

// Import all pages
import TeamDiscovery from '@/pages/TeamDiscovery';
import TeamChat from '@/pages/TeamChat';
import TeamIDE from '@/pages/TeamIDE';
import TeamVideo from '@/pages/TeamVideo';
import TeamTasks from '@/pages/TeamTasks';
import TeamWhiteboard from '@/pages/TeamWhiteboard';
import TeamAnalytics from '@/pages/TeamAnalytics';
import CreateTeam from '@/pages/CreateTeam';

const queryClient = new QueryClient();

/**
 * MaitriCollaboration - Complete team collaboration platform
 * 
 * This is a self-contained component that includes:
 * - Team Discovery & Creation
 * - Real-time Chat
 * - Collaborative IDE
 * - Video Conferencing
 * - Task Management
 * - Whiteboard
 * - Analytics
 * 
 * To integrate into your website:
 * 1. Copy this component and all dependencies from src/components and src/pages
 * 2. Copy the UI components from src/components/ui
 * 3. Copy the CSS from src/index.css
 * 4. Install the required dependencies (see package.json)
 * 5. Use this component wherever you want the Maitri section
 */
export const MaitriCollaboration: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Toaster />
          <Sonner />
          <BrowserRouter basename="/dashboard/maitri">
            <Routes>
              <Route path="/" element={<Navigate to="/teams" replace />} />
              <Route path="/teams" element={<TeamDiscovery />} />
              <Route path="/teams/create" element={<CreateTeam />} />
              <Route path="/teams/:id/chat" element={<TeamChat />} />
              <Route path="/teams/:id/ide" element={<TeamIDE />} />
              <Route path="/teams/:id/video" element={<TeamVideo />} />
              <Route path="/teams/:id/tasks" element={<TeamTasks />} />
              <Route path="/teams/:id/whiteboard" element={<TeamWhiteboard />} />
              <Route path="/teams/:id/analytics" element={<TeamAnalytics />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default MaitriCollaboration;