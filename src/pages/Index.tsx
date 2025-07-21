import { Link } from "react-router-dom";
import { Users, Code, MessageSquare, Calendar, PaintBucket, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">SyncHubb</span>
          </h1>
          <h2 className="text-3xl font-semibold mb-4 text-foreground">
            Collaborative Team Platform
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover teams, collaborate in real-time, and build amazing projects together. 
            Join the future of team collaboration.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Button variant="purple" size="lg" className="text-lg px-8" asChild>
              <Link to="/teams">
                Explore Teams
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8" asChild>
              <Link to="/teams/create">Create Team</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-team-card hover:bg-team-card-hover transition-all duration-200 shadow-card hover:shadow-glow">
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Real-Time Chat</h3>
              <p className="text-muted-foreground">
                Telegram-like group chat with online status and message history
              </p>
            </CardContent>
          </Card>

          <Card className="bg-team-card hover:bg-team-card-hover transition-all duration-200 shadow-card hover:shadow-glow">
            <CardContent className="p-6 text-center">
              <Code className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Collaborative IDE</h3>
              <p className="text-muted-foreground">
                VS Code-like editor with real-time collaboration and AI assistance
              </p>
            </CardContent>
          </Card>

          <Card className="bg-team-card hover:bg-team-card-hover transition-all duration-200 shadow-card hover:shadow-glow">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Video Calling</h3>
              <p className="text-muted-foreground">
                High-quality video calls with screen sharing and collaboration tools
              </p>
            </CardContent>
          </Card>

          <Card className="bg-team-card hover:bg-team-card-hover transition-all duration-200 shadow-card hover:shadow-glow">
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Task Management</h3>
              <p className="text-muted-foreground">
                Kanban boards, calendars, and task assignment with progress tracking
              </p>
            </CardContent>
          </Card>

          <Card className="bg-team-card hover:bg-team-card-hover transition-all duration-200 shadow-card hover:shadow-glow">
            <CardContent className="p-6 text-center">
              <PaintBucket className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Whiteboard</h3>
              <p className="text-muted-foreground">
                Excalidraw-like collaborative whiteboard for brainstorming and design
              </p>
            </CardContent>
          </Card>

          <Card className="bg-team-card hover:bg-team-card-hover transition-all duration-200 shadow-card hover:shadow-glow">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-muted-foreground">
                Track team performance, coding hours, and collaboration metrics
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-semibold mb-4">Ready to Start Collaborating?</h3>
          <Button variant="purple" size="lg" className="text-lg px-8" asChild>
            <Link to="/teams">
              Discover Teams Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
