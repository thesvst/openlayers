import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { useState } from "react";
import { genId } from "./genId";
import { Map as OLMap } from "ol";

type Layer = VectorLayer<any>;

export const useLayers = (map: OLMap) => {
  const [layers, setLayers] = useState<Map<string, Layer>>(new Map());

  const addLayer = () => {
    const source = new VectorSource();
    const layer = new VectorLayer({
      source: source,
    });

    const id = genId();
    layers.set(id, layer);

    setLayers(new Map(layers));
    map.addLayer(layer);
  };

  const getLayer = (id: string) => layers.get(id);

  const deleteLayer = (id: string) => {
    const layer = getLayer(id);
    if (!layer) return;

    layer.getSource().clear();
    layer.setMap(null);

    layers.delete(id);
  };

  return {
    addLayer,
    layers,
    getLayer,
    deleteLayer,
  };
};
