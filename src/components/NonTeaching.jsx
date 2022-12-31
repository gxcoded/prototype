import "../assets/css/SuperAdmin.css";
import "../assets/css/SchoolAdmin.css";
import PsuLogo from "../assets/images/psuLogo.png";
import { Link } from "react-router-dom";
import StaffGuestScan from "./subComponents/StaffGuestScan";
import StaffAccount from "./subComponents/StaffAccount";
import ManualLog from "./subComponents/ManualLog";
import CredentialsPage from "./subComponents/CredentialsPage";
import BounceLoader from "react-spinners/BounceLoader";
import WalkIn from "./subComponents/WalkIn";
import Scanner from "./subComponents/Scanner";
import { useState, useEffect, Fragment } from "react";
import LoggedOut from "./LoggedOut";
import axios from "axios";

const NonTeaching = () => {
  const [loading, setLoading] = useState(true);
  const [accountInfo, setAccountInfo] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [url] = useState(process.env.REACT_APP_URL);
  const [guestScan, setGuestScan] = useState(true);
  const [credentials, setCredentials] = useState(false);
  const [account, setAccount] = useState(false);
  const [manual, setManual] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [walkIn, setWalkIn] = useState(false);
  const [assignedRoom, setAssignedRoom] = useState({});
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  const [allowed, setAllowed] = useState(false);
  const [scan, setScan] = useState(false);
  const [isEntrance, setIsEntrance] = useState(false);

  useEffect(() => {
    localStorage.getItem("ctIdToken") !== null && setLoggedIn(true);

    const fetchInfo = async () => {
      const info = await getInfo();
      console.log(info);
      setAccountInfo(info);
      checkAssigned(info);
    };

    fetchInfo();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [updated]);

  const checkAssigned = async (account) => {
    const entrance = "Entrance";
    const data = await fetchAssignedRoom(account);
    if (Object.keys(data).length > 0) {
      setIsEntrance(
        data.room.description.toString().toLowerCase() ===
          entrance.toLowerCase()
      );
    }
    setAssignedRoom(data);
  };

  const fetchAssignedRoom = async (accountInformation) => {
    const { data } = await axios.post(`${url}/checkAssignedRoom`, {
      account: accountInformation._id,
    });
    console.log(data);
    return data;
  };
  const reloadPage = () => {
    setUpdated(!updated);
  };

  //get account Information
  const getInfo = async () => {
    const id = localStorage.getItem("ctIdToken");
    const response = await axios.post(`${url}/accountInfo`, { id: id });

    return await response.data;
  };

  const resetState = (e) => {
    setAccount(false);
    setGuestScan(false);
    toggleLeftBar();
    setManual(false);
    setCredentials(false);
    setWalkIn(false);
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
                        <i className="fas fa-vector-square me-3"></i>Location
                        Scanner
                      </div>
                    </li>
                    {isEntrance && (
                      <li className="list-group-item px-4 border-0">
                        <div
                          onClick={(e) => {
                            resetState(e);
                            setWalkIn(true);
                          }}
                          className="side-button"
                        >
                          <i className="fas fa-walking me-3"></i>Walk In
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
                <div className="links-bottom mt-5">
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
                  {walkIn && <WalkIn accountInfo={accountInfo} />}
                  {account && (
                    <StaffAccount
                      accountInfo={accountInfo}
                      reloadPage={reloadPage}
                    />
                  )}
                  {scan && <Scanner accountInfo={accountInfo} />}
                  {manual && <ManualLog type={"2"} area="" />}
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

export default NonTeaching;
