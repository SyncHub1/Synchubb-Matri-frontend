import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Canvas as FabricCanvas, FabricImage, ActiveSelection, Group, util } from "fabric";
import { Button } from "@/components/ui/button";
import { WhiteboardCanvas } from "@/components/whiteboard/WhiteboardCanvas";
import { Toolbar } from "@/components/whiteboard/Toolbar";
import { ColorPicker } from "@/components/whiteboard/ColorPicker";
import { StrokeControls } from "@/components/whiteboard/StrokeControls";
import { SizeControls } from "@/components/whiteboard/SizeControls"
import { FontControls } from "@/components/whiteboard/FontControls"
import { CollaboratorCursors } from "@/components/whiteboard/CollaboratorCursors";
import { ThemeToggle } from "@/components/whiteboard/ThemeToggle";
import { WhiteboardMenu } from "@/components/whiteboard/WhiteboardMenu";
import { CollaborationPanel } from "@/components/whiteboard/CollaborationPanel";
import { LayersList } from "@/components/whiteboard/LayersList";
import { toast } from "sonner";
import { ChevronLeft, Menu, X } from "lucide-react";
import { string } from "zod";

const TeamWhiteboard = () => {
  const { id } = useParams();
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [selectedTool, setSelectedTool] = useState("select");
  const [selectedColor, setSelectedColor] = useState("#000000")
  const [selectedObject, setSelectedObject] = useState(null);
  const [brushSize, setBrushSize] = useState(3);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [diameter, setDiameter] = useState("");
  const [strokeColor, setStrokeColor] = useState("#000");  
  const [fillColor, setFillColor] = useState("");
  const [fontSize, setFontSize] = useState(28);
  const [zoom, setZoom] = useState(100);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
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
      if (e.key === 'Delete') {
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
        1: "select",
        2: "hand",
        3: "rectangle",
        4: "circle",
        5: "triangle",
        6: "single-arrow",
        7: "double-arrow",
        8: "line",
        9: "pen",
        0: "text",
      };

      if (toolShortcuts[e.key]) {
        setSelectedTool(toolShortcuts[e.key]);
      }
    };

    if (fabricCanvas) {
        fabricCanvas.on("selection:created", (event) => {
            handleObjectSelection(event.selected[0]);
        });
        fabricCanvas.on("selection:updated", (event) => {
            handleObjectSelection(event.selected[0]);
        });
        fabricCanvas.on("selection:cleared", (event) => {
            setSelectedObject(null);
            clearSettings();
            setSelectedTool("select");
        });
        fabricCanvas.on("object:modified", (event) => {
            handleObjectSelection(event.target);
        });
        fabricCanvas.on("object:scaling", (event) => {
            handleObjectSelection(event.target);
        });
        }
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    
  }, [fabricCanvas]);


    const handleObjectSelection = (object) => {
        if (!object) return;
        console.log(object.id);
        setSelectedObject(object);
        if (object.type === 'rect') {
            setWidth(Math.round(object.width * object.scaleX));
            setHeight(Math.round(object.height * object.scaleY));
            setStrokeColor(object.stroke);
            setFillColor(object.fill);
            setDiameter("");
        } else if (object.type === 'circle'){
            setDiameter(Math.round(object.radius * 2 * object.scaleX));
            setStrokeColor(object.stroke);
            setFillColor(object.fill);
            setWidth("");
            setHeight("");
        }  else if (object.type === 'line'){
            setWidth("");
            setStrokeColor(object.stroke);
            setHeight("");
            setDiameter("");
        } else if (object.type === 'group'){
            setWidth("");
            setFillColor(object.fill);
            setHeight("");
            setDiameter("");
        } else if (object.type === 'path'){
            setWidth("");
            setStrokeColor(object.stroke);
            setHeight("");
            setDiameter("");
        } else if (object.type === 'i-text'){
            setWidth("");
            setFillColor(object.fill);
            setStrokeColor(object.stroke);
            setHeight("");
            setDiameter("");
        } else if (object.type === "triangle") {
            setWidth(Math.round(object.width * object.scaleX));
            setHeight(Math.round(object.height * object.scaleY));
            setStrokeColor(object.stroke); 
            setFillColor(object.fill);
            setDiameter("");
}
    };    




  // Simulate collaborative cursor movement
  useEffect(() => {
    const interval = setInterval(() => {
      // Update collaborator positions (simulated)
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const clearSettings = () => {
        setWidth("");
        setHeight("");
        setStrokeColor("#000");
        setFillColor("");
        setDiameter("");
    };
  
  const handleCanvasReady = (canvas) => {
    setFabricCanvas(canvas);
  };

  const handleBrushSizeChange = (e) => {
    const value = e.target.value;
    setBrushSize(value)
    fabricCanvas.renderAll();
  }

  const handleFontSizeChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    const IntValue = parseInt(value, 10)
    setFontSize(IntValue);
    if (selectedObject) {
      selectedObject.set({fontSize: IntValue});
      fabricCanvas.requestRenderAll();
    }
  }

  const handleWidthChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    const IntValue = parseInt(value, 10)
    setWidth(IntValue);
    selectedObject.set({width: IntValue / selectedObject.scaleX});

    if(!selectedObject || IntValue <=0 ) return;

    if (selectedObject.type === "rect" || selectedObject.type === "line") {
        selectedObject.set({width: IntValue / selectedObject.scaleX});
    } else if (selectedObject.type === "group") {
      setArrowWidth(selectedObject, IntValue);
    };

    fabricCanvas.requestRenderAll();
  };

  const handleHeightChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    const IntValue = parseInt(value, 10)
    setHeight(IntValue);
    if (selectedObject && selectedObject.type === "rect" && IntValue >= 0) {
        selectedObject.set({height: IntValue / selectedObject.scaleY});
        fabricCanvas.renderAll();
    }  
  }

  const handleDiameterChange = (e) => {
      const value = e.target.value.replace(/,/g, "");
      const IntValue = parseInt(value, 10)
      setDiameter(IntValue);
      if (selectedObject && selectedObject.type === "circle" && IntValue >= 0) {
          selectedObject.set({radius: IntValue / 2 / selectedObject.scaleX});
          fabricCanvas.renderAll();
      }           
  };

  const handleStrokeColorChange = (color) => {
      const value = color;
      setStrokeColor(value);
      if (selectedObject) {
          selectedObject.set({stroke: value});
          fabricCanvas.renderAll();
      }
  };  

    const handleFillColorChange = (color) => {
      const value = color;
      setFillColor(value);
      if (selectedObject) {
          selectedObject.set({fill: value});
          fabricCanvas.renderAll();
      }
  };  

  const handleGroupnTextColorChange = (color) => {
      setStrokeColor(color);
      if (selectedObject && selectedObject.type === 'group') {
        if (selectedObject.label === 'single-arrow'){
          const head = selectedObject.item(1);
          const line = selectedObject.item(0);
          head.set({ fill: color });
          line.set({ stroke: color });
        } else if (selectedObject.label === 'double-arrow'){
          const head = selectedObject.item(0);
          const line = selectedObject.item(1);
          const head2 = selectedObject.item(2);
          head.set({ fill: color });
          line.set({ stroke: color });
          head2.set({ fill: color });     
        }
      } else {
        selectedObject.set({fill: color});
      }
      fabricCanvas.renderAll();
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

  const uploadImageToCloudinary = async (file) => {
    if (!file) return;

    const data = new FormData();
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    data.append("file", file);
    data.append("upload_preset", uploadPreset)
    data.append("cloud_name", cloudName)
 
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: data
    });

    const uploadRes = await res.json();
    const uploadedImageUrl = uploadRes.url;
    toast.success("Image uploaded successfully!");
    return uploadedImageUrl;

  }

  const handleImageUpload = async (file) => {
    if (!fabricCanvas) return;
    const uploadedImageUrl = await uploadImageToCloudinary(file);
    console.log(uploadedImageUrl);
    const reader = new FileReader();
    reader.onload = (event) => {
      const imgElement = new Image();
      imgElement.onload = () => {
        FabricImage.fromURL(uploadedImageUrl).then((img) => {
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
      {/* Mobile Header - Top */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <Link to={`/dashboard/maitri/teams/${id}/chat`} className="flex items-center gap-2 text-nav-foreground hover:text-nav-active">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-foreground">✕</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold">Whiteboard</h1>
              <p className="text-xs text-muted-foreground">EcoTrack Project</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileMenu(false)} />
          <div className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-background border-l border-border">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold">Whiteboard Tools</h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowMobileMenu(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <CollaborationPanel 
                roomId={id || "demo"}
                currentUser={currentUser}
              />
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Library
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleExportImage}>
                  Export Image
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleClearCanvas}>
                  Clear Canvas
                </Button>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}

      {/* Menu Button - Top Left (Desktop) */}
      <div className="hidden lg:block fixed top-4 left-4 z-50">
        <WhiteboardMenu 
          onExportImage={handleExportImage}
          onClearCanvas={handleClearCanvas}
          onImageUpload={handleImageUpload}
          fabricCanvas={fabricCanvas}
        />
      </div>

      {/* Main Toolbar - Top Center */}
      <div className="fixed z-50 top-16 lg:top-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-1">
          <Toolbar 
            selectedTool={selectedTool} 
            onToolSelect={setSelectedTool} 
            onImageUpload={handleImageUpload}
          />
        </div>
      </div>

      {/* Top Right Controls (Desktop) */}
      <div className="hidden lg:flex fixed top-4 right-4 z-50 items-center gap-2">
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
      {(selectedTool !== "hand" && selectedObject !== null) && (
        <div className="fixed z-40 flex items-center gap-2 sm:gap-3 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-2 top-28 lg:top-20 left-1/2 transform -translate-x-1/2">
          <SizeControls 
            selectedObject={selectedObject}
            selectedTool={selectedTool}
            handleWidthChange={handleWidthChange} 
            handleHeightChange={handleHeightChange} 
            handleDiameterChange={handleDiameterChange}
            height={height} 
            width={width}
            diameter={diameter}/>
          <ColorPicker
            selectedObject={selectedObject} 
            selectedColor={selectedColor}
            selectedTool={selectedTool}
            handleStrokeColorChange={handleStrokeColorChange}
            handleFillColorChange={handleFillColorChange}
            handleGroupnTextColorChange={handleGroupnTextColorChange}
            strokeColor={strokeColor}
            fillColor={fillColor}
          />
          <StrokeControls 
            selectedObject={selectedObject}
            selectedTool={selectedTool}
            brushSize={brushSize}
            setBrushSize={setBrushSize}
          />
          <FontControls
            selectedTool={selectedTool}
            selectedObject={selectedObject}
            fontSize={fontSize}
            handleFontSizeChange={handleFontSizeChange}
            />
        </div>
      )}

      {/* Zoom Controls - Bottom Left */}
      <div className="fixed bottom-4 left-4 z-50">
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-2 flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9"
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
            className="h-8 w-8 sm:h-9 sm:w-9"
            onClick={() => setZoom(Math.min(500, zoom + 25))}
            title="Zoom In"
          >
            <span className="text-lg font-bold">+</span>
          </Button>
        </div>
      </div>

      {/* Help Button - Bottom Right */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button variant="outline" size="icon" className="shadow-md rounded-full h-10 w-10 sm:h-11 sm:w-11">
          <span className="text-sm font-bold">?</span>
        </Button>
      </div>

      {/* Main Canvas */}
      <div className="absolute inset-0 top-16 lg:top-0">
        <WhiteboardCanvas
          selectedTool={selectedTool}
          strokeColor={strokeColor}
          fillColor={fillColor}
          brushSize={brushSize}
          zoom={zoom}
          fontSize={fontSize}
          setSelectedTool={setSelectedTool}
          setStrokeColor={setStrokeColor}
          onCanvasReady={handleCanvasReady}
          onImageUpload={handleImageUpload}
        />
        
        {/* Collaborative Cursors */}
        <CollaboratorCursors collaborators={collaborators} />
      </div>
       {/* Layers List */}
      <div>
        <LayersList 
            fabricCanvas={fabricCanvas}
        />
       </div>
        
      {/* Welcome Message - Center */}
      {fabricCanvas && fabricCanvas.getObjects().length === 0 && (
        <div className="absolute inset-0 top-16 lg:top-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-muted-foreground px-4">
            <div className="mb-6 sm:mb-8">
              <div className="text-4xl sm:text-6xl font-bold text-primary mb-3 sm:mb-4">✕</div>
              <h1 className="text-lg sm:text-2xl font-semibold mb-2">EXCALIDRAW</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8">All your data is saved locally in your browser.</p>
            </div>
            <div className="space-y-3 sm:space-y-4 text-left max-w-xs mx-auto">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span>📁</span>
                <span>Open</span>
                <kbd className="ml-auto bg-muted px-1.5 py-0.5 rounded text-xs">Ctrl+O</kbd>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span>❓</span>
                <span>Help</span>
                <kbd className="ml-auto bg-muted px-1.5 py-0.5 rounded text-xs">?</kbd>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span>👥</span>
                <span>Live collaboration...</span>
              </div>
            </div>
            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-base sm:text-lg font-medium mb-2">Pick a tool &</p>
              <p className="text-base sm:text-lg font-medium">Start drawing!</p>
              <p className="text-xs text-muted-foreground mt-3 sm:mt-4 max-w-sm mx-auto">
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