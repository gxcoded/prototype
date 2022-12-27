import "./MapView.css";
import MapView from "./MapView";
import { useState } from "react";
import { useLoadScript } from "@react-google-maps/api";

const MapViewContainer = ({ uniqueRooms, defaultCenter, infoSetter }) => {
  const [url] = useState(process.env.REACT_APP_URL);
  const [mapAPIKey] = useState(process.env.REACT_APP_MAP_API_KEY);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: mapAPIKey,
    libraries: ["places"],
  });

  return (
    <div className="map-view-container-main">
      {isLoaded ? (
        <MapView
          infoSetter={infoSetter}
          defaultCenter={defaultCenter}
          uniqueRooms={uniqueRooms}
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default MapViewContainer;
