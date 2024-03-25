import {
  Box,
  Button,
  Drawer as ChakraDrawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  FormControl,
  HStack,
  Tag,
  TagLabel,
  VStack,
} from "@chakra-ui/react";
import { noop } from "../../utils/noop";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";
import { Layer, MapRefAPI } from "../MainMap";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { genId } from "../../utils/genId";
import Draw from "ol/interaction/Draw";

interface DrawerProps {
  mapRef: React.RefObject<MapRefAPI | null>;
}

export const Drawer = (props: DrawerProps) => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const drawRef = useRef<Draw | null>(null);

  const onFindMeHandler = () => {};

  const onCreateLayerHandler = () => {
    if (!props.mapRef.current) return;

    const id = genId();
    const layer = new VectorLayer({ source: new VectorSource() });
    props.mapRef.current.addLayer({ id, layer });
    setLayers(props.mapRef.current.findAllLayers());
  };

  const onDeleteLayerHandler = (id: string) => {
    if (!props.mapRef.current) return;

    if (id === activeLayer) setActiveLayer(null);

    props.mapRef.current.removeLayer(id);
    setLayers(props.mapRef.current.findAllLayers());
  };

  const onSetActiveLayerHandler = (id: string) => {
    setActiveLayer(id);

    if (!drawRef.current || !props.mapRef.current) return;
    props.mapRef.current.removeInteraction(drawRef.current);
    drawRef.current = null;
  };

  const onStartDrawingHandler = () => {
    if (!props.mapRef.current || !activeLayer) {
      alert("No active layer selected!");
      return;
    }

    const activeLayerData = layers.find((layer) => layer.id === activeLayer);
    if (!activeLayerData) return;

    const source = activeLayerData.layer.getSource();
    const interaction = new Draw({ source, type: "Polygon" });
    drawRef.current = interaction;

    if (drawRef.current) {
      props.mapRef.current.addInteraction(drawRef.current);
    }
  };

  const onStopDrawingHandler = () => {
    if (!props.mapRef.current || !drawRef.current) return;

    props.mapRef.current.removeInteraction(drawRef.current);
    drawRef.current = null;
  };

  return (
    <ChakraDrawer isOpen placement="left" onClose={noop}>
      <DrawerContent>
        <DrawerHeader>
          <Box>Hello!</Box>
          <Box>Active Layer: {activeLayer ?? "None"}</Box>
        </DrawerHeader>
        <DrawerBody>
          <VStack align="flex-start">
            <VStack spacing={4} overflowY="auto" height="200px">
              {layers.map((data, index) => {
                return (
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
                        colorScheme={data.id === activeLayer ? "green" : "teal"}
                      >
                        <TagLabel>Layer ID: {data.id}</TagLabel>
                      </Tag>
                      <DeleteIcon
                        onClick={() => {
                          onDeleteLayerHandler(data.id);
                        }}
                      />
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
    </ChakraDrawer>
  );
};
