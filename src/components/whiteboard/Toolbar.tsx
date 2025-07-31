import { 
  MousePointer2, Hand, Square, Circle, Triangle, ArrowRight, 
  Minus, Pen, Type, Image as ImageIcon, Eraser 
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

export const Toolbar = ({ selectedTool, onToolSelect }: ToolbarProps) => {
  const tools = [
    { id: "select", icon: MousePointer2, label: "Selection", shortcut: "1" },
    { id: "hand", icon: Hand, label: "Hand", shortcut: "2" },
    { id: "rectangle", icon: Square, label: "Rectangle", shortcut: "3" },
    { id: "circle", icon: Circle, label: "Circle", shortcut: "4" },
    { id: "arrow", icon: ArrowRight, label: "Arrow", shortcut: "5" },
    { id: "line", icon: Minus, label: "Line", shortcut: "6" },
    { id: "pen", icon: Pen, label: "Draw", shortcut: "7" },
    { id: "text", icon: Type, label: "Text", shortcut: "8" },
    { id: "image", icon: ImageIcon, label: "Image", shortcut: "9" },
    { id: "eraser", icon: Eraser, label: "Eraser", shortcut: "0" }
  ];

  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-1 flex items-center">
      {tools.map((tool, index) => (
        <div key={tool.id} className="flex items-center">
          <Button
            variant={selectedTool === tool.id ? "default" : "ghost"}
            size="icon"
            className={`h-10 w-10 relative group ${
              selectedTool === tool.id 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-accent hover:text-accent-foreground"
            }`}
            onClick={() => onToolSelect(tool.id)}
            title={`${tool.label} (${tool.shortcut})`}
          >
            <tool.icon className="h-4 w-4" />
            <span className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-xs bg-popover text-popover-foreground border border-border rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-50">
              {tool.label} ({tool.shortcut})
            </span>
          </Button>
          {/* Add separator after hand tool (index 1) */}
          {index === 1 && (
            <div className="w-px h-6 bg-border mx-1" />
          )}
        </div>
      ))}
    </div>
  );
};