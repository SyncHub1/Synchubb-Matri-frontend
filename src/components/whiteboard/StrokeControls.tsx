import { Slider } from "@/components/ui/slider";
import { FabricObject } from "fabric";

declare module "fabric" {
  interface Object {
    label?: string;
  }
}

interface StrokeControlsProps {
  selectedObject: FabricObject | null;
  selectedTool: string;
  brushSize: number;
  setBrushSize: (size: number) => void;
}

export const StrokeControls = ({ selectedObject, selectedTool, brushSize, setBrushSize }: StrokeControlsProps) => {
  const strokeControlObjs = ['rectangle', 'triangle', 'circle', 'pen'];
  return (
    <div>
    {(strokeControlObjs.includes(selectedTool) || strokeControlObjs.includes(selectedObject?.label)) && (
    <div className="bg-background border border-border rounded-lg shadow-lg p-3 min-w-[200px]">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Stroke Width</span>
          <span className="text-sm text-muted-foreground">{brushSize}px</span>
        </div>
        <Slider
          value={[brushSize]}
          onValueChange={(value) => setBrushSize(value[0])}
          max={20}
          min={1}
          step={1}
          className="w-full"
        />
        <div className="flex items-center justify-center pt-2">
          <div 
            className="rounded-full bg-foreground"
            style={{ 
              width: `${Math.max(brushSize, 2)}px`, 
              height: `${Math.max(brushSize, 2)}px` 
            }}
          />
        </div>
      </div>
    </div>
    )}
    </div>
  );
};