import "ol/ol.css";
import React, { useRef, useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Drawer } from "./components/Drawer";
import { MainMap, MapRefAPI } from "./components/MainMap";

function App() {
  const mapRef = useRef<MapRefAPI>(null);

  useEffect(() => {
    mapRef.current?.init();
  }, []);

  return (
    <ChakraProvider>
      <Drawer mapRef={mapRef} />
      <MainMap ref={mapRef} />
    </ChakraProvider>
  );
}

export default App;
