import "./subCss/ManualLog.css";
import { useState } from "react";
import swal from "sweetalert";

const ManualLog = ({ area, type }) => {
  const [logs, setLogs] = useState([]);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [room, setRoom] = useState(area);

  const addLog = () => {
    if (contact) {
      const log = {
        id: Math.floor(Math.random() * 11221),
        fullName,
        address,
        contact,
        room,
        time: Date().toString().slice(16, 25),
        date: Date().toString().slice(0, 16),
      };
      swal("Saved!", "Log Saved!", "success").then((res) => {
        setLogs([...logs, log]);
        reset();
      });
    }
  };

  const reset = () => {
    setFullName("");
    setAddress("");
    setContact("");
    setRoom(area);
  };

  return (
    <div className="manual-log-container">
      <div className="manual-log-title">
        <i className="fab fa-wpforms me-3"></i>Manual Log
      </div>
      <div className="manual-log-main">
        <div className="manual-log-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              type="text"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Area</label>
            {type === "1" && (
              <select className="form-control">
                <option value={area}>{area}</option>
              </select>
            )}
            {type === "2" && (
              <select
                className="form-control"
                defaultValue={room}
                onChange={(e) => setRoom(e.target.value)}
              >
                <option value="">Select</option>
                <option value="AB1-201">AB1-201</option>
                <option value="AB1-203">AB1-203</option>
                <option value="AB1-204">AB1-204</option>
                <option value="AB1-205">AB1-205</option>
              </select>
            )}
            {type === "3" && (
              <select
                className="form-control"
                defaultValue={room}
                onChange={(e) => setRoom(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Clinic">Clinic</option>
                <option value="Guidance Office">Guidance Office</option>
                <option value="Library">Library</option>
              </select>
            )}
          </div>
        </div>
        <div className="px-3 pt-5 text-end manual-save-btn">
          <div onClick={() => addLog()} className="btn btn-success">
            <i className="me-3 far fa-save"></i>Save
          </div>
        </div>
      </div>
      <div className="manual-log-table">
        <table className="table subjects-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Full Name</th>
              <th scope="col">Address</th>
              <th scope="col">Contact Number</th>
              <th scope="col">Time</th>
              <th scope="col">Date</th>
              <th scope="col">Room</th>
              <th scope="col">Option</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 &&
              logs.map((l) => (
                <tr key={l.id}>
                  <td>{l.id}</td>
                  <td>{l.fullName}</td>
                  <td>{l.address}</td>
                  <td>{l.contact}</td>
                  <td>{l.time}</td>
                  <td>{l.date}</td>
                  <td>{l.room}</td>
                  <td>
                    <div className="table-options">
                      <span className="controls option-view text-warning">
                        <i className="fas fa-pen"></i>
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManualLog;
