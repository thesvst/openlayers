import { useRef } from "react";

import { Map } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import View from "ol/View";

const osmBaseLayer = new TileLayer({
  visible: true,
  source: new OSM(),
});

export const map = new Map({
  target: "map",
  layers: [osmBaseLayer],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

export function useMap() {
  const mapRef = useRef<Map>();
  if (!mapRef.current) {
    mapRef.current = map;
  }

  return {
    map: mapRef.current,
  };
}
