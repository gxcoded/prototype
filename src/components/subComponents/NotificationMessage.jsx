import "./subCss/NotificationMessage.css";
import Maintenance from "./Maintenance";
import Phone from "../../assets/images/phone.png";
import { Fragment, useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";

const NotificationMessage = ({ campus }) => {
  const [underMaintenance, setUnderMaintenance] = useState(false);
  const [url] = useState(process.env.REACT_APP_URL);
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState("");
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    loadMessage();
  }, []);

  const loadMessage = async () => {
    const text = await fetchMessage();
    setMessage(text);
  };
  const fetchMessage = async () => {
    const { data } = await axios.post(`${url}/getMessage`, {
      campus,
    });
    return data.text;
  };

  const addMessage = async () => {
    const { data } = await axios.post(`${url}/addMessage`, {
      campus,
      text: message,
    });
    return data;
  };

  const messageUpdate = async () => {
    if (message.length < 20) {
      swal({ text: "Message must be at least 20 characters", icon: "warning" });
    } else {
      const saved = await addMessage();
      saved
        ? swal({
            title: "Success!",
            text: "Message Updated",
            icon: "success",
          })
        : swal({ text: "Please Try again", icon: "error" });

      setEditable(false);
    }
  };

  return (
    <Fragment>
      {underMaintenance ? (
        <Maintenance section={"Notification Message"} />
      ) : (
        <div className="notification-message-container">
          <div
            onClick={() => setPreview(false)}
            className={`preview-container ${preview && "hide-preview"}`}
          >
            <div className={`preview-display`}>
              <div className="phone-msg-display">{message}</div>
            </div>
          </div>
          <div className="notification-message-title">
            <i className="me-2 fas fa-bell"></i>Notification
          </div>
          <div className="notification-main-section">
            <div className="notification-main-section-right">
              <div className="notification-main-section-right-content">
                <div className="custom-msg-header">
                  Custom Notification Message
                </div>
                <div className="custom-msg-box">
                  <div className="">
                    <textarea
                      required
                      minLength={"20"}
                      disabled={!editable}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className=" custom-text-area"
                      rows="10"
                    ></textarea>
                  </div>
                </div>
                <div className="custom-mg-btn text-end mt-3">
                  {editable ? (
                    <button
                      onClick={() => messageUpdate()}
                      className="btn btn-secondary me-2"
                    >
                      Update
                    </button>
                  ) : (
                    <div
                      onClick={() => setEditable(true)}
                      className="btn btn-warning"
                    >
                      <i className="far fa-edit"></i>
                    </div>
                  )}
                  <div
                    onClick={() => setPreview(true)}
                    className="btn btn-custom-red mx-2"
                  >
                    Preview
                  </div>
                </div>
              </div>
            </div>

            <div className="notification-main-section-left"></div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default NotificationMessage;
