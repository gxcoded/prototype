import "./subCss/Preview.css";
import Image from "../../assets/images/psHeader.png";

const AttendancePreview = ({ id, setPreview }) => {
  const print = () => {
    window.location.href = "/print";
  };
  return (
    <div className="preview-container mt-3">
      <div className="top-btn d-flex justify-content-end">
        <div
          onClick={() => setPreview(false)}
          className="close-preview btn btn-outline-danger mx-3"
        >
          <i className="fas fa-eye-slash"></i>
        </div>
        <div
          onClick={() => print()}
          className="close-preview btn btn-outline-primary"
        >
          <i className="me-1 fas fa-print"></i>Print
        </div>
      </div>
      <div className="preview-main">
        <div className="preview-header">
          <div className="preview-header-content">
            <img src={Image} alt="" className="psu-img" />
          </div>
        </div>
        <div className="preview-title">Attendance Record</div>
        <div className="attendance-details py-5">
          <div className="attendance-subject">
            <div className="attendance-details-text-title me-3">Subject:</div>
            <div className="attendance-details-text">
              Fundamentals of Programming
            </div>
          </div>
          <div className="attendance-subject">
            <div className="attendance-details-text-title me-3">Section:</div>
            <div className="attendance-details-text">BSIT-3A</div>
          </div>
          <div className="attendance-subject">
            <div className="attendance-details-text-title me-3">Room:</div>
            <div className="attendance-details-text">AB1-206</div>
          </div>
          <div className="attendance-subject">
            <div className="attendance-details-text-title me-3">Date:</div>
            <div className="attendance-details-text">
              {Date().toString().slice(0, 16)}
            </div>
          </div>
        </div>
        <div className="preview-table">
          <table className="campus-table table table-bordered">
            <thead>
              <tr>
                <th className="fw-bold" scope="col">
                  Course Code
                </th>
                <th className="fw-bold" scope="col">
                  Student Id
                </th>
                <th className="fw-bold" scope="col">
                  Full Name
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CC101</td>
                <td>18-UR-0695</td>
                <td>Gucela, Gilbert E</td>
              </tr>
              <tr>
                <td>CC101</td>
                <td>18-UR-0611</td>
                <td>Doe, John X</td>
              </tr>
              <tr>
                <td>CC101</td>
                <td>18-UR-0692</td>
                <td>Jean, Unknown E</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendancePreview;
