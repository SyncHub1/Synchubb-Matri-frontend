import { useState } from "react";
import { Plus, MessageCircle, Users, Calendar, Palette, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const actions = [
    { icon: MessageCircle, label: "Chat", action: () => navigate(`/teams/${id}/chat`) },
    { icon: Users, label: "Video Call", action: () => navigate(`/teams/${id}/video`) },
    { icon: Calendar, label: "Tasks", action: () => navigate(`/teams/${id}/tasks`) },
    { icon: Palette, label: "Whiteboard", action: () => navigate(`/teams/${id}/whiteboard`) },
    { icon: BarChart3, label: "Analytics", action: () => navigate(`/teams/${id}/analytics`) },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Buttons */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-3 animate-slide-up">
          {actions.map((action, index) => (
            <div
              key={action.label}
              className="flex items-center gap-3 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-xs font-medium text-foreground bg-card/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-border/30 shadow-sm">
                {action.label}
              </span>
              <Button
                variant="purple"
                size="icon"
                className="h-12 w-12 shadow-primary hover:scale-110 transition-all duration-200"
                onClick={() => {
                  action.action();
                  setIsOpen(false);
                }}
              >
                <action.icon className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <Button
        variant="purple"
        size="icon"
        className={`h-14 w-14 shadow-primary hover:scale-110 transition-all duration-300 ${
          isOpen ? "rotate-45" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default FloatingActionButton;