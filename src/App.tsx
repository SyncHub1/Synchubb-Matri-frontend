import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TeamDiscovery from "./pages/TeamDiscovery";
import TeamChat from "./pages/TeamChat";
import TeamIDE from "./pages/TeamIDE";
import TeamVideo from "./pages/TeamVideo";
import TeamTasks from "./pages/TeamTasks";
import TeamWhiteboard from "./pages/TeamWhiteboard";
import TeamAnalytics from "./pages/TeamAnalytics";
import CreateTeam from "./pages/CreateTeam";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="dark min-h-screen bg-background">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/teams" element={<TeamDiscovery />} />
            <Route path="/teams/create" element={<CreateTeam />} />
            <Route path="/teams/:id/chat" element={<TeamChat />} />
            <Route path="/teams/:id/ide" element={<TeamIDE />} />
            <Route path="/teams/:id/video" element={<TeamVideo />} />
            <Route path="/teams/:id/tasks" element={<TeamTasks />} />
            <Route path="/teams/:id/whiteboard" element={<TeamWhiteboard />} />
            <Route path="/teams/:id/analytics" element={<TeamAnalytics />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;