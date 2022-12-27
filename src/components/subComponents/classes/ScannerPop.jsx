import "./ScannerPop.css";
import "../subCss/QrScanner.css";
import { QrReader } from "react-qr-reader";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import swal from "sweetalert";

const ScannerPop = ({
  hideScanner,
  currentRoomInfo,
  room,
  currentMeetingId,
  loadMeetingLogs,
}) => {
  const [url] = useState(process.env.REACT_APP_URL);
  const [displayResult, setDisplayResult] = useState(false);
  const [details, setDetails] = useState({});
  const [students, setStudents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [scan, setScan] = useState(true);
  const [manual, setManual] = useState(false);
  const [manualValue, setManualValue] = useState("");
  const [api] = useState(process.env.REACT_APP_API_SERVER);

  useEffect(() => {
    dataLoader();
    console.log(currentRoomInfo);
    loadLogs();
  }, []);

  const dataLoader = async () => {
    const studentList = await fetchStudentList();

    setStudents(studentList);
  };
  const fetchStudentList = async () => {
    const { data } = await axios.post(`${url}/getClassRoomStudents`, {
      classId: room._id,
    });
    return data;
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
      const request = async () => {
        const data = await makeRequest(key);
        setDetails(data);
        setDisplayResult(true);
      };
      request();
    }
  };

  const makeRequest = async (key) => {
    const response = await axios.post(`${url}/accounts`, {
      campus: room.campus,
      key,
    });
    return await response.data;
  };

  const makeManualRequest = async (key) => {
    const response = await axios.post(`${url}/getManualAccount`, {
      campus: room.campus,
      idNumber: manualValue,
    });
    return await response.data;
  };

  const studentChecker = (id) => {
    let isStudent = false;
    students.forEach((s) => {
      if (s.student._id === id) {
        isStudent = true;
      }
    });

    return isStudent;
  };

  const saveStudentLog = async (id) => {
    alert(currentMeetingId);
    const { data } = await axios.post(`${url}/addMeetingLog`, {
      campus: room.campus,
      room: currentRoomInfo._id,
      scannedBy: room.account,
      person: id,
      meetingId: currentMeetingId,
    });
    console.log(data);
    if (data) {
      setDisplayResult(false);
      loadMeetingLogs();
      swal("Added to Logs", {
        icon: "success",
      });
    }
  };
  const addSeatIn = async (id) => {
    alert(currentMeetingId);
    const { data } = await axios.post(`${url}/addMeetingSitIn`, {
      campus: room.campus,
      room: currentRoomInfo._id,
      scannedBy: room.account,
      person: id,
      meetingId: currentMeetingId,
    });
    if (data) {
      setDisplayResult(false);
      loadMeetingLogs();
      swal("Added to Logs", {
        icon: "success",
      });
    }
  };
  const addGuest = async (id) => {
    alert(currentMeetingId);
    const { data } = await axios.post(`${url}/addMeetingGuest`, {
      campus: room.campus,
      room: currentRoomInfo._id,
      scannedBy: room.account,
      person: id,
      meetingId: currentMeetingId,
    });
    if (data) {
      setDisplayResult(false);
      loadMeetingLogs();
      swal("Added to Logs", {
        icon: "success",
      });
    }
  };

  const loadLogs = async () => {
    const logList = await fetchCurrentLogs();
    setLogs(logList);
  };

  const fetchCurrentLogs = async () => {
    const { data } = await axios.post(`${url}/getMeetingLogs`, {
      meetingId: currentMeetingId,
    });

    return data;
  };

  const logChecker = (id) => {
    console.log(logs);
    let exist = false;

    logs.forEach((l) => {
      if (l.accountScanned._id === id) {
        exist = true;
      }
    });

    return exist;
  };
  const submitManual = (e) => {
    e.preventDefault();
    const request = async () => {
      const data = await makeManualRequest();
      setDetails(data);
      setDisplayResult(true);
    };
    request();
    setManualValue("");
  };

  return (
    <div className="scanner-pop-container">
      <div className="scanner-pop-main">
        {displayResult && (
          <div className="scanner-result-container">
            <Fragment>
              {Object.keys(details).length > 0 ? (
                <div className="scan-result-box att-res-card">
                  <div className="scan-result-box-image-section">
                    <img
                      className="scan-result-box-image"
                      src={`${api}/${details.image}`}
                      // src={require(`../../../../../server/uploads/${details.image}`)}
                      alt="pp"
                    />
                    <div className="result-idNumber">{details.username}</div>
                    <div className="result-name">
                      {details.firstName} {details.lastName}
                    </div>
                    <div className="result-role">
                      {details.role.description}
                    </div>
                    <div className="result-room-number">
                      {currentRoomInfo.description}
                    </div>
                    {details.allowed ? (
                      <div className="result-status">Allowed</div>
                    ) : (
                      <div className="result-status text-danger">
                        Not Allowed
                      </div>
                    )}
                    <div className="result-status-label">Status</div>
                  </div>
                  {studentChecker(details._id) ? (
                    <Fragment>
                      {!logChecker(details._id) ? (
                        <div className="result-btn-options">
                          <button
                            onClick={() => {
                              setDisplayResult(false);
                            }}
                            className="shadow btn-sm btn-custom-red"
                          >
                            Cancel<i className="ms-1 fas fa-ban"></i>
                          </button>
                          <button
                            onClick={() => {
                              saveStudentLog(details._id);
                            }}
                            className="shadow btn-sm btn-primary"
                          >
                            Confirm<i className="ms-1 far fa-thumbs-up"></i>
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-center mt-3">
                          <button
                            onClick={() => {
                              setDisplayResult(false);
                            }}
                            className="shadow btn btn-custom-red"
                          >
                            Already Scanned<i className="ms-1 fas fa-ban"></i>
                          </button>
                        </div>
                      )}
                    </Fragment>
                  ) : (
                    <Fragment>
                      {!logChecker(details._id) ? (
                        <div className="result-btn-options scan-res-buttons">
                          <button
                            onClick={() => {
                              setDisplayResult(false);
                            }}
                            className="shadow btn-sm btn-custom-red"
                          >
                            Cancel<i className="ms-1 fas fa-ban"></i>
                          </button>
                          {details.role._id === "62cb91ba2c5804049b716d49" ? (
                            <button
                              onClick={() => {
                                addSeatIn(details._id);
                              }}
                              className="shadow btn-sm btn-warning"
                            >
                              Seat In<i className="ms-1 far fa-thumbs-up"></i>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                addGuest(details._id);
                              }}
                              className="shadow btn-sm btn-success"
                            >
                              Guest<i className="ms-1 far fa-thumbs-up"></i>
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="d-flex justify-content-center mt-3">
                          <button
                            onClick={() => {
                              setDisplayResult(false);
                            }}
                            className="shadow btn btn-custom-red"
                          >
                            Already Scanned<i className="ms-1 fas fa-ban"></i>
                          </button>
                        </div>
                      )}
                    </Fragment>
                  )}
                </div>
              ) : (
                <div
                  onClick={() => {
                    setDisplayResult(false);
                  }}
                  className="not-found"
                >
                  Not found!
                  <div className="not-found-try-again">
                    <i className="me-2 fas fa-redo-alt"></i>Try Again
                  </div>
                </div>
              )}
            </Fragment>
          </div>
        )}
        <div onClick={() => hideScanner()} className="hide-scanner-text shadow">
          <i className="fas fa-times me-2"></i>
          Close
        </div>
        <div className="scanner-pop">
          {scan && (
            <Fragment>
              <div className="scanner-frame-container">
                <div className="scanner-frame">
                  <i className="fas fa-qrcode"></i>
                  <div className="room-frame-display">
                    {currentRoomInfo.description}
                  </div>
                </div>
                <div
                  onClick={() => {
                    setScan(false);
                    setManual(true);
                  }}
                  className="manual-switch "
                >
                  <i className="fas fa-sync me-2"></i> Manual Log
                </div>
              </div>
              <div className="scanner-label ">
                <i className="fas fa-camera"></i>
              </div>
              <QrReader
                className={"attendance-reader"}
                delay={5000}
                onError={handleError}
                onScan={handleScan}
                onResult={showResult}
              />
            </Fragment>
          )}
          {manual && (
            <Fragment>
              <div className="manual-frame-container">
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
                    className="toggle-scan"
                    onClick={() => {
                      setManual(false);
                      setScan(true);
                    }}
                  >
                    <div className="toggle-scan-text">
                      {" "}
                      <i className="fas fa-qrcode"></i>
                      <i className="fas fa-camera mx-2"></i>Open Scanner
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPop;
