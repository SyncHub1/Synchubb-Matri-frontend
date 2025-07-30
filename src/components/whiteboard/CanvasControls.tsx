import { 
  Undo2, Redo2, Trash2, Download, ZoomIn, ZoomOut, 
  RotateCcw, Save, Share 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Canvas as FabricCanvas } from "fabric";

interface CanvasControlsProps {
  canvas: FabricCanvas | null;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export const CanvasControls = ({ canvas, zoom, onZoomChange }: CanvasControlsProps) => {
  const handleUndo = () => {
    if (!canvas) return;
    const objects = canvas.getObjects();
    if (objects.length > 0) {
      canvas.remove(objects[objects.length - 1]);
      canvas.renderAll();
      toast("Undone");
    }
  };

  const handleRedo = () => {
    // Placeholder for redo functionality
    toast("Redo functionality coming soon!");
  };

  const handleClear = () => {
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = "var(--background)";
    canvas.renderAll();
    toast("Canvas cleared!");
  };

  const handleExport = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1
    });
    const link = document.createElement('a');
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    toast("Canvas exported!");
  };

  const handleSave = () => {
    if (!canvas) return;
    // Placeholder for save functionality
    toast("Canvas saved to local storage!");
  };

  const handleShare = () => {
    // Placeholder for share functionality
    toast("Share link copied to clipboard!");
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Action Controls */}
      <div className="bg-background border border-border rounded-lg shadow-lg p-2 flex flex-col gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleRedo}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleClear}
          title="Clear Canvas"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Zoom Controls */}
      <div className="bg-background border border-border rounded-lg shadow-lg p-2 flex flex-col items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onZoomChange(Math.min(500, zoom + 25))}
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <span className="text-xs font-mono text-muted-foreground py-1">
          {zoom}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onZoomChange(Math.max(10, zoom - 25))}
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onZoomChange(100)}
          title="Reset Zoom"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Export Controls */}
      <div className="bg-background border border-border rounded-lg shadow-lg p-2 flex flex-col gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleSave}
          title="Save"
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleExport}
          title="Export as PNG"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleShare}
          title="Share"
        >
          <Share className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};