import "../assets/css/Student.css";
import "../assets/css/SuperAdmin.css";
import { Fragment } from "react";
import PsuLogo from "../assets/images/psuLogo.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import QrCodeDisplay from "./QrCodeDisplay";
import LoggedOut from "./LoggedOut";
import Profile from "./subComponents/Profile";
import CredentialsPage from "./subComponents/CredentialsPage";
import BounceLoader from "react-spinners/BounceLoader";
import Movement from "./subComponents/Movement";
import Positive from "./subComponents/Positive";
import Negative from "./subComponents/Negative";
import Scanner from "./subComponents/Scanner";
import ChatNurse from "./subComponents/ChatNurse";
import Pop from "./modals/Pop";
import swal from "sweetalert";

const Student = ({ vaxStatsList, genderList }) => {
  const [accountInfo, setAccountInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [profile, setProfile] = useState(true);
  const [credentials, setCredentials] = useState(false);
  const [movements, setMovements] = useState(false);
  const [positive, setPositive] = useState(false);
  const [negative, setNegative] = useState(false);
  const [scan, setScan] = useState(false);
  const [url] = useState(process.env.REACT_APP_URL);
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  const [allowed, setAllowed] = useState(false);
  const [chat, setChat] = useState(false);
  const [hideNotify, setHideNotify] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [newNotificationCounter, setNewNotificationCounter] = useState(0);
  const [showNotice, setShowNotice] = useState(false);
  const [showPopModal, setShowPopModal] = useState(false);

  useEffect(() => {
    localStorage.getItem("ctIdToken") !== null && setLoggedIn(true);

    fetchInfo();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const fetchInfo = async () => {
    const info = await getInfo();
    console.log(info);
    setAccountInfo(info);
    isAllowed(info._id);
    loadNotifications(info._id);
  };

  const reloadAccountInfo = () => {
    fetchInfo();
  };

  const popModalToggler = () => {
    setShowPopModal(!showPopModal);
  };

  const notifyToggler = () => {
    setHideNotify(!hideNotify);
  };
  //status checker
  const isAllowed = async (id) => {
    const response = await requestChecker(id);

    setAllowed(response);
  };

  const requestChecker = async (id) => {
    const { data } = await axios.post(`${url}/statusChecker`, {
      id,
    });

    return data;
  };

  //get account Information
  const getInfo = async () => {
    const id = localStorage.getItem("ctIdToken");
    const response = await axios.post(`${url}/accountInfo`, { id: id });

    return await response.data;
  };

  const toggleActive = (e) => {
    document.querySelectorAll(".side-button").forEach((btn) => {
      btn.classList.remove("activ");
    });

    e.target.classList.add("activ");
    setProfile(false);
    setCredentials(false);
    setMovements(false);
    setPositive(false);
    setScan(false);
    setChat(false);
    setNegative(false);
    toggleLeftBar();
  };

  const toggleLeftBar = () => {
    document.querySelector("#navLeft").classList.toggle("shown");
  };

  const notAllowedAlert = () => {
    swal("Not Allowed!", "You are not allowed to use this Feature!", "warning");
  };

  const loadNotifications = async (id) => {
    const notificationList = await fetchNotifications(id);
    notice(notificationList);
    setNotifications(notificationList);
    countNewNotifications(notificationList);
  };

  const fetchNotifications = async (id) => {
    const { data } = await axios.post(`${url}/getMyNotifications`, {
      id,
    });

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

  const notice = (notification) => {
    const now = Number(Date.now().toString());

    if (notification.length > 0) {
      const count = Math.floor(
        (now - Number(notification[0].dateSent)) / 86400000
      );
      console.log(count);
      count < 7 && setShowNotice(true);
    }
  };

  return (
    <div className="sudo-container">
      {showPopModal && (
        <Pop
          accountInfo={accountInfo}
          popModalToggler={popModalToggler}
          reloadAccountInfo={reloadAccountInfo}
        />
      )}
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
                <div className="nav-collapse">
                  <div onClick={toggleLeftBar} className="nav-collapse-btn">
                    <i className="fas fa-times"></i>
                  </div>
                </div>
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
                    <div className="sudo-name me-5">
                      {" "}
                      {`${accountInfo.firstName} ${accountInfo.lastName}`}
                    </div>
                    <div className="sub-name-title">
                      {accountInfo.role.description}
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
                          setProfile(true);
                        }}
                        className="side-button activ"
                      >
                        <i className="fas fa-id-card-alt me-3"></i>Profile
                      </div>
                    </li>
                    <li className="list-group-item px-4 border-0">
                      <div
                        onClick={(e) => {
                          if (allowed) {
                            toggleActive(e);
                            setScan(true);
                          } else {
                            notAllowedAlert();
                          }
                        }}
                        className="side-button"
                      >
                        <i className="fas fa-vector-square me-3"></i>Scanner2
                      </div>
                    </li>
                    <li className="list-group-item px-4 border-0">
                      <div
                        onClick={(e) => {
                          toggleActive(e);
                          setMovements(true);
                        }}
                        className="side-button"
                      >
                        <i className="fas fa-history me-3"></i>Logs
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
                          <i className="fab fa-rocketchat me-3"></i>Chat Campus
                          Nurse
                        </span>
                      </div>
                    </li>
                    <li className="list-group-item px-4 border-0">
                      <div
                        onClick={(e) => {
                          toggleActive(e);
                          setPositive(true);
                        }}
                        className="side-button"
                      >
                        <i className="text-danger fas fa-prescription me-3"></i>
                        I'm Covid Positive
                      </div>
                    </li>
                    <li className="list-group-item px-4 border-0">
                      <div
                        onClick={(e) => {
                          toggleActive(e);
                          setNegative(true);
                        }}
                        className="side-button"
                      >
                        <i className="text-success fas fa-hand-holding-heart me-3"></i>
                        Negative Test Result
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="links-bottom mt-5">
                  <hr />
                  <div className="sub-label px-5">
                    <i className="fas fa-sliders-h me-3"></i>Options
                  </div>
                  <ul className="list-group list-group-light">
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
              <div className="sudo-right bg-light">
                <div className="sudo-right-top">
                  {/* <div>
                    <i className="fas fa-qrcode me-3 "></i>
                    <span>PSU-Trace</span>
                  </div> */}
                  <div
                    onClick={() => notifyToggler()}
                    className="notification-link d-flex align-items-center"
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
                {profile && (
                  // super-admin-css
                  <div
                    className={`sudo-right-main override notify-override 
                    }`}
                  >
                    {/* <SvgDisplay /> */}
                    <div className="profile-container">
                      <div className="student-main">
                        <div className="student-profile">
                          <div className="student-profile-left">
                            <div className="profile-upper-section">
                              <div className="profile-name">
                                <img
                                  onClick={() => popModalToggler()}
                                  src={`${api}/${accountInfo.image}`}
                                  alt="profile"
                                  className="profile-image pointer"
                                />
                                <div className="profile-text-display">
                                  {`${accountInfo.firstName} ${accountInfo.lastName}`}
                                </div>
                                <div className="profile-id-display">
                                  {accountInfo.idNumber}
                                </div>

                                <div className="profile-status mt-4 ">
                                  {accountInfo.allowed ? (
                                    <div className="status-content text-success">
                                      Allowed{" "}
                                      <i className="ms-2 fas fa-thumbs-up"></i>
                                    </div>
                                  ) : (
                                    <div className="status-content text-danger">
                                      Not Allowed{" "}
                                      <i className="ms-2 fas fa-times"></i>
                                    </div>
                                  )}
                                </div>
                                {showNotice && (
                                  <div
                                    className="border  notice-stats p-2 rounded text-warning"
                                    style={{
                                      fontSize: ".9rem",
                                      fontWeight: "500",
                                      maxWidth: "300px",
                                    }}
                                  >
                                    You've been identified as close contact in
                                    the last 7 days. If you feel any symptoms of
                                    COVID-19 within the next few days, you are
                                    advised to take a COVID-19 Test.
                                    <br />
                                    This notification will disappear in 7 days.
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="student-profile-right shadow-0">
                            <QrCodeDisplay value={accountInfo._id} />
                          </div>
                        </div>
                      </div>
                      <Profile
                        accountInfo={accountInfo}
                        vaxStatsList={vaxStatsList}
                        genderList={genderList}
                        type={1}
                      />
                    </div>
                  </div>
                )}
                {credentials && <CredentialsPage accountInfo={accountInfo} />}
                {chat && <ChatNurse accountInfo={accountInfo} />}
                {scan && <Scanner accountInfo={accountInfo} />}
                {movements && <Movement accountInfo={accountInfo} />}
                {positive && <Positive accountInfo={accountInfo} />}
                {negative && <Negative accountInfo={accountInfo} />}
              </div>
            </Fragment>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default Student;
