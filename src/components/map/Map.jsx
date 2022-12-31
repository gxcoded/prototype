import "./Map.css";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useState, useMemo, useEffect } from "react";

const options = {
  mapId: "44216e082ffcb0c0",
  mapTypeId: "satellite",
  satelliteMode: true,
};

const Map = ({
  getCoordinates,
  isEdit,
  currentCoords,
  defaultCoordinates,
  floor,
}) => {
  const [loading, setLoading] = useState(true);

  const center = useMemo(
    () => (isEdit ? currentCoords : defaultCoordinates),
    []
  );
  const [showMark, setShowMark] = useState(false);
  const [lat, setLat] = useState(15.9882);
  const [lng, setLng] = useState(120.5736);
  const coords = { lat: lat, lng: lng };
  const [iconBase] = useState("http://maps.google.com/mapfiles/ms/icons");
  const [icon, setIcon] = useState("");

  const iconSetter = () => {
    console.log(floor);
    switch (floor) {
      case "Ground Floor":
        setIcon(`${iconBase}/red-dot.png`);
        break;
      case "2nd Floor":
        setIcon(`${iconBase}/blue-dot.png`);
        break;
      case "3rd Floor":
        setIcon(`${iconBase}/green-dot.png`);
        break;
      case "4th Floor":
        setIcon(`${iconBase}/orange-dot.png`);
        break;
      case "5th Floor":
        setIcon(`${iconBase}/yellow-dot.png`);
        break;
      case "6th Floor":
        setIcon(`${iconBase}/pink-dot.png`);
        break;
      case "7th Floor":
        setIcon(`${iconBase}/purple-dot.png`);
        break;
      default:
        setIcon("");
    }
  };

  useEffect(() => {
    iconSetter();
    console.log();
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
          {showMark && <Marker icon={icon} position={{ lat: lat, lng: lng }} />}
          {isEdit && !showMark && (
            <Marker
              position={{ lat: currentCoords.lat, lng: currentCoords.lng }}
              icon={icon}
            />
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;
