import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import styled from "styled-components";
import OLMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import Draw from "ol/interaction/Draw";
import { fromLonLat } from "ol/proj";

type Interaction = Draw;

export interface Layer {
  id: string;
  layer: VectorLayer<any>;
}

export interface MapRefAPI {
  init(): void;
  addLayer(payload: Layer): void;
  findAllLayers(): Layer[];
  removeLayer(id: string): void;
  getLayer(id: string): Layer | null;
  addInteraction(interaction: Interaction): void;
  removeInteraction(interaction: Interaction): void;
}

const getDefaultLayer = () =>
  new TileLayer({ visible: true, source: new OSM() });
const getDefaultView = () => new View({ center: fromLonLat([0, 0]), zoom: 2 });

export const MainMap = forwardRef((props, ref) => {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const OLMapRef = useRef<OLMap | null>(null);
  const [layers, setLayers] = useState<Map<any, VectorLayer<any>>>(new Map());

  useImperativeHandle(
    ref,
    (): MapRefAPI => ({
      init() {
        if (OLMapRef.current) return;
        if (!mapElementRef.current) return;

        const newMap = new OLMap({
          target: mapElementRef.current,
          layers: [getDefaultLayer()],
          view: getDefaultView(),
        });

        OLMapRef.current = newMap;
      },
      addLayer(payload: Layer) {
        if (!OLMapRef.current) return;

        layers.set(payload.id, payload.layer);
        OLMapRef.current.addLayer(payload.layer);
        setLayers(new Map(layers));
      },
      findAllLayers() {
        return Array.from(layers.entries()).map(([id, layer]) => ({
          id,
          layer,
        }));
      },
      getLayer(id: string) {
        const layer = layers.get(id);
        if (!layer) return null;

        return { id, layer };
      },
      removeLayer(id: string) {
        const layerToRemove = layers.get(id);
        if (!layerToRemove || !OLMapRef.current) return;

        OLMapRef.current.removeLayer(layerToRemove);
        layers.delete(id);
        setLayers(new Map(layers));
      },
      addInteraction(interaction: Interaction) {
        if (!OLMapRef.current) return;
        OLMapRef.current.addInteraction(interaction);
      },
      removeInteraction(interaction: Interaction) {
        if (!OLMapRef.current) return;
        OLMapRef.current.removeInteraction(interaction);
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
