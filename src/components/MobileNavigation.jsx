import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  Menu, 
  X, 
  MessageSquare, 
  Code, 
  Video, 
  Calendar, 
  PaintBucket, 
  BarChart3,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const MobileNavigation = () => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: `/teams/${id}/chat`, icon: MessageSquare, label: "Chat" },
    { to: `/teams/${id}/ide`, icon: Code, label: "IDE" },
    { to: `/teams/${id}/video`, icon: Video, label: "Video" },
    { to: `/teams/${id}/tasks`, icon: Calendar, label: "Tasks" },
    { to: `/teams/${id}/whiteboard`, icon: PaintBucket, label: "Whiteboard" },
    { to: `/teams/${id}/analytics`, icon: BarChart3, label: "Analytics" },
  ];

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-nav-background p-0">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">EcoTrack Innovators</h2>
            <p className="text-sm text-muted-foreground">Team navigation</p>
          </div>
          
          <nav className="p-4 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Team Tools
            </h3>
            {navItems.map((item) => (
              <Button
                key={item.to}
                variant="ghost"
                className="w-full justify-start"
                asChild
                onClick={() => setIsOpen(false)}
              >
                <Link to={item.to}>
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Link>
              </Button>
            ))}
            
            <div className="pt-4 border-t border-border mt-4">
              <Button
                variant="outline"
                className="w-full"
                asChild
                onClick={() => setIsOpen(false)}
              >
                <Link to="/teams">
                  <Users className="h-4 w-4 mr-2" />
                  Back to Teams
                </Link>
              </Button>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;