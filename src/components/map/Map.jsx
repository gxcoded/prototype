import "./Map.css";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useState, useMemo, useEffect } from "react";

const options = {
  mapId: "44216e082ffcb0c0",
  mapTypeId: "satellite",
  satelliteMode: true,
};

const Map = ({ getCoordinates, isEdit, currentCoords, defaultCoordinates }) => {
  const [loading, setLoading] = useState(true);

  const center = useMemo(() => defaultCoordinates, []);
  const [showMark, setShowMark] = useState(false);
  const [lat, setLat] = useState(15.9882);
  const [lng, setLng] = useState(120.5736);
  const coords = { lat: lat, lng: lng };

  useEffect(() => {
    console.log(center);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const setMarkCoordinates = (event) => {
    getCoordinates({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    console.log("lat " + event.latLng.lat());
    console.log("lng " + event.latLng.lng());
    setLat(event.latLng.lat());
    setLng(event.latLng.lng());
    setShowMark(true);
  };

  return (
    <div className="map-container">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <GoogleMap
          mapContainerClassName="map-con"
          zoom={18}
          center={center}
          options={options}
          onClick={(e) => setMarkCoordinates(e)}
        >
          {showMark && <Marker position={{ lat: lat, lng: lng }} />}
          {isEdit && !showMark && (
            <Marker
              position={{ lat: currentCoords.lat, lng: currentCoords.lng }}
            />
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;
