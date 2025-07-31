import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Canvas as FabricCanvas } from "fabric";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhiteboardCanvas } from "@/components/whiteboard/WhiteboardCanvas";
import { Toolbar } from "@/components/whiteboard/Toolbar";
import { ColorPicker } from "@/components/whiteboard/ColorPicker";
import { StrokeControls } from "@/components/whiteboard/StrokeControls";
import { CollaboratorCursors } from "@/components/whiteboard/CollaboratorCursors";
import { ThemeToggle } from "@/components/whiteboard/ThemeToggle";

const TeamWhiteboard = () => {
  const { id } = useParams();
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [selectedTool, setSelectedTool] = useState("select");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);
  const [zoom, setZoom] = useState(100);
  
  const collaborators = [
    { 
      id: "1", 
      name: "Alex", 
      avatar: "A", 
      color: "#3b82f6", 
      x: 200, 
      y: 150, 
      isActive: true 
    },
    { 
      id: "2", 
      name: "Sarah", 
      avatar: "S", 
      color: "#10b981", 
      x: 350, 
      y: 200, 
      isActive: true 
    },
    { 
      id: "3", 
      name: "Mike", 
      avatar: "M", 
      color: "#f59e0b", 
      x: 100, 
      y: 300, 
      isActive: false 
    },
    { 
      id: "4", 
      name: "You", 
      avatar: "Y", 
      color: "#6366f1", 
      x: 0, 
      y: 0, 
      isActive: true 
    }
  ];

  // Simulate collaborative cursor movement
  useEffect(() => {
    const interval = setInterval(() => {
      // Update collaborator positions (simulated)
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleCanvasReady = (canvas) => {
    setFabricCanvas(canvas);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Menu Button - Top Left (Excalidraw style) */}
      <div className="fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" className="shadow-md">
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Toolbar - Top Center (Excalidraw style) */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <Toolbar 
          selectedTool={selectedTool} 
          onToolSelect={setSelectedTool} 
        />
      </div>

      {/* Top Right Controls (Share & Library like Excalidraw) */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <Button variant="default" className="shadow-md">
          Share
        </Button>
        <Button variant="outline" className="shadow-md">
          Library
        </Button>
        <ThemeToggle />
      </div>

      {/* Color & Stroke Controls - Appears below main toolbar when tool selected */}
      {selectedTool !== "select" && selectedTool !== "hand" && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 flex items-center gap-3">
          <ColorPicker 
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
          />
          <StrokeControls 
            brushSize={brushSize}
            onBrushSizeChange={setBrushSize}
          />
        </div>
      )}

      {/* Zoom Controls - Bottom Left (Excalidraw style) */}
      <div className="fixed bottom-4 left-4 z-50">
        <div className="bg-background border border-border rounded-lg shadow-lg p-2 flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setZoom(Math.max(10, zoom - 25))}
            title="Zoom Out"
          >
            <span className="text-lg font-bold">−</span>
          </Button>
          <span className="text-xs font-mono text-muted-foreground px-2 min-w-[3rem] text-center">
            {zoom}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setZoom(Math.min(500, zoom + 25))}
            title="Zoom In"
          >
            <span className="text-lg font-bold">+</span>
          </Button>
        </div>
      </div>

      {/* Help Button - Bottom Right (Excalidraw style) */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button variant="outline" size="icon" className="shadow-md rounded-full">
          <span className="text-sm font-bold">?</span>
        </Button>
      </div>

      {/* Main Canvas */}
      <div className="absolute inset-0">
        <WhiteboardCanvas
          selectedTool={selectedTool}
          selectedColor={selectedColor}
          brushSize={brushSize}
          zoom={zoom}
          onCanvasReady={handleCanvasReady}
        />
        
        {/* Collaborative Cursors */}
        <CollaboratorCursors collaborators={collaborators} />
      </div>

      {/* Welcome Message - Center (Excalidraw style) */}
      {fabricCanvas && fabricCanvas.getObjects().length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-muted-foreground">
            <div className="mb-8">
              <div className="text-6xl font-bold text-primary mb-4">✕</div>
              <h1 className="text-2xl font-semibold mb-2">EXCALIDRAW</h1>
              <p className="text-sm text-muted-foreground mb-8">All your data is saved locally in your browser.</p>
            </div>
            <div className="space-y-4 text-left max-w-xs">
              <div className="flex items-center gap-2 text-sm">
                <span>📁</span>
                <span>Open</span>
                <kbd className="ml-auto bg-muted px-1.5 py-0.5 rounded text-xs">Ctrl+O</kbd>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>❓</span>
                <span>Help</span>
                <kbd className="ml-auto bg-muted px-1.5 py-0.5 rounded text-xs">?</kbd>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>👥</span>
                <span>Live collaboration...</span>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-lg font-medium mb-2">Pick a tool &</p>
              <p className="text-lg font-medium">Start drawing!</p>
              <p className="text-xs text-muted-foreground mt-4">
                To move canvas, hold mouse wheel or spacebar while dragging, or use the hand tool
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeamWhiteboard;