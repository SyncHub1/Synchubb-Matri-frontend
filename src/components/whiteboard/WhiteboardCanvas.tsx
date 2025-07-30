import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect, PencilBrush, Line, Triangle, Textbox } from "fabric";
import { toast } from "sonner";

interface WhiteboardCanvasProps {
  selectedTool: string;
  selectedColor: string;
  brushSize: number;
  zoom: number;
  onCanvasReady: (canvas: FabricCanvas) => void;
}

export const WhiteboardCanvas = ({
  selectedTool,
  selectedColor,
  brushSize,
  zoom,
  onCanvasReady
}: WhiteboardCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "var(--background)",
    });

    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.color = selectedColor;
    canvas.freeDrawingBrush.width = brushSize;

    setFabricCanvas(canvas);
    onCanvasReady(canvas);
    toast("Whiteboard ready! Start creating!");

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = selectedTool === "pen";
    fabricCanvas.selection = selectedTool === "select";
    
    if (selectedTool === "pen" && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = selectedColor;
      fabricCanvas.freeDrawingBrush.width = brushSize;
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

  useEffect(() => {
    if (["rectangle", "circle", "line", "arrow", "triangle", "text"].includes(selectedTool)) {
      addShape(selectedTool);
    }
  }, [selectedTool]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
      />
    </div>
  );
};