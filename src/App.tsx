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
} from "@chakra-ui/react";
import { noop } from "./utils/noop";
import { useMap } from "./hooks/useMap";

function App() {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const map = useMap();

  React.useEffect(() => {
    if (mapRef.current) {
      map.setTarget(mapRef.current);
      map.updateSize();
    }
  }, [map]);

  return (
    <ChakraProvider>
      <Drawer isOpen placement="left" onClose={noop}>
        <DrawerContent>
          <DrawerHeader>Hello!</DrawerHeader>
          <DrawerBody>
            <p>Some content</p>
            <p>Some content</p>
          </DrawerBody>
          <DrawerFooter>
            <p>Footer</p>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Map ref={mapRef} id="map" />
    </ChakraProvider>
  );
}

const Map = styled.div`
  width: calc(100% - 320px);
  margin-left: 320px;
  height: 100vh;
`;

export default App;
