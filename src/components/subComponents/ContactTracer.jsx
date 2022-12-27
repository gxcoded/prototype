import "../subComponents/subCss/ContactTracer.css";
import { Fragment, useState, useEffect } from "react";
import Interactions from "../contactTrace/Interactions";
import Table from "../contactTrace/Table";
import ThreadsTable from "../contactTrace/ThreadsTable";
import UntracedTable from "../contactTrace/UntracedTable";
import NewThreadsTable from "../contactTrace/NewThreadsTable";
import NewNegativeThreadsTable from "../contactTrace/NewNegativeThreadsTable";
import NegativeDetails from "../contactTrace/NegativeDetails";
import axios from "axios";

const ContactTracer = ({ campus, showMsgProof }) => {
  const [requested, setRequested] = useState(false);
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [url] = useState(process.env.REACT_APP_URL);
  const [current, setCurrent] = useState({});
  const [viewContacts, setViewContacts] = useState(false);
  const [viewDetails, setViewDetails] = useState(false);
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  const [allThreads, setAllThreads] = useState([]);
  const [newThreads, setNewThreads] = useState([]);
  const [allUntraced, setAllUntraced] = useState([]);
  const [negativeReports, setNegativeReports] = useState([]);
  const [newNegativeReports, setNewNegativeReports] = useState([]);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [showAllThreads, setShowAllThreads] = useState(false);
  const [showNewThreads, setShowNewThreads] = useState(false);
  const [showUntraced, setShowUntraced] = useState(false);
  const [showNegativeReports, setShowNegativeReports] = useState(false);
  const [showNewNegativeReports, setShowNewNegativeReports] = useState(false);
  const [roles, setRoles] = useState([]);
  const [defaultLat, setDefaultLat] = useState(0);
  const [defaultLng, setDefaultLng] = useState(0);
  const slider = document.querySelector("#slider");
  const [reload, setReload] = useState(false);
  const [currentProofId, setCurrentProofId] = useState("");

  useEffect(() => {
    loadMessages();
    loadRoles();
    loadDefaultCoords();
    loadNotificationMessage();
    loadUntracedCases();
    loadNegativeReports();
  }, [reload]);

  const reloader = () => {
    setReload(!reload);
    console.log("reloaded");
  };
  const loadUntracedCases = async () => {
    const all = await fetchUntraced();

    setAllUntraced(all);
    console.log(all);
  };
  const fetchUntraced = async () => {
    const { data } = await axios.post(`${url}/getAllUntracedCase`, {
      campus,
    });
    console.log(data);
    return data;
  };
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

  const resetBoard = () => {
    setShowAllThreads(false);
    setShowNewThreads(false);
    setShowSearchResult(false);
    setShowUntraced(false);
    setShowNegativeReports(false);
    setShowNewNegativeReports(false);
    setViewDetails(false);
    slider.click();
  };

  // ==========Negative Reports================

  const loadNegativeReports = async () => {
    const data = await fetchNegativeReports();

    let array = [];

    if (data.length > 0) {
      data.forEach((newData) => {
        if (!newData.seen) {
          array.push(newData);
          setNewNegativeReports(array);
        }
      });
    }
    setNegativeReports(data);
  };

  const fetchNegativeReports = async () => {
    const { data } = await axios.post(`${url}/getAllNegativeReports`, {
      campus,
    });
    // console.log(data);
    return data;
  };

  // ==========================================

  const submitSearch = async (e) => {
    e.preventDefault();
    fetchRequest();
    setRequested(true);
    resetBoard();
    setShowSearchResult(true);
  };

  const fetchRequest = async () => {
    const result = await sendSearch();

    setSearchResult(result);
  };

  const sendSearch = async () => {
    const { data } = await axios.post(`${url}/contact-tracer-search`, {
      campus,
      text,
    });

    return data;
  };

  const showInteractions = (list, proofId) => {
    setCurrentProofId(proofId);
    setCurrent(list);
    toggleView();
  };

  const showNegativeDetails = (list, proofId) => {
    setCurrentProofId(proofId);
    setCurrent(list);
    toggleDetails();
  };

  const toggleView = () => {
    setViewContacts(!viewContacts);
  };

  const toggleDetails = () => {
    setViewDetails(!viewDetails);
  };

  //messages
  const loadMessages = async () => {
    let array = [];

    const msgs = await fetchMessages();

    msgs.forEach((msg) => {
      if (!msg.seen) {
        array.push(msg);
        setNewThreads(array);
      }
    });

    setAllThreads(msgs);
  };

  const fetchMessages = async () => {
    const { data } = await axios.post(`${url}/getAllMessages`, {
      campus,
    });

    return data;
  };

  const dateFormatter = (timeString) => {
    const date = new Date(Number(timeString)).toString().slice(4, 15);
    const time = new Date(Number(timeString)).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${date} ${time}`;
  };

  const loadRoles = async () => {
    const roleList = await fetchRoles();
    setRoles(roleList);
  };

  const fetchRoles = async () => {
    const { data } = await axios.get(`${url}/allRoles`);

    return data;
  };

  const loadNotificationMessage = async () => {
    const textMsg = await fetchNotificationMessage();

    setMessage(textMsg.text);
  };

  const fetchNotificationMessage = async () => {
    const { data } = await axios.post(`${url}/getMessage`, {
      campus,
    });

    return data;
  };

  return (
    <div className="tracer-wrap">
      <div className="tracer-form-title">
        <i className="me-2 fas fa-street-view"></i>Contact Tracer
      </div>
      {viewDetails ? (
        <NegativeDetails
          currentProofId={currentProofId}
          current={current}
          toggleDetails={toggleDetails}
          reloader={reloader}
        />
      ) : (
        <div className="tracer-container">
          {viewContacts ? (
            <Interactions
              showMsgProof={showMsgProof}
              currentProofId={currentProofId}
              current={current}
              toggleView={toggleView}
              defaultCenter={{ lat: defaultLat, lng: defaultLng }}
              message={message}
              reloader={reloader}
            />
          ) : (
            <Fragment>
              <div className="contact-tracer-summary">
                <div className="contact-tracer-summary-top">
                  {" "}
                  <div className="contact-tracer-summary-cards">
                    <div
                      onClick={() => {
                        resetBoard();
                        setShowNewThreads(true);
                      }}
                      className="contact-tracer-card"
                    >
                      <div className="contact-tracer-card-counter">
                        {newThreads.length}
                      </div>
                      <div className="contact-tracer-card-label">
                        New Reported Positive
                      </div>
                    </div>

                    <div
                      onClick={() => {
                        resetBoard();
                        setShowUntraced(true);
                      }}
                      className="contact-tracer-card"
                    >
                      <div className="contact-tracer-card-counter">
                        {allUntraced.length}
                      </div>
                      <div className="contact-tracer-card-label">Untraced</div>
                    </div>
                    <div
                      onClick={() => {
                        resetBoard();
                        setShowAllThreads(true);
                      }}
                      className="contact-tracer-card"
                    >
                      <div className="contact-tracer-card-counter">
                        {allThreads.length}
                      </div>
                      <div className="contact-tracer-card-label">
                        All Reported Cases
                      </div>
                    </div>
                  </div>
                </div>
                {/* =========================Negative Reports==================================== */}
                <div className="contact-tracer-summary-bottom mt-3">
                  <div className="contact-tracer-summary-cards">
                    <div
                      onClick={() => {
                        resetBoard();
                        setShowNewNegativeReports(true);
                      }}
                      className="contact-tracer-card negative-cards"
                    >
                      <div className="contact-tracer-card-counter">
                        {newNegativeReports.length}
                      </div>
                      <div className="contact-tracer-card-label">
                        New Reported Negative
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        resetBoard();
                        setShowNegativeReports(true);
                      }}
                      className="contact-tracer-card negative-cards"
                    >
                      <div className="contact-tracer-card-counter">
                        {negativeReports.length}
                      </div>
                      <div className="contact-tracer-card-label">
                        All Reported Negative
                      </div>
                    </div>
                    {/* <div className="contact-tracer-search border">
                <form onSubmit={submitSearch}>
                  <div className="tracer-form-title">Search For Accounts</div>
                  <div className="mt-3">
                    <input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      required
                      minLength={"2"}
                      type="text"
                      className="form-control"
                      placeholder="Name"
                    />
                  </div>
                  <div className="mt-3">
                    <button className="btn-block btn btn-primary">
                      Search
                    </button>
                  </div>
                </form>
              </div> */}
                  </div>
                </div>
                <div className="contact-tracer-search">
                  <form onSubmit={submitSearch}>
                    <div className="tracer-form-title">Search For Accounts</div>
                    <div className="mt-3">
                      <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                        minLength={"2"}
                        type="text"
                        className="form-control"
                        placeholder="Name"
                      />
                    </div>
                    <div className="mt-3">
                      <a
                        href="#tableDisplay"
                        id="slider"
                        style={{ display: "none" }}
                      ></a>
                      <button className="btn-block btn btn-primary">
                        Search
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              {/* <div className="contact-tracer-main">
            <div className="contact-tracer-main-left">
              <div className="contact-tracer-form">
                <div className="tracer-search-section">
                  <form onSubmit={submitSearch}>
                    <div className="tracer-form-title">Contact Tracer</div>
                    <div className="mt-3">
                      <label>Type Name Here</label>
                      <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                        minLength={"2"}
                        type="text"
                        className="form-control"
                        placeholder="Name"
                      />
                    </div>
                    <div className="mt-3">
                      <button className="btn-block btn btn-primary">
                        Search
                      </button>
                    </div>
                    <div className="contact-tracer-words bg-light">
                      <span>
                        Trace someone's interaction by typing the Full Name of
                        the person you want to trace.
                      </span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="contact-tracer-main-right">
              <div className="tracer-calendar bg-light">
                <div className="tracer-calendar-content text-center">
                  <div className="tracer-calendar-icon text-primary">
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                  <div className="tracer-calendar-date">
                    {new Date().toString().slice(0, 16)}
                  </div>
                </div>
              </div>
            </div>
          </div> */}

              <div className="search-result-table" id="tableDisplay">
                {showSearchResult && (
                  <Fragment>
                    {searchResult.length > 0 ? (
                      <Table
                        showMsgProof={showMsgProof}
                        data={searchResult}
                        showInteractions={showInteractions}
                        api={api}
                      />
                    ) : (
                      <div className="trace-result-stats text-muted bg-light">
                        {requested
                          ? "Search Result is Empty..."
                          : "Result Will be displayed here..."}
                      </div>
                    )}
                  </Fragment>
                )}
                {showAllThreads && (
                  <ThreadsTable
                    data={allThreads}
                    showInteractions={showInteractions}
                    api={api}
                    roles={roles}
                    campus={campus}
                  />
                )}
                {showUntraced && (
                  <UntracedTable
                    data={allThreads}
                    showInteractions={showInteractions}
                    api={api}
                    roles={roles}
                    campus={campus}
                  />
                )}
                {showNewThreads && (
                  <NewThreadsTable
                    showMsgProof={showMsgProof}
                    data={newThreads}
                    showInteractions={showInteractions}
                    api={api}
                    roles={roles}
                  />
                )}
                {showNegativeReports && (
                  <NewNegativeThreadsTable
                    data={negativeReports}
                    showNegativeDetails={showNegativeDetails}
                    api={api}
                    roles={roles}
                  />
                )}
                {showNewNegativeReports && (
                  <NewNegativeThreadsTable
                    data={newNegativeReports}
                    showNegativeDetails={showNegativeDetails}
                    api={api}
                    roles={roles}
                  />
                )}
              </div>
            </Fragment>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactTracer;
