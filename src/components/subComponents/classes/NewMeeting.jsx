import ScannerPop from "./ScannerPop";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import swal from "sweetalert";

const NewMeeting = ({ room, onGoing, loadMeeting, modalToggler }) => {
  const [showScanner, setShowScanner] = useState(false);
  const [rooms, setRooms] = useState([]);

  const [hasOnGoing, setHasOnGoing] = useState(false);
  const [meetingLogs, setMeetingLogs] = useState([]);
  const [studentLogs, setStudentLogs] = useState([]);
  const [sitInLogs, setSitInLogs] = useState([]);
  const [guestLogs, setGuestLogs] = useState([]);
  const [showRight, setShowRight] = useState(false);
  const [showSubmit, setShowSubmit] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(room.defaultRoom);
  const [roomInfo, setRoomInfo] = useState({});
  const [start, setStart] = useState(room.defaultTimeStart);
  const [currentMeetingId, setCurrentMeetingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [url] = useState(process.env.REACT_APP_URL);
  const [api] = useState(process.env.REACT_APP_API_SERVER);

  useEffect(() => {
    loadData();
    // console.log(room);
    console.log(onGoing);
    // console.log(loadMeeting);

    if (checkOngoing()) {
      console.log(onGoing);
      setSelectedRoom(onGoing.room._id);
      setStart(onGoing.time);
      setShowRight(true);
      setShowSubmit(false);
      setCurrentMeetingId(onGoing._id);
      setRoomInfo(onGoing.room);
      loadMeetingLogs();
    } else {
      currentRoomInfo(room.defaultRoom);
    }
    // setTimeout(() => {
    //   setLoading(false);
    // }, 1000);
  }, []);

  const checkOngoing = () => {
    return Object.keys(onGoing).length > 0;
  };

  const loadMeetingLogs = async () => {
    const logs = await fetchMeetingLogs();
    setMeetingLogs(logs);
    setStudentLogs(
      logs.filter((l) => l.isVisitor === false && l.isSitIn === false)
    );
    setSitInLogs(logs.filter((l) => l.isSitIn === true));
    setGuestLogs(logs.filter((l) => l.isVisitor === true));
  };

  const fetchMeetingLogs = async () => {
    const { data } = await axios.post(`${url}/getMeetingLogs`, {
      meetingId: onGoing._id,
    });

    return data;
  };

  const loadData = async () => {
    const roomList = await fetchRooms();
    setRooms(roomList);
  };

  const fetchRooms = async () => {
    const { data } = await axios.post(`${url}/classRoomList`, {
      campus: room.campus,
    });
    return data;
  };

  const addMeeting = async () => {
    const { data } = await axios.post(`${url}/addMeeting`, {
      classId: room._id,
      room: selectedRoom,
      start: convertDate(start),
      time: start,
    });
    console.log(data);
  };

  const toggleScanner = (e) => {
    e.preventDefault();
    // alert(selectedRoom);
    // alert(start);
    swal({
      title: "Start Now?",
      buttons: true,
    }).then((yes) => {
      if (yes) {
        setShowRight(true);
        setShowSubmit(false);

        const sendMeeting = async () => {
          await addMeeting();
          loadMeeting();
          setCurrentMeetingId(onGoing._id);
        };
        sendMeeting();
        swal("Meeting Activated", {
          icon: "success",
        });
      }
    });
    // alert(selectedRoom);

    // console.log(convertDate(start));
  };

  const convertDate = (date) => {
    const now = new Date();
    return new Date(now.toString().split(":")[0].slice(0, -2) + date).getTime();
  };

  const currentRoomInfo = (id) => {
    rooms.forEach((r) => {
      r._id === id && setRoomInfo(r);
    });
  };

  const endMeeting = async () => {
    // alert(onGoing._id);
    swal({
      title: "End Meeting?",
      buttons: true,
    }).then(async (yes) => {
      if (yes) {
        const { data } = await axios.post(`${url}/endMeeting`, {
          id: onGoing._id,
        });
        if (data) {
          setShowSubmit(true);
          loadMeeting();

          meetingLogs.forEach(async (l) => {
            await axios.post(`${url}/updateMeetingStatus`, {
              id: l._id,
            });
          });
          swal("Meeting Ended", {
            icon: "success",
          });
          resetLogs();
          loadMeetingLogs();
        }
      }
    });
  };

  const hideScanner = () => {
    setShowScanner(false);
  };

  const convert = (d) => {
    const date = new Date(Number(d));
    return date.toString().slice(16, 21);
  };

  const removeLog = async (id) => {
    swal({
      title: "Remove from Meeting?",
      buttons: true,
    }).then(async (yes) => {
      if (yes) {
        const { data } = await axios.post(`${url}/updateMeetingStatus`, {
          id,
        });
        if (data) {
          console.log(data);
          loadMeetingLogs();
          swal("Removed", {
            icon: "success",
          });
        }
      }
    });
  };

  const timeFormatter = (timeString) => {
    // const date = new Date(Number(timeString)).toString().slice(4, 15);
    const time = new Date(Number(timeString)).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${time}`;
  };

  const resetLogs = () => {
    setStudentLogs([]);
    setSitInLogs([]);
    setGuestLogs([]);
  };

  return (
    <div className="new-meeting-container">
      {showScanner && (
        <ScannerPop
          currentMeetingId={onGoing._id}
          hideScanner={hideScanner}
          currentRoomInfo={roomInfo}
          room={room}
          loadMeetingLogs={loadMeetingLogs}
        />
      )}
      {loading ? (
        <div className="mt-4 fw-bold">Loading...</div>
      ) : (
        <div className="new-meeting-left">
          <div className="meeting-room-options border">
            <form onSubmit={toggleScanner}>
              <div className="meeting-room-header">Meeting Details</div>
              <div className=" mt-2">
                <label>Room</label>
                <select
                  disabled={!showSubmit}
                  required
                  onChange={(e) => {
                    setSelectedRoom(e.target.value);
                    currentRoomInfo(e.target.value);
                  }}
                  className="form-control"
                  defaultValue={selectedRoom}
                >
                  {rooms.map((list) => (
                    <option key={list._id} value={list._id}>
                      {list.description}
                    </option>
                  ))}
                </select>
              </div>
              <div className="">
                <div className=" mt-2">
                  <label>Time Start</label>
                  <input
                    disabled={!showSubmit}
                    required
                    value={start}
                    onChange={(e) => {
                      setStart(e.target.value);
                    }}
                    type="time"
                    className="form-control"
                  />
                </div>
              </div>
              {showSubmit ? (
                <div className="mt-4">
                  <button
                    onClick={() => console.log(selectedRoom)}
                    className="btn btn-custom-red btn-block"
                  >
                    Start Scanning
                  </button>
                </div>
              ) : (
                <Fragment>
                  <div className="mt-4">
                    <div
                      onClick={() => setShowScanner(true)}
                      className="btn btn-success btn-block"
                    >
                      Toggle Scanner
                    </div>
                  </div>
                  <div className="mt-4">
                    <div
                      onClick={() => {
                        endMeeting();
                      }}
                      className="btn btn-danger btn-block"
                    >
                      End Meeting
                    </div>
                  </div>
                </Fragment>
              )}
            </form>
          </div>
        </div>
      )}

      <div
        className={`new-meeting-right mx-1 
        }`}
      >
        <div></div>
        <div className=" new-meeting-logs-right-header d-flex justify-content-between align-items-center">
          <span>Students </span>
          {checkOngoing() && (
            <button
              onClick={(e) => {
                modalToggler(onGoing._id, room._id);
              }}
              className={`btn-sm meeting-nav bg-danger text-light`}
            >
              <i className="far fa-calendar-times me-2"></i>Excuse Student
            </button>
          )}
        </div>
        <table className="campus-table table table-striped current-meeting-log-table">
          <tbody>
            {studentLogs.length > 0 ? (
              studentLogs.map((list) => (
                <Fragment key={list._id}>
                  <tr>
                    <td>
                      <img
                        src={`${api}/${list.accountScanned.image}`}
                        // src={require(`../../../../../server/uploads/${list.accountScanned.image}`)}
                        alt={list._id}
                        className="table-image"
                      />
                    </td>
                    <td>
                      {list.accountScanned.lastName},{" "}
                      {list.accountScanned.firstName}
                    </td>

                    <td>{list.accountScanned.idNumber}</td>
                    <td>{timeFormatter(list.start)}</td>
                    <td>
                      <div className="table-options fw-normal fst-italic">
                        <span
                          onClick={() => removeLog(list._id)}
                          className="option-delete"
                        >
                          Remove
                        </span>
                      </div>
                    </td>
                  </tr>
                </Fragment>
              ))
            ) : (
              <tr>
                <tr>
                  <div className="fw-bold fst-italic new-meeting-no-logs p-4">
                    No Logs Yet..
                  </div>
                </tr>
              </tr>
            )}
          </tbody>
        </table>
        <div className="new-meeting-logs-right-header bg-secondary mt-5">
          Sit In
        </div>
        <table className="campus-table table table-striped">
          <tbody>
            {sitInLogs.length > 0 ? (
              sitInLogs.map((list) => (
                <Fragment key={list._id}>
                  <tr>
                    <td>
                      <img
                        src={`${api}/${list.accountScanned.image}`}
                        // src={require(`../../../../../server/uploads/${list.accountScanned.image}`)}
                        alt={list._id}
                        className="table-image"
                      />
                    </td>
                    <td>
                      {list.accountScanned.lastName},{" "}
                      {list.accountScanned.firstName}
                    </td>

                    <td>{list.accountScanned.idNumber}</td>
                    <td>{timeFormatter(list.start)}</td>
                    <td>
                      <div className="table-options">
                        <span
                          onClick={() => removeLog(list._id)}
                          className="option-delete"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </span>
                      </div>
                    </td>
                  </tr>
                </Fragment>
              ))
            ) : (
              <tr>
                <tr>
                  <div className="fw-bold fst-italic new-meeting-no-logs">
                    No Logs Yet..
                  </div>
                </tr>
              </tr>
            )}
          </tbody>
        </table>
        <div className="new-meeting-logs-right-header bg-warning mt-5">
          Guests
        </div>
        <table className="campus-table table table-striped">
          <tbody>
            {guestLogs.length > 0 ? (
              guestLogs.map((list) => (
                <Fragment key={list._id}>
                  <tr>
                    <td>
                      <img
                        src={`${api}/${list.accountScanned.image}`}
                        // src={require(`../../../../../server/uploads/${list.accountScanned.image}`)}
                        alt={list._id}
                        className="table-image"
                      />
                    </td>
                    <td>
                      {list.accountScanned.lastName},{" "}
                      {list.accountScanned.firstName}
                    </td>

                    <td>{list.accountScanned.username}</td>
                    <td>{timeFormatter(list.start)}</td>
                    <td>
                      <div className="table-options">
                        <span
                          onClick={() => removeLog(list._id)}
                          className="option-delete"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </span>
                      </div>
                    </td>
                  </tr>
                </Fragment>
              ))
            ) : (
              <tr>
                <tr>
                  <div className="fw-bold fst-italic new-meeting-no-logs">
                    No Logs Yet..
                  </div>
                </tr>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewMeeting;
