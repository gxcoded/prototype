import "./MapView.css";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useState, useMemo, useEffect } from "react";

const options = {
  mapId: "44216e082ffcb0c0",
  mapTypeId: "satellite",
  satelliteMode: true,
};

const MapView = ({ uniqueRooms, defaultCenter, infoSetter }) => {
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState([]);

  useEffect(() => {
    console.log(defaultCenter);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const showInfo = (room) => {
    let array = [];

    uniqueRooms.forEach((r) => {
      if (room.room._id === r.room._id) {
        array.push(r);
      }
    });

    infoSetter(array);
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <GoogleMap
          mapContainerClassName="map-con bg-primary"
          zoom={18}
          center={defaultCenter}
          options={options}
          // onClick={(e) => setMarkCoordinates(e)}
        >
          {uniqueRooms.map((mark) => (
            <Marker
              key={mark._id}
              position={{
                lat: Number(mark.room.lat),
                lng: Number(mark.room.lng),
              }}
              onMouseOver={() => showInfo(mark)}
            />
          ))}
        </GoogleMap>
      )}
    </div>
  );
};

export default MapView;
