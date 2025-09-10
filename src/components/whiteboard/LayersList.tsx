import { Canvas } from "fabric";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowDownFromLine, ArrowUpFromLine } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';


declare module "fabric" {
  interface Object {
    id?: string;
    zIndex?: number;
  }
}

interface LayersListProps {
  fabricCanvas: any;
}

export const LayersList = ({fabricCanvas}: LayersListProps) => {
  const [layers, setLayers] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState(null);

  const moveSelectedLayer = (direction) => {
    if (!selectedLayer) return;

    const objects = fabricCanvas.getObjects();
    const object = objects.find((obj) => obj.id === selectedLayer);

    if (object) {
      const currentIndex = objects.indexOf(object);

      if (direction === 'up' && currentIndex < objects.length - 1) {
        const temp = objects[currentIndex];
        objects[currentIndex] = objects[currentIndex + 1];
        objects[currentIndex + 1] = temp;
      } else if (direction === 'down') {
        const temp = objects[currentIndex];
        objects[currentIndex] = objects[currentIndex - 1];
        objects[currentIndex - 1] = temp;
      }

      const backgroundColor = fabricCanvas.backgroundColor;
      fabricCanvas.clear();

      objects.forEach((obj) => fabricCanvas.add(obj));

      fabricCanvas.backgroundColor = backgroundColor;
      fabricCanvas.renderAll();

      objects.forEach((obj, index) => {
        obj.zIndex = index;
      });

      fabricCanvas.setActiveObject(object);
      fabricCanvas.renderAll();

      updateLayers();
    }
  }

  const addIdToObject = (object) => {
    if (object.type==='path' && !object.label) {
      const timestamp = new Date().getTime();
      object.id = `pen_${timestamp}`;
      object.label = 'pen'
      console.log(object.id)
    } else if (object.label) {
      const timestamp = new Date().getTime();
      object.id = `${object.label}_${uuidv4()}`;
      console.log(object.id)
    }
  }

  (Canvas.prototype as any).updateZIndices = function ():any {
    const objects = this.getObjects();
    objects.forEach((obj,index) => {
      addIdToObject(obj);
      obj.zIndex = index;
    });
  }

  const updateLayers = () => {
    if (fabricCanvas) {
      fabricCanvas.updateZIndices();
      const objects = fabricCanvas
      .getObjects()
      .filter(
        (obj) => 
          !(
            obj.id.startsWith("vertical-") || obj.id.startsWith("horizontal-") || obj.id.startsWith("arrow-line")
          )
      )
      .map((obj) => ({
        id: obj.id,
        label: obj.label,
        zIndex: obj.zIndex,
        type: obj.type
      }));
      setLayers([...objects].reverse());
    }
  };

  const handleObjectSelected = (e) => {
    const selectObject = e.selected ? e.selected[0] : null;

    if (selectObject) {
      setSelectedLayer(selectObject.id);
    } else {
      setSelectedLayer(null);
    }
  }

  const selectLayerInCanvas = (layerId) => {
    const object = fabricCanvas.getObjects().find((obj) => obj.id === layerId);
    if (object) {  
      fabricCanvas.setActiveObject(object);
      fabricCanvas.renderAll();
    } 
  }


  useEffect(() => {
    if (!fabricCanvas) return;
      fabricCanvas.on({
        "object:added": updateLayers,
        "object:removed": updateLayers,
        "object:modified": updateLayers,

        "selection:created": handleObjectSelected,
        "selection:updated": handleObjectSelected,
        "selection:cleared": () => setSelectedLayer(null),
      });

      updateLayers();

      return () => {
    if (!fabricCanvas) return;
      fabricCanvas.off({
        "object:added": updateLayers,
        "object:removed": updateLayers,
        "object:modified": updateLayers,

        "selection:created": handleObjectSelected,
        "selection:updated": handleObjectSelected,
        "selection:cleared": () => setSelectedLayer(null)

      });
      };
    }, [fabricCanvas]);

  return (
    <div className="fixed right-2 top-1/2 p-5 text-black transform -translate-y-1/2 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg ">
      <div className="space-x-2">
        <Button 
          onClick={() => moveSelectedLayer('up')}
          disabled={!selectedLayer || layers[0]?.id === selectedLayer}>
          <ArrowUpFromLine/>
        </Button>
        <Button 
          onClick={() => moveSelectedLayer('down')}
          disabled={!selectedLayer || layers[layers.length-1]?.id === selectedLayer}>
          <ArrowDownFromLine/>
        </Button>
      </div>
      <ul className="flex flex-col gap-2 mt-5">
        {layers?.map((layer) => (
          <li key={layer.id} onClick={() => selectLayerInCanvas(layer.id)} className={layer.id === selectedLayer ? "selected-layer": ""}>
            {layer.label} ({layer.zIndex})
          </li>
        ))}
      </ul>
    </div>
  )
}
