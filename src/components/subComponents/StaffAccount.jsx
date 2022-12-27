import "./subCss/StaffAccount.css";
import QrCodeDisplay from "../QrCodeDisplay";
import StaffProfile from "./StaffProfile";
import { useState } from "react";

const StaffAccount = ({ accountInfo, reloadPage }) => {
  const [api] = useState(process.env.REACT_APP_API_SERVER);

  return (
    <div className="staff-account-container">
      <div className="staff-account-container-left">
        <div className="staff-account-container-left-content">
          <div className="staff-account-container-left-content-profile">
            <img
              src={`${api}/${accountInfo.image}`}
              // src={require(`../../../../server/uploads/${accountInfo.image}`)}
              alt=""
              className="staff-account-profile"
            />
            <div className="staff-account-profile-name">
              {accountInfo.firstName} {accountInfo.lastName}
            </div>
            <div className="staff-account-profile-id">
              {accountInfo.idNumber}
            </div>
            <div className="staff-account-profile-status">
              {accountInfo.allowed ? (
                <div className="status text-success">Allowed</div>
              ) : (
                <div className="status text-danger">Not Allowed</div>
              )}
            </div>
          </div>
          <div className="qr-box-container">
            <QrCodeDisplay value={accountInfo._id} />
          </div>
        </div>
      </div>
      <div className="staff-account-container-right">
        <div className="staff-account-container-right-content">
          <StaffProfile accountDetails={accountInfo} reloadPage={reloadPage} />
        </div>
      </div>
    </div>
  );
};

export default StaffAccount;
