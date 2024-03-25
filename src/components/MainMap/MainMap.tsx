import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import OLMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";

export interface MapRefAPI {
  init(): void;
  addLayer(id: string, layer: VectorLayer<any>): void;
  findAllLayers(): VectorLayer<any>[];
  removeLayer(id: string): void;
}

const getDefaultLayer = () => new TileLayer({ source: new OSM() });
const getDefaultView = () => new View({ center: [0, 0], zoom: 2 });

export const MainMap = forwardRef((props, ref) => {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<OLMap | null>(null);
  const [layers, setLayers] = useState<Map<any, VectorLayer<any>>>(new Map());

  useImperativeHandle(
    ref,
    (): MapRefAPI => ({
      init() {
        if (map) return;
        if (!mapElementRef.current) return;

        const newMap = new OLMap({
          target: mapElementRef.current,
          layers: [getDefaultLayer()],
          view: getDefaultView(),
        });

        setMap(newMap);
      },
      addLayer(id: string, layer: VectorLayer<any>) {
        if (!map) return;

        layers.set(id, layer);
        map.addLayer(layer);
        setLayers(new Map(layers));
      },
      findAllLayers() {
        return Array.from(layers.values());
      },
      removeLayer(id: string) {
        const layerToRemove = layers.get(id);
        if (!layerToRemove || !map) return;

        map.removeLayer(layerToRemove);
        layers.delete(id);
        setLayers(new Map(layers));
      },
    })
  );

  return <StyledMap ref={mapElementRef} />;
});

const StyledMap = styled.div`
  position: relative;
  z-index: 5000;
  width: calc(100% - 320px);
  margin-left: 320px;
  height: 100vh;
`;
