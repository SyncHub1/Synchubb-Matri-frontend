import { useEffect, useRef, useState, useCallback } from "react";
import {
  Canvas as FabricCanvas,
  Circle,
  Rect,
  PencilBrush,
  Triangle,
  Textbox,
  FabricImage,
  IText,
  ActiveSelection,
  Group,
  Path,
  Point,
} from "fabric";
import { toast } from "sonner";
import { EraserBrush, ClippingGroup } from "@erase2d/fabric";

interface WhiteboardCanvasProps {
  selectedTool: string;
  strokeColor: string;
  fillColor: string;
  brushSize: number;
  zoom: number;
  fontSize: number;
  setSelectedTool: React.Dispatch<React.SetStateAction<string>>;
  setStrokeColor: React.Dispatch<React.SetStateAction<string>>;
  onCanvasReady: (canvas: FabricCanvas) => void;
  onImageUpload?: (file: File) => void;
}

export const WhiteboardCanvas = ({
  selectedTool,
  strokeColor,
  fillColor,
  brushSize,
  zoom,
  fontSize,
  setSelectedTool,
  setStrokeColor,
  onCanvasReady,
  onImageUpload,
}: WhiteboardCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const LineRef = useRef(null);
  const ArrowHead1Ref = useRef(null);
  const ArrowHead2Ref = useRef(null);
  const mouseDown = useRef(false);
  const shapeTypeRef = useRef<string>("");
  const isPanning = useRef(false);
  const panningHandlers = useRef<{
    panningMouseDown: ((opt: any) => void) | null;
    panningMouseMove: ((opt: any) => void) | null;
    panningMouseUp: (() => void) | null;
  } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "transparent",
    });

    // Enable multiple selection with enhanced configuration
    canvas.selection = true;
    canvas.preserveObjectStacking = true;
    canvas.selectionColor = "rgba(100, 100, 255, 0.1)";
    canvas.selectionBorderColor = "rgba(100, 100, 255, 1)";
    canvas.selectionLineWidth = 2;
    canvas.selectionDashArray = [5, 5];

    // Enable multi-selection with Ctrl/Cmd + click
    canvas.on("mouse:down", (e) => {
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

    canvas.on("path:created", (e) => {
      e.path.set({
        erasable: true,
      });
    });

    // Group/ungroup functionality
    canvas.on("object:modified", () => {
      canvas.renderAll();
    });

    setFabricCanvas(canvas);
    onCanvasReady(canvas);
    toast("Whiteboard ready! Use Ctrl+Click for multiple selection!");

    return () => {
      canvas.dispose();
    };
  }, []);

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
      fabricCanvas.selection = false;

      activatePanning();
    } else if (selectedTool === "pen") {
      fabricCanvas.isDrawingMode = true;
      fabricCanvas.selection = false;
      fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.color = strokeColor;
      fabricCanvas.freeDrawingBrush.width = brushSize;
      const penSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pen-icon lucide-pen"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>`
      const penCursor = `url("data:image/svg+xml;utf8,${encodeURIComponent(penSvg)}") 4 4, auto`;
      fabricCanvas.freeDrawingCursor = penCursor;
      fabricCanvas.hoverCursor = "move";
    } else if (selectedTool === "text") {
      fabricCanvas.isDrawingMode = false;
      fabricCanvas.selection = true;
      fabricCanvas.defaultCursor = "text";
    } else if (selectedTool === "eraser") {
      fabricCanvas.isDrawingMode = true;
      fabricCanvas.selection = false;
      fabricCanvas.freeDrawingBrush = new EraserBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.width = 30;
      const eraserSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21"/><path d="m5.082 11.09 8.828 8.828"/></svg>`;
      const eraserCursor = `url("data:image/svg+xml;utf8,${encodeURIComponent(eraserSvg)}") 4 4, auto`;
      fabricCanvas.freeDrawingCursor = eraserCursor;
    } else {
      fabricCanvas.isDrawingMode = false;
      fabricCanvas.selection = false;
    }

    if (selectedTool !== "hand") {
      deactivatePanning();
    }
  }, [selectedTool, strokeColor, brushSize, fabricCanvas]);

  useEffect(() => {
    if (!fabricCanvas) return;

    const zoomLevel = zoom / 100;
    fabricCanvas.setZoom(zoomLevel);
    fabricCanvas.renderAll();
  }, [zoom, fabricCanvas]);

  const activatePanning = () => {
    const panningMouseDown = (opt: any) => {
      isPanning.current = true;
      fabricCanvas.setCursor("grabbing");
    };

    const panningMouseMove = (opt: any) => {
      if (!isPanning.current) return;
      const e = opt.e;
      fabricCanvas.relativePan(new Point(e.movementX, e.movementY));
    };

    const panningMouseUp = () => {
      isPanning.current = false;
      fabricCanvas.setCursor("grab");
    };

    fabricCanvas.on("mouse:down", panningMouseDown);
    fabricCanvas.on("mouse:move", panningMouseMove);
    fabricCanvas.on("mouse:up", panningMouseUp);

    panningHandlers.current = {
      panningMouseDown,
      panningMouseMove,
      panningMouseUp,
    };

    fabricCanvas.defaultCursor = "grab";
    fabricCanvas.hoverCursor = "grab";
  };

  const deactivatePanning = () => {
    if (!panningHandlers.current) return;

    const { panningMouseDown, panningMouseMove, panningMouseUp } =
      panningHandlers.current;
    fabricCanvas.off("mouse:down", panningMouseDown);
    fabricCanvas.off("mouse:move", panningMouseMove);
    fabricCanvas.off("mouse:up", panningMouseUp);

    panningHandlers.current = null;

    fabricCanvas.defaultCursor = "default";
    fabricCanvas.hoverCursor = "move";
  };

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (fabricCanvas && canvasRef.current) {
        fabricCanvas.setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        fabricCanvas.renderAll();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fabricCanvas]);

  const addShape = (shapeType: string) => {
    shapeTypeRef.current = shapeType;
    if (!fabricCanvas) return;
    const centerX = fabricCanvas.width! / 2;
    const centerY = fabricCanvas.height! / 2;

    switch (shapeType) {
      case "rectangle":
        const rect = new Rect({
          label: "rectangle",
          left: centerX - 50,
          top: centerY - 50,
          fill: fillColor,
          width: 100,
          height: 100,
          stroke: strokeColor,
          strokeWidth: brushSize,
        });
        fabricCanvas.add(rect);
        fabricCanvas.setActiveObject(rect);
        break;

      case "circle":
        const circle = new Circle({
          label: "circle",
          left: centerX - 50,
          top: centerY - 50,
          fill: fillColor,
          radius: 50,
          stroke: strokeColor,
          strokeWidth: brushSize,
        });
        fabricCanvas.add(circle);
        fabricCanvas.setActiveObject(circle);
        break;

      case "line":
        fabricCanvas.selection = false;
        fabricCanvas.on({
          "mouse:down": addingShapeOnMouseDown,
          "mouse:move": drawingShapeOnMouseMove,
          "mouse:up": stopDrawingOnMouseUp,
        });
        break;

      case "single-arrow": {
        fabricCanvas.selection = false;
        fabricCanvas.on({
          "mouse:down": addingShapeOnMouseDown,
          "mouse:move": drawingShapeOnMouseMove,
          "mouse:up": stopDrawingOnMouseUp,
        });
        break;
      }

      case "double-arrow": {
        fabricCanvas.selection = false;
        fabricCanvas.on({
          "mouse:down": addingShapeOnMouseDown,
          "mouse:move": drawingShapeOnMouseMove,
          "mouse:up": stopDrawingOnMouseUp,
        });
        break;
      }

      case "triangle":
        const triangle = new Triangle({
          label: "triangle",
          left: centerX - 50,
          top: centerY - 50,
          fill: fillColor,
          width: 100,
          height: 100,
          stroke: strokeColor,
          strokeWidth: brushSize,
        });
        fabricCanvas.add(triangle);
        fabricCanvas.setActiveObject(triangle);
        break;

      case "text":
        const text = new Textbox("Type here...", {
          label: "text",
          left: centerX - 50,
          top: centerY - 25,
          fill: fillColor,
          fontSize: 20,
          fontFamily: "Arial",
        });
        fabricCanvas.add(text);
        fabricCanvas.setActiveObject(text);
        break;
    }
    fabricCanvas.renderAll();
    setStrokeColor("#000");
  };

  function addingShapeOnMouseDown(e) {
    console.log("add");
    const shapeType = shapeTypeRef.current;
    mouseDown.current = true;
    let pointer = fabricCanvas.getViewportPoint(e);
    let linePath =
      "M" + pointer.x + " " + pointer.y + " L " + pointer.x + " " + pointer.y;
    const line = new Path(linePath, {
      label: "line",
      stroke: strokeColor,
      strokeWidth: 3,
      originX: "center",
      originY: "center",
      hasControls: false,
      hasBorders: false,
      objectCaching: false,
    });
    fabricCanvas.add(line);
    LineRef.current = line;

    let arrowHeadPath = "M 0 0 L 20 10 L 0 20 Z";

    if (shapeType === "single-arrow" || shapeType === "double-arrow") {
      const arrowHead1 = new Path(arrowHeadPath, {
        label: "arrow-line",
        fill: strokeColor,
        stroke: strokeColor,
        strokeWidth: 0,
        originX: "center",
        originY: "center",
        hasBorders: false,
        hasControls: false,
        top: pointer.y,
        left: pointer.x,
      });
      fabricCanvas.add(arrowHead1);
      ArrowHead1Ref.current = arrowHead1;
    }

    if (shapeType === "double-arrow") {
      const arrowHead2 = new Path(arrowHeadPath, {
        label: "arrow-line",
        fill: strokeColor,
        stroke: strokeColor,
        strokeWidth: 0,
        originX: "center",
        originY: "center",
        hasBorders: false,
        hasControls: false,
        top: pointer.y,
        left: pointer.x,
        angle: 180,
      });
      fabricCanvas.add(arrowHead2);
      ArrowHead2Ref.current = arrowHead2;
    }
    fabricCanvas.requestRenderAll();
    console.log(pointer);
  }

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

      if (shapeType === "single-arrow" || shapeType === "double-arrow") {
        arrowHead1.left = pointer.x;
        arrowHead1.top = pointer.y;
        let startPointX = line.path[0][1];
        let startPointY = line.path[0][2];
        let width = Math.abs(pointer.x - line.path[0][1]);
        let height = Math.abs(pointer.y - line.path[0][2]);
        let ratio = height / width;
        let angle = (Math.atan(ratio) / Math.PI) * 180;

        if (shapeType === "single-arrow") {
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
          }
          arrowHead1.setCoords();
        } else if (shapeType === "double-arrow") {
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
          }
        }
      }
      fabricCanvas.requestRenderAll();
    }
  }

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
      label:
        shapeType === "single-arrow" || shapeType === "double-arrow"
          ? "arrow-line"
          : "line",
      stroke: strokeColor,
      strokeWidth: 3,
      originX: "center",
      originY: "center",
      hasControls: true,
      hasBorders: false,
      objectCaching: false,
    });
    fabricCanvas.add(line);
    fabricCanvas.setActiveObject(line);
    LineRef.current = line;

    if (shapeType === "single-arrow") {
      fabricCanvas.bringObjectToFront(arrowHead1);
      let objects = [];
      fabricCanvas.getObjects().forEach((o) => {
        if ((o as any).label === "arrow-line") {
          objects.push(o);
        }
      });
      let singleArrow = new Group(objects, {
        label: "single-arrow",
        originX: "center",
        originY: "center",
        hasControls: true,
        hasBorders: false,
        objectCaching: false,
      } as any);
      fabricCanvas.add(singleArrow);
      fabricCanvas.setActiveObject(singleArrow);
      fabricCanvas.remove(LineRef.current, ArrowHead1Ref.current);
    } else if (shapeType === "double-arrow") {
      fabricCanvas.bringObjectToFront(arrowHead2);
      let objects = [];
      fabricCanvas.getObjects().forEach((o) => {
        if ((o as any).label === "arrow-line") {
          objects.push(o);
        }
      });
      let doubleArrow = new Group(objects, {
        label: "double-arrow",
        originX: "center",
        originY: "center",
        hasControls: true,
        hasBorders: false,
        objectCaching: false,
      } as any);
      fabricCanvas.add(doubleArrow);
      fabricCanvas.setActiveObject(doubleArrow);
      fabricCanvas.remove(
        LineRef.current,
        ArrowHead1Ref.current,
        ArrowHead2Ref.current
      );
    }

    fabricCanvas.requestRenderAll();
    fabricCanvas.off({
      "mouse:down": addingShapeOnMouseDown,
      "mouse:move": drawingShapeOnMouseMove,
      "mouse:up": stopDrawingOnMouseUp,
    });
  }

  // Enhanced text editing with shape detection
  const addEditableText = (
    x: number = fabricCanvas?.getWidth() / 2,
    y: number = fabricCanvas?.getHeight() / 2
  ) => {
    if (!fabricCanvas) return;

    // Check if clicking inside a shape
    const objectsAtPoint = fabricCanvas.getObjects().filter((obj) => {
      if (obj.type === "textbox" || obj.type === "i-text") return false;
      const objBounds = obj.getBoundingRect();
      return (
        x >= objBounds.left &&
        x <= objBounds.left + objBounds.width &&
        y >= objBounds.top &&
        y <= objBounds.top + objBounds.height
      );
    });

    const isInsideShape = objectsAtPoint.length > 0;
    const textColor = isInsideShape ? "#ffffff" : strokeColor;

    const text = new IText("Type here...", {
      label: "text",
      left: x - 40,
      top: y - 10,
      fill: textColor,
      fontSize: fontSize,
      fontFamily: "Arial",
      editable: true,
      backgroundColor: isInsideShape ? "rgba(0,0,0,0.5)" : "transparent",
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
      fabricCanvas.on("mouse:down", handleCanvasClick);
    }

    return () => {
      fabricCanvas.off("mouse:down", handleCanvasClick);
    };
  }, [selectedTool, fabricCanvas, strokeColor]);

  useEffect(() => {
    if (!fabricCanvas) return;

    if (
      [
        "rectangle",
        "circle",
        "line",
        "single-arrow",
        "double-arrow",
        "triangle",
      ].includes(selectedTool)
    ) {
      addShape(selectedTool);
    }
  }, [selectedTool]);

  // Expose image upload function
  useEffect(() => {
    if (onImageUpload && fabricCanvas) {
      // Store reference for external access
      (window as any).addImageToWhiteboard = onImageUpload;
    }
  }, [fabricCanvas, onImageUpload]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />
    </div>
  );
};
