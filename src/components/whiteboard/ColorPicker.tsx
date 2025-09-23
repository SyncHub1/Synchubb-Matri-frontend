import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FabricObject } from "fabric";
import { Label } from "../ui/label";
import { useTheme } from "next-themes";



interface ColorPickerProps {
  darkColors: string[],
  lightColors: string[],
  baseColors: string[],
  selectedObject: FabricObject | null;
  strokeColor: string;
  fillColor: string;
  selectedTool: string;
  handleStrokeColorChange: (color: string) => void;
  handleFillColorChange: (color: string) => void;
  handleGroupnTextColorChange: (groupTextColor: string) => void;
}

export const ColorPicker = ({
  darkColors,
  lightColors,
  baseColors,
  selectedTool,
  selectedObject,
  strokeColor,
  fillColor,
  handleStrokeColorChange,
  handleFillColorChange,
  handleGroupnTextColorChange,
}: ColorPickerProps) => {

  const {theme, setTheme} = useTheme();
  
  const fillStrokeColorObjs = ["rectangle", "triangle", "pen", "circle"];
  const strokeColorObjs = ["line", "single-arrow", "double-arrow", "text"];
  const strokePalette = theme === "dark" ? lightColors:darkColors;
  const fillPalette = theme === "dark" ? darkColors:lightColors;
  return (
    <div>
      {(fillStrokeColorObjs.includes(selectedTool) ||
        fillStrokeColorObjs.includes((selectedObject as any)?.label)) && (
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
                  {strokePalette.map((colorInArr) => (
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
                  {fillPalette.map((colorInArr) => (
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
      {(strokeColorObjs.includes(selectedTool) ||
        strokeColorObjs.includes((selectedObject as any)?.label)) && (
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
                {strokePalette.map((colorInArr) => (
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
