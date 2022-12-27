import "./Attendance.css";
import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";

const Attendance = ({ room }) => {
  const [from, setFrom] = useState("");
  const [custom, setCustom] = useState(false);
  const [showCustomTable, setShowCustomTable] = useState(false);
  const [to, setTo] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeeting] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [url] = useState(process.env.REACT_APP_URL);
  const [headers, setHeaders] = useState([]);
  const [dataContent, setDataContent] = useState([]);
  const [excusedList, setExcusedList] = useState([]);

  let arrayList = [];

  useEffect(() => {
    loadMeetingList();
    loadStudents();
    loadExcusedStudents();
    localStorage.removeItem("printInfo");
  }, []);

  const loadMeetingList = async () => {
    const meetingList = await fetchMeetingList();
    setMeetings(meetingList);

    meetingList.forEach(async (m) => {
      await fetchAttendance(m._id);
    });
  };

  const fetchMeetingList = async () => {
    const { data } = await axios.post(`${url}/getMeetingList`, {
      classId: room._id,
    });

    return data;
  };

  // ======excuses

  const loadExcusedStudents = async () => {
    const excused = await fetchExcusedStudents();
    setExcusedList(excused);
  };

  const fetchExcusedStudents = async () => {
    const { data } = await axios.post(`${url}/getExcusedStudents`, {
      classRoomId: room._id,
    });
    console.log(data);
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
    const { data } = await axios.post(`${url}/getClassRoomStudents`, {
      classId: room._id,
    });
    return data;
  };

  const attendanceRequest = async (value) => {
    if (value === "2") {
      setCustom(true);
      setShowTable(false);
      setUpHeaders(meetings);
    } else {
      setShowTable(true);
      setCustom(false);
      setTo(false);
      setFrom(false);
      setUpHeaders(filteredMeetings);
    }
    setShowCustomTable(false);
  };

  const fetchAttendance = async (id) => {
    const { data } = await axios.post(`${url}/allAttendance`, {
      id,
    });

    data.forEach((d) => {
      arrayList.push(d);
      setAttendance(arrayList);
    });
  };

  const checker = (s, m) => {
    let status = {
      isPresent: false,
      isExcused: false,
      remarks: "",
    };

    attendance.forEach((a) => {
      if (a.accountScanned === s && a.meeting === m) {
        status.isPresent = true;
      }
    });

    excusedList.forEach((ex) => {
      if (ex.student === s && ex.meeting === m) {
        console.log(ex.meeting);
        status.isExcused = true;
        status.remarks = ex.remarks;
      }
    });

    return status;
  };

  const csvChecker = (s, m) => {
    let isPresent = false;

    attendance.forEach((a) => {
      // console.log("Meeting:" + a.meeting);
      // console.log("Passed:" + m);
      if (a.accountScanned === s && a.meeting === m) {
        isPresent = true;
      }
    });
    return isPresent;
  };

  // 1 2 3 4 5 6 7 8 9 10
  const customRange = (value) => {
    const currentVal = Number(new Date(value).getTime()) + 79200000;

    let array = [];
    setFilteredMeeting([]);
    setShowCustomTable(false);

    meetings.forEach((m) => {
      // console.log(m.date);
      // console.log(m.date);
      // console.log(Number(new Date(from).getTime()));
      // console.log("==================");
      if (
        Number(m.date) <= currentVal &&
        Number(m.date) >= Number(new Date(from).getTime())
      ) {
        array.push(m);
        // console.log(array);
        setFilteredMeeting(array);
      }
      // console.log("========End==========");
    });
    setTimeout(() => {
      setShowCustomTable(true);
    }, 500);
  };

  const printReport = () => {
    const printObject = {
      from,
      to,
      room: room._id,
      subject: room.subject.courseDescription,
      course: room.course.description,
      section: room.section.description,
    };
    localStorage.setItem("printInfo", JSON.stringify(printObject));
    window.open(`/attendance-report`);
  };

  const downloadCSV = (type) => {
    if (type === "1") {
      const content = setUpHeaders(meetings);
      setHeaders(content[0]);
      setDataContent(content[1]);
    } else {
      const content = setUpHeaders(filteredMeetings);
      setHeaders(content[0]);
      setDataContent(content[1]);
    }
  };

  const setUpHeaders = (file) => {
    let headersArray = [
      [
        {
          label: "ID Number",
          key: "idNumber",
        },
        {
          label: "Full Name",
          key: "fullName",
        },
      ],
      [],
    ];

    file.forEach((meet) => {
      const content = new Date(Number(meet.date)).toString().slice(4, 16);
      const keyContent = new Date(Number(meet.date)).toString();
      const header = {
        label: content,
        key: keyContent,
      };
      headersArray[0].push(header);
    });

    students.forEach((s) => {
      const stud = {
        idNumber: s.student.username,
        fullName: `${s.student.lastName}, ${s.student.firstName}`,
      };

      file.forEach((f) => {
        // console.log(attendance);
        if (checker(s.student._id, f._id).isPresent) {
          stud[new Date(Number(f.date)).toString()] = "1";
        } else if (checker(s.student._id, f._id).isExcused) {
          stud[new Date(Number(f.date)).toString()] = "2";
        } else {
          stud[new Date(Number(f.date)).toString()] = "0";
        }
      });

      headersArray[1].push(stud);
    });

    const space = { idNumber: "" };
    const guide = { idNumber: "LEGEND / GUIDE" };
    const absent = { idNumber: "0 = Absent" };
    const present = { idNumber: "1 = Present" };
    const excused = { idNumber: "2 = Excused" };

    headersArray[1].push(space);
    headersArray[1].push(guide);
    headersArray[1].push(absent);
    headersArray[1].push(present);
    headersArray[1].push(excused);

    return headersArray;
  };

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <div className="attendance-header-title">Attendance Records</div>
        <div className="attendance-header-controls">
          <div className="form-group">
            <label>View</label>
            <select
              defaultValue={"0"}
              onChange={(e) => {
                attendanceRequest(e.target.value);
              }}
              required
              className="form-control"
            >
              <option value="0" disabled>
                Select
              </option>
              <option value="1">All Meetings</option>
              <option value="2">Specify Date</option>
            </select>
          </div>
          <Fragment>
            <div className="form-group">
              <label>From</label>
              <input
                disabled={!custom}
                onChange={(e) => {
                  {
                    setFrom(e.target.value);
                  }
                }}
                type="date"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>To</label>
              <input
                disabled={!custom}
                onChange={(e) => {
                  setTo(e.target.value);
                  customRange(e.target.value);
                }}
                type="date"
                name=""
                id=""
                className="form-control"
              />
            </div>
          </Fragment>
        </div>
      </div>

      {showTable &&
        (meetings.length > 0 ? (
          <Fragment>
            <div className="attendance-print-options d-flex">
              <div
                onClick={() => printReport()}
                className="fetch-btn btn btn-primary text-center"
              >
                Print<i className="fas fa-print ms-2"></i>
              </div>
              <CSVLink
                headers={headers}
                data={dataContent}
                filename={"attendance.csv"}
                id={"triggerDownload"}
              >
                <div
                  onClick={() => downloadCSV("1")}
                  className="fetch-btn btn btn-success text-center mx-3"
                >
                  Download CSV<i className="fas fa-download ms-2"></i>
                </div>
              </CSVLink>
              {/* <div className="form-group">
                <select
                  defaultValue={""}
                  onChange={(e) => {
                    alert(e.target.value);
                  }}
                  required
                  className="form-control"
                >
                  <option value="" disabled>
                    Download CSV File
                  </option>
                  <option value="1">1 = Present , 0 = Absent</option>
                  <option value="2">/ = Present , x = Absent</option>
                </select>
              </div> */}
            </div>
            <div className="attendance-records-main">
              <div className="attendance-records-main-left">
                <div className="record-table-header border">Students</div>
                {students.map((list) => (
                  <div
                    key={list._id}
                    className="custom-table-list-row student-list-row"
                  >
                    {list.student.lastName}, {list.student.firstName}
                  </div>
                ))}
              </div>
              <div className="attendance-records-main-right">
                <div className="attendance-records-dates">
                  {meetings.map((list) => (
                    <div key={list._id} className="record-dates-column border">
                      {new Date(Number(list.date)).toString().slice(4, 16)}
                    </div>
                  ))}
                </div>
                {students.map((l) => (
                  <div key={l._id} className="attendance-records-dates">
                    {meetings.map((list) => (
                      <div
                        key={list._id}
                        className="record-dates-column text-center border"
                      >
                        {checker(l.student._id, list._id).isPresent && (
                          <div className="present">
                            <i className="fas fa-check"></i>
                          </div>
                        )}
                        {checker(l.student._id, list._id).isExcused && (
                          <div className="excused">
                            <span className="fw-bold fst-normal">Excused</span>
                            <div className="" style={{ fontSize: ".6rem" }}>
                              {checker(l.student._id, list._id).remarks}
                            </div>
                          </div>
                        )}

                        {!checker(l.student._id, list._id).isPresent &&
                          !checker(l.student._id, list._id).isExcused && (
                            <div className="absent">
                              <i className="fas fa-times"></i>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Fragment>
        ) : (
          <div className="p-5 text-center fst-italic bg-light mt-5">
            {" "}
            No Meetings Yet
          </div>
        ))}
      {showCustomTable && (
        <Fragment>
          {filteredMeetings.length > 0 && (
            <div className="attendance-print-options">
              <div
                onClick={() => printReport()}
                className="fetch-btn btn btn-primary text-center"
              >
                Print<i className="fas fa-print ms-2"></i>
              </div>
              <CSVLink
                headers={headers}
                data={dataContent}
                filename={"attendance.csv"}
              >
                <div
                  onClick={() => downloadCSV("2")}
                  className="fetch-btn btn btn-success text-center mx-3"
                >
                  Download CSV<i className="fas fa-download ms-2"></i>
                </div>
              </CSVLink>
            </div>
          )}
          <div className="attendance-records-main mt-5">
            <div className="attendance-records-main-left">
              <div className="record-table-header border">Students</div>
              {students.map((list) => (
                <div
                  key={list._id}
                  className="custom-table-list-row student-list-row"
                >
                  {list.student.lastName}, {list.student.firstName}
                </div>
              ))}
            </div>
            <div className="attendance-records-main-right">
              <div className="attendance-records-dates">
                {filteredMeetings.length > 0 ? (
                  filteredMeetings.map((list) => (
                    <div key={list._id} className="record-dates-column border">
                      <i className="fas fa-calendar-alt me-1"></i>
                      {new Date(Number(list.date)).toString().slice(4, 16)}
                    </div>
                  ))
                ) : (
                  <div className="border no-meetings-found">
                    No Meeting Found...
                  </div>
                )}
              </div>
              {students.map((l) => (
                <div key={l._id} className="attendance-records-dates">
                  {filteredMeetings.map((list) => (
                    <div
                      key={list._id}
                      className="record-dates-column text-center border"
                    >
                      {checker(l.student._id, list._id) ? (
                        <div className="present">
                          <i className="fas fa-check"></i>
                        </div>
                      ) : (
                        <div className="absent">
                          <i className="fas fa-times"></i>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Attendance;
