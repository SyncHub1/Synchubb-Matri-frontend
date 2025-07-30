import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Canvas as FabricCanvas, Circle, Rect, PencilBrush } from "fabric";
import { 
  ChevronLeft, 
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
  MoreVertical,
  Save,
  Settings,
  Plus,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MobileNavigation from "@/components/MobileNavigation";
import { toast } from "sonner";

const TeamWhiteboard = () => {
  const { id } = useParams();
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [selectedTool, setSelectedTool] = useState("pen");
  const [selectedColor, setSelectedColor] = useState("#6366f1");
  const [brushSize, setBrushSize] = useState(3);
  
  const collaborators = [
    { name: "Alex", avatar: "A", color: "#3b82f6", isActive: true },
    { name: "Sarah", avatar: "S", color: "#10b981", isActive: true },
    { name: "Mike", avatar: "M", color: "#f59e0b", isActive: false },
    { name: "You", avatar: "Y", color: "#6366f1", isActive: true }
  ];

  const tools = [
    { id: "pen", icon: Pen, label: "Pen" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "circle", icon: CircleIcon, label: "Circle" },
    { id: "text", icon: Type, label: "Text" },
    { id: "eraser", icon: Eraser, label: "Eraser" }
  ];

  const colors = [
    "#000000", "#ffffff", "#6366f1", "#3b82f6", "#10b981", 
    "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#6b7280"
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
    });

    // Initialize the freeDrawingBrush
    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.color = selectedColor;
    canvas.freeDrawingBrush.width = brushSize;

    setFabricCanvas(canvas);
    toast("Whiteboard ready! Start creating!");

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = selectedTool === "pen";
    
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
        left: 100,
        top: 100,
        fill: selectedColor,
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
        left: 100,
        top: 100,
        fill: "transparent",
        radius: 50,
        stroke: selectedColor,
        strokeWidth: 2
      });
      fabricCanvas.add(circle);
      fabricCanvas.setActiveObject(circle);
      fabricCanvas.renderAll();
    } else if (tool === "eraser") {
      fabricCanvas.isDrawingMode = false;
      // Enable selection mode for eraser
      fabricCanvas.selection = true;
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    toast("Whiteboard cleared!");
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

  const deleteSelectedObject = () => {
    if (!fabricCanvas) return;
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.remove(activeObject);
      fabricCanvas.renderAll();
    }
  };

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (fabricCanvas && canvasRef.current) {
        const container = canvasRef.current.parentElement;
        const containerWidth = container.clientWidth - 32; // Account for padding
        const containerHeight = container.clientHeight - 32;
        
        fabricCanvas.setDimensions({
          width: Math.min(containerWidth, 1200),
          height: Math.min(containerHeight, 800)
        });
        fabricCanvas.renderAll();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial resize

    return () => window.removeEventListener('resize', handleResize);
  }, [fabricCanvas]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-nav-background border-b border-border px-4 sm:px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MobileNavigation />
            <Link to={`/teams/${id}/chat`} className="hidden sm:flex items-center gap-2 text-nav-foreground hover:text-nav-active">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <Palette className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Team Whiteboard</h1>
                <p className="text-sm text-muted-foreground">Collaborative drawing space</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 mr-4">
              {collaborators.filter(c => c.isActive).map((collab) => (
                <div key={collab.name} className="relative">
                  <Avatar className="h-6 w-6 ring-2" style={{ '--tw-ring-color': collab.color }}>
                    <AvatarFallback className="text-xs">{collab.avatar}</AvatarFallback>
                  </Avatar>
                  <div 
                    className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-nav-background"
                    style={{ backgroundColor: collab.color }}
                  ></div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Toolbar */}
        <aside className="hidden sm:block w-16 sm:w-20 bg-nav-background border-r border-border p-2 sm:p-4 space-y-4">
          {/* Drawing Tools */}
          <div className="space-y-2">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant={selectedTool === tool.id ? "default" : "ghost"}
                size="icon"
                className="w-12 h-12"
                onClick={() => handleToolClick(tool.id)}
                title={tool.label}
              >
                <tool.icon className="h-5 w-5" />
              </Button>
            ))}
          </div>

          <div className="h-px bg-border" />

          {/* Action Tools */}
          <div className="space-y-2">
            <Button variant="ghost" size="icon" className="w-12 h-12" onClick={handleUndo} title="Undo">
              <Undo2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="w-12 h-12" onClick={deleteSelectedObject} title="Delete">
              <Trash2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="w-12 h-12" onClick={handleClear} title="Clear">
              <Eraser className="h-5 w-5" />
            </Button>
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 p-4 sm:p-6">
          <div className="h-full bg-white rounded-lg shadow-lg border border-border relative overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
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
                  <svg width="20" height="20" viewBox="0 0 20 20" className="absolute">
                    <path
                      d="M0 0L20 7L7 20Z"
                      fill={collab.color}
                      stroke="white"
                      strokeWidth="1"
                    />
                  </svg>
                  <Badge 
                    variant="secondary" 
                    className="ml-5 text-xs"
                    style={{ backgroundColor: collab.color, color: 'white' }}
                  >
                    {collab.name}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Properties Panel */}
        <aside className="hidden lg:block w-64 bg-nav-background border-l border-border p-4 space-y-6">
          {/* Color Palette */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Colors</h3>
              <div className="grid grid-cols-5 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-lg border-2 ${
                      selectedColor === color ? 'border-primary ring-2 ring-primary/50' : 'border-border'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
              
              <div className="mt-4">
                <label className="text-sm font-medium mb-2 block">Custom Color</label>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full h-8 rounded border border-border"
                />
              </div>
            </CardContent>
          </Card>

          {/* Brush Settings */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Brush</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Size: {brushSize}px</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div className="flex justify-center">
                  <div
                    className="rounded-full border border-border"
                    style={{
                      width: `${Math.max(brushSize, 8)}px`,
                      height: `${Math.max(brushSize, 8)}px`,
                      backgroundColor: selectedColor
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tools */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Tools</h3>
              <div className="space-y-2">
                <Button 
                  variant={selectedTool === "pen" ? "default" : "outline"} 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => handleToolClick("pen")}
                >
                  <Pen className="h-3 w-3 mr-2" />
                  Free Draw
                </Button>
                <Button 
                  variant={selectedTool === "rectangle" ? "default" : "outline"} 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => handleToolClick("rectangle")}
                >
                  <Square className="h-3 w-3 mr-2" />
                  Rectangle
                </Button>
                <Button 
                  variant={selectedTool === "circle" ? "default" : "outline"} 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => handleToolClick("circle")}
                >
                  <CircleIcon className="h-3 w-3 mr-2" />
                  Circle
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Collaborators */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Active Users</h3>
              <div className="space-y-2">
                {collaborators.map((collab) => (
                  <div key={collab.name} className="flex items-center gap-3 p-2 rounded">
                    <div
                      className={`h-2 w-2 rounded-full ${collab.isActive ? '' : 'opacity-30'}`}
                      style={{ backgroundColor: collab.color }}
                    />
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{collab.avatar}</AvatarFallback>
                    </Avatar>
                    <span className={`text-sm ${collab.isActive ? '' : 'text-muted-foreground'}`}>
                      {collab.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default TeamWhiteboard;