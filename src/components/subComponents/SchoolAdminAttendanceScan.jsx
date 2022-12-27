import "./subCss/QrScanner.css";
import { QrReader } from "react-qr-reader";
import { useState } from "react";
import axios from "axios";
import swal from "sweetalert";

const SchoolAdiminAttendanceScan = () => {
  const [attendance, setAttendance] = useState([]);
  const [scan, setScan] = useState(false);
  const [details, setDetails] = useState({});

  const handleError = (error) => {
    console.log(error);
  };

  const handleScan = (result) => {
    console.log(result);
  };

  const showResult = (res) => {
    if (res) {
      const request = async () => {
        const data = await makeRequest(res);

        setDetails(data);
      };
      request();
      console.log(details);
    }
  };

  const makeRequest = async (url) => {
    const response = await axios.get(url);
    const data = await response.data;

    return data;
  };

  const saveScan = () => {
    swal("Added!", "Added to Attendance List!", "success").then((res) => {
      setAttendance([...attendance, details]);
      setDetails({});
    });
  };

  const removeList = (id) => {
    swal({
      title: "Are you sure?",
      text: "You can not undo this.",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setAttendance(attendance.filter((list) => list.id !== id));
        swal("Deleted!", {
          icon: "success",
        });
      }
    });
  };
  const saveData = () => {
    swal("Saved!", "Attendance Saved!", "success").then((res) => {
      setAttendance([]);
    });
  };
  return (
    <div className="staff-qr-scan-container">
      <div className="scanner-title d-flex justify-content-between align-items-center">
        <div className="scanner-title-text">
          <i className="fas fa-expand me-2"></i>Scan Attendance
        </div>
        <div className="scanner-title-text">
          {!scan ? (
            <div
              onClick={(e) => setScan(!scan)}
              className="toggler btn-sm btn-primary"
            >
              Scan
            </div>
          ) : (
            <div
              onClick={(e) => setScan(!scan)}
              className="toggler btn-sm btn-danger"
            >
              <i className="fas fa-times"></i>
            </div>
          )}
        </div>
      </div>
      {scan && (
        <div className="cam-section p-0 mt-4">
          <div className="reader-container">
            <QrReader
              className={"reader-cam"}
              delay={5000}
              onError={handleError}
              onScan={handleScan}
              onResult={showResult}
            />
          </div>
          <div className="display-result">
            {Object.keys(details).length !== 0 && (
              <div className="display-result-card border">
                <div className="card-image">
                  <img
                    src={require(`../../assets/images/${details.image}`)}
                    alt="pic"
                    className="card-image-preview"
                  />
                  <div className="profile-text-display fw-bold">
                    {details.firstName}
                    <span className="m-1"></span>
                    {details.lastName}
                  </div>
                  <div className="profile-id-display">{details.idNumber}</div>
                </div>
                <div className="profile-lower-section">
                  <div className="profile-details">
                    <div className="profile-details-icon text-success">
                      <i className="fas fa-poll"></i>
                    </div>
                    <div className="profile-details-text">
                      <div className="profile-details-title">Course</div>
                      <div className="profile-details-display">
                        {details.course}
                      </div>
                    </div>
                  </div>
                  <div className="profile-details ">
                    <div className="profile-details-icon text-warning">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div className="profile-details-text">
                      <div className="profile-details-title">Contact</div>
                      <div className="profile-details-display">
                        {details.phoneNumber}
                      </div>
                    </div>
                  </div>
                  <div className="profile-details">
                    <div className="profile-details-icon text-primary">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="profile-details-text">
                      <div className="profile-details-title">Email</div>
                      <div className="profile-details-display">
                        {details.email}
                      </div>
                    </div>
                  </div>
                  <div className="profile-details">
                    <div className="profile-details-icon text-danger">
                      <i className="fas fa-map-marked-alt"></i>
                    </div>
                    <div className="profile-details-text">
                      <div className="profile-details-title">Address</div>
                      <div className="profile-details-display">
                        {details.address}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-bottom-btn p-2">
                  <div
                    onClick={() => saveScan()}
                    className="btn btn-primary btn-block"
                  >
                    Add
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="table-list">
        <div className="attendance-table-container">
          <div className="table-title pb-5 fw-bold">
            <i className="fas fa-clipboard-list me-2"></i>Scanned List
          </div>
          {attendance.length > 0 && (
            <div className="table-control d-flex justify-content-between align-items-center mb-5 px-4">
              <div className="">
                <label className="att-label">Room</label>
                <select className="att-select">
                  <option value={"1"}>AB1-205</option>
                  <option value={"2"}>AB1-206</option>
                  <option value={"3"}>AB1-208</option>
                </select>
              </div>
              <div className="">
                <label className="att-label">Subject</label>
                <select className="att-select">
                  <option value={"1"}>CC 101</option>
                  <option value={"2"}>OOP</option>
                  <option value={"3"}>DSA</option>
                </select>
              </div>
              <div className="">
                <label className="att-label">Section</label>
                <select className="att-select">
                  <option value={"1"}>IT-1A</option>
                  <option value={"2"}>IT-2B</option>
                  <option value={"3"}>IT-3C</option>
                </select>
              </div>
              <div className="">
                <div onClick={() => saveData()} className="btn btn-primary">
                  <i className="fas fa-save me-3"></i>Save
                </div>
              </div>
            </div>
          )}
          <table className="campus-table table table-striped">
            <thead>
              <tr>
                <th className="fw-bold" scope="col">
                  <i className="ms-2 fas fa-hashtag"></i>
                </th>
                <th className="fw-bold" scope="col">
                  ID Number
                </th>
                <th className="fw-bold" scope="col">
                  Full Name
                </th>
                <th className="fw-bold" scope="col">
                  Time
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
              {attendance.length > 0 &&
                attendance.map((list) => (
                  <tr key={list.id}>
                    <th scope="row">{list.id}</th>
                    <td>{list.idNumber}</td>
                    <td>
                      {list.firstName}
                      <span className="m-1"></span>
                      {list.lastName}
                    </td>
                    <td>{Date().toString().slice(16, 25)}</td>
                    <td>{Date().toString().slice(0, 16)}</td>
                    <td>
                      <div className="table-options">
                        <span
                          onClick={() => removeList(list.id)}
                          className="option-delete"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SchoolAdiminAttendanceScan;
