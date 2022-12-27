import "./subCss/StaffList.css";
import "./subCss/RoomList.css";
import { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import { QRCode } from "react-qrcode-logo";
import Image from "../../assets/images/psuLogo.png";
import MapContainer from "../map/MapContainer";

const RoomList = ({ campus }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [url] = useState(process.env.REACT_APP_URL);
  const [rooms, setRooms] = useState([]);
  const [value, setValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [selected, setSelected] = useState({});
  const [current, setCurrent] = useState({});
  const [floor, setFloor] = useState("");
  const [currentFloor, setCurrentFloor] = useState("");
  const [currentLat, setCurrentLat] = useState(0);
  const [currentLng, setCurrentLng] = useState(0);
  const [defaultLat, setDefaultLat] = useState(0);
  const [defaultLng, setDefaultLng] = useState(0);
  const [iconBase] = useState("http://maps.google.com/mapfiles/ms/icons");

  const [floors] = useState([
    {
      description: "Ground Floor",
      icon: `${iconBase}/red-dot.png`,
    },
    { description: "2nd Floor", icon: `${iconBase}/blue-dot.png` },
    { description: "3rd Floor", icon: `${iconBase}/green-dot.png` },
    { description: "4th Floor", icon: `${iconBase}/orange-dot.png` },
    { description: "5th Floor", icon: `${iconBase}/yellow-dot.png` },
    { description: "6th Floor", icon: `${iconBase}/pink-dot.png` },
    { description: "7th Floor", icon: `${iconBase}/purple-dot.png` },
    { description: "8th Floor", icon: "" },
  ]);

  const [description, setDescription] = useState("");
  const [filterList, setFilterList] = useState([]);
  const [showMap, setShowMap] = useState(false);

  const loadData = async () => {
    const data = await fetchList();
    setRooms(data);
    setFilterList(data);
  };

  useEffect(() => {
    console.log(campus);
    loadData();
    loadDefaultCoords();
  }, []);

  const fetchDefaultCoords = async () => {
    const { data } = await axios.post(`${url}/getCoordinates`, {
      campusId: campus,
    });
    return data;
  };

  const loadDefaultCoords = async () => {
    const defaultCoords = await fetchDefaultCoords();
    setDefaultLat(Number(defaultCoords.lat));
    setDefaultLng(Number(defaultCoords.lng));
  };

  const fetchList = async () => {
    const response = await axios.post(`${url}/roomList`, {
      campus,
    });
    return await response.data;
  };

  const deleteRoom = (id) => {
    swal({
      title: "Are you sure?",
      text: "You can not undo this.",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setRooms(rooms.filter((list) => list.id !== id));
        swal("Deleted!", {
          icon: "success",
        });
      }
    });
  };

  const addRoom = async (e) => {
    e.preventDefault();
    setIsEdit(false);
    mapToggler();
  };

  const downloadRoomQr = async (list) => {
    setValue(list._id);
    swal(`Download QR-Code for ${list.description} ?`).then((value) => {
      value && saveCanvas(list.description);
    });
  };

  const saveCanvas = (description) => {
    const canvas = document.querySelector("#roomQrCodeDownload");
    const context = canvas.getContext("2d");
    context.font = "40px Arial";
    context.textAlign = "center";
    context.fillStyle = "yellow";
    context.fillText(`${description}`, 150, 50);
    let canvasUrl = canvas.toDataURL();

    const createEl = document.createElement("a");
    createEl.href = canvasUrl;
    createEl.download = description;
    createEl.click();
    createEl.remove();
  };

  const changeScanStatus = async () => {
    const { data } = await axios.post(`${url}/updateRoomScanControl`, {
      id: selected._id,
      isAllowed: !selected.allowStudentsAndGuests,
    });
    return data;
  };

  const updateScanStatus = async () => {
    const updated = await changeScanStatus();
    if (updated) {
      loadData();
      setShowModal(false);
      swal("Updated!", {
        icon: "success",
      });
    }
  };

  const isUpdated = async (list) => {
    const { data } = await axios.post(`${url}/updateRoomStatus`, {
      id: list._id,
      isOpen: !list.isOpen,
    });
    console.log(data);
    return data;
  };

  const updateStatus = async (list) => {
    if (await isUpdated(list)) {
      swal("Status Updated!", {
        icon: "success",
      });
    }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setIsEdit(true);
    setEditModal(false);
    mapToggler();
  };

  const mapToggler = () => {
    setShowMap(!showMap);
  };
  return (
    <div className="staff-list-container locations-list-container ">
      {showMap && (
        <MapContainer
          floor={floor}
          description={description}
          campus={campus}
          mapToggler={mapToggler}
          loadData={loadData}
          isEdit={isEdit}
          currentFloor={currentFloor}
          editDescription={editDescription}
          currentCoords={{ lat: currentLat, lng: currentLng }}
          current={current}
          defaultCoordinates={{ lat: defaultLat, lng: defaultLng }}
        />
      )}
      <div className="staff-list-title">
        <i className="fas fa-city me-3"></i>Manage Locations
      </div>
      <div className="campus-staff-main room-list-main">
        <div className="list-top-controls">
          <div className="list-counter-box">
            <div className="list-counter">{rooms.length}</div>
            <div className="list-counter-label">Total Locations</div>
          </div>
          <div className="list-filter-controls">
            <div className="controls-title">
              <i className="me-2 fas fa-plus"></i>Add Locations
            </div>
            <form onSubmit={addRoom}>
              <div className="form-inline d-flex">
                <div className="form-group">
                  <label>Floor</label>
                  <select
                    onChange={(e) => {
                      setFloor(e.target.value);
                      console.log(floor);
                    }}
                    required
                    defaultValue={""}
                    className="form-control"
                  >
                    <option disabled value={""}>
                      Select
                    </option>
                    {floors.map((list) => (
                      <option
                        key={Math.random() * 9999}
                        value={list.description}
                      >
                        {list.description}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-input">
                  <div className="form-group">
                    <label>Description</label>
                    <input
                      minLength={"3"}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      type="text"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="px-2 mt-4 text-end">
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-angle-double-right me-2"></i>Next
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="table-list staff-table room-list-table py-5">
          {showModal && (
            <div className={`settings-modal`}>
              <div className="settings-modal-main">
                <div
                  onClick={() => setShowModal(false)}
                  className="close-settings-modal"
                >
                  <i className="fas fa-times"></i>
                </div>
                <div className="smm-selected-location">
                  {selected.description}
                </div>

                <div className="switch-display">
                  {selected.allowStudentsAndGuests ? (
                    <div className="form-check form-switch d-flex justify-content-center">
                      <input
                        onChange={() => updateScanStatus()}
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        defaultChecked={true}
                      />
                    </div>
                  ) : (
                    <div className="form-check form-switch d-flex justify-content-center">
                      <input
                        onChange={() => updateScanStatus()}
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        defaultChecked={false}
                      />
                    </div>
                  )}
                </div>
                <div className="smm-status">
                  Current Status:{" "}
                  {`${
                    selected.allowStudentsAndGuests ? "Allowed" : "Not Allowed"
                  } `}
                </div>
                <div className="smm-text">
                  Allow Student and Guest to Scan the Qr Code of this Location?
                </div>
              </div>
            </div>
          )}
          {editModal && (
            <div className={`settings-modal `}>
              <div className="edit-modal-main">
                <div
                  onClick={() => setEditModal(false)}
                  className="close-settings-modal"
                >
                  <i className="fas fa-times"></i>
                </div>
                <form onSubmit={saveEdit}>
                  <div className="form-group my-3 ">
                    <select
                      defaultValue={currentFloor}
                      onChange={(e) => {
                        setCurrentFloor(e.target.value);
                      }}
                      required
                      className="form-control"
                    >
                      <option disabled value={""}>
                        Select
                      </option>
                      {floors.map((list) => (
                        <option
                          key={Math.random() * 9999}
                          value={list.description}
                        >
                          {list.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <input
                      required
                      minLength={"3"}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      type="text"
                      className="form-control"
                      placeholder="Description"
                    />
                  </div>
                  <div className="px-3 mt-3 text-end">
                    <div
                      onClick={() => setEditModal(false)}
                      className="btn btn-warning"
                    >
                      Cancel
                    </div>
                    <button className="btn btn-success mx-1">Next</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="d-none">
            <QRCode
              id="roomQrCodeDownload"
              fgColor="#333"
              // fgColor="#50bfa5"
              value={value}
              logoHeight={"200"}
              logoWidth={"200"}
              size={"1000"}
              logoImage={Image}
              eyeRadius={[
                {
                  // top/left eye
                  outer: [0, 0, 0, 0],
                  inner: [0, 100, 0, 100],
                },
                [0, 0, 0, 0], // top/right eye
                [0, 0, 0, 0], // bottom/left
              ]}
            />
          </div>
          <div className="table-header px-2 mb-5 d-flex justify-content-between align-items-center">
            <div className="table-header-text fw-bold">Rooms</div>
            <div>
              <div className="input-group">
                <input
                  placeholder="Description"
                  type="search"
                  className="form-control search-control rounded"
                  aria-label="Search"
                  aria-describedby="search-addon"
                />
                <button type="button" className="btn btn-outline-primary">
                  Search
                </button>
              </div>
            </div>
          </div>
          <table className="campus-table table table-striped">
            <thead>
              <tr>
                <th className="fw-bold" scope="col">
                  Description
                </th>
                <th className="fw-bold" scope="col">
                  Available
                </th>
                <th className="fw-bold text-center" scope="col">
                  <i className="ms-2 fas fas fa-tools"></i>
                </th>
              </tr>
            </thead>
            <tbody>
              {filterList.length > 0 ? (
                filterList.map((list) => (
                  <tr key={list._id}>
                    <td>{list.description}</td>
                    <td>
                      {list.isOpen ? (
                        <div className="form-check form-switch d-flex justify-content-center">
                          <input
                            onChange={() => updateStatus(list)}
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            defaultChecked={true}
                          />
                        </div>
                      ) : (
                        <div className="form-check form-switch  d-flex justify-content-center">
                          <input
                            onChange={() => updateStatus(list)}
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            defaultChecked={false}
                          />
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="table-options justify-content-center">
                        <span
                          onClick={() => {
                            setCurrent(list);
                            setEditDescription(list.description);
                            setCurrentFloor(list.floor);
                            setCurrentLat(Number(list.lat));
                            setCurrentLng(Number(list.lng));
                            setEditModal(true);
                          }}
                          className="option-edit text-warning me-3"
                          data-mdb-toggle="tooltip"
                          title="Edit Description"
                        >
                          <i className="fas fa-edit"></i>
                        </span>
                        <span
                          onClick={() => downloadRoomQr(list)}
                          className="option-edit text-primary me-3"
                          data-mdb-toggle="tooltip"
                          title="Download Qr Code"
                        >
                          <i className="fas fa-file-download"></i>
                        </span>
                        <span
                          onClick={() => {
                            setSelected(list);
                            setShowModal(true);
                          }}
                          className="option-edit text-dark me-3"
                          data-mdb-toggle="tooltip"
                          title="Show Options"
                        >
                          <i className="fas fa-cog"></i>
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="fw-bold fst-italic">No Records found...</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="show-count p-4">
            Showing{" "}
            <span className="text-primary fw-bold">{filterList.length}</span>{" "}
            out of{" "}
            <span className="text-primary fw-bold">{filterList.length}</span>{" "}
            Records
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomList;
