import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const ColorPicker = ({ selectedColor, onColorSelect }: ColorPickerProps) => {
  const colors = [
    "#000000", "#374151", "#6B7280", "#9CA3AF", "#D1D5DB", "#F3F4F6", "#FFFFFF",
    "#DC2626", "#EA580C", "#D97706", "#CA8A04", "#65A30D", "#16A34A", "#059669",
    "#0891B2", "#0284C7", "#2563EB", "#4F46E5", "#7C3AED", "#A855F7", "#C026D3",
    "#E11D48"
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="h-10 w-10">
          <div 
            className="w-4 h-4 rounded border border-border"
            style={{ backgroundColor: selectedColor }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3">
        <div className="grid grid-cols-7 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                selectedColor === color 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : 'border-border hover:border-primary'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onColorSelect(color)}
              title={color}
            />
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-border">
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => onColorSelect(e.target.value)}
            className="w-full h-8 rounded border border-border cursor-pointer"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};