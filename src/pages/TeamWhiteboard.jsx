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
import FloatingActionButton from "@/components/FloatingActionButton";
import QuickActions from "@/components/QuickActions";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import StatusIndicator from "@/components/StatusIndicator";
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

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-4">
              {collaborators.filter(c => c.isActive).map((collab) => (
                <div key={collab.name} className="relative">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/30 hover:ring-primary/50 transition-all duration-200" style={{ '--tw-ring-color': collab.color }}>
                    <AvatarFallback className="text-xs font-medium">{collab.avatar}</AvatarFallback>
                  </Avatar>
                  <div 
                    className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-nav-background animate-pulse"
                    style={{ backgroundColor: collab.color }}
                  ></div>
                </div>
              ))}
            </div>
            <Button variant="purple" size="sm" onClick={handleSave} className="shadow-primary">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave} className="border-primary/30 hover:bg-primary/10">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <QuickActions />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Toolbar */}
        <aside className="hidden sm:block w-20 bg-gradient-card border-r border-border/50 p-4 space-y-6 backdrop-blur-sm">
          {/* Drawing Tools */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tools</h3>
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant={selectedTool === tool.id ? "purple" : "ghost"}
                size="icon"
                className={`w-12 h-12 transition-all duration-200 ${
                  selectedTool === tool.id 
                    ? "shadow-primary ring-2 ring-primary/30" 
                    : "hover:bg-card hover:scale-105"
                }`}
                onClick={() => handleToolClick(tool.id)}
                title={tool.label}
              >
                <tool.icon className="h-5 w-5" />
              </Button>
            ))}
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Action Tools */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-12 h-12 hover:bg-card hover:scale-105 transition-all duration-200" 
              onClick={handleUndo} 
              title="Undo"
            >
              <Undo2 className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-12 h-12 hover:bg-destructive/10 hover:text-destructive hover:scale-105 transition-all duration-200" 
              onClick={deleteSelectedObject} 
              title="Delete Selected"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-12 h-12 hover:bg-warning/10 hover:text-warning hover:scale-105 transition-all duration-200" 
              onClick={handleClear} 
              title="Clear All"
            >
              <Eraser className="h-5 w-5" />
            </Button>
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 p-6">
          <div className="h-full bg-white rounded-xl shadow-glow border border-border/30 relative overflow-hidden backdrop-blur-sm">
            {/* Canvas Header */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-border/20">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
                  <span className="text-xs font-medium text-foreground">Live Collaboration</span>
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-border/20">
                <span className="text-xs font-medium text-muted-foreground">
                  {selectedTool === "pen" ? `Brush: ${brushSize}px` : `Tool: ${selectedTool}`}
                </span>
              </div>
            </div>

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
        <aside className="hidden lg:block w-72 bg-gradient-card border-l border-border/50 p-6 space-y-6 backdrop-blur-sm">
          {/* Color Palette */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/30 shadow-card">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-4 text-primary">Color Palette</h3>
              <div className="grid grid-cols-5 gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-xl border-2 transition-all duration-200 hover:scale-110 ${
                      selectedColor === color 
                        ? 'border-primary ring-2 ring-primary/30 shadow-glow' 
                        : 'border-border/30 hover:border-primary/50'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
              
              <div className="mt-5">
                <label className="text-sm font-medium mb-3 block text-muted-foreground">Custom Color</label>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border/30 bg-transparent cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {/* Brush Settings */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/30 shadow-card">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-4 text-primary">Brush Settings</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-muted-foreground">Size</label>
                    <span className="text-sm font-mono bg-muted px-2 py-1 rounded">{brushSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                
                <div className="flex justify-center p-4 bg-white/5 rounded-lg">
                  <div
                    className="rounded-full border border-border/30 shadow-md transition-all duration-200"
                    style={{
                      width: `${Math.max(brushSize * 2, 16)}px`,
                      height: `${Math.max(brushSize * 2, 16)}px`,
                      backgroundColor: selectedColor
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Tools */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/30 shadow-card">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-4 text-primary">Quick Tools</h3>
              <div className="space-y-2">
                <Button 
                  variant={selectedTool === "pen" ? "purple" : "outline"} 
                  className="w-full justify-start transition-all duration-200 hover:scale-105" 
                  size="sm"
                  onClick={() => handleToolClick("pen")}
                >
                  <Pen className="h-4 w-4 mr-2" />
                  Free Draw
                </Button>
                <Button 
                  variant={selectedTool === "rectangle" ? "purple" : "outline"} 
                  className="w-full justify-start transition-all duration-200 hover:scale-105" 
                  size="sm"
                  onClick={() => handleToolClick("rectangle")}
                >
                  <Square className="h-4 w-4 mr-2" />
                  Rectangle
                </Button>
                <Button 
                  variant={selectedTool === "circle" ? "purple" : "outline"} 
                  className="w-full justify-start transition-all duration-200 hover:scale-105" 
                  size="sm"
                  onClick={() => handleToolClick("circle")}
                >
                  <CircleIcon className="h-4 w-4 mr-2" />
                  Circle
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Collaborators */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/30 shadow-card">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-4 text-primary">Collaborators</h3>
              <div className="space-y-3">
                {collaborators.map((collab) => (
                  <div key={collab.name} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200">
                    <div
                      className={`h-3 w-3 rounded-full transition-all duration-200 ${
                        collab.isActive ? 'animate-pulse shadow-glow' : 'opacity-30'
                      }`}
                      style={{ backgroundColor: collab.color }}
                    />
                    <Avatar className="h-8 w-8 ring-2 ring-border/30">
                      <AvatarFallback className="text-xs font-medium">{collab.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <span className={`text-sm font-medium ${collab.isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {collab.name}
                      </span>
                      <div className="text-xs text-muted-foreground">
                        {collab.isActive ? 'Online' : 'Offline'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
      
      <FloatingActionButton />
      <KeyboardShortcuts />
      <StatusIndicator />
    </div>
  );
};

export default TeamWhiteboard;