import { useRef } from "react";

import { Map } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import View from "ol/View";
import { defaults } from "ol/control/defaults";
import { defaults as interactionDefaults } from "ol/interaction/defaults";

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
  controls: defaults(),
  interactions: interactionDefaults({}),
});

export function useMap() {
  const mapRef = useRef<Map>();
  if (!mapRef.current) {
    mapRef.current = map;
  }
  return mapRef.current;
}
