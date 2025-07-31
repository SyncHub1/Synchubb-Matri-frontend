import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect, PencilBrush, Line, Triangle, Textbox, FabricImage, IText, ActiveSelection } from "fabric";
import { toast } from "sonner";

interface WhiteboardCanvasProps {
  selectedTool: string;
  selectedColor: string;
  brushSize: number;
  zoom: number;
  onCanvasReady: (canvas: FabricCanvas) => void;
  onImageUpload?: (file: File) => void;
}

export const WhiteboardCanvas = ({ 
  selectedTool, 
  selectedColor, 
  brushSize, 
  zoom, 
  onCanvasReady,
  onImageUpload 
}: WhiteboardCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "transparent",
    });

    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.color = selectedColor;
    canvas.freeDrawingBrush.width = brushSize;

    // Enable multiple selection with enhanced configuration
    canvas.selection = true;
    canvas.preserveObjectStacking = true;
    canvas.selectionColor = 'rgba(100, 100, 255, 0.1)';
    canvas.selectionBorderColor = 'rgba(100, 100, 255, 1)';
    canvas.selectionLineWidth = 2;
    canvas.selectionDashArray = [5, 5];

    // Enable multi-selection with Ctrl/Cmd + click
    canvas.on('mouse:down', (e) => {
      if (e.e.ctrlKey || e.e.metaKey) {
        const activeObjects = canvas.getActiveObjects();
        if (e.target && !activeObjects.includes(e.target)) {
          canvas.setActiveObject(e.target);
          if (activeObjects.length > 0) {
            activeObjects.push(e.target);
            const selection = new ActiveSelection(activeObjects, {
              canvas: canvas,
            });
            canvas.setActiveObject(selection);
          }
        }
      }
    });

    // Group/ungroup functionality
    canvas.on('object:modified', () => {
      canvas.renderAll();
    });

    setFabricCanvas(canvas);
    onCanvasReady(canvas);
    toast("Whiteboard ready! Use Ctrl+Click for multiple selection!");

    return () => {
      canvas.dispose();
    };
  }, []);

  // Image upload functionality
  const addImageToCanvas = (file: File) => {
    if (!fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgElement = new Image();
      imgElement.onload = () => {
        FabricImage.fromURL(event.target?.result as string).then((img) => {
          const canvasWidth = fabricCanvas.getWidth();
          const canvasHeight = fabricCanvas.getHeight();
          const maxWidth = canvasWidth * 0.3;
          const maxHeight = canvasHeight * 0.3;
          
          const scale = Math.min(maxWidth / img.width!, maxHeight / img.height!);
          
          img.set({
            left: canvasWidth / 2 - (img.width! * scale) / 2,
            top: canvasHeight / 2 - (img.height! * scale) / 2,
            scaleX: scale,
            scaleY: scale,
          });
          
          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
          fabricCanvas.renderAll();
        });
      };
      imgElement.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!fabricCanvas) return;

    // Handle different tools
    if (selectedTool === "select") {
      fabricCanvas.isDrawingMode = false;
      fabricCanvas.selection = true;
      fabricCanvas.defaultCursor = "default";
      fabricCanvas.hoverCursor = "move";
    } else if (selectedTool === "hand") {
      fabricCanvas.isDrawingMode = false;
      fabricCanvas.selection = false;
      fabricCanvas.defaultCursor = "grab";
      fabricCanvas.hoverCursor = "grab";
    } else if (selectedTool === "pen") {
      fabricCanvas.isDrawingMode = true;
      fabricCanvas.selection = false;
      fabricCanvas.freeDrawingBrush.color = selectedColor;
      fabricCanvas.freeDrawingBrush.width = brushSize;
    } else if (selectedTool === "text") {
      fabricCanvas.isDrawingMode = false;
      fabricCanvas.selection = true;
      fabricCanvas.defaultCursor = "text";
    } else {
      fabricCanvas.isDrawingMode = false;
      fabricCanvas.selection = true;
    }
  }, [selectedTool, selectedColor, brushSize, fabricCanvas]);

  useEffect(() => {
    if (!fabricCanvas) return;
    
    const zoomLevel = zoom / 100;
    fabricCanvas.setZoom(zoomLevel);
    fabricCanvas.renderAll();
  }, [zoom, fabricCanvas]);

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (fabricCanvas && canvasRef.current) {
        fabricCanvas.setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
        fabricCanvas.renderAll();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fabricCanvas]);

  const addShape = (shapeType: string) => {
    if (!fabricCanvas) return;

    const centerX = fabricCanvas.width! / 2;
    const centerY = fabricCanvas.height! / 2;

    switch (shapeType) {
      case "rectangle":
        const rect = new Rect({
          left: centerX - 50,
          top: centerY - 50,
          fill: "transparent",
          width: 100,
          height: 100,
          stroke: selectedColor,
          strokeWidth: brushSize
        });
        fabricCanvas.add(rect);
        fabricCanvas.setActiveObject(rect);
        break;

      case "circle":
        const circle = new Circle({
          left: centerX - 50,
          top: centerY - 50,
          fill: "transparent",
          radius: 50,
          stroke: selectedColor,
          strokeWidth: brushSize
        });
        fabricCanvas.add(circle);
        fabricCanvas.setActiveObject(circle);
        break;

      case "line":
        const line = new Line([centerX - 50, centerY, centerX + 50, centerY], {
          stroke: selectedColor,
          strokeWidth: brushSize
        });
        fabricCanvas.add(line);
        fabricCanvas.setActiveObject(line);
        break;

      case "arrow":
        const arrow = new Line([centerX - 50, centerY, centerX + 50, centerY], {
          stroke: selectedColor,
          strokeWidth: brushSize
        });
        fabricCanvas.add(arrow);
        fabricCanvas.setActiveObject(arrow);
        break;

      case "triangle":
        const triangle = new Triangle({
          left: centerX - 50,
          top: centerY - 50,
          fill: "transparent",
          width: 100,
          height: 100,
          stroke: selectedColor,
          strokeWidth: brushSize
        });
        fabricCanvas.add(triangle);
        fabricCanvas.setActiveObject(triangle);
        break;

      case "text":
        const text = new Textbox("Type here...", {
          left: centerX - 50,
          top: centerY - 25,
          fill: selectedColor,
          fontSize: 20,
          fontFamily: "Arial"
        });
        fabricCanvas.add(text);
        fabricCanvas.setActiveObject(text);
        break;
    }
    fabricCanvas.renderAll();
  };

  // Enhanced text editing with shape detection
  const addEditableText = (x: number = fabricCanvas?.getWidth() / 2, y: number = fabricCanvas?.getHeight() / 2) => {
    if (!fabricCanvas) return;

    // Check if clicking inside a shape
    const objectsAtPoint = fabricCanvas.getObjects().filter(obj => {
      if (obj.type === 'textbox' || obj.type === 'i-text') return false;
      const objBounds = obj.getBoundingRect();
      return x >= objBounds.left && x <= objBounds.left + objBounds.width &&
             y >= objBounds.top && y <= objBounds.top + objBounds.height;
    });

    const isInsideShape = objectsAtPoint.length > 0;
    const textColor = isInsideShape ? '#ffffff' : selectedColor;

    const text = new IText('Type here...', {
      left: x - 40,
      top: y - 10,
      fill: textColor,
      fontSize: 16,
      fontFamily: 'Arial',
      editable: true,
      backgroundColor: isInsideShape ? 'rgba(0,0,0,0.5)' : 'transparent',
      padding: isInsideShape ? 4 : 0,
    });

    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    text.enterEditing();
    fabricCanvas.renderAll();
    
    if (isInsideShape) {
      toast("Text added inside shape! Click outside to finish editing.");
    }
  };

  // Handle canvas clicks for text tool
  useEffect(() => {
    if (!fabricCanvas) return;

    const handleCanvasClick = (event: any) => {
      if (selectedTool === "text") {
        const pointer = fabricCanvas.getPointer(event.e);
        addEditableText(pointer.x, pointer.y);
      }
    };

    if (selectedTool === "text") {
      fabricCanvas.on('mouse:down', handleCanvasClick);
    }

    return () => {
      fabricCanvas.off('mouse:down', handleCanvasClick);
    };
  }, [selectedTool, fabricCanvas, selectedColor]);

  useEffect(() => {
    if (["rectangle", "circle", "line", "arrow", "triangle"].includes(selectedTool)) {
      addShape(selectedTool);
    } else if (selectedTool === "text") {
      addEditableText();
    }
  }, [selectedTool]);

  // Expose image upload function
  useEffect(() => {
    if (onImageUpload && fabricCanvas) {
      // Store reference for external access
      (window as any).addImageToWhiteboard = addImageToCanvas;
    }
  }, [fabricCanvas, onImageUpload]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
      />
    </div>
  );
};