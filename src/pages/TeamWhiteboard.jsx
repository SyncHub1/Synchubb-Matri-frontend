import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Canvas as FabricCanvas } from "fabric";
import { ChevronLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhiteboardCanvas } from "@/components/whiteboard/WhiteboardCanvas";
import { Toolbar } from "@/components/whiteboard/Toolbar";
import { ColorPicker } from "@/components/whiteboard/ColorPicker";
import { CanvasControls } from "@/components/whiteboard/CanvasControls";
import { StrokeControls } from "@/components/whiteboard/StrokeControls";
import { CollaboratorCursors, CollaboratorAvatars } from "@/components/whiteboard/CollaboratorCursors";
import { ThemeToggle } from "@/components/whiteboard/ThemeToggle";
import MobileNavigation from "@/components/MobileNavigation";
import FloatingActionButton from "@/components/FloatingActionButton";
import QuickActions from "@/components/QuickActions";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import StatusIndicator from "@/components/StatusIndicator";

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
      {/* Mobile Menu Button - Top Left */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button variant="outline" size="icon" className="shadow-md">
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Desktop Back Button - Top Left */}
      <div className="fixed top-4 left-4 z-50 hidden lg:block">
        <Link to={`/teams/${id}/chat`}>
          <Button variant="outline" size="icon" className="shadow-md">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Top Right Controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeToggle />
      </div>

      {/* Main Toolbar - Top Center */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <Toolbar 
          selectedTool={selectedTool} 
          onToolSelect={setSelectedTool} 
        />
      </div>

      {/* Color & Stroke Controls - Secondary Toolbar */}
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

      {/* Left Side Controls */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50">
        <CanvasControls 
          canvas={fabricCanvas}
          zoom={zoom}
          onZoomChange={setZoom}
        />
      </div>

      {/* Bottom Center - Collaborators */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <CollaboratorAvatars collaborators={collaborators} />
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

      {/* Welcome Message - Center */}
      {fabricCanvas && fabricCanvas.getObjects().length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-muted-foreground">
            <h2 className="text-3xl font-light mb-4">Start creating!</h2>
            <p className="text-base">Select a tool from the toolbar above to begin drawing</p>
            <div className="mt-6 text-sm space-y-1">
              <p>💡 Use <kbd className="px-1 py-0.5 bg-muted rounded text-xs">V</kbd> for selection</p>
              <p>✏️ Use <kbd className="px-1 py-0.5 bg-muted rounded text-xs">P</kbd> for pen tool</p>
              <p>⬜ Use <kbd className="px-1 py-0.5 bg-muted rounded text-xs">R</kbd> for rectangle</p>
            </div>
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