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
import { Draw } from "ol/interaction";
import { circular } from "ol/geom/Polygon";
import { Point } from "ol/geom";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { DeleteIcon } from "@chakra-ui/icons";
import { useLayers } from "./hooks/useLayers";

function App() {
  const [activeLayer, setActiveLayer] = React.useState<string | null>(null);
  const [draw, setDraw] = React.useState<Draw | null>(null);
  const mapRef = React.useRef<HTMLDivElement>(null);
  const { map } = useMap();
  const { addLayer, deleteLayer, layers, getLayer } = useLayers(map);


  React.useEffect(() => {
    console.log("Asasda");
    if (mapRef.current) {
      map.setTarget(mapRef.current);
      map.updateSize();
    }
  }, [map, layers]);

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
    addLayer();
  };

  const onDeleteLayerHandler = (id: string) => {
    if (activeLayer === id) setActiveLayer(null);

    deleteLayer(id);
  };

  const onSetActiveLayerHandler = (id: string) => {
    setActiveLayer(id);
  };

  const onStartDrawingHandler = () => {
    if (!activeLayer) {
      alert("Select layer first!");
      return;
    }

    const layer = getLayer(activeLayer);
    setDraw(
      new Draw({
        source: layer?.getSource(),
        type: "Polygon",
      })
    );

    if (draw) {
      map.addInteraction(draw);
    }
  };

  const onStopDrawingHandler = () => {};

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
                {Array.from(layers).map(([id], index) => {
                  return (
                    <Box key={id}>
                      <HStack>
                        <Tag
                          onClick={() => onSetActiveLayerHandler(id)}
                          flexShrink="0"
                          size="md"
                          cursor="pointer"
                          key={index}
                          borderRadius="full"
                          variant="solid"
                          colorScheme={"green"}
                        >
                          <TagLabel>Layer: {id}</TagLabel>
                        </Tag>
                        <DeleteIcon onClick={() => onDeleteLayerHandler(id)} />
                      </HStack>
                    </Box>
                  );
                })}
              </VStack>
              <FormControl>
                <Button
                  colorScheme="teal"
                  size="md"
                  onClick={onCreateLayerHandler}
                >
                  Create Layer
                </Button>
              </FormControl>
            </VStack>
            <Box style={{ marginTop: 15 }}>
              <HStack>
                <Button
                  colorScheme="teal"
                  size="md"
                  onClick={onStartDrawingHandler}
                >
                  Start Drawing
                </Button>
                <Button
                  colorScheme="teal"
                  size="md"
                  onClick={onStopDrawingHandler}
                >
                  Stop Drawing
                </Button>
              </HStack>
            </Box>
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
