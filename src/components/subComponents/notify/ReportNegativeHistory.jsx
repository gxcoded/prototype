import "./ReportHistory.css";
import { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import DefaultImage from "../../../assets/images/dimg.png";

const ReportNegativeHistory = ({ accountInfo }) => {
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

  return (
    <div className="sent-messages-container">
      <div className="sent-messages-main">
        {negativeReport.map((msg) => (
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
                {/* <div className="sent-message-text">{msg.message}</div>
                <div className="sent-message-reply-section">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportNegativeHistory;
