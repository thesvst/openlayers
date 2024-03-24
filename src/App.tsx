import * as React from "react";
import styled from "styled-components";
import "ol/ol.css";

import {
  ChakraProvider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Stack,
} from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { noop } from "./utils/noop";
import { useMap } from "./hooks/useMap";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { circular } from "ol/geom/Polygon";
import { Point } from "ol/geom";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";

function App() {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const { map } = useMap();

  React.useEffect(() => {
    if (mapRef.current) {
      map.setTarget(mapRef.current);
      map.updateSize();
    }
  }, [map]);

  const onFindMeHandler = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = [position.coords.longitude, position.coords.latitude];
        const accuracy = circular(coords, 25);

        map.getView().setCenter(fromLonLat(coords));
        map.getView().setZoom(18);

        const source = new VectorSource();
        const layer = new VectorLayer({
          source: source,
        });
        map.addLayer(layer);

        source.clear();
        source?.addFeatures([
          new Feature(
            accuracy.transform("EPSG:4326", map.getView().getProjection())
          ),
          new Feature(new Point(fromLonLat(coords))),
        ]);
      },
      noop,
      { enableHighAccuracy: true }
    );
  };

  return (
    <ChakraProvider>
      <Drawer isOpen placement="left" onClose={noop}>
        <DrawerContent>
          <DrawerHeader>Hello!</DrawerHeader>
          <DrawerBody>TODO</DrawerBody>
          <DrawerFooter>
            <Button colorScheme="teal" size="md" onClick={onFindMeHandler}>
              Find me!
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Map ref={mapRef} id="map" />
    </ChakraProvider>
  );
}

const Map = styled.div`
  position: relative;
  z-index: 5000;
  width: calc(100% - 320px);
  margin-left: 320px;
  height: 100vh;
`;

export default App;
