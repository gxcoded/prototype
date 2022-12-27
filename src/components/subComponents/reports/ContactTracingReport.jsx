import "./ContactTracingReport.css";
import { useState, useEffect, Fragment } from "react";
import LoggedOut from "../../LoggedOut";
import Image from "../../../assets/images/psHeader.png";
import axios from "axios";

const ContactTracingReport = () => {
  const [url] = useState(process.env.REACT_APP_URL);
  const [printable, setPrintable] = useState(false);
  const [dates, setDates] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState([]);
  const [oneDay] = useState(86400000);
  const [defaultDates, setDefaultDates] = useState({});
  const [allLogs, setAllLogs] = useState([]);
  const [preview, setPreview] = useState(true);

  useEffect(() => {
    const reportDates = localStorage.getItem("reportDates");
    const dateRange = localStorage.getItem("dateRange");
    const contactString = localStorage.getItem("contactString");
    const logs = localStorage.getItem("allLogs");
    const current = localStorage.getItem("currentAccount");

    if (dateRange !== null && contacts !== null && current !== null) {
      setDates(JSON.parse(dateRange));
      setContacts(JSON.parse(contactString));
      setCurrentAccount(JSON.parse(current));
      setDefaultDates(JSON.parse(reportDates));
      setAllLogs(JSON.parse(logs));
      setPrintable(true);
    }
  }, []);

  const checkVisited = (value) => {
    let counter = [];

    const limit = Number(value) + oneDay;

    contacts.forEach((con) => {
      if (Number(con.date) >= value && Number(con.date) <= limit) {
        counter.push(con);
      }
    });

    // counter.forEach((c) => {
    //   all.push(c);
    // });
    // counter.length > 0 && setAllVisited([...allVisited, counter]);
    return counter;
  };

  const timeFormatter = (timeString) => {
    const time = new Date(Number(timeString)).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${time}`;
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

  const searchContacts = (list) => {
    let array = [];
    // console.log(list);

    allLogs.forEach((record) => {
      if (list.room._id === record.room._id) {
        if (
          Number(list.start) < Number(record.end) &&
          Number(list.end) >= Number(record.start) &&
          currentAccount._id !== record.accountScanned._id
        ) {
          array.push(record);
        }
        // array.push(record);
      }
    });
    return array;
  };

  const printNow = () => {
    setPreview(false);

    setTimeout(() => {
      window.print();
    }, 500);
  };

  window.onafterprint = () => {
    setPreview(true);
  };

  return (
    <div className="contact-tracing-report-container">
      {/* <div className={`attendance-report-main ${preview && "page-preview"}`}> */}
      {printable ? (
        <div className={`attendance-report-main ${preview && "page-preview"}`}>
          <div className={`print-controls ${!preview && "d-none"}`}>
            <div className="print-controls-text">
              <div onClick={() => printNow()} className="btn btn-primary">
                Print / Save
              </div>
              <div
                onClick={() => window.close()}
                className="btn btn-warning ms-2"
              >
                Close
              </div>
            </div>
          </div>

          {/* <div className={`attendance-main-page ${preview && "shadow p-5"}`}> */}
          <div className={`attendance-main-page p-5 shadow`}>
            <div className="attendance-report-header mt-5">
              <img
                src={Image}
                alt="report-img"
                className="attendance-report-img"
              />
            </div>
            <div className="attendance-report-header-title">
              Contact Tracing Report
            </div>
            <div className="attendance-report-header-details">
              <div className="report-header-detail">
                <div className="report-left">Name:</div>
                <div className="report-right">
                  {currentAccount.lastName}, {currentAccount.firstName}
                </div>
              </div>
              <div className="report-header-detail">
                <div className="report-left">Contact Number:</div>
                <div className="report-right">{currentAccount.phoneNumber}</div>
              </div>
              <div className="report-header-detail">
                <div className="report-left">Date Tested:</div>
                <div className="report-right">
                  {dateFormatter(defaultDates.testDate)}
                </div>
              </div>
              <div className="report-header-detail">
                <div className="report-left">Last Campus Visit</div>
                <div className="report-right">
                  {dateFormatter(defaultDates.lastVisit)}
                </div>
              </div>
              <div className="report-header-detail">
                <div className="report-left">Current Date:</div>
                <div className="report-right">
                  {new Date().toString().slice(4, 16)}
                </div>
              </div>
            </div>
            {dates.map((date) => (
              <div className="attendance-report-table border">
                <div className="attendance-report-table-header bg-light text-dark">
                  <div className="report-table-date">{date.string}</div>
                  <div className="report-table-start"></div>
                </div>
                {checkVisited(date.numeric).length > 0 ? (
                  <div className="report-date-container p-2">
                    {checkVisited(date.numeric).map((room) => (
                      <div className="border mt-3" key={Math.random() * 99999}>
                        <div className="contact-report-date-header bg-light">
                          {room.room.description}
                          <div className="trace-all-map-info-list-card-time">
                            {timeFormatter(room.start)}
                            {" - "}
                            {timeFormatter(room.end)}
                          </div>
                          <div className="trace-all-map-info-list-card-time">
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
                                    {/* <td>Img</td> */}
                                    <td>Full Name</td>
                                    <td>Duration</td>
                                    <td>Contact Number</td>
                                  </tr>
                                </thead>
                                <tbody>
                                  {searchContacts(room).map((r) => (
                                    <tr key={r._id}>
                                      {/* <td>
                                        <img
                                          src={`${api}/${r.accountScanned.image}`}
                                          // src={require(`../../../../server/uploads/${r.accountScanned.image}`)}
                                          alt={r._id}
                                          className="table-image"
                                        />
                                      </td> */}
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
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-2">No Rooms Visited</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>NO data Found...</div>
      )}
    </div>
  );
};

export default ContactTracingReport;
