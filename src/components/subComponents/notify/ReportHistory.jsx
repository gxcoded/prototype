import "./ReportHistory.css";
import { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import DefaultImage from "../../../assets/images/dimg.png";

const ReportHistory = ({ accountInfo }) => {
  const [url] = useState(process.env.REACT_APP_URL);
  const [messages, setMessages] = useState([]);
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  const [revert, setRevert] = useState(false);
  const [testTypes, setTestTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [file, setFile] = useState("");
  const [caseId, setCaseId] = useState("");
  const [reload, setReload] = useState(false);
  const [negativeReport, setNegativeReport] = useState([]);
  const [minimumDate, setMinimumDate] = useState("");
  const [dateTested, setDateTested] = useState(
    new Date().toISOString().toString().slice(0, 10)
  );

  const [resultDate, setResultDate] = useState(
    new Date().toISOString().toString().slice(0, 10)
  );

  const [defaultDate] = useState(
    new Date().toISOString().toString().slice(0, 10)
  );

  useEffect(() => {
    loadMessages();
    loadTestTypes();
    loadNegative();
  }, [reload]);

  //  get negative reports
  const loadNegative = async () => {
    const data = await fetchNegative();
    setNegativeReport(data);
  };

  const fetchNegative = async () => {
    const { data } = await axios.post(`${url}/getNegative`, {
      accountOwner: accountInfo._id,
    });
    return data;
  };

  // iterate Negative
  const negativeChecker = (id) => {
    let obj = {};
    negativeReport.forEach((neg) => {
      neg.case === id && (obj = neg);
    });

    return obj;
  };

  //load test types
  const loadTestTypes = async () => {
    const types = await fetchTestTypes();
    console.log(types);

    setTestTypes(types);
  };

  const fetchTestTypes = async () => {
    const { data } = await axios.post(`${url}/getTestTypes`);
    return data;
  };

  const loadMessages = async () => {
    const fetchedMessages = await fetchMessages();
    setMessages(fetchedMessages);
  };

  const fetchMessages = async () => {
    const { data } = await axios.post(`${url}/getSentMessages`, {
      account: accountInfo._id,
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

  const dateFormatOnly = (timeString) => {
    const date = new Date(Number(timeString)).toString().slice(4, 15);
    return `${date}`;
  };

  const previewImage = (e) => {
    const preview = document.querySelector("#imgPreview");

    const reader = new FileReader();

    reader.onload = () => {
      preview.src = reader.result;
    };

    setFile(e.target.files[0]);
    reader.readAsDataURL(e.target.files[0]);
  };

  const trigger = () => {
    const uploader = document.querySelector("#picUploader");
    uploader.click();
  };

  const sendNow = async () => {
    if (selectedType) {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("campus", accountInfo.campus._id);
        formData.append("caseId", caseId);
        formData.append("testType", selectedType);
        formData.append("dateTested", new Date(dateTested).getTime());
        formData.append("resultDate", new Date(resultDate).getTime());
        formData.append("dateSent", Date.now().toString());
        formData.append("accountOwner", accountInfo._id);
        // formData.append("adminNumber", adminInfo.phoneNumber);
        // formData.append("adminEmail", adminInfo.email);
        // formData.append("caseId", caseId);

        console.log(formData);
        try {
          const res = await axios.post(`${url}/reportNegative`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          console.log(res.data);

          swal({
            title: "Sent!",
            text: "Notification was sent to School Admin",
            icon: "success",
          });
          setFile("");
          document.querySelector("#imgPreview").src = DefaultImage;
          setReload(!reload);
          setRevert(false);
        } catch (error) {
          console.log(error);
        }
      } else {
        swal("Please Include an Image of your test Result!");
      }
    } else {
      swal("Please Select Test Type");
    }
  };

  const toggleRevert = () => {
    setRevert(!revert);
  };

  return (
    <div className="sent-messages-container">
      {revert && (
        <div className="revert-pop-up">
          <div className="revert-pop-up-form">
            <div className="rp-uf-header">
              <span>Please Provide Details</span>
              <span
                className="rp-close-btn"
                onClick={() => {
                  toggleRevert();
                }}
              >
                <i className="fas fa-times"></i>
              </span>
            </div>
            <div className="rp-uf-main">
              <div className="rp-uf-left">
                <div className="rp-uf-left-header">
                  Please attach a picture of your test result
                </div>
                <img
                  onClick={() => trigger()}
                  id="imgPreview"
                  src={DefaultImage}
                  alt="nfw-imgs"
                  className="rp-left-img"
                />
              </div>
              <div className="rp-uf-right">
                <div className="mt-3">
                  <span>Test Type</span>
                  <select
                    required
                    onChange={(e) => {
                      setSelectedType(e.target.value);
                    }}
                    className="form-control"
                    defaultValue={selectedType}
                  >
                    f
                    <option value={selectedType} disabled>
                      Select
                    </option>
                    {testTypes.map((list) => (
                      <option key={list._id} value={list._id}>
                        {list.description}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-2">
                  <span>Date Tested</span>
                  <input
                    value={dateTested}
                    onChange={(e) => {
                      {
                        setDateTested(e.target.value);
                        setMinimumDate(e.target.value);
                      }
                    }}
                    max={defaultDate}
                    type="date"
                    className="form-control"
                  />
                </div>
                <div className="mt-2">
                  <span>Date when you get the test Result</span>
                  <input
                    value={resultDate}
                    onChange={(e) => {
                      {
                        setResultDate(e.target.value);
                      }
                    }}
                    min={minimumDate}
                    max={defaultDate}
                    type="date"
                    className="form-control"
                  />
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => sendNow()}
                    className="btn btn-primary btn-block"
                  >
                    Send Result
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="sent-messages-main">
        {messages.map((msg) => (
          <div key={msg._id} className="sent-msg-wrap bg-light">
            <input
              onChange={(e) => previewImage(e)}
              id="picUploader"
              type="file"
              style={{ display: "none" }}
            />
            <div className="sent-message">
              <img
                src={`${api}/${msg.imgProof}`}
                // src={require(`../../../../../server/uploads/${msg.imgProof}`)}
                alt={msg._id}
                className="sent-message-img mt-5"
              />
              <div className="sent-message-details mt-5">
                <div className="sent-message-date">
                  <div className="sent-message-date-label">Date Sent</div>
                  {dateFormatter(msg.dateSent)}
                </div>
                <div className="sent-message-status">
                  <div className="status-label">
                    Message Status:{" "}
                    {msg.seen ? (
                      <span>
                        Seen<i className="ms-2 fas fa-eye text-success"></i>
                      </span>
                    ) : (
                      <span>
                        Delivered
                        <i className="ms-2 fas fa-check-circle text-primary"></i>
                      </span>
                    )}
                  </div>
                </div>
                <hr />
                <div className="sent-message-text">{msg.message}</div>
                {/* <div className="sent-message-reply-section">
                  {msg.reply.length > 0 ? (
                    <div className="admin-reply">
                      <div className="admin-reply-msg">{msg.reply}</div>
                      <div className="admin-reply-date">
                        {dateFormatter(msg.replyDate)}
                      </div>
                    </div>
                  ) : (
                    <div className="admin-reply-msg">
                      School Nurse has no reply yet..
                    </div>
                  )}
                </div> */}
              </div>
            </div>
            {/* <div className="msg-neg-stats bg-light">
              <div className="msg-neg-header">Negative Results</div>
              {Object.keys(negativeChecker(msg._id)).length > 0 ? (
                <div className="sent-message">
                  <img
                    src={`${api}/${negativeChecker(msg._id).imgProof}`}
                    alt={Math.random() * 1000}
                    className="sent-message-img"
                  />
                  <div className="sent-message-details mt-5">
                    <div className="sent-message-date">
                      <div className="sent-message-date-label">Date Sent</div>
                      {dateFormatter(negativeChecker(msg._id).dateSent)}
                    </div>
                    <div className="sent-message-status">
                      <div className="status-label">
                        Message Status:{" "}
                        {negativeChecker(msg._id).seen ? (
                          <span>
                            Seen<i className="ms-2 fas fa-eye text-success"></i>
                          </span>
                        ) : (
                          <span>
                            Delivered
                            <i className="ms-2 fas fa-check-circle text-primary"></i>
                          </span>
                        )}
                      </div>
                      <hr />
                      <div className="date-test-section">
                        <div className="sent-message-date">
                          <div className="neg-date-label">Date Tested</div>
                          {dateFormatOnly(negativeChecker(msg._id).dateTested)}
                        </div>
                        <div className="sent-message-date">
                          <div className="neg-date-label">Test Result Date</div>
                          {dateFormatOnly(negativeChecker(msg._id).resultDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  className="btn btn-success"
                  onClick={() => {
                    toggleRevert();
                    setCaseId(msg._id);
                  }}
                >
                  I've got my negative Result
                </button>
              )}
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportHistory;
