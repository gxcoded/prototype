import "./Interactions.css";
import axios from "axios";
import ShowInteractions from "./ShowInteractions";
import TraceAll from "./TraceAll";
import { useState, useEffect, Fragment } from "react";

const Interactions = ({
  current,
  toggleView,
  showMsgProof,
  defaultCenter,
  message,
  reloader,
  currentProofId,
}) => {
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  const [showInteractions, setShowInteractions] = useState(false);
  const [traceAll, setTraceAll] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [url] = useState(process.env.REACT_APP_URL);
  const [days, setDays] = useState(14);
  const [dates, setDates] = useState([]);
  const [oneDay] = useState(86400000);
  const [fiveHours] = useState(36000000);
  const [currentDate, setCurrentDate] = useState("");
  const [lastVisit, setLastVisit] = useState(Date.now().toString());
  const [defaultTest, setDefaultTest] = useState(Date.now().toString());
  const [customStart, setCustomStart] = useState(Date.now().toString());
  const [proof, setProof] = useState([]);
  const [defaultDate] = useState(
    new Date().toISOString().toString().slice(0, 10)
  );
  const [customDate, setCustomDate] = useState(
    new Date().toISOString().toString().slice(0, 10)
  );
  // const [fiveHours, setFiveHours] = useState(1191600000);
  //86,400,000 in one Day

  useEffect(() => {
    loadData();
    loadDates(days);
    getValidProof();
    loadLastLog();
  }, []);

  //=======Proof==========

  const fetchProof = async () => {
    const { data } = await axios.post(`${url}/getValidProof`, {
      id: currentProofId,
    });
    return data;
  };

  const getValidProof = async () => {
    const proof = await fetchProof();
    console.log(proof);
    setProof(proof);
    proof.length > 0 && setDefaultTest(proof[0].dateTested);
  };

  const loadData = async () => {
    const data = await fetchContacts(
      Number(Date.now().toString()) - oneDay * 14
    );
    console.log(data);
    setContacts(data);
  };

  const fetchContacts = async (total) => {
    const range = total - fiveHours;
    const { data } = await axios.post(`${url}/showInteractions`, {
      id: current._id,
      range,
    });

    return data;
  };

  const updateRange = (range) => {
    let array = [];
    let start = Number(new Date(customDate).getTime());
    console.log(start);

    for (let i = 0; i < range; i++) {
      let day = {
        numeric: "",
        string: "",
      };

      day.numeric = new Date(new Date(start).toString().slice(4, 16)).getTime();
      day.string = new Date(start).toString().slice(4, 16);
      array.push(day);
      setDates(array);
      start -= oneDay;
    }
    // loadDates(range);
    // console.log(Number(Date.now().toString()) - oneDay * range);
  };

  const loadDates = (limit) => {
    let array = [];

    let now = Number(Date.now().toString());

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

  const updateDates = (start) => {
    let array = [];

    for (let i = 0; i < days; i++) {
      let day = {
        numeric: "",
        string: "",
      };

      day.numeric = new Date(new Date(start).toString().slice(4, 16)).getTime();
      day.string = new Date(start).toString().slice(4, 16);
      array.push(day);
      setDates(array);
      start -= oneDay;
    }
  };

  const checkVisited = (value) => {
    let counter = 0;
    const limit = Number(value) + oneDay;
    contacts.forEach((con) => {
      if (Number(con.date) >= value && Number(con.date) <= limit) {
        counter++;
      }
    });
    return counter;
  };

  const viewInteractions = (date) => {
    setCurrentDate(date);
    setShowInteractions(true);
  };

  const toggleInteractions = () => {
    setShowInteractions(!showInteractions);
  };

  const toggleTrace = () => {
    setTraceAll(!traceAll);
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

  // const customStartDate = (value) => {
  //   alert(Number(new Date(value).getTime()));
  // };

  const loadLastLog = async () => {
    const last = await fetchLastLog();
    setLastVisit(last);
    console.log(last._id);
  };

  const fetchLastLog = async () => {
    const { data } = await axios.post(`${url}/getLastLog`, {
      id: current._id,
    });
    return data;
  };

  const dayCounter = (sent) => {
    const now = Date.now().toString();
    const total = (Number(now) - Number(sent)) / 86400000;

    return Math.floor(total);
  };

  return (
    <div className="interactions-container ">
      {traceAll ? (
        <TraceAll
          contacts={contacts}
          current={current}
          toggleTrace={toggleTrace}
          customDate={lastVisit}
          // customDate={customStart}
          toggleInteractions={toggleInteractions}
          defaultCenter={defaultCenter}
          defaultTest={defaultTest}
          message={message}
          proofId={proof.length > 0 && proof[0]._id}
          reloader={reloader}
        />
      ) : (
        <Fragment>
          {showInteractions ? (
            <ShowInteractions
              toggleInteractions={toggleInteractions}
              currentDate={currentDate}
              currentAccount={current}
              defaultCenter={defaultCenter}
            />
          ) : (
            <Fragment>
              <div className="interactions-header">
                <span onClick={() => toggleView()} className="prev-btn">
                  <i className="me-2 fas fa-chevron-left"></i>
                  Go Back
                </span>
              </div>
              <div className="show-proof">
                {proof.length > 0 ? (
                  <div
                  // style={{ cursor: "pointer" }}
                  // onClick={() => showMsgProof(current)}
                  >
                    <div className="proof-section">
                      <div className="h5 py-2">Reported Positive</div>
                      <div className="proof-section-header">Report Details</div>
                      <div className="day-count-section border-bottom py-2 mb-2">
                        <div className="day-count-label d-flex">
                          Sent
                          <div className="day-count-display mx-2 fw-bold text-primary">
                            {" "}
                            {dayCounter(proof[0].dateSent)}
                          </div>
                          day(s) ago.
                        </div>
                      </div>
                      <div className="proof-section-details">
                        <div className="proof-section-details-left">
                          <img
                            src={`${api}/${proof[0].imgProof}`}
                            alt="proofImg"
                            className="ps-img"
                          />
                        </div>
                        <div className="proof-section-details-right">
                          <div className="proof-section-right-details">
                            <div className="proof-section-label">Test Type</div>
                            <div className="proof-section-text">
                              {proof[0].testType.description}
                            </div>
                            <div className="proof-section-label">
                              Date Tested
                            </div>
                            <div className="proof-section-text">
                              {dateFormatter(proof[0].dateTested)}
                            </div>
                            <div className="proof-section-label">
                              Result Date
                            </div>
                            <div className="proof-section-text">
                              {dateFormatter(proof[0].resultDate)}
                            </div>
                            <div className="proof-section-label">
                              Last Visit Date
                            </div>
                            <div className="proof-section-text">
                              {dateFormatter(lastVisit)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="show-proof-content text-success">
                    This user does not sent any Proof .
                  </div>
                )}
              </div>
              <div className="interactions-main">
                <div className="interactions-main-left">
                  <div className="interactions-main-left-card">
                    <div className="current-img-container">
                      <img
                        src={`${api}/${current.image}`}
                        // src={require(`../../../../server/uploads/${current.image}`)}
                        alt={current._id}
                        className="interactions-current-img"
                      />
                    </div>
                    <div className="current-info current-info-name">
                      {current.firstName} {current.lastName}
                    </div>
                    <div className="current-info current-info-role">
                      {current.role.description}
                    </div>
                    <div className="current-info current-info-username">
                      {current.username}
                    </div>
                    <div className="notify-btn mt-3">
                      <button
                        onClick={() => toggleTrace()}
                        className="btn btn-custom-red"
                      >
                        <i className="me-2 far fa-envelope"></i>Trace All
                        Interactions
                      </button>
                    </div>
                  </div>
                </div>
                <div className="interactions-main-right">
                  <div className="interactions-main-right-header">
                    <div className="interaction-range">
                      <span>Showing Rooms Visited in last</span>
                      <div className="range-control">
                        <div
                          onClick={() => {
                            if (days > 1) {
                              setDays(days - 1);
                              updateRange(days - 1);
                            }
                          }}
                          className="decrease"
                        >
                          <i className="fas fa-chevron-down"></i>
                        </div>
                        <div className="range-display">{days}</div>
                        <div
                          onClick={() => {
                            if (days < 14) {
                              setDays(days + 1);
                              updateRange(days + 1);
                            }
                          }}
                          className="increase"
                        >
                          <i className="fas fa-chevron-up"></i>
                        </div>
                      </div>
                      <span>Day(s)</span>
                    </div>
                    <div className="interaction-starting-date">
                      <span>Starting Date</span>
                      <input
                        value={customDate}
                        onChange={(e) => {
                          {
                            new Date(customDate).getTime();
                            // customStartDate(e.target.value);
                            setCustomStart(new Date(e.target.value).getTime());
                            // console.log(e.target.value);
                            setCustomDate(e.target.value);
                            updateDates(
                              Number(new Date(e.target.value).getTime())
                            );
                          }
                        }}
                        max={defaultDate}
                        type="date"
                        className="form-control"
                      />
                    </div>
                    <hr />
                  </div>
                  <div className="date-grid">
                    {dates.map((d) => (
                      <div
                        onClick={() => viewInteractions(d.numeric)}
                        className="date-box  border"
                        key={Math.floor(Math.random() * 1000000)}
                      >
                        <div className="date-content-date"> {d.string}</div>
                        <div className="date-content-visited">
                          <div className="visited-total">
                            {checkVisited(d.numeric)}
                          </div>
                          <div className="visited-text">Visits</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Fragment>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default Interactions;
