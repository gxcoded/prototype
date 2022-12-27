//this component if for scanning entrance and exit for students

import "../subComponents/subCss/Scanner.css";
import { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import axios from "axios";

const Scanner = ({ accountInfo }) => {
  const [url] = useState(process.env.REACT_APP_URL);
  const [openScanner, setOpenScanner] = useState(false);
  const [hideModal, setHideModal] = useState(true);
  const [timeIn, setTimeIn] = useState(true);
  const [allowed, setAllowed] = useState(true);
  const [location, setLocation] = useState("");
  const [api] = useState(process.env.REACT_APP_API_SERVER);

  useEffect(() => {
    console.log(accountInfo);
  }, []);
  //scanner functions
  const handleError = (error) => {
    console.log(error);
  };

  const handleScan = (result) => {
    console.log(result);
  };

  const showResult = (key) => {
    if (key) {
      setOpenScanner(false);
      getResponse(key);
      setHideModal(false);
    }
  };

  const getResponse = async (key) => {
    const response = await sendKey(key);

    if (response.success) {
      setAllowed(true);
      setLocation(response.location);
      setTimeIn(response.timeIn);
    } else {
      setAllowed(false);
    }
  };

  const sendKey = async (key) => {
    console.log(key);
    const { data } = await axios.post(`${url}/personalLog`, {
      campus: accountInfo.campus._id,
      key: key,
      accountOwner: accountInfo._id,
      role: accountInfo.role._id,
    });
    console.log(data);
    return data;
  };

  const dateFormatter = (timeString) => {
    const date = new Date(Number(timeString)).toString().slice(4, 15);
    const time = new Date(Number(timeString)).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${date} ${time}`;
  };

  const constrain = (e) => {
    console.log(e);
  };
  return (
    <div className="entrance-scan-container">
      <div
        className={`scanner-modal-container ${hideModal && "hide-scan-modal"}`}
      >
        <div className="scanner-modal border">
          {allowed ? (
            <div className="scan-result-box-image-section">
              <img
                className="scan-result-box-image"
                src={`${api}/${accountInfo.image}`}
                // src={require(`../../../../server/uploads/${accountInfo.image}`)}
                alt="pp"
              />
              <div className="result-idNumber">{accountInfo.username}</div>
              <div className="result-name">
                {accountInfo.firstName} {accountInfo.lastName}
              </div>
              <div className="result-role">{accountInfo.role.description}</div>
              <div className="scan-location-display">{location}</div>
              {accountInfo.allowed ? (
                <div className="result-status">Allowed</div>
              ) : (
                <div className="result-status text-danger">Not Allowed</div>
              )}
              <div className="result-status-label">Status</div>
              {timeIn ? (
                <div className="scan-class scan-class-in">Time In</div>
              ) : (
                <div className="scan-class scan-class-out">Time Out</div>
              )}
              <div className="scan-date">
                {dateFormatter(Date.now().toString())}
              </div>
              <div className="scan-btn-hide mt-4">
                <button
                  onClick={() => setHideModal(true)}
                  className="btn btn-custom-red"
                >
                  <i className="me-2 fas fa-check"></i>Ok
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setHideModal(true)}
              className="not-allowed-sign"
            >
              <div className="not-allowed-icon">
                <i className="fas fa-spinner"></i>
              </div>
              <div className="not-allowed-text">Please Try Again</div>
            </div>
          )}
        </div>
      </div>
      <div
        className="entrance-scan-main"
        onClick={() => setOpenScanner(!openScanner)}
      >
        {openScanner ? (
          <div className="entrance-scanner-frame">
            <QrReader
              className={"entrance-scanner"}
              delay={10000}
              onError={handleError}
              onScan={handleScan}
              onResult={showResult}
              key={"environment"}
              constraints={{ facingMode: "environment" }}
            />
          </div>
        ) : (
          <div className="entrance-scanner-frame-wrapper">
            <div className="scanner-frame-wrap">
              <div className="scanner-wrap-text">Open Scanner</div>
              <i className="fas fa-qrcode"></i>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scanner;
