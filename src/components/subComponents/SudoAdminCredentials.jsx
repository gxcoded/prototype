import "./subCss/SudoAdminCredentials.css";
import AddStaffForm from "./AddStaffForm";
import { useState } from "react";
import swal from "sweetalert";

const SudoAdminCredentials = () => {
  const [showCredentials, setShowCredentials] = useState(true);

  const saveOnly = () => {
    swal("Saved!", "Data Saved!", "success").then((res) => {
      setShowCredentials(false);
    });
  };
  const sendAndSave = () => {
    swal("Saved!", "Link Sent and Data Saved!", "success").then((res) => {
      setShowCredentials(false);
    });
  };
  return (
    <div>
      {!showCredentials ? (
        <AddStaffForm />
      ) : (
        <div className="sudo-admins-credentials-container">
          <div className="form-image-container">
            <img
              src={require("../../assets/images/credentials.png")}
              alt="preview"
              className="form-image"
            />
          </div>
          <div className="form-group-section">
            <div className="form-default-title">Default Credentials</div>
            <div className="form-group">
              <label>Username</label>
              <input
                value={"17-UR-8827"}
                readOnly
                type="text"
                className="form-control"
              />
            </div>
            <div className="form-group mt-4">
              <label>Password</label>
              <input
                readOnly
                value={"jmcfykezqo"}
                type="text"
                className="form-control"
              />
            </div>
            <div className="form-group saving-options mt-3 py-3">
              Send Default Credentials to the User's Email?
            </div>
            <div className="form-inline d-flex justify-content-between px-3">
              <div onClick={() => sendAndSave()} className="btn btn-warning">
                <i className="me-2 fas fa-paper-plane"></i>
                <i className=" me-2 far fa-save"></i>Send and Save
              </div>
              <div onClick={() => saveOnly()} className="btn btn-primary">
                <i className=" me-2 far fa-save"></i>Save Only
              </div>
            </div>
            <div className="px-3 mt-4">
              <span
                onClick={() => setShowCredentials(false)}
                className="pointer"
              >
                <i className="me-3 fas fa-arrow-left"></i>Go Back
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SudoAdminCredentials;
