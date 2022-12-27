import "../assets/css/SuperAdmin.css";
import "../assets/css/SchoolAdmin.css";
import PsuLogo from "../assets/images/psuLogo.png";
import { Link } from "react-router-dom";
import ContactTracer from "./subComponents/ContactTracer";
import CredentialsPage from "./subComponents/CredentialsPage";
import BounceLoader from "react-spinners/BounceLoader";
import LoggedOut from "./LoggedOut";
import Messages from "./subComponents/notify/Messages";
import MapContainer from "./map/MapContainer";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import Chats from "./subComponents/Chats";
import AccountInfo from "./subComponents/AccountInfo";
import Pop from "./modals/Pop";

const SchoolAdmin = () => {
  const [url] = useState(process.env.REACT_APP_URL);
  const [accountInfo, setAccountInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [roles, setRoles] = useState([]);
  const [contactTrace, setContactTrace] = useState(true);
  const [credentials, setCredentials] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showMsgs, setShowMsgs] = useState(false);
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  const [currentPerson, setCurrentPerson] = useState({});
  const [currentState, setCurrentState] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const [notification, setNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [chat, setChat] = useState(false);
  const [newChatCount, setNewChatCount] = useState(0);
  const [newNotificationCounter, setNewNotificationCounter] = useState(0);
  const [hideNotify, setHideNotify] = useState(true);
  const [accountSettings, setAccountSettings] = useState(false);
  const [showPopModal, setShowPopModal] = useState(false);

  const popModalToggler = () => {
    setShowPopModal(!showPopModal);
  };

  useEffect(() => {
    localStorage.getItem("ctIdToken") !== null && setLoggedIn(true);

    fetchInfo();

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  const fetchInfo = async () => {
    const info = await getInfo();
    const fetchedRoles = await fetchRoles();

    setAccountInfo(info);
    loadNewChats(info);
    setRoles(fetchedRoles);
    loadNotifications(info._id);

    // setInterval(() => {
    //   msgReload(info.campus._id);
    // }, 1000);
  };
  const reloadAccountInfo = () => {
    fetchInfo();
  };

  const notifyToggler = () => {
    setHideNotify(!hideNotify);
  };

  // notifications
  const loadNotifications = async (id) => {
    const notificationList = await fetchNotifications(id);

    setNotifications(notificationList);
    countNewNotifications(notificationList);
  };

  const fetchNotifications = async (id) => {
    const { data } = await axios.post(`${url}/getMyNotifications`, {
      id,
    });

    console.log(id);
    return data;
  };

  const countNewNotifications = (notes) => {
    let counter = 0;
    notes.forEach((note) => {
      if (!note.seen) {
        console.log("Note");
        counter++;
        setNewNotificationCounter(counter);
      }
    });
    setNewNotificationCounter(counter);
  };
  const sendUpdateRequest = async (id) => {
    const updated = await updateNotificationStatus(id);
    loadNotifications(accountInfo._id);
  };

  const updateNotificationStatus = async (id) => {
    const { data } = await axios.post(`${url}/updateNotificationStatus`, {
      id,
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
  //chat count
  const loadNewChats = async (info) => {
    const total = await fetchNewChats(info);
    setNewChatCount(total);
  };

  const fetchNewChats = async (info) => {
    const { data } = await axios.post(`${url}/newChatCounter`, {
      account: info._id,
    });

    return data;
  };
  //messages
  const msgReload = async (id) => {
    const fetchedMessages = await fetchMessages(id);
    console.log(id);
    setMessages(fetchedMessages);
  };

  const fetchMessages = async (id) => {
    const { data } = await axios.post(`${url}/countNewMessages`, {
      campus: id,
    });

    return data;
  };

  //get account Information
  const getInfo = async () => {
    const id = localStorage.getItem("ctIdToken");
    const response = await axios.post(`${url}/accountInfo`, { id: id });

    return await response.data;
  };

  //Fetch Courses
  const fetchRoles = async () => {
    const response = await axios.get(`${url}/getRole`);
    return await response.data;
  };

  const toggleActive = (e) => {
    reset();
    document.querySelectorAll(".side-button").forEach((btn) => {
      btn.classList.remove("activ");
    });

    e.target.classList.add("activ");
  };

  const msgToggler = (state) => {
    setCurrentState(state);
    setShowMsgs(!showMsgs);
  };

  const showMsgProof = (list) => {
    setCurrentPerson(list);
    setShowMsgs(true);
    // setContactTrace(false);

    // setTimeout(() => {
    //   setContactTrace(true);
    // }, 500);
  };
  const mapToggler = () => {
    setShowMap(!showMap);
  };

  const reset = () => {
    setContactTrace(false);
    setCredentials(false);
    toggleLeftBar();
    setNotification(false);
    setChat(false);
    setAccountSettings(false);
  };
  const toggleLeftBar = () => {
    document.querySelector("#navLeft").classList.toggle("shown");
  };
  return (
    <div className="sudo-container school-admin-container">
      {showPopModal && (
        <Pop
          accountInfo={accountInfo}
          popModalToggler={popModalToggler}
          reloadAccountInfo={reloadAccountInfo}
        />
      )}
      {/* {showMap && <MapContainer mapToggler={mapToggler} />} */}
      {loading ? (
        <div className="spinner border loader-effect">
          <BounceLoader color="#5dcea1" loading={loading} size={150} />
        </div>
      ) : (
        <Fragment>
          {!loggedIn ? (
            <LoggedOut />
          ) : (
            <Fragment>
              <div id="navLeft" className="sudo-left">
                <div className="sudo-left-header">
                  <div className="img-top">
                    <img className="logo-top" src={PsuLogo} alt="logo" />
                  </div>
                  <div className="psu-title text-center mt-2">
                    Pangasinan State University
                  </div>
                  <div className="psu-sub-text text-center mt-2">
                    {accountInfo.campus.campusName} Campus
                  </div>
                </div>
                <hr className="mt-5" />
                <div className="admin-label my-4">
                  <img
                    src={`${api}/${accountInfo.image}`}
                    alt="img"
                    className="me-3"
                  />
                  <div className="label-container">
                    <div className="sudo-name me-5">{`${accountInfo.firstName} ${accountInfo.lastName}`}</div>
                    <div className="sub-name-title">
                      Campus {accountInfo.role.description}
                    </div>
                  </div>
                </div>
                <hr className="mt-3" />
                <div className="links">
                  <ul className="list-group list-group-light">
                    <li className="list-group-item px-4 border-0">
                      <div
                        onClick={(e) => {
                          toggleActive(e);
                          setContactTrace(true);
                        }}
                        className="ct-nav-btn  side-button activ"
                      >
                        <span className="">
                          <i className="fas fa-street-view me-3"></i>Contact
                          Tracer
                        </span>
                        {messages.length > 0 && (
                          <span className="notification-counter">
                            {messages.length}
                          </span>
                        )}
                      </div>
                    </li>
                    <li className="list-group-item px-4 border-0">
                      <div
                        onClick={(e) => {
                          toggleActive(e);
                          setChat(true);
                        }}
                        className="ct-nav-btn  side-button"
                      >
                        <span className="">
                          <i className="fab fa-rocketchat me-3"></i>Chats{" "}
                        </span>
                        {newChatCount > 0 && (
                          <span className="chat-count-display border">
                            {newChatCount}
                          </span>
                        )}
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="links-bottom mt-2">
                  <hr />
                  <div className="sub-label px-5">
                    <i className="fas fa-sliders-h me-3"></i>Options
                  </div>
                  <ul className="list-group list-group-light">
                    <li className="list-group-item px-4 border-0">
                      <div
                        onClick={(e) => {
                          toggleActive(e);
                          setAccountSettings(true);
                        }}
                        className="side-button"
                      >
                        <i className="fas fa-user-cog me-3"></i>Account Info
                      </div>
                    </li>
                    <li className="list-group-item px-4 border-0">
                      <div
                        onClick={(e) => {
                          toggleActive(e);
                          setCredentials(true);
                        }}
                        className="side-button"
                      >
                        <i className="fas fa-cogs me-3"></i>Credentials
                      </div>
                    </li>
                    <li className="list-group-item px-4 border-0">
                      <Link to="/login">
                        <div className="side-button">
                          <i className="fas fa-sign-out-alt me-3"></i>Logout
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="sudo-right bg-light s-admin-right">
                {showMsgs && (
                  <Messages
                    accountInfo={accountInfo}
                    msgToggler={msgToggler}
                    msgReload={msgReload}
                    currentPerson={currentPerson}
                    currentState={currentState}
                  />
                )}
                <div className="sudo-right-top sa-right-top">
                  <div
                    onClick={() => notifyToggler()}
                    className={`notification-link d-flex align-items-center ${
                      newNotificationCounter > 0 && "bold-notif"
                    }`}
                  >
                    <i className="fas fa-bell me-2 "></i>
                    <span>Notification</span>
                    {newNotificationCounter > 0 && (
                      <span className="notification-counter mx-2">
                        {newNotificationCounter}
                      </span>
                    )}
                  </div>
                  <div className="burger-menu  d-flex justify-content-end align-items-center">
                    <div onClick={toggleLeftBar} className="burger-bars p-3">
                      <i className="fas fa-bars"></i>
                    </div>
                  </div>
                </div>
                {/* ======Notify Card====== */}
                <div
                  className={`notifications-pop-section ${
                    hideNotify && "hide-notify"
                  }`}
                >
                  <div className="notification-pop-block">
                    <div className="notification-pop-header border-bottom">
                      <span
                        onClick={() => {
                          notifyToggler();
                          sendUpdateRequest(accountInfo._id);
                          loadNotifications(accountInfo.id);
                        }}
                        className="pop-closer"
                      >
                        <i className="fas fa-times"></i>
                      </span>
                    </div>
                    {notifications.length > 0 ? (
                      notifications.map((note) => (
                        <div
                          key={note._id}
                          className="notification-pop-list bg-light"
                        >
                          {" "}
                          <i className="fas fa-bell text-warning fw-bold me-2"></i>
                          {note.text}
                          <div className="notif-date mt-2  fw-bold">
                            {dateFormatter(note.dateSent)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="fst-italic p-4 fw-bold">
                        No Notifications Yet
                      </div>
                    )}
                  </div>
                </div>
                <div className="sudo-right-main">
                  {contactTrace && (
                    <ContactTracer
                      campus={accountInfo.campus._id}
                      roles={roles}
                      showMsgProof={showMsgProof}
                    />
                  )}
                  {accountSettings && (
                    <AccountInfo
                      popModalToggler={popModalToggler}
                      accountInfo={accountInfo}
                      reloadAccountInfo={reloadAccountInfo}
                    />
                  )}

                  {credentials && <CredentialsPage accountInfo={accountInfo} />}
                  {chat && <Chats accountInfo={accountInfo} />}
                </div>
              </div>
            </Fragment>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default SchoolAdmin;
