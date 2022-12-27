import Image from "../../assets/images/class.png";
import "./subCss/ViewClass.css";
import { useState } from "react";
import NewMeeting from "./classComponents/NewMeeting";
import Meetings from "./classComponents/Meetings";
import Students from "./classComponents/Students";

const ViewClass = ({ title }) => {
  const [newMeeting, setNewMeeting] = useState(true);
  const [meetingLog, setMeetingLog] = useState(false);
  const [students, setStudents] = useState(false);

  const setActive = (element) => {
    document.querySelectorAll(".view-class-nav-link").forEach((link) => {
      link.classList.remove("nav-link-active");
    });

    element.target.classList.add("nav-link-active");
    reset();
  };
  const reset = () => {
    setNewMeeting(false);
    setMeetingLog(false);
    setStudents(false);
  };

  return (
    <div className="view-class-container border">
      <div className="view-class-title">
        <div>
          <img src={Image} alt="993" className="title-img" />
          <span className="view-class-title-text">{title}</span>
        </div>
      </div>
      <div className="view-class-nav">
        <div
          onClick={(e) => {
            setActive(e);
            setNewMeeting(true);
          }}
          className="view-class-nav-link nav-link-active"
        >
          <i className="fas fa-grip-vertical me-2"></i>New Meeting
        </div>
        <div
          onClick={(e) => {
            setActive(e);
            setMeetingLog(true);
          }}
          className="view-class-nav-link"
        >
          <i className="fas fa-grip-vertical me-2"></i>Meetings
        </div>
        <div
          onClick={(e) => {
            setActive(e);
            setStudents(true);
          }}
          className="view-class-nav-link"
        >
          <i className="fas fa-grip-vertical me-2"></i>Students
        </div>
      </div>
      <div className="view-class-main-board">
        {newMeeting && <NewMeeting />}
        {meetingLog && <Meetings />}
        {students && <Students />}
      </div>
    </div>
  );
};

export default ViewClass;
