import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FabricObject } from "fabric";
import { Label } from "../ui/label";

interface ColorPickerProps {
  selectedObject: FabricObject | null;
  strokeColor: string;
  fillColor: string;
  selectedTool: string;
  handleStrokeColorChange: (color: string) => void;
  handleFillColorChange: (color: string) => void;
  handleGroupnTextColorChange: (groupTextColor: string) => void;
}

export const ColorPicker = ({
  selectedTool,
  selectedObject,
  strokeColor,
  fillColor,
  handleStrokeColorChange,
  handleFillColorChange,
  handleGroupnTextColorChange,
}: ColorPickerProps) => {
  const colors = [
    "#000000",
    "#374151",
    "#6B7280",
    "#9CA3AF",
    "#D1D5DB",
    "#F3F4F6",
    "#FFFFFF",
    "#DC2626",
    "#EA580C",
    "#D97706",
    "#CA8A04",
    "#65A30D",
    "#16A34A",
    "#059669",
    "#0891B2",
    "#0284C7",
    "#2563EB",
    "#4F46E5",
    "#7C3AED",
    "#A855F7",
    "#C026D3",
    "#E11D48",
  ];
  const fillStrokeColorObjs = ["rectangle", "triangle", "circle"];
  const strokeColorObjs = [
    "line",
    "single-arrow",
    "double-arrow",
    "pen",
    "text",
  ];
  return (
    <div>
      {fillStrokeColorObjs.includes(selectedTool) && (
        <div className="p-2 space-y-2">
          <div className="flex flex-col gap-2">
            <Label>Stroke:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <div
                    className="w-4 h-4 rounded border border-border"
                    style={{ backgroundColor: strokeColor }}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3">
                <div className="grid grid-cols-7 gap-2">
                  {colors.map((colorInArr) => (
                    <button
                      key={colorInArr}
                      className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                        strokeColor === colorInArr
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-primary"
                      }`}
                      style={{ backgroundColor: colorInArr }}
                      onClick={() => handleStrokeColorChange(colorInArr)}
                      title={colorInArr}
                    />
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <input
                    type="color"
                    value={strokeColor}
                    onChange={(e) => handleStrokeColorChange(e.target.value)}
                    className="w-full h-8 rounded border border-border cursor-pointer"
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Fill:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <div
                    className="w-4 h-4 rounded border border-border"
                    style={{ backgroundColor: fillColor }}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3">
                <div className="grid grid-cols-7 gap-2">
                  {colors.map((colorInArr) => (
                    <button
                      key={colorInArr}
                      className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                        fillColor === colorInArr
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-primary"
                      }`}
                      style={{ backgroundColor: colorInArr }}
                      onClick={() => handleFillColorChange(colorInArr)}
                      title={colorInArr}
                    />
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <input
                    type="color"
                    value={fillColor}
                    onChange={(e) => handleFillColorChange(e.target.value)}
                    className="w-full h-8 rounded border border-border cursor-pointer"
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
      {strokeColorObjs.includes(selectedTool) && (
        <div className="flex flex-col gap-2 p-2">
          <Label>Stroke:</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <div
                  className="w-4 h-4 rounded border border-border"
                  style={{ backgroundColor: strokeColor }}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3">
              <div className="grid grid-cols-7 gap-2">
                {colors.map((colorInArr) => (
                  <button
                    key={colorInArr}
                    className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                      strokeColor === colorInArr
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary"
                    }`}
                    style={{ backgroundColor: colorInArr }}
                    onClick={() => handleGroupnTextColorChange(colorInArr)}
                    title={colorInArr}
                  />
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => handleGroupnTextColorChange(e.target.value)}
                  className="w-full h-8 rounded border border-border cursor-pointer"
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};
