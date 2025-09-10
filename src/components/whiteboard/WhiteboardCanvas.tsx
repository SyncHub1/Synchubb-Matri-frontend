import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas, Circle, Rect, PencilBrush, Line, Triangle, Textbox, FabricImage, IText, ActiveSelection, Group, Path } from "fabric";
import { toast } from "sonner";

interface WhiteboardCanvasProps {
  selectedTool: string;
  selectedColor: string;
  brushSize: number;
  zoom: number;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  onCanvasReady: (canvas: FabricCanvas) => void;
  onImageUpload?: (file: File) => void;
}

export const WhiteboardCanvas = ({ 
  selectedTool, 
  selectedColor, 
  brushSize, 
  zoom,
  setSelectedColor,
  onCanvasReady,
  onImageUpload 
}: WhiteboardCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const LineRef = useRef(null);
  const ArrowHead1Ref = useRef(null);
  const ArrowHead2Ref = useRef(null);
  const mouseDown = useRef(false);
  const shapeTypeRef = useRef<string>("");

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
      fabricCanvas.selection = false;
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
    shapeTypeRef.current = shapeType;
    if (!fabricCanvas) return;
    const centerX = fabricCanvas.width! / 2;
    const centerY = fabricCanvas.height! / 2;

    switch (shapeType) {
      case "rectangle":
        const rect = new Rect({
          label: 'rectangle',
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
          label: 'circle',
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
        fabricCanvas.selection = false;
        fabricCanvas.on({
          'mouse:down': addingShapeOnMouseDown,
          'mouse:move': drawingShapeOnMouseMove,
          'mouse:up': stopDrawingOnMouseUp
        });
        break;

      case "single-arrow": {
        fabricCanvas.selection = false;
        fabricCanvas.on({
          'mouse:down': addingShapeOnMouseDown,
          'mouse:move': drawingShapeOnMouseMove,
          'mouse:up': stopDrawingOnMouseUp
        });
        break;
      };
        
      case "double-arrow": {
        fabricCanvas.selection = false;
        fabricCanvas.on({
          'mouse:down': addingShapeOnMouseDown,
          'mouse:move': drawingShapeOnMouseMove,
          'mouse:up': stopDrawingOnMouseUp
        });
        break;
      }

      case "triangle":
        const triangle = new Triangle({
          label: 'triangle',
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
          label: 'text',
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
    setSelectedColor("#000");
  };

  function addingShapeOnMouseDown(e) {
    console.log("add");
    const shapeType = shapeTypeRef.current;
    mouseDown.current = true;
    let pointer = fabricCanvas.getViewportPoint(e);
    let linePath = 'M' + pointer.x + ' ' + pointer.y + ' L ' + pointer.x + ' ' + pointer.y;
    const line = new Path(linePath, {
      label: 'line',
      stroke: selectedColor,
      strokeWidth: 3,
      originX: 'center',
      originY: 'center',
      hasControls: false,
      hasBorders: false,
      objectCaching: false
    });
    fabricCanvas.add(line);
    LineRef.current = line;

    let arrowHeadPath = 'M 0 0 L 20 10 L 0 20 Z';

    if (shapeType === 'single-arrow' || shapeType === 'double-arrow'){
      const arrowHead1 = new Path(arrowHeadPath, {
        label: 'arrow-line',
        fill: selectedColor,
        stroke: selectedColor,
        strokeWidth: 0,
        originX: 'center',
        originY: 'center',
        hasBorders: false,
        hasControls: false,
        top: pointer.y,
        left: pointer.x
      });
      fabricCanvas.add(arrowHead1)
      ArrowHead1Ref.current = arrowHead1;
    ;
    }

    if (shapeType === 'double-arrow'){
      const arrowHead2 = new Path(arrowHeadPath, {
        label: 'arrow-line',
        fill: selectedColor,
        stroke: selectedColor,
        strokeWidth: 0,
        originX: 'center',
        originY: 'center',
        hasBorders: false,
        hasControls: false,
        top: pointer.y,
        left: pointer.x,
        angle: 180
      });
      fabricCanvas.add(arrowHead2);
      ArrowHead2Ref.current = arrowHead2;
    }
    fabricCanvas.requestRenderAll();
    console.log(pointer);
  };

  function drawingShapeOnMouseMove(e) {
    console.log("draw");
    const shapeType = shapeTypeRef.current;
    const line = LineRef.current;
    const arrowHead1 = ArrowHead1Ref.current;
    const arrowHead2 = ArrowHead2Ref.current;
    console.log(mouseDown.current);

    if (mouseDown.current) {
      let pointer = fabricCanvas.getViewportPoint(e);
      line.path[1][1] = pointer.x;
      line.path[1][2] = pointer.y;
      line.setCoords();

      if (shapeType==='single-arrow' || shapeType==='double-arrow'){
        arrowHead1.left = pointer.x;
        arrowHead1.top = pointer.y;
        let startPointX = line.path[0][1];
        let startPointY = line.path[0][2];
        let width = Math.abs(pointer.x - line.path[0][1]);
        let height = Math.abs(pointer.y - line.path[0][2]);
        let ratio = height / width;
        let angle = ((Math.atan(ratio) / Math.PI) * 180 );

        if (shapeType === 'single-arrow'){
          if (arrowHead1.left >= startPointX) {
            if (arrowHead1.top <= startPointY) {
              arrowHead1.angle = 360 - angle;
            } else if (arrowHead1.top > startPointY) {
              arrowHead1.angle = angle;
            }
          } else {
            if (arrowHead1.top <= startPointY) {
              arrowHead1.angle = 180 + angle;
            } else if (arrowHead1.top > startPointY) {
              arrowHead1.angle = 180 - angle;
            }
          };
          arrowHead1.setCoords();
        } else if (shapeType === 'double-arrow'){
          if (arrowHead1.left >= arrowHead2.left) {
            if (arrowHead1.top <= arrowHead2.top) {
              arrowHead1.angle = 360 - angle;
              arrowHead2.angle = 360 - angle + 180;
            } else if (arrowHead1.top > arrowHead2.top) {
              arrowHead1.angle = angle;
              arrowHead2.angle = angle + 180;
            }
          } else {
            if (arrowHead1.top <= arrowHead2.top) {
              arrowHead1.angle = 180 + angle;
              arrowHead2.angle = 360 + angle;
            } else if (arrowHead1.top > arrowHead2.top) {
              arrowHead1.angle = 180 - angle;
              arrowHead2.angle = 360 - angle;
            }
            arrowHead1.setCoords();
            arrowHead2.setCoords();
          };
        }
      };
      fabricCanvas.requestRenderAll();
    }
  };

  function stopDrawingOnMouseUp(e) {
    console.log("stop");
    mouseDown.current = false;
    const shapeType = shapeTypeRef.current;
    let line = LineRef.current;
    const arrowHead1 = ArrowHead1Ref.current;
    const arrowHead2 = ArrowHead2Ref.current;
    let updatedLinePath = line.path;
    fabricCanvas.remove(line);
    line = new Path(updatedLinePath, {
      label: (shapeType === 'single-arrow' || shapeType === 'double-arrow') ? 'arrow-line' : 'line',
      stroke: selectedColor,
      strokeWidth: 3,
      originX: 'center',
      originY: 'center',
      hasControls: true,
      hasBorders: false,
      objectCaching: false,
    });
    fabricCanvas.add(line);
    LineRef.current = line;

    if (shapeType==='single-arrow') {
      fabricCanvas.bringObjectToFront(arrowHead1);
      let objects = [];
      fabricCanvas.getObjects().forEach(o => {
        if ((o as any).label === 'arrow-line') {
          objects.push(o);
        }
      });
      let singleArrow = new Group(objects, {
        label: 'single-arrow',
        originX: 'center',
        originY: 'center',
        hasControls: true,
        hasBorders: false,
        objectCaching: false
      } as any)
      fabricCanvas.add(singleArrow);
      fabricCanvas.remove(LineRef.current, ArrowHead1Ref.current)
    } else if (shapeType==='double-arrow') {
      fabricCanvas.bringObjectToFront(arrowHead2);
      let objects = [];
      fabricCanvas.getObjects().forEach(o => {
        if ((o as any).label === 'arrow-line') {
          objects.push(o);
        }
      });
      let doubleArrow = new Group(objects, {
        label: 'double-arrow',
        originX: 'center',
        originY: 'center',
        hasControls: true,
        hasBorders: false,
        objectCaching: false
      } as any)
      fabricCanvas.add(doubleArrow);
      fabricCanvas.remove(LineRef.current, ArrowHead1Ref.current, ArrowHead2Ref.current)
    }

    fabricCanvas.requestRenderAll();
    fabricCanvas.off({
      'mouse:down': addingShapeOnMouseDown,
      'mouse:move': drawingShapeOnMouseMove,
      'mouse:up': stopDrawingOnMouseUp
    });
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
      label: 'text',
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
    if (!fabricCanvas) return;

    if (["rectangle", "circle", "line", "single-arrow", "double-arrow", "triangle"].includes(selectedTool)) {
      addShape(selectedTool);
    } else if (selectedTool === "text") {
      addEditableText();
    } else if (selectedTool === "select" || selectedTool === "hand") {
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