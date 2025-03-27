// src/components/MapView.js
import React, { useRef, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%"
};

function MapView({ center }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAnWgbbTe4W6R_1ogi_czNL8Po8NMBR7d8" // Replace with your actual API key
  });

  const mapRef = useRef(null);

  const onLoad = (map) => {
    mapRef.current = map;
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.panTo(center);
    }
  }, [center]);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      onLoad={onLoad}
    >
      <Marker position={center} />
    </GoogleMap>
  );
}

export default React.memo(MapView);
