import "../assets/css/SuperAdmin.css";
import "../assets/css/SchoolAdmin.css";
import PsuLogo from "../assets/images/psuLogo.png";
import { Link } from "react-router-dom";
import StaffAttendanceRecord from "./subComponents/StaffAttendanceRecord";
import SchoolAdminDashboard from "./subComponents/ShoolAdminDashboard";
import ContactTracer from "./subComponents/ContactTracer";
import CredentialsPage from "./subComponents/CredentialsPage";
import StaffQrScan from "./subComponents/StaffQrScan";
import StaffSubjects from "./subComponents/StaffSubjects";
import StaffGuestScan from "./subComponents/StaffGuestScan";
import StaffList from "./subComponents/StaffList";
import StudentList from "./subComponents/StudentLIst";
import CourseList from "./subComponents/CourseList";
import BuildingList from "./subComponents/BuildingList";
import RoomList from "./subComponents/RoomList";
import ManualLog from "./subComponents/ManualLog";
import NotificationMessage from "./subComponents/NotificationMessage";
import BounceLoader from "react-spinners/BounceLoader";
import LoggedOut from "./LoggedOut";
import Departments from "./subComponents/Departments";
import Office from "./subComponents/Offices";
import Chairs from "./subComponents/Chairs";
import Assign from "./subComponents/Assign";
import Messages from "./subComponents/notify/Messages";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import AccountInfo from "./subComponents/AccountInfo";
import Pop from "./modals/Pop";

