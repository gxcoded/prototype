import "./ClassAttendanceLog.css";
import { useState, useEffect } from "react";
import axios from "axios";

const ClassAttendanceLog = ({ currentList, toggleList }) => {
  const [attendanceLog, setAttendanceLog] = useState([]);
  const [url] = useState(process.env.REACT_APP_URL);

  useEffect(() => {
    loadData();
  }, []);

  const compare = (current, next) => {
    if (current.accountScanned.lastName < next.accountScanned.lastName) {
      return -1;
    }
    if (current.accountScanned.lastName > next.accountScanned.lastName) {
      return 1;
    }
    return 0;
  };

  const loadData = async () => {
    const attendance = await fetchAttendance();
    setAttendanceLog(attendance.sort(compare));
  };

  const fetchAttendance = async () => {
    const { data } = await axios.post(`${url}/getAttendanceLog`, {
      id: currentList._id,
    });
    return data;
  };

  // const printRecord = () => {
  //   window.open(`${window.location.href}/asdfasdf`);
  // };

  const dateFormatter = (timeString) => {
    const date = new Date(Number(timeString)).toString().slice(4, 15);
    const time = new Date(Number(timeString)).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${date}`;
  };

  const timeFormatter = (timeString) => {
    const time = new Date(Number(timeString)).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${time}`;
  };
  return (
    <div>
      <div className="table-list attendance-log-list border">
        <div className="meeting-details">
          <div className="meeting-details-left">
            <div className="meeting-details-title">Meeting Details</div>
            <div className="meeting-details-date">
              {new Date(Number(currentList.date)).toString().slice(0, 16)}
            </div>
            <div className="meeting-details-start">
              {timeFormatter(currentList.start)}
            </div>
          </div>
          <div className="meeting-details-right">
            {/* <div onClick={() => printRecord()}>
              <i className="fas fa-print"></i>
            </div> */}
            <div onClick={() => toggleList()}>
              <i className="fas fa-chevron-circle-left"></i>
            </div>
          </div>
        </div>
        <div className="meeting-logs-table-section">
          {/* students table */}
          <div className="attendance-category">Students</div>
          <table className="table meeting-logs-table">
            <thead>
              <tr>
                <th className="fw-bold" scope="col">
                  Id Number
                </th>
                <th className="fw-bold" scope="col">
                  Name
                </th>
                <th className="fw-bold" scope="col">
                  Time In
                </th>
                <th className="fw-bold" scope="col">
                  Time Out
                </th>
                {/* <th className="fw-bold" scope="col">
                Remarks
              </th> */}
              </tr>
            </thead>
            <tbody>
              {attendanceLog.length > 0 &&
                attendanceLog.map(
                  (list) =>
                    !list.isSitIn &&
                    !list.isVisitor && (
                      <tr key={list._id}>
                        <td>{list.accountScanned.username}</td>
                        <td>
                          {list.accountScanned.lastName},{" "}
                          {list.accountScanned.firstName}
                        </td>
                        <td>{timeFormatter(list.start)}</td>
                        <td>{timeFormatter(list.end)}</td>
                      </tr>
                    )
                )}
            </tbody>
          </table>
          {/* Sit In table */}
          <div className="attendance-category">Sit In</div>
          <table className="table meeting-logs-table">
            <tbody>
              {attendanceLog.length > 0 &&
                attendanceLog.map(
                  (list) =>
                    list.isSitIn && (
                      <tr key={list._id}>
                        <td>{list.accountScanned.username}</td>
                        <td>
                          {list.accountScanned.lastName},{" "}
                          {list.accountScanned.firstName}
                        </td>
                        <td>
                          {new Date(Number(list.start))
                            .toString()
                            .slice(16, 25)}
                        </td>
                        <td>
                          {new Date(Number(list.end)).toString().slice(16, 25)}
                        </td>
                      </tr>
                    )
                )}
            </tbody>
          </table>
          {/* Guest table */}
          <div className="attendance-category ">Guest</div>
          <table className="table meeting-logs-table">
            <tbody>
              {attendanceLog.length > 0 &&
                attendanceLog.map(
                  (list) =>
                    list.isVisitor && (
                      <tr key={list._id}>
                        <td>{list.accountScanned.username}</td>
                        <td>
                          {list.accountScanned.lastName},{" "}
                          {list.accountScanned.firstName}
                        </td>
                        <td>
                          {new Date(Number(list.start))
                            .toString()
                            .slice(16, 25)}
                        </td>
                        <td>
                          {new Date(Number(list.end)).toString().slice(16, 25)}
                        </td>
                      </tr>
                    )
                )}
            </tbody>
          </table>
        </div>
        {/* <div className="show-count p-4 mt-5">
          Showing{" "}
          <span className="text-primary fw-bold">{attendanceLog.length}</span>{" "}
          out of{" "}
          <span className="text-primary fw-bold">{attendanceLog.length}</span>{" "}
          Records
        </div> */}
      </div>
    </div>
  );
};

export default ClassAttendanceLog;
