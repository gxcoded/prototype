import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./NegativeDetails.css";
import swal from "sweetalert";

const NegativeDetails = ({
  toggleDetails,
  current,
  currentProofId,
  reloader,
}) => {
  const [proof, setProof] = useState([]);
  const [url] = useState(process.env.REACT_APP_URL);
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  const [allowed, setAllowed] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    loadProof();
    isAllowed(current._id);
    reloader();
  }, [reload]);

  const myReloader = () => {
    setReload(!reload);
    console.log(reload);
  };

  const fetchProof = async () => {
    const { data } = await axios.post(`${url}/getProofDetails`, {
      id: currentProofId,
    });
    return data;
  };

  const loadProof = async () => {
    const p = await fetchProof();
    console.log(p);
    setProof(p);
  };

  const dateFormatter = (timeString) => {
    const date = new Date(Number(timeString)).toString().slice(4, 15);
    const time = new Date(Number(timeString)).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${date}`;
  };
  const dayCounter = (sent) => {
    const now = Date.now().toString();
    const total = (Number(now) - Number(sent)) / 86400000;

    return Math.floor(total);
  };
  // -=======================================

  const reportUpdated = async () => {
    const updated = await updateReportStatus();

    return updated;
  };
  const updateReportStatus = async () => {
    const { data } = await axios.post(`${url}/updateReportStatus`, {
      id: currentProofId,
    });

    return data;
  };
  const statusUpdater = (id) => {
    swal({
      title: "Are you sure?",
      text: "This will change the status of this account.",
      icon: "warning",
      buttons: true,
    }).then((willUpdate) => {
      if (willUpdate) {
        if (statusUpdated(id)) {
          isAllowed(id);
          myReloader();
          reportUpdated();
          swal("Status Updated", {
            icon: "success",
          });
        }
      }
    });
  };

  const addressUpdater = () => {
    swal({
      title: "Are you sure?",
      text: "This mark this report as Addressed",
      icon: "warning",
      buttons: true,
    }).then((willUpdate) => {
      if (willUpdate) {
        if (reportUpdated()) {
          myReloader();
          swal("Status Updated", {
            icon: "success",
          });
        }
      }
    });
  };

  const statusUpdated = async (id) => {
    const updated = await statusUpdateRequest(id);
    // console.log(updated);
    return updated;
  };

  const statusUpdateRequest = async (id) => {
    const { data } = await axios.post(`${url}/statusUpdater`, {
      id,
    });

    return data;
  };

  const isAllowed = async (id) => {
    const yes = await statusCheckRequest(id);
    // console.log(yes);
    setAllowed(yes);
  };

  const statusCheckRequest = async (id) => {
    const { data } = await axios.post(`${url}/statusChecker`, {
      id,
    });

    return data;
  };
  return (
    <div className="negative-details-container">
      <div className="interactions-header">
        <span onClick={() => toggleDetails()} className="prev-btn">
          <i className="me-2 fas fa-chevron-left"></i>
          Go Back
        </span>
      </div>
      <div className="trace-all-main-header" style={{ background: "white" }}>
        <div className="trace-all-main-profile d-flex align-items-center">
          <div>
            <div className="current-img-container">
              <img
                src={`${api}/${current.image}`}
                // src={require(`../../../../server/uploads/${currentAccount.image}`)}
                alt={current._id}
                className="interactions-current-img trace-all-img"
              />
            </div>
            <div className="s-i-m-profile-info">
              <div className="s-i-m-profile-name">
                {current.firstName} {current.lastName}
              </div>
              <div className="s-i-m-profile-status text-center">
                {allowed ? (
                  <span className="fw-bold text-success">Allowed</span>
                ) : (
                  <span className="fw-bold text-danger">Not Allowed</span>
                )}
              </div>
              {/* <div
                onClick={() => {
                  statusUpdater(current._id);
                }}
                className="s-i-m-profile-status-label text-center border"
              >
                Change Status
              </div> */}

              {!allowed ? (
                <div
                  onClick={() => {
                    statusUpdater(current._id);
                  }}
                  className="s-i-m-profile-status-label text-center border"
                >
                  Change Status
                </div>
              ) : (
                <div>
                  {proof.length > 0 && proof[0].replyDate === null && (
                    <div
                      onClick={() => {
                        addressUpdater();
                      }}
                      className="s-i-m-profile-status-label text-center border"
                    >
                      Mark As Resolved
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {proof.length > 0 && proof[0].replyDate !== null && (
            <div className="trace-all-main-date tam-report text-center">
              <div className="s-i-m-date-content">
                <i className="fas fa-check text-success"></i>
                Addressed
              </div>
              <div className="s-i-m-date-content fw-bold">
                {dateFormatter(proof[0].replyDate)}
              </div>
            </div>
          )}
        </div>
      </div>

      {proof.length > 0 && (
        <div className="proof-section mt-5">
          <div className="h5 mt-2">Reported Negative</div>
          <div className="proof-section-header">Report Details</div>
          <div className="day-count-section border-bottom py-2 mb-2">
            <div className="day-count-label d-flex">
              Sent
              <div className="day-count-display mx-2 fw-bold text-primary">
                {" "}
                {dayCounter(proof[0].dateSent)}
              </div>
              day(s) ago.
            </div>
          </div>
          <div className="proof-section-details negative-proof-section-left">
            <div className="proof-section-details-left  negative-proof-left">
              <img
                src={`${api}/${proof[0].imgProof}`}
                alt="proofImg"
                className="ps-img"
              />
            </div>
            <div className="proof-section-details-right  negative-proof-right">
              <div className="proof-section-right-details negative-proof-right-details">
                <div className="proof-section-label">Test Type</div>
                <div className="proof-section-text">
                  {proof[0].testType.description}
                </div>
                <div className="proof-section-label">Date Tested</div>
                <div className="proof-section-text">
                  {dateFormatter(proof[0].dateTested)}
                </div>
                <div className="proof-section-label">Result Date</div>
                <div className="proof-section-text">
                  {dateFormatter(proof[0].resultDate)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NegativeDetails;