const SchoolAdmin = () => {
  const [url] = useState(process.env.REACT_APP_URL);
  const [departments, setDepartments] = useState(false);
  const [offices, setOffices] = useState(false);
  const [accountInfo, setAccountInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [courseList, setCourseList] = useState("");
  const [roles, setRoles] = useState([]);
  const [signUpLink, setSignUpLink] = useState(false);
  const [attendanceScan, setAttendanceScan] = useState(false);
  const [guestScan, setGuestScan] = useState(false);
  const [subjects, setSubjects] = useState(false);
  const [adminControl, setAdminControl] = useState(true);
  const [staffControl, setStaffControl] = useState(false);
  const [contactTrace, setContactTrace] = useState(false);
  const [dashboard, setDashboard] = useState(true);
  const [staff, setStaff] = useState(false);
  const [students, setStudents] = useState(false);
  const [courses, setCourses] = useState(false);
  const [building, setBuilding] = useState(false);
  const [rooms, setRooms] = useState(false);
  const [credentials, setCredentials] = useState(false);
  const [manual, setManual] = useState(false);
  const [attendanceRecord, setAttendanceRecord] = useState(false);
  const [notification, setNotification] = useState(false);
  const [chairs, setChairs] = useState(false);
  const [assign, setAssign] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showMsgs, setShowMsgs] = useState(false);
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  const [currentPerson, setCurrentPerson] = useState({});
  const [currentState, setCurrentState] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const [accountSettings, setAccountSettings] = useState(false);
  const [showPopModal, setShowPopModal] = useState(false);

  const popModalToggler = () => {
    setShowPopModal(!showPopModal);
  };

  useEffect(() => {
    const date = new Date().toISOString().slice(0, 10);

    console.log(new Date(date).getTime());
    console.log(Date.now().toString());
    console.log(new Date(1670198400000 - 28800000));
    localStorage.getItem("ctIdToken") !== null && setLoggedIn(true);

    fetchInfo();

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const reloadAccountInfo = () => {
    fetchInfo();
  };
  const fetchInfo = async () => {
    const info = await getInfo();
    const fetchedCourses = await fetchCourses(info.campus._id);
    const fetchedRoles = await fetchRoles();

    setAccountInfo(info);
    setCourseList(fetchedCourses);
    setRoles(fetchedRoles);

    // setInterval(() => {
    //   msgReload(info.campus._id);
    // }, 1000);
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
  const fetchCourses = async (campusId) => {
    const response = await axios.post(`${url}/courseList`, {
      campus: campusId,
    });

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
    setGuestScan(false);
    setSubjects(false);
    setAttendanceScan(false);
    setContactTrace(false);
    setDashboard(false);
    setStaff(false);
    setStudents(false);
    setCourses(false);
    setBuilding(false);
    setRooms(false);
    setCredentials(false);
    toggleLeftBar();
    setAttendanceRecord(false);
    setManual(false);
    setNotification(false);
    setSignUpLink(false);
    setDepartments(false);
    setOffices(false);
    setChairs(false);
    setAssign(false);
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
                {/* <hr className="mt-3" /> */}
                {/* <div className="links">
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
                  </ul>
                </div> */}
                <div className="links">
                  <hr />
                  <div
                    onClick={() => setAdminControl(!adminControl)}
                    className="sub-label px-5 collapsible"
                  >
                    <div className="collapse-text">
                      <i className="fas fa-sliders-h me-3"></i>Campus Management
                    </div>
                    <div className="collapse-text">
                      {adminControl ? (
                        <i className="fas fa-angle-up"></i>
                      ) : (
                        <i className="fas fa-angle-down"></i>
                      )}
                    </div>
                  </div>
                  {adminControl && (
                    <ul className="list-group list-group-light">
                      <li className="list-group-item px-4 border-0 ">
                        <div
                          onClick={(e) => {
                            toggleActive(e);
                            setDashboard(true);
                          }}
                          className="side-button activ"
                        >
                          <i className="fas fa-table me-3"></i>Dashboard
                        </div>
                      </li>

                      <li className="list-group-item px-4 border-0">
                        <div
                          onClick={(e) => {
                            toggleActive(e);
                            setCourses(true);
                          }}
                          className="side-button"
                        >
                          <i className="fas fa-book-reader me-3"></i>Courses
                        </div>
                      </li>
                      <li className="list-group-item px-4 border-0">
                        <div
                          onClick={(e) => {
                            toggleActive(e);
                            setDepartments(true);
                          }}
                          className="side-button"
                        >
                          <i className="fas fa-fax me-3"></i>Departments
                        </div>
                      </li>
                      <li className="list-group-item px-4 border-0">
                        <div
                          onClick={(e) => {
                            toggleActive(e);
                            setOffices(true);
                          }}
                          className="side-button"
                        >
                          <i className="fas fa-swatchbook me-3"></i>Offices
                        </div>
                      </li>
                      {/* <li className="list-group-item px-4 border-0">
                        <div
                          onClick={(e) => {
                            toggleActive(e);
                            setBuilding(true);
                          }}
                          className="side-button"
                        >
                          {" "}
                          <i className="fas fa-city me-3"></i>Buildings
                        </div>
                      </li> */}

                      <li className="list-group-item px-4 border-0">
                        <div
                          onClick={(e) => {
                            toggleActive(e);
                            setRooms(true);
                          }}
                          className="side-button"
                        >
                          <i className="fas fa-puzzle-piece me-3"></i>Locations
                        </div>
                      </li>
                      <li className="list-group-item px-4 border-0">
                        <div
                          onClick={(e) => {
                            toggleActive(e);
                            setNotification(true);
                          }}
                          className="side-button"
                        >
                          <i className="fas fa-bell me-3"></i>Notification
                          Message
                        </div>
                      </li>
                    </ul>
                  )}
                </div>
                <div className="links-bottom mt-2">
                  <hr />
                  <div
                    onClick={() => setStaffControl(!staffControl)}
                    className="sub-label px-5 collapsible"
                  >
                    <div className="collapse-text">
                      <i className="fas fa-sliders-h me-2"></i>Account
                      Management
                    </div>
                    <div className="collapse-text">
                      {staffControl ? (
                        <i className="fas fa-angle-up"></i>
                      ) : (
                        <i className="fas fa-angle-down"></i>
                      )}
                    </div>
                  </div>
                  {staffControl && (
                    <ul className="list-group list-group-light">
                      <li className="list-group-item px-4 border-0">
                        <div
                          onClick={(e) => {
                            toggleActive(e);
                            setChairs(true);
                          }}
                          className="side-button"
                        >
                          <i className="fas fa-user-tag me-3"></i>
                          Chairpersons
                        </div>
                      </li>
                      <li className="list-group-item px-4 border-0">
                        <div
                          onClick={(e) => {
                            toggleActive(e);
                            setStaff(true);
                          }}
                          className="side-button"
                        >
                          <i className="fas fa-users me-3"></i>Staff
                        </div>
                      </li>
                      <li className="list-group-item px-4 border-0">
                        <div
                          onClick={(e) => {
                            toggleActive(e);
                            setStudents(true);
                          }}
                          className="side-button"
                        >
                          <i className="fas fa-user-graduate me-3"></i>Students
                        </div>
                      </li>
                      <li className="list-group-item px-4 border-0">
                        <div
                          onClick={(e) => {
                            toggleActive(e);
                            setAssign(true);
                          }}
                          className="side-button"
                        >
                          <i className="fab fa-trello me-3"></i>Designate Scan
                          Location
                        </div>
                      </li>
                    </ul>
                  )}
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
                  <div>
                    <i className="fas fa-qrcode me-3 "></i>
                    <span>PSU-Trace</span>
                  </div>
                  {/* <div
                    onClick={() => msgToggler()}
                    className={`notification-link d-flex align-items-center ${
                      messages.length > 0 && "bold-notif"
                    }`}
                  >
                    <i className="fas fa-bell me-2 "></i>
                    <span>Notification</span>
                    {messages.length > 0 && (
                      <span className="notification-counter mx-2">
                        {messages.length}
                      </span>
                    )}
                  </div> */}
                  <div className="burger-menu  d-flex justify-content-end align-items-center">
                    <div onClick={toggleLeftBar} className="burger-bars p-3">
                      <i className="fas fa-bars"></i>
                    </div>
                  </div>
                </div>
                <div className="sudo-right-main">
                  {/* {contactTrace && (
                    <ContactTracer
                      campus={accountInfo.campus._id}
                      roles={roles}
                      showMsgProof={showMsgProof}
                    />
                  )} */}
                  {dashboard && (
                    <SchoolAdminDashboard accountInfo={accountInfo} />
                  )}
                  {accountSettings && (
                    <AccountInfo
                      popModalToggler={popModalToggler}
                      accountInfo={accountInfo}
                      reloadAccountInfo={reloadAccountInfo}
                    />
                  )}
                  {departments && (
                    <Departments campus={accountInfo.campus._id} />
                  )}
                  {offices && <Office campus={accountInfo.campus._id} />}
                  {attendanceScan && <StaffQrScan />}
                  {manual && <ManualLog />}
                  {staff && (
                    <StaffList roles={roles} accountInfo={accountInfo} />
                  )}
                  {subjects && <StaffSubjects />}
                  {students && (
                    <StudentList
                      campus={accountInfo.campus}
                      courseList={courseList}
                    />
                  )}
                  {chairs && <Chairs accountInfo={accountInfo} />}
                  {assign && <Assign accountInfo={accountInfo} />}
                  {guestScan && <StaffGuestScan />}
                  {courses && <CourseList accountInfo={accountInfo} />}
                  {building && <BuildingList campus={accountInfo.campus._id} />}
                  {rooms && (
                    <RoomList
                      mapToggler={mapToggler}
                      campus={accountInfo.campus._id}
                    />
                  )}
                  {credentials && <CredentialsPage accountInfo={accountInfo} />}
                  {attendanceRecord && <StaffAttendanceRecord />}
                  {notification && (
                    <NotificationMessage campus={accountInfo.campus._id} />
                  )}
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
