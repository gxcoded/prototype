import "../assets/css/SuperAdmin.css";
import "../assets/css/SchoolAdmin.css";
import PsuLogo from "../assets/images/psuLogo.png";
import { Link } from "react-router-dom";
import StaffGuestScan from "./subComponents/StaffGuestScan";
import Subjects from "./subComponents/Subjects";
import StaffAccount from "./subComponents/StaffAccount";
import CredentialsPage from "./subComponents/CredentialsPage";
import TeachingClasses from "./subComponents/TeachingClasses";
import Sections from "./subComponents/Sections";
import Classes from "./Classes";
// import WalkIn from "./subComponents/WalkIn";
import Scanner from "./subComponents/Scanner";
import BounceLoader from "react-spinners/BounceLoader";
import { useState, useEffect, Fragment } from "react";
import LoggedOut from "./LoggedOut";
import axios from "axios";

const Teaching = () => {
  const [loading, setLoading] = useState(true);
  const [accountInfo, setAccountInfo] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [teachingOptions, setTeachingOptions] = useState(false);
  const [guestScan, setGuestScan] = useState(true);
  const [credentials, setCredentials] = useState(false);
  const [subject, setSubject] = useState(false);
  const [account, setAccount] = useState(false);
  const [manual, setManual] = useState(false);
  const [classes, setClasses] = useState(false);
  const [testClass, setTestClass] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [walkIn, setWalkIn] = useState(false);
  const [isChair, setIsChair] = useState(false);
  const [chairInfo, setChairInfo] = useState({});
  const [chairOptions, setChairOptions] = useState(false);
  const [sections, setSections] = useState(false);
  const [url] = useState(process.env.REACT_APP_URL);
  const [assignedRoom] = useState({});
  const [scan, setScan] = useState(false);
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    localStorage.getItem("ctIdToken") !== null && setLoggedIn(true);

    const fetchInfo = async () => {
      const info = await getInfo();
      setIsChair(Object.keys(await chairChecker()).length > 0);
      setAccountInfo(info);
      isAllowed(info._id);
    };

    fetchInfo();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [updated]);

  const reloadPage = () => {
    setUpdated(!updated);
  };

  //status checker
  const isAllowed = async (id) => {
    const response = await requestChecker(id);
    setGuestScan(response);
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
  //check if chairperson
  const chairChecker = async () => {
    const id = localStorage.getItem("ctIdToken");
    const response = await axios.post(`${url}/checkChair`, { account: id });
    setChairInfo(await response.data);
    return await response.data;
  };

  const resetState = (e) => {
    setAccount(false);
    setGuestScan(false);
    setSubject(false);
    toggleLeftBar();
    setManual(false);
    setClasses(false);
    setCredentials(false);
    setWalkIn(false);
    setSections(false);
    setTestClass(false);
    setScan(false);
    document.querySelectorAll(".side-button").forEach((button) => {
      button.classList.remove("activ");
    });

    e.target.classList.add("activ");
  };

  const toggleLeftBar = () => {
    document.querySelector("#navLeft").classList.toggle("shown");
  };

  return (
    <div className="sudo-container">
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
                    <div className="sudo-name me-5">
                      {accountInfo.firstName} {accountInfo.lastName}
                    </div>
                    <div className="sub-name-title">
                      {accountInfo.role.description} Staff
                    </div>
                  </div>
                </div>
                <hr className="mt-3" />
                <div className="links">
                  <ul className="list-group list-group-light">
                    {allowed && (
                      <Fragment>
                        <li className="list-group-item px-4 border-0">
                          <div
                            onClick={(e) => {
                              resetState(e);
                              setGuestScan(true);
                            }}
                            className="side-button activ"
                          >
                            <i className="fas fa-qrcode me-3"></i>Scanner
                          </div>
                        </li>
                        <li className="list-group-item px-4 border-0">
                          <div
                            onClick={(e) => {
                              resetState(e);
                              setScan(true);
                            }}
                            className="side-button"
                          >
                            <i className="fas fa-vector-square me-3"></i>
                            Location Scanner
                          </div>
                        </li>
                      </Fragment>
                    )}
                    {/* <li className="list-group-item px-4 border-0">
                      <div
                        onClick={(e) => {
                          resetState(e);
                          setWalkIn(true);
                        }}
                        className="side-button"
                      >
                        <i className="fas fa-walking me-3"></i>Walk In
                      </div>
                    </li> */}
                  </ul>
                </div>
                {isChair && (
                  <div className="links-bottom mt-2">
                    <hr />
                    <div
                      onClick={() => setChairOptions(!chairOptions)}
                      className="sub-label px-5 collapsible"
                    >
                      <div className="collapse-text">
                        <i className="fas fa-sliders-h me-3"></i>Chair Controls
                      </div>
                      <div className="collapse-text">
                        {chairOptions ? (
                          <i className="fas fa-angle-up"></i>
                        ) : (
                          <i className="fas fa-angle-down"></i>
                        )}
                      </div>
                    </div>
                    {chairOptions && (
                      <ul className="list-group list-group-light">
                        {/* <li className="list-group-item px-4 border-0">
                          <div
                            onClick={(e) => {
                              resetState(e);
                              setSections(true);
                            }}
                            className="side-button"
                          >
                            <i className="me-3 fas fa-puzzle-piece"></i>
                            Sections
                          </div>
                        </li> */}
                        <li className="list-group-item px-4 border-0">
                          <div
                            onClick={(e) => {
                              resetState(e);
                              setSubject(true);
                            }}
                            className="side-button"
                          >
                            <i className="fas fa-cube me-3"></i>Subjects
                          </div>
                        </li>
                      </ul>
                    )}
                  </div>
                )}
                <div className="links-bottom mt-2">
                  <hr />
                  <div
                    onClick={() => setTeachingOptions(!teachingOptions)}
                    className="sub-label px-5 collapsible"
                  >
                    <div className="collapse-text">
                      <i className="fas fa-sliders-h me-3"></i>Teaching
                    </div>
                    <div className="collapse-text">
                      {teachingOptions ? (
                        <i className="fas fa-angle-up"></i>
                      ) : (
                        <i className="fas fa-angle-down"></i>
                      )}
                    </div>
                  </div>
                  {teachingOptions && (
                    <ul className="list-group list-group-light">
                      <li className="list-group-item px-4 border-0">
                        <div
                          onClick={(e) => {
                            resetState(e);
                            setClasses(true);
                          }}
                          className="side-button"
                        >
                          <i className="me-3 fas fa-chalkboard-teacher"></i>
                          Class
                        </div>
                      </li>
                      {/* <li className="list-group-item px-4 border-0">
                        <div
                          onClick={(e) => {
                            resetState(e);
                            setTestClass(true);
                          }}
                          className="side-button"
                        >
                          <i className="me-3 fas fa-chalkboard-teacher"></i>
                          Class Test
                        </div>
                      </li> */}
                    </ul>
                  )}
                </div>
                <div className="links-bottom mt-1">
                  <hr />
                  <div className="sub-label px-5">
                    <i className="fas fa-sliders-h me-3"></i>Account
                  </div>
                  <ul className="list-group list-group-light">
                    <li className="list-group-item px-4 border-0">
                      <div
                        onClick={(e) => {
                          resetState(e);
                          setAccount(true);
                        }}
                        className="side-button"
                      >
                        <i className="far fa-user-circle me-3"></i>Profile
                      </div>
                    </li>
                    <li className="list-group-item px-4 border-0">
                      <div
                        onClick={(e) => {
                          resetState(e);
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
              <div className="sudo-right">
                <div className="sudo-right-top shadow-1">
                  <div className="fw-bold">
                    <i className="text-success fas fa-qrcode me-3 "></i>
                    <span>PSU-Trace</span>
                  </div>
                  <div className="burger-menu  d-flex justify-content-end align-items-center">
                    <div onClick={toggleLeftBar} className="burger-bars p-3">
                      <i className="fas fa-bars"></i>
                    </div>
                  </div>
                </div>
                <div className="sudo-right-main">
                  {guestScan && (
                    <StaffGuestScan
                      assignedRoom={assignedRoom}
                      accountInfo={accountInfo}
                    />
                  )}
                  {/* {walkIn && <WalkIn accountInfo={accountInfo} />} */}
                  {sections && (
                    <Sections
                      accountInfo={accountInfo}
                      courseInfo={chairInfo.course}
                    />
                  )}
                  {subject && (
                    <Subjects
                      accountInfo={accountInfo}
                      courseInfo={chairInfo.course}
                    />
                  )}
                  {/* {
                                attendanceRecord && <StaffAttendanceRecord/>
                            } */}
                  {account && (
                    <StaffAccount
                      accountInfo={accountInfo}
                      reloadPage={reloadPage}
                    />
                  )}
                  {scan && <Scanner accountInfo={accountInfo} />}
                  {classes && <Classes accountInfo={accountInfo} />}
                  {testClass && <TeachingClasses />}
                  {/* {manual && <ManualLog type={"2"} area="" />} */}
                  {credentials && <CredentialsPage accountInfo={accountInfo} />}
                </div>
              </div>
            </Fragment>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default Teaching;
