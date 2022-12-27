import "./AttendanceReport.css";
import { useState, useEffect } from "react";
import LoggedOut from "../../LoggedOut";
import Image from "../../../assets/images/psHeader.png";
import axios from "axios";

const AttendanceReport = () => {
  let arrayList = [];
  const [minute] = useState(60000);
  const [attendance, setAttendance] = useState([]);
  const [url] = useState(process.env.REACT_APP_URL);
  const [meetings, setMeetings] = useState([]);
  const [students, setStudents] = useState();
  const [preview, setPreview] = useState(true);
  const [filteredMeetings, setFilteredMeeting] = useState([]);
  const [excusedList, setExcusedList] = useState([]);
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("ctIdToken") !== null
  );
  const [printable, setPrintable] = useState(
    localStorage.getItem("printInfo") !== null
  );

  const [printDetails, setPrintDetails] = useState({});

  useEffect(() => {
    if (printable) {
      const printInfo = JSON.parse(localStorage.getItem("printInfo"));

      setPrintDetails(printInfo);
      loadMeetingList();
      loadStudents();
      loadExcusedStudents(printInfo.room);
    }
    // loggedIn && window.print();
  }, []);

  // ======excuses

  const loadExcusedStudents = async (room) => {
    const excused = await fetchExcusedStudents(room);
    setExcusedList(excused);
  };

  const fetchExcusedStudents = async (room) => {
    const { data } = await axios.post(`${url}/getExcusedStudents`, {
      classRoomId: room,
    });
    console.log(data);
    return data;
  };

  const printNow = () => {
    setPreview(false);

    setTimeout(() => {
      window.print();
    }, 500);
  };

  window.onafterprint = () => {
    setPreview(true);
  };

  const loadMeetingList = async () => {
    const info = JSON.parse(localStorage.getItem("printInfo"));
    let array = [];
    const meetingList = await fetchMeetingList();

    meetingList.forEach(async (meet) => {
      await fetchAttendance(meet._id);
    });

    if (!info.from || !info.to) {
      setFilteredMeeting(meetingList);
    } else {
      meetingList.forEach((m) => {
        const currentVal = Number(new Date(info.to).getTime()) + 79200000;

        if (
          Number(m.date) <= currentVal &&
          Number(m.date) >= Number(new Date(info.from).getTime())
        ) {
          array.push(m);
          console.log(array);
          setFilteredMeeting(array);
        }
      });
    }

    setMeetings(meetingList);
  };

  const fetchMeetingList = async () => {
    const info = JSON.parse(localStorage.getItem("printInfo"));
    const { data } = await axios.post(`${url}/getMeetingList`, {
      classId: info.room,
    });

    return data;
  };

  const compare = (current, next) => {
    if (current.student.lastName < next.student.lastName) {
      return -1;
    }
    if (current.student.lastName > next.student.lastName) {
      return 1;
    }
    return 0;
  };

  const loadStudents = async () => {
    const studentList = await fetchStudentList();

    setStudents(studentList.sort(compare));
  };

  const fetchStudentList = async () => {
    const info = JSON.parse(localStorage.getItem("printInfo"));
    const { data } = await axios.post(`${url}/getClassRoomStudents`, {
      classId: info.room,
    });
    return data;
  };

  const checkDuration = () => {
    const info = JSON.parse(localStorage.getItem("printInfo"));
    if (!info.from || !info.to) {
      return "All Meetings";
    } else {
      return `${info.from} to ${info.to}`;
    }
  };

  const fetchAttendance = async (id) => {
    const { data } = await axios.post(`${url}/allAttendance`, {
      id,
    });

    data.forEach((d) => {
      arrayList.push(d);
      console.log(arrayList);
      setAttendance(arrayList);
    });
  };

  const checker = (s, m, start) => {
    let isPresent = {
      timeIn: "--",
      timeOut: "--",
      present: "Absent",
      remarks: "--",
    };

    attendance.forEach((a) => {
      if (a.accountScanned === s && a.meeting === m) {
        isPresent.timeIn = `${new Date(Number(a.start))
          .toString()
          .slice(16, 25)}`;
        isPresent.timeOut = `${new Date(Number(a.end))
          .toString()
          .slice(16, 25)}`;
        isPresent.present = `Present`;
        if (Number(start) < Number(a.start)) {
          isPresent.remarks = "( Late )";
        }
        console.log(start);
        console.log(a.start);
      }
    });

    excusedList.forEach((ex) => {
      if (ex.student === s && ex.meeting === m) {
        isPresent.present = "Excused";
        isPresent.remarks = ex.remarks;
      }
    });

    return isPresent;
  };

  return (
    <div className="attendance-report-container">
      {!loggedIn ? (
        <LoggedOut />
      ) : (
        <div className={`attendance-report-main ${preview && "page-preview"}`}>
          {preview && (
            <div className="print-controls">
              <div className="print-controls-text">
                <div onClick={() => printNow()} className="btn btn-primary">
                  Print / Save
                  {filteredMeetings.length}
                </div>
                <div
                  onClick={() => window.close()}
                  className="btn btn-warning ms-2"
                >
                  Close
                </div>
              </div>
            </div>
          )}
          <div className={`attendance-main-page ${preview && "shadow p-5"}`}>
            <div className="attendance-report-header mt-5">
              <img
                src={Image}
                alt="report-img"
                className="attendance-report-img"
              />
            </div>
            <div className="attendance-report-header-title">
              Attendance Report
            </div>
            <div className="attendance-report-header-details">
              <div className="report-header-detail">
                <div className="report-left">Course:</div>
                <div className="report-right">{printDetails.course}</div>
              </div>
              <div className="report-header-detail">
                <div className="report-left">Subject:</div>
                <div className="report-right">{printDetails.subject}</div>
              </div>
              <div className="report-header-detail">
                <div className="report-left">Section:</div>
                <div className="report-right">{printDetails.section}</div>
              </div>
              <div className="report-header-detail">
                <div className="report-left">Duration:</div>
                <div className="report-right">{checkDuration()}</div>
              </div>
            </div>

            {filteredMeetings.map((list) => (
              <div key={list._id} className="attendance-report-table border">
                <div className="attendance-report-table-header bg-warning">
                  <div className="report-table-date">
                    {new Date(Number(list.date)).toString().slice(0, 16)}
                  </div>
                  <div className="report-table-start">
                    Time Start:
                    {new Date(Number(list.start)).toString().slice(16, 21)}
                  </div>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID Number</th>
                      <th>Name</th>
                      <th>Time In</th>
                      <th>Time Out</th>
                      <th>Status</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s._id}>
                        <td>{s.student.idNumber}</td>
                        <td>
                          {s.student.lastName} {s.student.firstName}
                        </td>
                        <td>
                          {checker(s.student._id, list._id, list.start).timeIn}
                        </td>
                        <td>
                          {checker(s.student._id, list._id, list.start).timeOut}
                        </td>
                        <td className="fst-italic">
                          {checker(s.student._id, list._id, list.start).present}
                        </td>
                        <td className="fst-italic">
                          {checker(s.student._id, list._id, list.start).remarks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceReport;
