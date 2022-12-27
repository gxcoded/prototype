import "./TraceAll.css";
import { Fragment, useEffect, useState } from "react";
// import InteractionLoop from "./InteractionLoop";
import MapViewContainer from "./MapViewContainer";
import swal from "sweetalert";
import axios from "axios";
const TraceAll = ({
  current,
  toggleTrace,
  customDate,
  contacts,
  toggleInteractions,
  defaultCenter,
  defaultTest,
  message,
  proofId,
  reloader,
}) => {
  const [url] = useState(process.env.REACT_APP_URL);
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  const [oneDay] = useState(86400000);
  const [dates, setDates] = useState([]);
  const [mapView, setMapView] = useState(false);
  const [allVisited, setAllVisited] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  const [uniqueRooms, setUniqueRooms] = useState([]);
  const [displayInfo, setDisplayInfo] = useState([]);
  const [allowed, setAllowed] = useState(false);
  const [isTraced, setIsTraced] = useState(false);

  const [logs, setLogs] = useState([]);
  const [defaultStart, setDefaultStart] = useState(
    new Date(Number(customDate)).toISOString().slice(0, 10)
  );
  const [defaultTestDate, setDefaultTestDate] = useState(
    new Date(Number(defaultTest)).toISOString().slice(0, 10)
  );
  // 86, 400, 000;
  let allRooms = [];
  let all = [];
  let count = [];
  let roomCount = [];
  let uniqueContacts = [];
  let accountScanners = [];

  useEffect(() => {
    contactTraced();

    isAllowed(current._id);
    const gap = Math.floor(
      (Number(customDate) - Number(defaultTest)) / 86400000
    );
    let limit = gap + 14;

    if (limit < 14) {
      limit = 14;
    }
    const lastStamp = limit * 86400000;
    const lastDate = Number(customDate) - Number(lastStamp);

    console.log("Gap " + gap);
    console.log("Limit " + limit);

    loadDates(limit);
    loadLogs(customDate, `${lastDate}`);
    // loadDates(14);
  }, []);

  const infoSetter = (array) => {
    // console.log(array);
    setDisplayInfo(array);
  };

  const loadDates = (limit) => {
    let array = [];

    // let now = Number(new Date(customDate).getTime());
    let now = Number(customDate);
    // console.log(now);
    for (let i = 0; i < limit; i++) {
      let day = {
        numeric: "",
        string: "",
      };

      day.numeric = new Date(new Date(now).toString().slice(4, 16)).getTime();
      day.string = new Date(now).toString().slice(4, 16);
      array.push(day);
      setDates(array);
      now -= oneDay;
    }
  };

  const checkVisited = (value) => {
    let counter = [];

    const limit = Number(value) + oneDay;

    contacts.forEach((con) => {
      if (Number(con.date) >= value && Number(con.date) <= limit) {
        counter.push(con);
      }
    });

    counter.forEach((c) => {
      all.push(c);
    });
    // counter.length > 0 && setAllVisited([...allVisited, counter]);
    return counter;
  };

  const mapViewToggler = () => {
    setMapView(!mapView);
    setDisplayInfo([]);
    // console.log(allVisited);
  };

  const idSetter = (id) => {
    count = id;
  };

  const allRoomsSetter = (room) => {
    // console.log(room);
    room.forEach((r) => {
      allRooms.push(r);
    });
  };

  // now = 1669884560209
  // origin = 1667878374846

  // 6369d0ed9c543afbd392304f

  //   1,123,200,000 = 13 days

  // 1669884560209 = dec 1.

  // 1,668,761,360,209 = nov 18,
  // 172,800,000

  // 1,668,588,560,209 = nov. 16

  // 1668588560209

  // 1668761360209

  // 1668847760209

  const uniqueData = () => {
    let array = [];
    let exist = false;

    all.forEach((a) => {
      exist = false;
      if (array.length > 0) {
        array.forEach((arr) => {
          if (arr.start.toString() === a.start.toString()) {
            exist = true;
          }
        });
        if (!exist) {
          array.push(a);
        }
      } else {
        array.push(a);
      }
    });
    setUniqueRooms(array);
  };

  const dateFormatter = (timeString) => {
    const date = new Date(Number(timeString)).toString().slice(4, 15);
    const time = new Date(Number(timeString)).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${date}`;
  };

  const timeFormatter = (timeString) => {
    const time = new Date(Number(timeString)).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${time}`;
  };

  const durationFormatter = (start, end) => {
    const duration = Math.floor((Number(end) - Number(start)) / 60000);
    let string = "";

    if (duration > 60) {
      return `${Math.floor(duration / 60)} hour(s)`;
    }

    return `${duration} Minutes`;
  };

  // loadLogs
  const loadLogs = async (start, end) => {
    const data = await getLogs(start, end);
    setLogs(data);
  };

  const getLogs = async (start, end) => {
    const { data } = await axios.post(`${url}/wideRangeInteractions`, {
      campus: current.campus,
      starting: start,
      ending: end,
    });
    // console.log(data);
    return data;
  };

  // report Generation
  const printReport = () => {
    // console.log(contacts);
    swal({
      title: "Generate Report?",
      buttons: true,
    }).then((willPrint) => {
      if (willPrint) {
        const reportDates = {
          lastVisit: customDate,
          testDate: defaultTest,
        };
        const dateString = JSON.stringify(dates);
        const contactString = JSON.stringify(contacts);
        const allLogs = JSON.stringify(logs);
        console.log(allLogs);
        localStorage.setItem("currentAccount", JSON.stringify(current));
        localStorage.setItem("contactString", contactString);
        localStorage.setItem("dateRange", dateString);
        localStorage.setItem("reportDates", JSON.stringify(reportDates));
        localStorage.setItem("allLogs", allLogs);
        window.open(`/contact-tracing-report`);
      }
    });
  };

  // notify contacts

  const getAllContacts = () => {
    let array = [];

    uniqueContacts.forEach((uc) => {
      array.push(uc.accountScanned);
    });
    accountScanners.forEach((ac) => {
      array.push(ac.scannedBy);
    });

    return array;
  };

  const notifyContacts = () => {
    uniqueDataContacts();
    let allContacts = getAllContacts();
    if (uniqueContacts.length > 0) {
      swal({
        title: "Notify Close Contacts?",
        text:
          `This will also mark this case as Traced.` + uniqueContacts.length,
        buttons: true,
      }).then((willNotify) => {
        if (willNotify) {
          if (notificationSent(allContacts)) {
            traceUpdated(true);
            swal("Done", {
              icon: "success",
            });
            contactTraced();
          }
        }
      });
    } else {
      swal({
        text: `No close Contacts Found`,
      });
    }
  };

  const notificationSent = async (contacts) => {
    return await sendNotification(contacts);
  };

  const sendNotification = async (contacts) => {
    const { data } = await axios.post(`${url}/sendNotification`, {
      contacts,
      message,
    });

    return data;
  };

  // ====================
  const searchContacts = (list) => {
    let array = [];
    // console.log(list);
    // console.log(logs);
    logs.forEach((record) => {
      if (list.room._id === record.room._id) {
        if (
          Number(list.start) <= Number(record.end) &&
          Number(list.end) > Number(record.start) &&
          current._id !== record.accountScanned._id
        ) {
          array.push(record);
          count.push(record);
        }
        // array.push(record);
      }
    });
    return array;
  };

  const uniqueDataContacts = () => {
    uniqueContacts = [];

    let exist = false;
    let found = false;

    count.forEach((c) => {
      exist = false;
      found = false;

      if (uniqueContacts.length > 0) {
        uniqueContacts.forEach((uc) => {
          if (c.accountScanned._id === uc.accountScanned._id) {
            exist = true;
          }
        });
        if (!exist) {
          uniqueContacts.push(c);
        }
      } else {
        uniqueContacts.push(c);
      }
      // =================================
      if (accountScanners.length > 0) {
        accountScanners.forEach((ac) => {
          if (c.scannedBy._id === ac.scannedBy._id) {
            found = true;
          }
        });
        if (!found) {
          accountScanners.push(c);
        }
      } else {
        accountScanners.push(c);
      }
    });
    // console.log(accountScanners);
  };

  // ============Trace Status=====================

  const contactTraced = async () => {
    const result = await checkTraceStatus();
    setIsTraced(result);
    reloader();
  };

  const checkTraceStatus = async () => {
    const { data } = await axios.post(`${url}/checkUntracedCase`, {
      report: proofId,
    });
    console.log(data);
    return data;
  };

  const traceUpdater = (type, status) => {
    let text = "Traced";
    if (type === 1) {
      text = "Untraced";
    }
    swal({
      title: "Are you sure?",
      text: `This case will be marked as ${text}`,
      icon: "warning",
      buttons: true,
    }).then((willUpdate) => {
      if (willUpdate) {
        if (traceUpdated(status)) {
          swal("Status Updated", {
            icon: "success",
          });
          contactTraced();
        }
      }
    });
  };

  const traceUpdated = async (status) => {
    const updated = await traceUpdateRequest(status);
    console.log(updated);
    return updated;
  };

  const traceUpdateRequest = async (status) => {
    const { data } = await axios.post(`${url}/caseUpdater`, {
      id: proofId,
      status: status,
    });
    console.log(data);
    return data;
  };

  // ===============Allowed Status=================
  const statusUpdater = (id) => {
    swal({
      title: "Are you sure?",
      text: "This will change the status of this account.",
      icon: "warning",
      buttons: true,
    }).then((willUpdate) => {
      if (willUpdate) {
        if (statusUpdated(id)) {
          isAllowed(id);
          swal("Status Updated", {
            icon: "success",
          });
        }
      }
    });
  };

  const statusUpdated = async (id) => {
    const updated = await statusUpdateRequest(id);
    // console.log(updated);
    return updated;
  };

  const statusUpdateRequest = async (id) => {
    const { data } = await axios.post(`${url}/statusUpdater`, {
      id,
    });

    return data;
  };

  const isAllowed = async (id) => {
    const yes = await statusCheckRequest(id);
    // console.log(yes);
    setAllowed(yes);
  };

  const statusCheckRequest = async (id) => {
    const { data } = await axios.post(`${url}/statusChecker`, {
      id,
    });

    return data;
  };

  return (
    <div className="trace-all-container ">
      {/* ===============Map View Pop=================== */}
      {mapView && (
        <div className="trace-all-map-view">
          <div className="trace-all-map-view-left">
            <div onClick={() => mapViewToggler()} className="map-view-closer">
              Close
            </div>
            <div className="trace-all-map-view-left-main">
              <div className="trace-all-map-info">
                {displayInfo.length > 0 ? (
                  <div className="trace-all-map-info-header border">
                    <div className="trace-all-map-info-header-floor">
                      {displayInfo[0].room.floor}
                    </div>
                    <div className="trace-all-map-info-header-room">
                      {displayInfo[0].room.description}
                    </div>
                  </div>
                ) : (
                  <div className="trace-all-map-info-header">
                    Hover on the markers to show details.
                  </div>
                )}
                <div className="trace-all-map-info-list">
                  {displayInfo.map((display) => (
                    <div className="trace-all-map-info-list-card">
                      <div className="trace-all-map-info-list-card-date">
                        {dateFormatter(display.date)}
                      </div>
                      <div className="trace-all-map-info-list-card-time">
                        {timeFormatter(display.start)}
                        {" - "}
                        {timeFormatter(display.end)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="trace-all-map-view-right">
            <MapViewContainer
              defaultCenter={defaultCenter}
              uniqueRooms={uniqueRooms}
              infoSetter={infoSetter}
            />
          </div>
        </div>
      )}
      {/* ===============Map View Pop=================== */}
      <div onClick={() => toggleTrace()} className="trace-all-header">
        <span className="back-span">
          {" "}
          <i className="fas fa-angle-left me-2"></i>Back
        </span>
      </div>
      <div className="trace-all-main">
        <div className="trace-all-main-header">
          <div className="trace-all-main-profile">
            <div className="current-img-container">
              <img
                src={`${api}/${current.image}`}
                // src={require(`../../../../server/uploads/${currentAccount.image}`)}
                alt={current._id}
                className="interactions-current-img trace-all-img"
              />
            </div>
            <div className="s-i-m-profile-info">
              <div className="s-i-m-profile-name">
                {current.firstName} {current.lastName}
              </div>
              <div className="s-i-m-profile-status text-center">
                {allowed ? (
                  <span className="fw-bold text-success">Allowed</span>
                ) : (
                  <span className="fw-bold text-danger">Not Allowed</span>
                )}
              </div>
              <div
                onClick={() => statusUpdater(current._id)}
                className="s-i-m-profile-status-label text-center border"
              >
                Change Status
              </div>
            </div>
          </div>
          <div className="trace-all-main-date">
            <div className="s-i-m-date-content mt-4">
              <i className="fas fa-street-view mb-2"></i>
              <div className="s-i-m-profile-status text-center mb-3">
                {isTraced ? (
                  <span className="fw-bold text-success">Traced</span>
                ) : (
                  <span className="fw-bold text-danger">Untraced</span>
                )}
              </div>
              {!isTraced && (
                <div
                  onClick={() => traceUpdater(0, true)}
                  className="s-i-m-profile-status-label text-center border"
                >
                  Set As Traced
                </div>
              )}
              {/* {isTraced ? (
                <div
                  onClick={() => traceUpdater(1, false)}
                  className="s-i-m-profile-status-label text-center border"
                >
                  Set As Untraced
                </div>
              ) : (
                <div
                  onClick={() => traceUpdater(0, true)}
                  className="s-i-m-profile-status-label text-center border"
                >
                  Set As Traced
                </div>
              )} */}
            </div>
          </div>
          <div className="trace-all-main-date tam-restrict text-center">
            <div
              onClick={() => {
                notifyContacts();
                // console.log(uniqueContacts);
              }}
              className="s-i-m-date-content"
            >
              <i className="far fa-bell text-warning"></i>
              Notify Close Contacts
            </div>
          </div>
          <div className="trace-all-main-date tam-report text-center">
            <div
              onClick={() => {
                uniqueData();
                mapViewToggler();
              }}
              className="s-i-m-date-content"
            >
              <i className="fas fa-map-marked text-success"></i>
              Map View
            </div>
          </div>
          <div
            onClick={() => printReport()}
            className="trace-all-main-date tam-report text-center"
          >
            <div className="s-i-m-date-content">
              <i className="far fa-file-alt"></i>
              Generate Report
            </div>
          </div>
        </div>
        <div className="trace-all-info-dates bg-light">
          <div className="trace-all-info-dates-left">
            <div className="interaction-starting-date">
              <span>Last Campus Visit</span>
              <input
                readOnly
                value={defaultStart}
                onChange={(e) => {
                  {
                    // customStartDate(e.target.value);
                    // setCustomDate(e.target.value);
                    // updateDates(Number(new Date(e.target.value).getTime()));
                  }
                }}
                // max={defaultDate}
                type="date"
                className="form-control"
              />
            </div>
            <div className="interaction-starting-date mt-3">
              <span>Date Tested</span>
              <input
                readOnly
                value={defaultTestDate}
                onChange={(e) => {
                  {
                    // customStartDate(e.target.value);
                    // setCustomDate(e.target.value);
                    // updateDates(Number(new Date(e.target.value).getTime()));
                  }
                }}
                // max={defaultDate}
                type="date"
                className="form-control"
              />
            </div>
          </div>
          <div className="trace-all-info-dates-right">
            <div className="trace-all-date-guide">
              Date traced is from last campus visit plus 14 days from the date
              tested.
            </div>
          </div>
        </div>
        <div className="trace-all-main-content">
          {dates.map((d) => (
            <div
              key={Math.floor(Math.random() * 1000000)}
              className={"fragment-wrap border mt-5"}
            >
              <div onClick={() => {}} className="dates-header border">
                <div className="date-content"> {d.string}</div>
              </div>
              <div className="all-rooms-visited-section">
                {checkVisited(d.numeric).length > 0 ? (
                  <Fragment key={Math.random() * 100000}>
                    {checkVisited(d.numeric).map((room) => (
                      <div
                        key={Math.floor(Math.random() * 1000000)}
                        className="visited-room-details border"
                      >
                        <div className="vrd-header">
                          {room.room.description}
                          <div className="trace-all-map-info-list-card-time">
                            {timeFormatter(room.start)}
                            {" - "}
                            {timeFormatter(room.end)}
                          </div>
                          <div className="trace-all-map-info-list-card-time  p-2">
                            <span className="me-2 ">Scanned by:</span>
                            {room.scannedBy.firstName}
                            {"  "} {room.scannedBy.lastName}
                          </div>
                        </div>
                        <div className="interactions-results">
                          {searchContacts(room).length > 0 ? (
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
                                    <td>Time</td>
                                    <td>Contact Number</td>
                                  </tr>
                                </thead>
                                <tbody>
                                  {searchContacts(room).map((r) => (
                                    <tr key={r._id}>
                                      <td>
                                        <img
                                          src={`${api}/${r.accountScanned.image}`}
                                          // src={require(`../../../../server/uploads/${r.accountScanned.image}`)}
                                          alt={r._id}
                                          className="table-image "
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
                                        {durationFormatter(r.start, r.end)}
                                      </td>
                                      <td className="interaction-time-duration">
                                        {timeFormatter(r.start)}
                                        {" - "}
                                        {timeFormatter(r.end)}
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

                        {/* <InteractionLoop
                          toggleInteractions={toggleInteractions}
                          currentDate={d.numeric}
                          currentAccount={current}
                          currentRoom={room.room._id}
                          currentId={currentId}
                          idSetter={idSetter}
                          count={count}
                          allRoomsSetter={allRoomsSetter}
                        /> */}
                      </div>
                    ))}
                  </Fragment>
                ) : (
                  <div>No Rooms Visited</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TraceAll;
