import "../subComponents/subCss/ClassRoom.css";
import ClassStudents from "./classes/ClassStudents";
import ClassMeetings from "./classes/ClassMeetings";
import Attendance from "./classes/Attendance";
import Modal from "../modals/Modal";
import { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";

const ClassRoom = ({ room, options }) => {
  const [students, setStudents] = useState(false);
  const [attendance, setAttendance] = useState(false);
  const [meetings, setMeetings] = useState(true);
  const [showExModal, setShowExModal] = useState(false);
  const [showRemarks, setShowRemarks] = useState(false);
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  const [onGoing, setOnGoing] = useState("");
  const [classStudents, setClassStudents] = useState([]);
  const [url] = useState(process.env.REACT_APP_URL);
  const [remarkText, setRemarkText] = useState("");
  const [meeting, setMeeting] = useState("");
  const [student, setStudent] = useState("");
  const [reload, setReload] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const students = await fetchStudentList();
    setClassStudents(students);
  };
  const fetchStudentList = async () => {
    const { data } = await axios.post(`${url}/getClassRoomStudents`, {
      classId: room._id,
    });
    // console.log(data);
    return data;
  };

  const toggleActive = (target) => {
    const links = document.querySelectorAll(".class-nav-links");

    links.forEach((link) => {
      link.classList.remove("nav-active");
    });
    target.classList.add("nav-active");

    resetSelection();
  };

  const resetSelection = () => {
    setStudents(false);
    setMeetings(false);
    setAttendance(false);
  };

  const modalToggler = (id, roomId) => {
    setOnGoing(id);
    setCurrentRoomId(roomId);
    setShowExModal(!showExModal);
  };

  const remarksToggler = (student, meeting) => {
    setMeeting(meeting);
    setStudent(student);

    setShowRemarks(!showRemarks);
  };

  const submitExcuse = async (e) => {
    e.preventDefault();
    if (await excuseSent()) {
      swal("Done!", "Marked as Excused!", "success");
      setShowRemarks(false);
      setRemarkText("");
      reloader();
    }
  };

  const excuseSent = async () => {
    const isSent = await sendExcuse();

    console.log(isSent);
    return isSent;
  };

  const sendExcuse = async () => {
    const { data } = await axios.post(`${url}/addExcuse`, {
      currentRoomId,
      meeting,
      student,
      remarks: remarkText,
    });
    return data;
  };

  const reloader = () => {
    setReload(!reload);
  };
  return (
    <div className="class-room-container position-relative">
      {showRemarks && (
        <div className="remarks-pop">
          <div className="remarks-form">
            <form onSubmit={submitExcuse}>
              <div className="input-group">
                <label>Add Remarks</label>
                <input
                  required
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  type="text"
                  className="form-control"
                />
              </div>
              <div className="input-group mt-4">
                <div
                  onClick={() => remarksToggler()}
                  className="btn btn-warning"
                >
                  Cancel
                </div>
                <button className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showExModal && (
        <Modal
          reload={reload}
          remarkText={remarkText}
          classStudents={classStudents}
          onGoing={onGoing}
          currentRoomId={currentRoomId}
          room={room}
          modalToggler={modalToggler}
          remarksToggler={remarksToggler}
        />
      )}
      <div className="class-room-header ">
        <div className="class-room-header-left">
          <img
            src={`${api}/${room.icon.description}`}
            // src={require(`../../../../server/icons/${room.icon.description}`)}
            alt=""
            className="class-icon-display"
          />
          <div className="class-room-header-text">
            {" "}
            {room.subject.courseCode} - {room.section}
          </div>
          <div className="class-room-header-course-text">
            {/* {room.course.description} */}
          </div>
        </div>
        <div className="class-room-header-right">
          <div className="class-room-header-right-content">
            <div className="selected-display">
              {room.subject.courseDescription}
            </div>
            <nav className="class-nav">
              <div
                onClick={(e) => {
                  toggleActive(e.target);
                  setMeetings(true);
                }}
                className="class-nav-links nav-active"
              >
                <i className="me-2 fas fa-grip-vertical dot-icon"></i>
                Meetings
              </div>
              <div
                onClick={(e) => {
                  toggleActive(e.target);
                  setStudents(true);
                }}
                className="class-nav-links"
              >
                <i className="me-2 fas fa-grip-vertical dot-icon"></i>Students
              </div>
              <div
                onClick={(e) => {
                  toggleActive(e.target);
                  setAttendance(true);
                }}
                className="class-nav-links"
              >
                <i className="me-2 fas fa-grip-vertical dot-icon"></i>Attendance
              </div>
              <div onClick={() => options()} className="class-nav-links">
                <i className="me-2 fas fa-undo dot-icon"></i>
                Previous Page
              </div>
            </nav>
          </div>
        </div>
      </div>
      <div className="class-room-main">
        {students && <ClassStudents room={room} />}
        {meetings && <ClassMeetings modalToggler={modalToggler} room={room} />}
        {attendance && <Attendance room={room} />}
      </div>
    </div>
  );
};

export default ClassRoom;
