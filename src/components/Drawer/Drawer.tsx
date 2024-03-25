//@ts-nocheck
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
import { useState } from "react";
import { MapRefAPI } from "../MainMap";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

interface DrawerProps {
  mapRef: React.RefObject<MapRefAPI | null>;
}

export const Drawer = (props: DrawerProps) => {
  const [layers, setLayers] = useState<VectorLayer<any>[]>([]);
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  const onFindMeHandler = () => {};

  const onCreateLayerHandler = () => {
    if (!props.mapRef.current) return;

    const layer = new VectorLayer({ source: new VectorSource() });
    props.mapRef.current.addLayer(layer.ol_uid, layer);
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
  };

  const onStartDrawingHandler = () => {};

  const onStopDrawingHandler = () => {};

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
              {layers.map((layer, index) => {
                return (
                  <Box key={layer.ol_uid}>
                    <HStack>
                      <Tag
                        onClick={() => onSetActiveLayerHandler(layer.ol_uid)}
                        flexShrink="0"
                        size="md"
                        cursor="pointer"
                        key={index}
                        borderRadius="full"
                        variant="solid"
                        colorScheme={
                          layer.ol_uid === activeLayer ? "green" : "teal"
                        }
                      >
                        <TagLabel>Layer ID: {layer.ol_uid}</TagLabel>
                      </Tag>
                      <DeleteIcon
                        onClick={() => {
                          onDeleteLayerHandler(layer.ol_uid);
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
