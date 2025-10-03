import {
  MousePointer2,
  Hand,
  Square,
  Circle,
  Triangle,
  ArrowRight,
  Minus,
  Pen,
  Type,
  Image as ImageIcon,
  Eraser,
  TriangleIcon,
  MoveHorizontal,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  onImageUpload: (file: File) => void;
}

export const Toolbar = ({
  onImageUpload,
  selectedTool,
  onToolSelect,
}: ToolbarProps) => {
  
  const handleFileInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onImageUpload(file);
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const tools = [
    {
      id: "select",
      icon: MousePointer2,
      label: "Selection",
      shortcut: "1",
      action: () => onToolSelect("select"),
    },
    {
      id: "hand",
      icon: Hand,
      label: "Hand",
      shortcut: "2",
      action: () => onToolSelect("hand"),
    },
    {
      id: "rectangle",
      icon: Square,
      label: "Rectangle",
      shortcut: "3",
      action: () => onToolSelect("rectangle"),
    },
    {
      id: "circle",
      icon: Circle,
      label: "Circle",
      shortcut: "4",
      action: () => onToolSelect("circle"),
    },
    {
      id: "triangle",
      icon: TriangleIcon,
      label: "Triangle",
      shortcut: "5",
      action: () => onToolSelect("triangle"),
    },
    {
      id: "single-arrow",
      icon: ArrowRight,
      label: "Single Arrow",
      shortcut: "6",
      action: () => onToolSelect("single-arrow"),
    },
    {
      id: "double-arrow",
      icon: MoveHorizontal,
      label: "Double Arrow",
      shortcut: "7",
      action: () => onToolSelect("double-arrow"),
    },
    {
      id: "line",
      icon: Minus,
      label: "Line",
      shortcut: "8",
      action: () => onToolSelect("line"),
    },
    {
      id: "pen",
      icon: Pen,
      label: "Draw",
      shortcut: "9",
      action: () => onToolSelect("pen"),
    },
    {
      id: "image",
      icon: ImageIcon,
      label: "Open",
      shortcut: "",
      action: () => {
        onToolSelect("image");
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = handleFileInput;
        input.click();
      },
    },
    {
      id: "text",
      icon: Type,
      label: "Text",
      shortcut: "0",
      action: () => onToolSelect("text"),
    },
    {
      id: "eraser",
      icon: Eraser,
      label: "Eraser",
      action: () => onToolSelect("eraser"),
    },
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
            onClick={tool.action}
            title={`${tool.label} (${tool.shortcut})`}
          >
            <tool.icon className="h-4 w-4" />
            <span className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-xs bg-popover text-popover-foreground border border-border rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-50">
              {tool.label} {tool.shortcut ? `(${tool.shortcut})`: ""}
            </span>
          </Button>
          {/* Add separator after hand tool (index 1) */}
          {index === 1 && <div className="w-px h-6 bg-border mx-1" />}
        </div>
      ))}
    </div>
  );
};
