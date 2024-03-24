import * as React from "react";
import styled from "styled-components";
import "ol/ol.css";

import {
  Box,
  ChakraProvider,
  Container,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  FormControl,
  HStack,
  Input,
  Tag,
  TagLabel,
  VStack,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { noop } from "./utils/noop";
import { useMap } from "./hooks/useMap";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { circular } from "ol/geom/Polygon";
import { Point } from "ol/geom";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { genId } from "./hooks/genId";
import { DeleteIcon } from "@chakra-ui/icons";

interface MapLayer {
  layer: any;
  id: string;
}

function App() {
  const [activeLayer, setActiveLayer] = React.useState<string | null>(null);
  const [layers, setLayers] = React.useState<MapLayer[]>([]); // TODO: Refactor to map
  const mapRef = React.useRef<HTMLDivElement>(null);
  const { map } = useMap();

  React.useEffect(() => {
    if (mapRef.current) {
      map.setTarget(mapRef.current);
      map.updateSize();
    }
  }, [map]);

  const onFindMeHandler = () => {
    // TODO: Source should be global to be able to remove it later
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

  const onCreateLayerHandler = () => {
    const source = new VectorSource();
    const layer = new VectorLayer({
      source: source,
    });
    map.addLayer(layer);

    setLayers([...layers, { layer, id: genId() }]);
  };

  const onDeleteLayerHandler = (id: string) => {
    if (activeLayer === id) setActiveLayer(null);

    const layer = layers.find((data) => data.id === id);
    if (!layer) return;

    map.removeLayer(layer.layer);

    const newLayers = layers.filter((data) => data.id !== id);
    setLayers(newLayers);
  };

  const onSetActiveLayerHandler = (id: string) => {
    setActiveLayer(id);
  };

  return (
    <ChakraProvider>
      <Drawer isOpen placement="left" onClose={noop}>
        <DrawerContent>
          <DrawerHeader>
            <Box>Hello!</Box>
            <Box>Active Layer: {activeLayer ?? "None"}</Box>
          </DrawerHeader>
          <DrawerBody>
            <VStack align="flex-start">
              <VStack spacing={4} overflowY="auto" height="200px">
                {layers.map((data, index) => (
                  <Box key={data.id}>
                    <HStack>
                      <Tag
                        onClick={() => onSetActiveLayerHandler(data.id)}
                        flexShrink="0"
                        size="md"
                        cursor="pointer"
                        key={index}
                        borderRadius="full"
                        variant="solid"
                        colorScheme={"green"}
                      >
                        <TagLabel>Layer: {data.id}</TagLabel>
                      </Tag>
                      <DeleteIcon
                        onClick={() => onDeleteLayerHandler(data.id)}
                      />
                    </HStack>
                  </Box>
                ))}
              </VStack>
              <FormControl>
                <HStack>
                  <Button
                    colorScheme="teal"
                    size="md"
                    onClick={onCreateLayerHandler}
                  >
                    Create Layer
                  </Button>
                </HStack>
              </FormControl>
            </VStack>
          </DrawerBody>
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
