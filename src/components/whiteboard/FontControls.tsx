import { FabricObject } from "fabric";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface FontControlsProps {
  selectedTool: string;
  selectedObject: FabricObject | null;
  fontSize: string
  handleFontSizeChange:  (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export const FontControls = ({selectedTool, fontSize, selectedObject, handleFontSizeChange}: FontControlsProps) => {
  return (
    <div>
    {(selectedTool === "text" || selectedObject?.type==='i-text') &&(
        <div>
            <Label>Font Size:</Label>
            <Input onChange={handleFontSizeChange}  value={[fontSize+'px']}/>
        </div>
    )}
    </div>
  )
}