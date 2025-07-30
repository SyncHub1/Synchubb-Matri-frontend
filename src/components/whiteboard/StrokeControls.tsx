import { Slider } from "@/components/ui/slider";

interface StrokeControlsProps {
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
}

export const StrokeControls = ({ brushSize, onBrushSizeChange }: StrokeControlsProps) => {
  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-3 min-w-[200px]">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Stroke Width</span>
          <span className="text-sm text-muted-foreground">{brushSize}px</span>
        </div>
        <Slider
          value={[brushSize]}
          onValueChange={(value) => onBrushSizeChange(value[0])}
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
  );
};