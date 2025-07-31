import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Canvas as FabricCanvas, FabricImage, ActiveSelection, Group, util } from "fabric";
import { Button } from "@/components/ui/button";
import { WhiteboardCanvas } from "@/components/whiteboard/WhiteboardCanvas";
import { Toolbar } from "@/components/whiteboard/Toolbar";
import { ColorPicker } from "@/components/whiteboard/ColorPicker";
import { StrokeControls } from "@/components/whiteboard/StrokeControls";
import { CollaboratorCursors } from "@/components/whiteboard/CollaboratorCursors";
import { ThemeToggle } from "@/components/whiteboard/ThemeToggle";
import { WhiteboardMenu } from "@/components/whiteboard/WhiteboardMenu";
import { CollaborationPanel } from "@/components/whiteboard/CollaborationPanel";
import { toast } from "sonner";

const TeamWhiteboard = () => {
  const { id } = useParams();
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [selectedTool, setSelectedTool] = useState("select");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);
  const [zoom, setZoom] = useState(100);
  
  // Current user for collaboration
  const currentUser = {
    id: "current-user",
    name: "You",
    avatar: "",
    email: "you@example.com",
    role: "editor",
    isOnline: true,
    cursor: { x: 0, y: 0, color: "#6366f1" }
  };
  
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

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Multi-selection with Ctrl/Cmd
      if ((e.ctrlKey || e.metaKey) && fabricCanvas) {
        if (e.key === 'a') {
          e.preventDefault();
          const allObjects = fabricCanvas.getObjects();
          if (allObjects.length > 0) {
            fabricCanvas.discardActiveObject();
            const selection = new ActiveSelection(allObjects, {
              canvas: fabricCanvas,
            });
            fabricCanvas.setActiveObject(selection);
            fabricCanvas.requestRenderAll();
            toast.success("All objects selected");
          }
        } else if (e.key === 'd') {
          e.preventDefault();
          const activeObjects = fabricCanvas.getActiveObjects();
          if (activeObjects.length > 0) {
            activeObjects.forEach(obj => {
              const cloned = util.object.clone(obj);
              cloned.set({
                left: obj.left + 20,
                top: obj.top + 20,
              });
              fabricCanvas.add(cloned);
            });
            fabricCanvas.requestRenderAll();
            toast.success("Objects duplicated");
          }
        } else if (e.key === 'g') {
          e.preventDefault();
          const activeObjects = fabricCanvas.getActiveObjects();
          if (activeObjects.length > 1) {
            const group = new Group(activeObjects, {
              canvas: fabricCanvas,
            });
            fabricCanvas.remove(...activeObjects);
            fabricCanvas.add(group);
            fabricCanvas.setActiveObject(group);
            fabricCanvas.requestRenderAll();
            toast.success("Objects grouped");
          }
        }
      }

      // Delete selected objects
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObjects = fabricCanvas?.getActiveObjects();
        if (activeObjects && activeObjects.length > 0) {
          activeObjects.forEach(obj => fabricCanvas.remove(obj));
          fabricCanvas.discardActiveObject();
          fabricCanvas.requestRenderAll();
          toast.success("Objects deleted");
        }
      }

      // Tool shortcuts
      const toolShortcuts = {
        '1': 'select',
        '2': 'hand', 
        '3': 'rectangle',
        '4': 'circle',
        '5': 'arrow',
        '6': 'line',
        '7': 'pen',
        '8': 'text'
      };

      if (toolShortcuts[e.key]) {
        setSelectedTool(toolShortcuts[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fabricCanvas]);

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

  const handleExportImage = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });
    
    const link = document.createElement('a');
    link.download = `whiteboard-export-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = dataURL;
    link.click();
    
    toast.success("Image exported successfully!");
  };

  const handleClearCanvas = () => {
    if (!fabricCanvas) return;
    
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    toast.success("Canvas cleared!");
  };

  const handleImageUpload = (file) => {
    if (!fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgElement = new Image();
      imgElement.onload = () => {
        FabricImage.fromURL(event.target.result).then((img) => {
          const canvasWidth = fabricCanvas.getWidth();
          const canvasHeight = fabricCanvas.getHeight();
          const maxWidth = canvasWidth * 0.3;
          const maxHeight = canvasHeight * 0.3;
          
          const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
          
          img.set({
            left: canvasWidth / 2 - (img.width * scale) / 2,
            top: canvasHeight / 2 - (img.height * scale) / 2,
            scaleX: scale,
            scaleY: scale,
          });
          
          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
          fabricCanvas.renderAll();
        });
      };
      imgElement.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Menu Button - Top Left (Excalidraw style) */}
      <div className="fixed top-4 left-4 z-50">
        <WhiteboardMenu 
          onExportImage={handleExportImage}
          onClearCanvas={handleClearCanvas}
          onImageUpload={handleImageUpload}
          fabricCanvas={fabricCanvas}
        />
      </div>

      {/* Main Toolbar - Top Center (Excalidraw style) */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <Toolbar 
          selectedTool={selectedTool} 
          onToolSelect={setSelectedTool} 
        />
      </div>

      {/* Top Right Controls (Enhanced Collaboration) */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <CollaborationPanel 
          roomId={id || "demo"}
          currentUser={currentUser}
        />
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
          onImageUpload={handleImageUpload}
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