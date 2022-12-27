import "../../components/subComponents/subCss/StaffAttendanceRecord.css";
import AttendancePreview from "./AttendancePreview";
import { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";

const StaffAttendanceRecord = () => {
  const [preview, setPreview] = useState(false);
  const [subjectId, setSubjectId] = useState();
  const [sectionList, setSectionList] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [attendanceFilter, setAttendanceFilter] = useState([]);
  const [sectionFilter, setSectionFilter] = useState([]);

  useEffect(() => {
    const sendRequest = async () => {
      const sections = await fetchData(
        "http://localhost:5000/records/sectionList"
      );
      const attendance = await fetchData(
        "http://localhost:5000/records/attendanceList"
      );

      setSectionList(sections);
      setAttendanceList(attendance);
    };
    sendRequest();
  }, []);

  const filterSections = (id) => {
    setSubjectId(id);

    setSectionFilter(
      sectionList.filter((list) => list.subjectId.toString() === id)
    );
    filterAttendance(null);
  };

  const filterAttendance = (sectionId) => {
    setAttendanceFilter(
      attendanceList.filter(
        (list) =>
          list.sectionId.toString() === sectionId &&
          list.subjectId.toString() === subjectId
      )
    );
  };

  const fetchData = async (url) => {
    const response = await axios.get(`${url}`);
    const data = await response.data;

    return data;
  };
  const printPage = () => {
    window.location.href = "/print";
  };
  const removeList = (id) => {
    swal({
      title: "Are you sure?",
      text: "You can not undo this.",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setAttendanceList(attendanceList.filter((list) => list.id !== id));
        setAttendanceFilter(attendanceFilter.filter((list) => list.id !== id));
        swal("Deleted!", {
          icon: "success",
        });
      }
    });
  };
  return (
    <div className="staff-attendance-record-container">
      <div className="attendance-record-title">
        <i className="me-3 far fa-file-archive"></i>Attendance Records
      </div>
      {preview ? (
        <AttendancePreview id={1} setPreview={setPreview} />
      ) : (
        <div className="staff-attendance-record-main">
          <div className="attendance-options">
            <div className="attendance-option-left">
              <div className="form-group">
                <label className="input-label">Subject</label>
                <select
                  onChange={(e) => filterSections(e.target.value)}
                  className="form-control-select"
                  defaultValue={""}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value={1}>CC 101</option>
                  <option value="2">IAS 102</option>
                  <option value="3">SAM 101</option>
                  <option value="4">OSA 101</option>
                </select>
              </div>
              <div className="form-group mt-3">
                <label className="input-label">Section</label>
                {sectionFilter.length > 0 && (
                  <select
                    onClick={(e) => filterAttendance(e.target.value)}
                    className="form-control-select"
                    defaultValue={""}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {sectionFilter.map((list) => (
                      <option key={list.id} value={list.value}>
                        {list.text}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div className="attendance-option-right">
              <div className="count-card">
                <div className="count-card-counter">
                  {attendanceFilter.length}
                </div>
                <div className="count-card-label">
                  <i className="me-3 fas fa-file-archive"></i> Total Records
                </div>
              </div>
            </div>
          </div>

          <div className="attendance-table">
            <table className="campus-table campus-table-list table table-bordered">
              <thead>
                <tr>
                  <th className="fw-bold" scope="col">
                    <i className="ms-2 fas fa-hashtag"></i>
                  </th>
                  <th className="fw-bold" scope="col">
                    Subject
                  </th>
                  <th className="fw-bold" scope="col">
                    Section
                  </th>
                  <th className="fw-bold" scope="col">
                    Room
                  </th>
                  <th className="fw-bold" scope="col">
                    Date
                  </th>
                  <th className="fw-bold text-center" scope="col">
                    <i className="ms-2 fas fas fa-tools"></i>
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendanceFilter.length > 0 ? (
                  attendanceFilter.map((list) => (
                    <tr key={list.id}>
                      <th scope="row">{list.id}</th>
                      <td>{list.text}</td>
                      <td>{list.sectionText}</td>
                      <td>{list.room}</td>
                      <td>{Date().toString().slice(0, 16)}</td>
                      <td>
                        <div className="table-options">
                          <span
                            onClick={() => setPreview(!preview)}
                            className="mx-2 controls option-view text-warning"
                          >
                            <i className="fas fa-eye"></i>
                          </span>
                          <span
                            onClick={() => printPage()}
                            className="mx-2 controls option-download text-primary"
                          >
                            <i className="fas fa-download"></i>
                          </span>
                          <span
                            onClick={() => removeList(list.id)}
                            className="mx-2 controls option-delete"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>No Records</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAttendanceRecord;
