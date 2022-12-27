import "./subCss/Preview.css";
import Image from "../../assets/images/psHeader.png";

const ReportPreview = ({ setPreview, id }) => {
  return (
    <div className="preview-container mt-3">
      <div className="top-btn d-flex justify-content-end">
        <div
          onClick={() => setPreview(false)}
          className="close-preview btn btn-outline-danger mx-3"
        >
          <i className="fas fa-eye-slash"></i>
        </div>
        <div className="close-preview btn btn-outline-primary">
          <i className="me-1 fas fa-print"></i>Print
        </div>
      </div>
      <div className="preview-main">
        <div className="preview-header">
          <div className="preview-header-content">
            <img src={Image} alt="" className="psu-img" />
          </div>
        </div>
        <div className="preview-title">Contact Tracing Report</div>
        <div className="attendance-details py-5">
          <div className="attendance-subject">
            <div className="attendance-details-text-title me-3">Id Number:</div>
            <div className="attendance-details-text">{id}</div>
          </div>
          <div className="attendance-subject">
            <div className="attendance-details-text-title me-3">Date:</div>
            <div className="attendance-details-text">
              {Date().toString().slice(0, 16)}
            </div>
          </div>
        </div>
        <div className="preview-table">
          <div className="table-title fw-bold py-3">Close Contacts </div>
          <table className="campus-table table table-bordered">
            <thead>
              <tr>
                <th className="fw-bold" scope="col">
                  Date
                </th>
                <th className="fw-bold" scope="col">
                  Time
                </th>
                <th className="fw-bold" scope="col">
                  Room
                </th>
                <th className="fw-bold" scope="col">
                  Id Number
                </th>
                <th className="fw-bold" scope="col">
                  Name
                </th>
                <th className="fw-bold" scope="col">
                  Contact Number
                </th>
                <th className="fw-bold" scope="col">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Thu May 12 20222</td>
                <td>10:12:56</td>
                <td>AB1-201</td>
                <td>18-UR-8839</td>
                <td>Arando, Michelle</td>
                <td>{Math.floor(Math.random() * 999999999999)}</td>
                <td>
                  <i className="fas fa-check me-2"></i>Notified
                </td>
              </tr>
              <tr>
                <td>Fri June 02 20222</td>
                <td>02:22:16</td>
                <td>AB1-203</td>
                <td>18-UR-0991</td>
                <td>Cruz, John</td>
                <td>{Math.floor(Math.random() * 999999999999)}</td>
                <td>
                  <i className="fas fa-check me-2"></i>Notified
                </td>
              </tr>
              <tr>
                <td>Tue June 09 20222</td>
                <td>09:00:20</td>
                <td>AB1-203</td>
                <td>18-UR-0881</td>
                <td>De Vega, Kyle</td>
                <td>{Math.floor(Math.random() * 999999999999)}</td>
                <td>
                  <i className="fas fa-check me-2"></i>Notified
                </td>
              </tr>
              <tr>
                <td>{Date().toString().slice(0, 16)}</td>
                <td>{Date().toString().slice(17, 24)}</td>
                <td>AB1-206</td>
                <td>18-UR-1234</td>
                <td>Ben Morris</td>
                <td>{Math.floor(Math.random() * 999999999999)}</td>
                <td>
                  <i className="fas fa-check me-2"></i>Notified
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
