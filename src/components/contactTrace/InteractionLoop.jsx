import "./ShowInteractions.css";
import axios from "axios";
import { useState, useEffect, Fragment } from "react";

const InteractionLoop = ({
  toggleInteractions,
  currentDate,
  currentAccount,
  currentRoom,
  currentId,
  idSetter,
  count,
  allRoomsSetter,
}) => {
  const [url] = useState(process.env.REACT_APP_URL);
  const [logs, setLogs] = useState([]);
  const [allLogs, setAllLogs] = useState([]);
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  let displayed = false;

  useEffect(() => {
    loadLogs();
    returnRooms();
    // console.log(currentAccount);
  }, []);

  const loadLogs = async () => {
    const array = [];
    const recs = [];

    const fetchedLogs = await getLogs();

    fetchedLogs.forEach((l) => {
      // console.log("Current" + currentAccount._id);
      // console.log("AccountScanned" + l.accountScanned._id);
      // console.log("ScannedBy" + l.scannedBy._id);

      if (
        l.accountScanned._id === currentAccount._id ||
        l.scannedBy._id === currentAccount._id
      ) {
        array.push(l);
        setLogs(array);
      } else {
        recs.push(l);
        setAllLogs(recs);
      }
    });
  };

  const getLogs = async () => {
    const { data } = await axios.post(`${url}/getPossibleInteractions`, {
      campus: currentAccount.campus,
      currentDate,
    });
    // console.log(data);
    return data;
  };

  const searchContacts = (list) => {
    let array = [];
    // console.log(list);

    allLogs.forEach((record) => {
      if (list.room._id === record.room._id) {
        if (
          // Number(list.start) <= Number(record.start) &&
          Number(list.end) >= Number(record.start)
        ) {
          array.push(record);
        }
        // array.push(record);
      }
    });
    return array;
  };

  const timeFormatter = (timeString) => {
    const time = new Date(Number(timeString)).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${time}`;
  };

  const setter = (id) => {
    idSetter(id);
  };

  const returnRooms = () => {
    let array = [];
    logs.forEach((log) => {
      if (log.room._id === currentRoom) {
        array.push(log);
      }
    });
    // console.log(array);
    allRoomsSetter(array);
  };

  return (
    <div className="show-interactions-container">
      <div className="show-interactions-main">
        <div className="s-i-m">
          {logs.length > 0 ? (
            <Fragment>
              {logs.map(
                (list) =>
                  list.room._id === currentRoom &&
                  currentId !== list._id &&
                  !displayed && (
                    <div key={list._id} className="rooms-visited-list">
                      <div className="room-visited-name">
                        <i className="mx-2 fas fa-map-marker-alt"></i>
                        <span> {list.room.description}</span>
                      </div>
                      <div className="rooms-visited-duration">
                        <div className="duration-labels">
                          <div className="duration-label">From</div>
                          <div className="duration-label">To</div>
                          <div className="duration-label">Scanned By</div>
                        </div>
                        <div className="duration-data">
                          <div className="duration-data-display">
                            {timeFormatter(list.start)}
                          </div>
                          <div className="duration-data-display">
                            {timeFormatter(list.end)}
                          </div>
                          <div className="duration-data-display">
                            {list.scannedBy.firstName} {list.scannedBy.lastName}
                          </div>
                        </div>
                      </div>
                      <div className="interactions-results border">
                        {searchContacts(list).length > 0 ? (
                          <Fragment>
                            <div className="interaction-results-title ">
                              Person Interacted
                            </div>
                            <table className="table">
                              <thead>
                                <tr>
                                  <td>Img</td>
                                  <td>Full Name</td>
                                  <td>Duration</td>
                                  <td>Contact Number</td>
                                </tr>
                              </thead>
                              <tbody>
                                {searchContacts(list).map((r) => (
                                  <tr key={r._id}>
                                    <td>
                                      <img
                                        src={`${api}/${r.accountScanned.image}`}
                                        // src={require(`../../../../server/uploads/${r.accountScanned.image}`)}
                                        alt={r._id}
                                        className="table-image"
                                      />
                                    </td>
                                    <td
                                      className="interaction-list"
                                      key={r._id}
                                    >
                                      {r.accountScanned.firstName}{" "}
                                      {r.accountScanned.lastName}
                                    </td>
                                    <td className="interaction-time-duration">
                                      {Math.floor(
                                        (Number(r.end) - Number(r.start)) /
                                          60000
                                      )}
                                      <span className="minutes">Minutes</span>
                                    </td>
                                    <td>{r.accountScanned.phoneNumber}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </Fragment>
                        ) : (
                          <div>No other interactions.</div>
                        )}
                      </div>

                      {(displayed = true)}
                      {setter(list._id)}
                    </div>
                  )
              )}
            </Fragment>
          ) : (
            <div className="text-muted fst-italic">No Rooms Visited</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractionLoop;
