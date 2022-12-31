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
  const [iconBase] = useState("http://maps.google.com/mapfiles/ms/icons");

  const iconSetter = (floor) => {
    switch (floor) {
      case "Ground Floor":
        return `${iconBase}/red-dot.png`;
        break;
      case "2nd Floor":
        return `${iconBase}/blue-dot.png`;
        break;
      case "3rd Floor":
        return `${iconBase}/green-dot.png`;
        break;
      case "4th Floor":
        return `${iconBase}/orange-dot.png`;
        break;
      case "5th Floor":
        return `${iconBase}/yellow-dot.png`;
        break;
      case "6th Floor":
        return `${iconBase}/pink-dot.png`;
        break;
      case "7th Floor":
        return `${iconBase}/purple-dot.png`;
        break;
      default:
        return "";
    }
  };

  useEffect(() => {
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
              icon={iconSetter(mark.room.floor)}
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
