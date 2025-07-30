import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Canvas as FabricCanvas, Circle, Rect, PencilBrush } from "fabric";
import { 
  ChevronLeft, 
  MousePointer2,
  Pen, 
  Square, 
  Circle as CircleIcon, 
  Type, 
  Eraser, 
  Undo2, 
  Redo2, 
  Download, 
  Users,
  Palette,
  Save,
  Plus,
  Trash2,
  Menu,
  Share,
  BookOpen,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Diamond,
  Triangle,
  Minus,
  Hand,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MobileNavigation from "@/components/MobileNavigation";
import FloatingActionButton from "@/components/FloatingActionButton";
import QuickActions from "@/components/QuickActions";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import StatusIndicator from "@/components/StatusIndicator";
import { toast } from "sonner";

const TeamWhiteboard = () => {
  const { id } = useParams();
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [selectedTool, setSelectedTool] = useState("pointer");
  const [selectedColor, setSelectedColor] = useState("#1e1e1e");
  const [brushSize, setBrushSize] = useState(3);
  const [zoom, setZoom] = useState(100);
  
  const collaborators = [
    { name: "Alex", avatar: "A", color: "#3b82f6", isActive: true },
    { name: "Sarah", avatar: "S", color: "#10b981", isActive: true },
    { name: "Mike", avatar: "M", color: "#f59e0b", isActive: false },
    { name: "You", avatar: "Y", color: "#6366f1", isActive: true }
  ];

  const tools = [
    { id: "pointer", icon: MousePointer2, label: "Selection", shortcut: "1" },
    { id: "hand", icon: Hand, label: "Hand", shortcut: "2" },
    { id: "rectangle", icon: Square, label: "Rectangle", shortcut: "3" },
    { id: "circle", icon: CircleIcon, label: "Circle", shortcut: "4" },
    { id: "diamond", icon: Diamond, label: "Diamond", shortcut: "5" },
    { id: "triangle", icon: Triangle, label: "Triangle", shortcut: "6" },
    { id: "arrow", icon: ArrowRight, label: "Arrow", shortcut: "7" },
    { id: "line", icon: Minus, label: "Line", shortcut: "8" },
    { id: "pen", icon: Pen, label: "Draw", shortcut: "9" },
    { id: "text", icon: Type, label: "Text", shortcut: "0" },
    { id: "image", icon: ImageIcon, label: "Image" },
    { id: "eraser", icon: Eraser, label: "Eraser" }
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight - 80,
      backgroundColor: "#ffffff",
    });

    // Initialize the freeDrawingBrush
    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.color = selectedColor;
    canvas.freeDrawingBrush.width = brushSize;

    setFabricCanvas(canvas);
    toast("Whiteboard ready! Pick a tool & Start drawing!");

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = selectedTool === "pen";
    fabricCanvas.selection = selectedTool === "pointer";
    
    if (selectedTool === "pen" && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = selectedColor;
      fabricCanvas.freeDrawingBrush.width = brushSize;
    }
  }, [selectedTool, selectedColor, brushSize, fabricCanvas]);

  const handleToolClick = (tool) => {
    setSelectedTool(tool);

    if (!fabricCanvas) return;

    if (tool === "rectangle") {
      const rect = new Rect({
        left: 200,
        top: 200,
        fill: "transparent",
        width: 100,
        height: 100,
        stroke: selectedColor,
        strokeWidth: 2
      });
      fabricCanvas.add(rect);
      fabricCanvas.setActiveObject(rect);
      fabricCanvas.renderAll();
    } else if (tool === "circle") {
      const circle = new Circle({
        left: 200,
        top: 200,
        fill: "transparent",
        radius: 50,
        stroke: selectedColor,
        strokeWidth: 2
      });
      fabricCanvas.add(circle);
      fabricCanvas.setActiveObject(circle);
      fabricCanvas.renderAll();
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    toast("Canvas cleared!");
  };

  const handleUndo = () => {
    if (!fabricCanvas) return;
    const objects = fabricCanvas.getObjects();
    if (objects.length > 0) {
      fabricCanvas.remove(objects[objects.length - 1]);
      fabricCanvas.renderAll();
    }
  };

  const handleSave = () => {
    if (!fabricCanvas) return;
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1
    });
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = dataURL;
    link.click();
    toast("Whiteboard saved!");
  };

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (fabricCanvas && canvasRef.current) {
        fabricCanvas.setDimensions({
          width: window.innerWidth,
          height: window.innerHeight - 80
        });
        fabricCanvas.renderAll();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [fabricCanvas]);

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Mobile Menu Button - Top Left */}
      <div className="fixed top-6 left-6 z-50 lg:hidden">
        <Button variant="outline" size="icon" className="bg-white shadow-md">
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Desktop Back Button - Top Left */}
      <div className="fixed top-6 left-6 z-50 hidden lg:block">
        <Link to={`/teams/${id}/chat`}>
          <Button variant="outline" size="icon" className="bg-white shadow-md">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Top Right Actions */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <Button variant="outline" className="bg-white shadow-md">
          <BookOpen className="h-4 w-4 mr-2" />
          Library
        </Button>
        <Button className="bg-primary text-white shadow-md">
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Main Toolbar - Top Center */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex items-center gap-1">
          {tools.map((tool, index) => (
            <div key={tool.id} className="relative">
              <Button
                variant={selectedTool === tool.id ? "default" : "ghost"}
                size="icon"
                className={`h-10 w-10 relative group ${
                  selectedTool === tool.id 
                    ? "bg-primary text-white shadow-md" 
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleToolClick(tool.id)}
                title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
              >
                <tool.icon className="h-4 w-4" />
                {tool.shortcut && (
                  <span className="absolute -bottom-1 -right-1 text-xs bg-gray-600 text-white rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {tool.shortcut}
                  </span>
                )}
              </Button>
              {index === 1 || index === 9 ? (
                <div className="w-px h-6 bg-gray-200 mx-1" />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Left Controls */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleUndo}
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {}}
            title="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(Math.max(10, zoom - 10))}
          >
            -
          </Button>
          <span className="text-sm font-mono min-w-[50px] text-center">{zoom}%</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(Math.min(500, zoom + 10))}
          >
            +
          </Button>
        </div>
      </div>

      {/* Bottom Right Help */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 text-sm text-gray-600 max-w-xs">
          To move canvas, hold mouse wheel or spacebar while dragging, or use the hand tool
        </div>
      </div>

      {/* Active Collaborators - Bottom Center */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex items-center gap-2">
          {collaborators.filter(c => c.isActive).map((collab) => (
            <div key={collab.name} className="relative">
              <Avatar className="h-8 w-8 ring-2 ring-white" style={{ backgroundColor: collab.color }}>
                <AvatarFallback className="text-xs font-medium text-white">{collab.avatar}</AvatarFallback>
              </Avatar>
              <div 
                className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white"
                style={{ backgroundColor: collab.color }}
              ></div>
            </div>
          ))}
        </div>
      </div>

      {/* Color Picker - Floating */}
      {selectedTool !== "pointer" && selectedTool !== "hand" && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex items-center gap-1">
            {["#1e1e1e", "#e03131", "#2f9e44", "#1971c2", "#f08c00", "#ae3ec9", "#495057", "#ffffff"].map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded border-2 ${
                  selectedColor === color 
                    ? 'border-gray-400 ring-2 ring-blue-300' 
                    : 'border-gray-200'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Canvas */}
      <div className="absolute inset-0 pt-16">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
        />
        
        {/* Live Cursors */}
        {collaborators.filter(c => c.isActive && c.name !== "You").map((collab, index) => (
          <div
            key={collab.name}
            className="absolute pointer-events-none"
            style={{
              left: `${20 + index * 50}%`,
              top: `${30 + index * 40}%`,
              color: collab.color
            }}
          >
            <div className="relative">
              <svg width="16" height="16" viewBox="0 0 16 16" className="absolute">
                <path
                  d="M0 0L16 6L6 16Z"
                  fill={collab.color}
                  stroke="white"
                  strokeWidth="1"
                />
              </svg>
              <div 
                className="ml-4 text-xs font-medium px-2 py-1 rounded shadow-md text-white"
                style={{ backgroundColor: collab.color }}
              >
                {collab.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Welcome Message - Center */}
      {fabricCanvas && fabricCanvas.getObjects().length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-500">
            <h2 className="text-2xl font-light mb-2">Pick a tool & Start drawing!</h2>
            <p className="text-sm">Use the toolbar above to select tools and start creating</p>
          </div>
        </div>
      )}

      {/* Hidden Components for Mobile */}
      <div className="hidden">
        <MobileNavigation />
        <FloatingActionButton />
        <QuickActions />
        <KeyboardShortcuts />
        <StatusIndicator />
      </div>
    </div>
  );
};

export default TeamWhiteboard;