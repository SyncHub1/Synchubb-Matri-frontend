import { Input } from "../ui/input"
import { Label } from "../ui/label"

type SizeControlsProps = {
  selectedTool: string;
  handleHeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleWidthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDiameterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  width: number;
  height: number;
  diameter: number;
};

export const SizeControls = ({selectedTool, handleHeightChange, handleWidthChange, handleDiameterChange, width, height, diameter }:SizeControlsProps) => {
  return (
    <div>
      {selectedTool === 'rectangle' && (
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
      {selectedTool === 'circle' && (
            <div>
                <div>
                    <Label>Diameter:</Label>
                    <Input onChange={handleDiameterChange} value={diameter+'px'}/>
                </div>
            </div>
        )}
        {selectedTool === 'triangle' && (
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
    </div>
  )
}

export default SizeControls