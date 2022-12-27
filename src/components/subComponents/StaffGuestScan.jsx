import "./subCss/QrScanner.css";
import "./subCss/StaffGuestScan.css";
import { QrReader } from "react-qr-reader";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import swal from "sweetalert";
import Logs from "./Logs";

const StaffGuestScan = ({ accountInfo, assignedRoom }) => {
  const [reLoad, setReLoad] = useState(false);
  const [url] = useState(process.env.REACT_APP_URL);
  const [manualValue, setManualValue] = useState("");
  const [showOptions, setShowOptions] = useState(true);
  const [manual, setManual] = useState(false);
  const [roomList, setRoomList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [hideResult, setHideResult] = useState(true);
  const [room, setRoom] = useState("");
  const [scan, setScan] = useState(false);
  const [details, setDetails] = useState({});
  const [selectedRoom, setSelectedRoom] = useState({});
  const [pending, setPending] = useState([]);
  const [api] = useState(process.env.REACT_APP_API_SERVER);

  const loadData = async () => {
    const rooms = await fetchList();
    console.log(rooms);
    setRoomList(rooms);
  };

  useEffect(() => {
    console.log(assignedRoom);
    loadData();
    if (Object.keys(assignedRoom).length > 0) {
      assignedRoom.room.description === "Entrance" && entranceLogs();
    }
  }, []);

  const checkExisting = (id) => {
    let exists = false;

    pending.forEach((p) => {
      p.accountScanned._id === id && (exists = true);
    });
    return exists;
  };

  const entranceLogs = async () => {
    const logs = await fetchEntranceLogs();
    setPending(logs);
    console.log(logs);
  };

  const fetchEntranceLogs = async () => {
    const { data } = await axios.post(`${url}/fetchEntranceLogs`, {
      campus: accountInfo.campus._id,
      entrance: assignedRoom.room._id,
    });

    return data;
  };

  const pendingLogs = async () => {
    const logs = await fetchPendingLogs();
    setPending(logs);
    console.log(logs);
  };

  const fetchPendingLogs = async () => {
    const { data } = await axios.post(`${url}/fetchEntranceLogs`, {
      campus: accountInfo.campus._id,
      entrance: room,
    });

    return data;
  };

  const fetchList = async () => {
    const response = await axios.post(`${url}/roomList`, {
      campus: accountInfo.campus._id,
    });
    return await response.data;
  };

  const searchRoom = async (e) => {
    const response = await axios.post(`${url}/searchRoom`, {
      campus: accountInfo.campus._id,
      key: e.target.value,
    });
    const data = await response.data;
    setSearchResult(data);
    if (e.keyCode === 13 && searchResult.length > 0) {
      setSelected();
    }
  };

  //scanner functions
  const handleError = (error) => {
    console.log(error);
  };
  const handleScan = (result) => {
    console.log(result);
  };

  const showResult = (key) => {
    if (key) {
      console.log(key);
      const request = async () => {
        const data = await makeRequest(key);
        setDetails(data);
      };
      request();
      setHideResult(false);
      setScan(false);
      setShowOptions(true);
    }
  };

  const makeRequest = async (key) => {
    const response = await axios.post(`${url}/accounts`, {
      campus: accountInfo.campus._id,
      key,
    });
    return await response.data;
  };

  const changeRoom = (e) => {
    setRoom(e.target.value);

    roomList.forEach((r) => {
      if (e.target.value === r._id) {
        setSelectedRoom(r);
      }
    });
  };

  const checkRoom = (trigger) => {
    if (Object.keys(assignedRoom).length > 0) {
      setRoom(assignedRoom.room._id);
      setSelectedRoom(assignedRoom.room);
      resetOption();
      if (trigger === 1) {
        setScan(true);
      } else {
        setManual(true);
      }
    } else {
      if (room) {
        resetOption();
        if (trigger === 1) {
          setScan(true);
        } else {
          setManual(true);
        }
      } else {
        swal({ text: "Please Select a room", icon: "warning" });
      }
    }
  };

  const resetOption = () => {
    setScan(false);
    setShowOptions(false);
    setManual(false);
  };

  const setSelected = () => {
    setRoom(searchResult[0]._id);
    setSelectedRoom(searchResult[0]);
    setSearchResult([]);
    setSearchValue("");
  };

  const submitManual = (e) => {
    e.preventDefault();
    const manualRequest = async () => {
      const response = await axios.post(`${url}/getManualAccount`, {
        campus: accountInfo.campus._id,
        idNumber: manualValue,
      });
      return await response.data;
    };

    const getData = async () => {
      const data = await manualRequest();
      setDetails(data);
    };

    getData();
    setHideResult(false);
    setManualValue("");
  };

  const addLog = async () => {
    const saveLog = async () => {
      console.log(details);
      const { data } = await axios.post(`${url}/addLog`, {
        campus: accountInfo.campus._id,
        room,
        scannedBy: accountInfo._id,
        person: details._id,
      });
      return data;
    };

    const data = await saveLog();
    setReLoad(!reLoad);
    console.log("this" + data);
    // swal("Done!", "Thank You.", "success");
    if (Object.keys(assignedRoom).length > 0) {
      entranceLogs();
    } else {
      pendingLogs();
    }
    setHideResult(true);
  };

  const confirmOut = async (id) => {
    const confirmed = await out(id);
    if (confirmed) {
      // swal("Done!", "Thank You.", "success");
      setHideResult(true);
      if (Object.keys(assignedRoom).length > 0) {
        entranceLogs();
      } else {
        pendingLogs();
      }
      setReLoad(!reLoad);
    }
  };

  const out = async (id) => {
    let r = "";
    if (Object.keys(assignedRoom).length > 0) {
      r = assignedRoom.room._id;
    } else {
      r = room;
    }
    const { data } = await axios.post(`${url}/exitLog`, {
      account: id,
      room: r,
    });
    console.log(data);
    return data;
  };

  return (
    <div className="guest-scan-container">
      <div className={`result-pop-up-container ${hideResult && "show-result"}`}>
        {Object.keys(details).length > 0 ? (
          <Fragment>
            <div className="scan-result-box">
              <div className="scan-result-box-image-section">
                <img
                  className="scan-result-box-image"
                  src={`${api}/${details.image}`}
                  // src={require(`../../../../server/uploads/${details.image}`)}
                  alt="pp"
                />
                <div className="result-idNumber">{details.username}</div>
                <div className="result-name">
                  {details.firstName} {details.lastName}
                </div>
                <div className="result-role">{details.role.description}</div>
                <div className="result-room-number">
                  {selectedRoom.description}
                </div>
                {details.allowed ? (
                  <div className="result-status">Allowed</div>
                ) : (
                  <div className="result-status text-danger">Not Allowed</div>
                )}
                <div className="result-status-label">Status</div>
              </div>
              <div className="result-btn-options">
                <button
                  onClick={() => setHideResult(true)}
                  className="shadow btn-sm btn-custom-red"
                >
                  Cancel<i className="ms-1 fas fa-ban"></i>
                </button>

                {details.allowed && (
                  <Fragment>
                    {checkExisting(details._id) ? (
                      <button
                        onClick={() => confirmOut(details._id)}
                        className="shadow btn-sm btn-primary"
                      >
                        Confirm Out<i className="ms-1 far fa-thumbs-up"></i>
                      </button>
                    ) : (
                      <button
                        onClick={() => addLog()}
                        className="shadow btn-sm btn-primary"
                      >
                        Confirm In<i className="ms-1 far fa-thumbs-up"></i>
                      </button>
                    )}
                  </Fragment>
                )}
              </div>
            </div>
          </Fragment>
        ) : (
          <div className="not-found ">
            <div className="not-found-text">Not Found !</div>
            <button
              onClick={() => setHideResult(true)}
              className="shadow btn-sm btn-custom-red"
            >
              Try Again<i className="ms-1 fas fa-redo"></i>
            </button>
          </div>
        )}
      </div>
      <div className="scan-guest-title">
        <div></div>
        <i className="fas fa-expand me-3"></i>Scanner / Log
      </div>

      <div className="cam-section guest-cam">
        <div className={`reader-container ${!scan && "bg-white"}`}>
          {showOptions && (
            <Fragment>
              <div className="open-scanner " onClick={() => checkRoom(1)}>
                <div className="trigger-scanner-icons">
                  <i className="fas fa-qrcode"></i>
                  <i className="fas fa-camera mx-2"></i>
                </div>
                <div className="trigger-scanner-text">
                  Click / Tap to Open Qr Scanner
                </div>
              </div>
              <div className="open-scanner " onClick={() => checkRoom(2)}>
                <div className="trigger-scanner-icons text-warning">
                  <i className="far fa-keyboard mx-2"></i>
                </div>
                <div className="trigger-scanner-text">
                  Click / Tap for Manual Log
                </div>
              </div>
            </Fragment>
          )}
          {scan && (
            <Fragment>
              <div className="scanner-frame-container">
                <div className="scanner-frame">
                  <i className="fas fa-qrcode"></i>
                  <div className="room-frame-display">
                    {selectedRoom.description}
                  </div>
                </div>
                <div className="manual-switch " onClick={() => checkRoom(2)}>
                  <i className="fas fa-sync me-2"></i> Switch to Manual
                </div>
              </div>
              <div className="scanner-label ">
                <i className="fas fa-camera"></i>
              </div>
              <QrReader
                className={"reader-cam"}
                delay={5000}
                onError={handleError}
                onScan={handleScan}
                onResult={showResult}
                key={"environment"}
                constraints={{ facingMode: "environment" }}
              />
            </Fragment>
          )}
          {manual && (
            <Fragment>
              <div className="manual-log">
                <form onSubmit={submitManual}>
                  <div className="form-group">
                    <div className="manual-label">
                      <i className="far fa-id-card me-2"></i>Enter Id Number
                    </div>
                    <input
                      onChange={(e) => setManualValue(e.target.value)}
                      value={manualValue}
                      required
                      type="text"
                      minLength={"5"}
                      placeholder="Id Number"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group mt-4">
                    <button className="btn btn-primary">
                      Find <i className="ms-2 fas fa-search"></i>
                    </button>
                  </div>
                </form>
                <div
                  className="open-scanner mt-5 "
                  onClick={() => checkRoom(1)}
                >
                  <div className="trigger-scanner-icons">
                    <i className="fas fa-qrcode"></i>
                    <i className="fas fa-camera mx-2"></i>
                  </div>
                  <div className="trigger-scanner-text">Open Scanner</div>
                </div>
              </div>
            </Fragment>
          )}
        </div>
        <div className="scanner-right-select mx-5">
          {Object.keys(assignedRoom).length === 0 ? (
            <Fragment>
              <div className="current-room right-select-upper text-center">
                <div className="current-room-name">
                  {room ? selectedRoom.description : "Please Select"}
                </div>
                <div className="current-room-label">Room</div>
              </div>
              <div className=" right-select-lower ">
                <div>
                  <div className="label-select">
                    <i className="me-2 fas fa-cog"></i>Set Room
                  </div>
                  <div className=" mt-3">
                    <label>Select Room</label>
                    <select
                      onChange={changeRoom}
                      defaultValue={room}
                      className="form-control"
                    >
                      <option value={room} disabled>
                        Select
                      </option>
                      {roomList.map((list) => (
                        <option key={list._id} value={list._id}>
                          {list.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-3 room-search-tab">
                    <label>Search Room</label>
                    <input
                      onChange={(e) => setSearchValue(e.target.value)}
                      value={searchValue}
                      onKeyUp={(e) => searchRoom(e)}
                      placeholder="Room Name"
                      type="search"
                      className="form-control search-control rounded"
                      aria-label="Search"
                      aria-describedby="search-addon"
                    />
                    {searchResult.length > 0 && (
                      <div className="search-result-views">
                        <div
                          key={searchResult[0]._id}
                          onClick={() => {
                            setSelected();
                          }}
                          className="search-result-list"
                        >
                          {searchResult[0].description}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Fragment>
          ) : (
            <div className="current-room right-select-upper text-center">
              <div className="current-room-name">
                {assignedRoom.room.description}
              </div>
              <div className="current-room-label">Room/Location</div>
            </div>
          )}
        </div>
      </div>
      <Logs
        accountInfo={accountInfo}
        url={url}
        reLoad={reLoad}
        entranceLogs={entranceLogs}
        assignedRoom={assignedRoom}
        pendingLogs={pendingLogs}
      />
      {/* {Object.keys(assignedRoom).length > 0 &&
      assignedRoom.room.description !== "Entrance" && (
     
      )} */}
    </div>
  );
};

export default StaffGuestScan;
