import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  ChevronLeft, 
  Pen, 
  Square, 
  Circle, 
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
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MobileNavigation from "@/components/MobileNavigation";

const TeamWhiteboard = () => {
  const { id } = useParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
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
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "text", icon: Type, label: "Text" },
    { id: "eraser", icon: Eraser, label: "Eraser" }
  ];

  const colors = [
    "#000000", "#ffffff", "#6366f1", "#3b82f6", "#10b981", 
    "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#6b7280"
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set default canvas styles
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = brushSize;
    context.strokeStyle = selectedColor;

    // Clear canvas with white background
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || selectedTool !== "pen") return;

    const context = canvas.getContext("2d");
    if (!context) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !isDrawing || selectedTool !== "pen") return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineWidth = brushSize;
    context.strokeStyle = selectedColor;
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

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
                  <Avatar className={`h-6 w-6 ring-2`} style={{ '--tw-ring-color': collab.color } as React.CSSProperties}>
                    <AvatarFallback className="text-xs">{collab.avatar}</AvatarFallback>
                  </Avatar>
                  <div 
                    className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-nav-background"
                    style={{ backgroundColor: collab.color }}
                  ></div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
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
                onClick={() => setSelectedTool(tool.id)}
                title={tool.label}
              >
                <tool.icon className="h-5 w-5" />
              </Button>
            ))}
          </div>

          <div className="h-px bg-border" />

          {/* Action Tools */}
          <div className="space-y-2">
            <Button variant="ghost" size="icon" className="w-12 h-12" title="Undo">
              <Undo2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="w-12 h-12" title="Redo">
              <Redo2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="w-12 h-12" onClick={clearCanvas} title="Clear">
              <Eraser className="h-5 w-5" />
            </Button>
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 p-4 sm:p-6">
          <div className="h-full bg-white rounded-lg shadow-lg border border-border relative overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
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

          {/* Layers */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Layers</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-primary/10 rounded">
                  <span className="text-sm">Layer 1</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </div>
                <Button variant="outline" className="w-full" size="sm">
                  <Plus className="h-3 w-3 mr-2" />
                  Add Layer
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