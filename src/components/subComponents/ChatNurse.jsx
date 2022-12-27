import "../subComponents/subCss/ChatNurse.css";
import { useState, useEffect } from "react";
import axios from "axios";

const ChatNurse = ({ accountInfo }) => {
  const [nurseInfo, setNurseInfo] = useState({});
  const [url] = useState(process.env.REACT_APP_URL);
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  const [text, setText] = useState("");
  const [chatThread, setChatThread] = useState([]);
  const bottomTrigger = document.querySelector("#bottomTrigger");
  const [focused, setFocused] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    loadNurseInfo();
    loadChat();
  }, [reload]);

  const fetchNurseInfo = async () => {
    const { data } = await axios.post(`${url}/getNurseInfo`, {
      campus: accountInfo.campus._id,
    });
    return data;
  };

  const loadNurseInfo = async () => {
    const data = await fetchNurseInfo();
    setNurseInfo(data);
    console.log(data);
  };

  const chatSender = () => {
    if (text) {
      if (chatSent()) {
        setText("");
        setReload(!reload);
        bottomTrigger.click();
      } else {
        alert("failed");
      }
    }
  };

  const chatSent = async () => {
    const isSent = await sendChat();

    return isSent;
  };

  const sendChat = async () => {
    const { data } = await axios.post(`${url}/addChat`, {
      receiver: nurseInfo._id,
      text,
      sender: accountInfo._id,
    });
    console.log(data);
    return data;
  };

  const fetchChat = async () => {
    const { data } = await axios.post(`${url}/getChat`, {
      sender: accountInfo._id,
    });
    return data;
  };

  const loadChat = async () => {
    const data = await fetchChat();
    console.log(data);
    setChatThread(data);
  };

  const isSender = (sender) => {
    return accountInfo._id === sender;
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

  const checkScreenWidth = () => {
    if (window.screen.width < 500) {
      return true;
    }

    return false;
  };
  return (
    <div className="chat-nurse-container">
      <div className="chat-nurse-header">
        <i className="fab fa-rocketchat me-2"></i>Chat Campus Nurse
      </div>
      <div className="chat-nurse-main">
        <a id="bottomTrigger" href="#bottom" style={{ display: "none" }}></a>
        <div className="chat-nurse-main-left ">
          <div className="chat-nurse-info ">
            <img
              className="chat-nurse-info-img"
              src={`${api}/${nurseInfo.image}`}
              alt="chat-thread-img"
            />
            <div className="chat-thread-details">
              <div className="chat-nurse-info-name">{`${nurseInfo.firstName} ${nurseInfo.lastName}`}</div>
              <div className="chat-nurse-info-role">{`Campus Nurse`}</div>
              <div className="chat-nurse-info-number">
                <i className="fas fa-phone me-2"></i>
                {nurseInfo.phoneNumber}
              </div>
            </div>
          </div>
        </div>
        <div className="chat-nurse-main-right">
          <div className="chat-nurse-thread">
            {chatThread.map((thread) =>
              isSender(thread.sender._id) ? (
                <div key={thread._id} className="chat-texts chat-sent">
                  <div className="chat-content ">
                    {thread.text}
                    <div className="chat-dates">
                      {dateFormatter(thread.dateSent)}
                    </div>
                  </div>
                </div>
              ) : (
                <div key={thread._id} className="chat-texts chat-receive">
                  <div className="chat-content ">
                    {thread.text}
                    <div className="chat-dates">
                      {dateFormatter(thread.dateSent)}
                    </div>
                  </div>
                </div>
              )
            )}
            <div id="bottom" style={{ height: "100px" }}></div>
          </div>
          <div
            className={`chat-input ${
              focused && checkScreenWidth() && "on-top-of-key"
            }`}
          >
            <div className="chat-input-main">
              <input
                onFocus={(e) => {
                  setFocused(true);
                }}
                onBlur={(e) => setFocused(false)}
                onKeyUp={(e) => {
                  e.keyCode === 13 && chatSender();
                }}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type Message Here"
                type="text"
                className="form-control chat-input-box"
              />
              <button
                onClick={() => chatSender()}
                className="btn btn-primary mt-2"
              >
                Send<i className="ms-2 far fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatNurse;
