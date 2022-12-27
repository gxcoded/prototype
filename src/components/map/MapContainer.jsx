import "./Map.css";
import { useState, Fragment } from "react";
import Map from "./Map";
import { useLoadScript } from "@react-google-maps/api";
import swal from "sweetalert";
import axios from "axios";

const MapContainer = ({
  mapToggler,
  floor,
  description,
  campus,
  loadData,
  isEdit,
  currentFloor,
  editDescription,
  currentCoords,
  current,
  defaultCoordinates,
}) => {
  const [url] = useState(process.env.REACT_APP_URL);
  const [mapAPIKey] = useState(process.env.REACT_APP_MAP_API_KEY);
  const [isSet, setIsSet] = useState(false);
  const [coords, setCoords] = useState({});

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: mapAPIKey,
    libraries: ["places"],
  });

  const getCoordinates = (coordinates) => {
    setCoords(coordinates);
    setIsSet(true);
  };

  const sendRequest = async (coordinates) => {
    const { data } = await axios.post(`${url}/updateRoomDescription`, {
      id: current._id,
      floor: currentFloor,
      description: editDescription,
      lat: `${coordinates.lat}`,
      lng: `${coordinates.lng}`,
    });
    return data;
  };

  const saveEdit = async (coordinates) => {
    const updated = await sendRequest(coordinates);
    if (updated) {
      swal("Updated!", {
        icon: "success",
      });
      loadData();
      setTimeout(() => {
        mapToggler();
      }, 500);
    }
  };

  const saveLocation = async () => {
    if (isEdit) {
      if (isSet) {
        saveEdit(coords);
      } else {
        saveEdit(currentCoords);
      }
    } else {
      if (isSet) {
        try {
          const { data } = await axios.post(`${url}/addRoom`, {
            campus,
            floor,
            description,
            lat: coords.lat,
            lng: coords.lng,
          });

          if (data) {
            swal("Location Saved!", {
              icon: "success",
            });
            loadData();
            setTimeout(() => {
              mapToggler();
            }, 500);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        swal("Please Pin a location!", {
          icon: "warning",
        });
      }
    }
  };

  return (
    <div className="mapContainer-container">
      <div className="mapContainer-main bg-primary">
        <div className="mapContainer-left">
          <div className="mapContainer-left-content">
            <div className="hide-map" onClick={() => mapToggler()}>
              <i className="fas fa-times me-2"></i>
              {isEdit ? "CLose" : "CLOSE"}
            </div>
            <div className="map-instructions">
              Please Pin Down the possible location of the room by clicking on
              the map.
            </div>
            <div className="location-details border">
              {isEdit ? (
                <Fragment>
                  <div className="location-details-floor"> {currentFloor}</div>
                  <div className="location-details-desc">{editDescription}</div>
                </Fragment>
              ) : (
                <Fragment>
                  <div className="location-details-floor"> {floor}</div>
                  <div className="location-details-desc">{description}</div>
                </Fragment>
              )}
              <div className="location-save mt-2">
                <button
                  onClick={() => saveLocation()}
                  className="btn btn-primary"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mapContainer-right">
          {isLoaded ? (
            <Map
              defaultCoordinates={defaultCoordinates}
              getCoordinates={getCoordinates}
              isEdit={isEdit}
              currentCoords={currentCoords}
            />
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapContainer;
