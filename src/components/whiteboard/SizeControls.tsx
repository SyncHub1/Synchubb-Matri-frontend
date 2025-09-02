import { FabricObject } from "fabric";
import { Input } from "../ui/input"
import { Label } from "../ui/label"

type SizeControlsProps = {
  selectedObject: FabricObject | null;
  handleHeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleWidthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDiameterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  width: number;
  height: number;
  diameter: number;
};

export const SizeControls = ({selectedObject, handleHeightChange, handleWidthChange, handleDiameterChange, width, height, diameter }:SizeControlsProps) => {
  console.log(selectedObject?.type)
  return (
    <div>
      {selectedObject?.type === 'rect' && (
        <div> 
          <div>
            <Label>Width:</Label>
            <Input onChange={handleWidthChange}  value={[width+'px']}/>
          </div>
          <div>
            <Label>Height:</Label>
            <Input onChange={handleHeightChange}  value={[height+'px']}/>
          </div>
        </div>
      )}
      {selectedObject?.type === 'circle' && (
            <div>
                <div>
                    <Label>Diameter:</Label>
                    <Input onChange={handleDiameterChange} value={diameter+'px'}/>
                </div>
            </div>
        )}
        {selectedObject?.type === 'line' && (
            <div>
                <div>
                    <Label>Length:</Label>
                    <Input onChange={handleWidthChange} value={width+'px'}/>
                </div>
            </div>
        )}
        {selectedObject?.type === 'group' && (
            <div>
                <div>
                    <Label>Length:</Label>
                    <Input onChange={handleWidthChange} value={width+'px'}/>
                </div>
            </div>
        )}        
    </div>
  )
}

export default SizeControls