import "./ClassMeetings.css";
import NewMeeting from "./NewMeeting";
import MeetingLogs from "./MeetingLogs";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";

const ClassMeetings = ({ room, modalToggler }) => {
  const [newMeeting, setNewMeeting] = useState(false);
  const [meetingLogs, setMeetingLogs] = useState(false);
  const [onGoing, setOnGoing] = useState({});
  const [url] = useState(process.env.REACT_APP_URL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeeting();
    setNewMeeting(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const loadMeeting = async () => {
    const meet = await getMeeting();
    setOnGoing(meet);
  };

  const getMeeting = async () => {
    const { data } = await axios.post(`${url}/getMeeting`, {
      classId: room._id,
    });
    console.log(data);
    return data;
  };

  const toggleChosen = (target) => {
    navReset();
    document.querySelectorAll(".meeting-nav").forEach((nav) => {
      nav.classList.remove("chosen");
    });
    target.classList.add("chosen");
  };

  const navReset = () => {
    setNewMeeting(false);
    setMeetingLogs(false);
  };

  return (
    <div className="class-meeting-container">
      {!loading ? (
        <Fragment>
          <div className="class-students-header">
            <div className="class-students-title">
              <i className="fab fa-algolia me-2 "></i>Meetings
            </div>
            <div className="class-students-options">
              <button
                onClick={(e) => {
                  toggleChosen(e.target);
                  setNewMeeting(true);
                }}
                className={`btn-sm meeting-nav chosen`}
              >
                <i className="fas fa-air-freshener me-2"></i>New Meeting
              </button>
              <button
                onClick={(e) => {
                  toggleChosen(e.target);
                  setMeetingLogs(true);
                }}
                className={`btn-sm meeting-nav `}
              >
                <i className="fas fa-book-reader me-2"></i>Meeting Logs
              </button>
            </div>
          </div>
          <hr />
          <div className="class-meeting-main">
            {newMeeting && (
              <NewMeeting
                room={room}
                onGoing={onGoing}
                loadMeeting={loadMeeting}
                modalToggler={modalToggler}
              />
            )}
            {meetingLogs && <MeetingLogs room={room} />}
          </div>
        </Fragment>
      ) : (
        <div>Please wait...</div>
      )}
    </div>
  );
};

export default ClassMeetings;
