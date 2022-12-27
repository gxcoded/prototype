import "./subCss/AccountCredentials.css";
import { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";

const AccountCredentials = ({ accountInfo }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [url] = useState(process.env.REACT_APP_URL);

  useEffect(() => {
    localStorage.getItem("ctIdToken") === null &&
      (window.location.href = "/login");
  }, []);

  const submitUpdate = async (e) => {
    e.preventDefault();
    if (newPassword === newPassword2) {
      const response = await axios.post(`${url}/updatePassword`, {
        id: accountInfo._id,
        oldPassword,
        newPassword,
      });
      const isUpdated = await response.data;
      if (isUpdated) {
        swal({
          title: "Updated",
          text: "Password Updated",
          icon: "success",
        });
      } else {
        swal({
          title: "Please Try Again",
          text: "Old Password is Incorrect",
          icon: "error",
        });
      }
      setOldPassword("");
      setNewPassword("");
      setNewPassword2("");
    } else {
      swal({ text: "Passwords are not the same", icon: "error" });
    }
  };
  return (
    <div className="credential-form">
      <form onSubmit={submitUpdate}>
        <div className="credentials-fields">
          <div className="from-group">
            <label>Username</label>
            <input
              value={accountInfo.username}
              readOnly
              type="text"
              className="form-control"
            />
          </div>
          <div className="password-option text-center">
            <i className="fas fa-lock me-2"></i>Change Password
          </div>
          <div className="from-group">
            <label>Current Password</label>
            <input
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              type="password"
              className="form-control"
            />
          </div>
          <div className="from-group">
            <label>New Password</label>
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              type="password"
              className="form-control"
            />
          </div>
          <div className="from-group">
            <label>Confirm New Password</label>
            <input
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
              required
              type="password"
              className="form-control"
            />
          </div>
          <div className="from-group mt-4">
            <button type="submit" className="btn w-100 btn-outline-primary">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AccountCredentials;
