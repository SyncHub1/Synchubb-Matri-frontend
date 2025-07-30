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
    { id: "select", icon: MousePointer2, label: "Selection", shortcut: "V" },
    { id: "hand", icon: Hand, label: "Hand", shortcut: "H" },
    { id: "rectangle", icon: Square, label: "Rectangle", shortcut: "R" },
    { id: "circle", icon: Circle, label: "Circle", shortcut: "O" },
    { id: "triangle", icon: Triangle, label: "Triangle", shortcut: "T" },
    { id: "arrow", icon: ArrowRight, label: "Arrow", shortcut: "A" },
    { id: "line", icon: Minus, label: "Line", shortcut: "L" },
    { id: "pen", icon: Pen, label: "Draw", shortcut: "P" },
    { id: "text", icon: Type, label: "Text", shortcut: "X" },
    { id: "image", icon: ImageIcon, label: "Image", shortcut: "I" },
    { id: "eraser", icon: Eraser, label: "Eraser", shortcut: "E" }
  ];

  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-2 flex items-center gap-1">
      {tools.map((tool, index) => (
        <div key={tool.id} className="flex items-center">
          <Button
            variant={selectedTool === tool.id ? "default" : "ghost"}
            size="icon"
            className={`h-10 w-10 relative group ${
              selectedTool === tool.id 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "hover:bg-accent hover:text-accent-foreground"
            }`}
            onClick={() => onToolSelect(tool.id)}
            title={`${tool.label} (${tool.shortcut})`}
          >
            <tool.icon className="h-4 w-4" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-popover text-popover-foreground rounded px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {tool.label} ({tool.shortcut})
            </span>
          </Button>
          {[1, 8].includes(index) && (
            <div className="w-px h-6 bg-border mx-1" />
          )}
        </div>
      ))}
    </div>
  );
};