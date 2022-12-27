import "../subComponents/subCss/Chat.css";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";

const Chats = ({ accountInfo }) => {
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  const [text, setText] = useState("");
  const [url] = useState(process.env.REACT_APP_URL);
  const [chatThread, setChatThread] = useState([]);
  const [currentThread, setCurrentThread] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showRightContent, setShowRightContent] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const bottomTrigger = document.querySelector("#bottomSlide");

  const dateFormatter = (timeString) => {
    const date = new Date(Number(timeString)).toString().slice(4, 15);
    const time = new Date(Number(timeString)).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${date} ${time}`;
  };

  useEffect(() => {
    loadChat();
    loadRoles();
  }, []);

  const fetchRoles = async () => {
    const { data } = await axios.get(`${url}/allRoles`);
    return data;
  };

  const loadRoles = async () => {
    const roles = await fetchRoles();
    setRoles(roles);
  };

  const fetchChat = async () => {
    const { data } = await axios.post(`${url}/getChat`, {
      sender: accountInfo._id,
    });
    return data;
  };

  const roleChecker = (id) => {
    let description = "";

    roles.forEach((role) => {
      if (role._id === id) {
        description = role.description;
      }
    });

    return description;
  };
  const loadChat = async () => {
    const array = [];
    const data = await fetchChat();
    setAllMessages(data);

    data.forEach((d) => {
      if (d.sender._id !== accountInfo._id) {
        let exist = false;
        if (array.length > 0) {
          array.forEach((msg) => {
            if (msg.sender._id === d.sender._id) {
              exist = true;
            }
          });
          !exist && array.push(d);
        } else {
          // setCurrentThread(d);
          array.push(d);
        }
      }
    });
    console.log(array);
    setChatThread(array);
  };

  const displayThread = (id) => {
    let array = [];

    allMessages.forEach((msg) => {
      if (msg.sender._id === id || msg.receiver._id === id) {
        array.push(msg);
      }
    });
    return array;
  };

  const isSender = (sender) => {
    return accountInfo._id === sender;
  };

  const chatSender = () => {
    if (text) {
      if (chatSent()) {
        setText("");
        loadChat();
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
      receiver: currentThread.sender._id,
      text,
      sender: accountInfo._id,
    });
    console.log(data);
    return data;
  };

  const toggleActive = (e) => {
    reset();
    e.classList.add("active-chat");
  };

  const reset = () => {
    document.querySelectorAll(".chat-thread").forEach((chat) => {
      chat.classList.remove("active-chat");
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-main-header">
        <i className="fab fa-rocketchat"></i>
        <span className="ms-2">Chats</span>
      </div>
      <div className="chat-main">
        <a id="bottomSlide" href="#bottomChat" style={{ display: "none" }}>
          Slide
        </a>
        <div className="chat-main-left position-relative">
          {chatThread.length > 0 ? (
            <div>
              {chatThread.map((thread) => (
                <div
                  onClick={(e) => {
                    setCurrentThread(thread);
                    setShowRightContent(true);
                    toggleActive(e.target);
                  }}
                  key={thread._id}
                  className="chat-thread"
                >
                  <img
                    className="chat-thread-img"
                    src={`${api}/${thread.sender.image}`}
                    alt="chat-thread-img"
                  />
                  <div className="chat-thread-details">
                    <div className="chat-thread-name">{`${thread.sender.firstName} ${thread.sender.lastName}`}</div>
                    <div className="chat-thread-date">
                      {dateFormatter(thread.dateSent)}
                    </div>
                  </div>
                </div>
              ))}
              {/* <div
                id="bottomThread"
                style={{ height: "100px", paddingBottom: "2em" }}
              ></div> */}
            </div>
          ) : (
            <div className="empty-thread">No Messages Yet...</div>
          )}
        </div>
        <div className="chat-main-right">
          {showRightContent ? (
            <Fragment>
              <div className="chat-main-right-header">
                <div className="chat-main-right-header-details">
                  <img
                    className="chat-thread-img"
                    src={`${api}/${currentThread.sender.image}`}
                    alt="chat-thread-img"
                  />
                  <div className="chat-thread-details">
                    <div className="chat-thread-name">{`${currentThread.sender.firstName} ${currentThread.sender.lastName}`}</div>
                    <div className="chat-thread-role">
                      {roleChecker(currentThread.sender.role)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="chat-main-right-content">
                <div className="chat-nurse-thread">
                  {displayThread(currentThread.sender._id).map((thread) =>
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
                  <div id="bottomChat" style={{ height: "100px" }}></div>
                </div>
              </div>

              <div className="chat-main-right-input border">
                <div className="chat-input-main">
                  <input
                    onKeyUp={(e) => {
                      e.keyCode === 13 && chatSender();
                    }}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type Message Here"
                    type="text"
                    className="form-control chat-input-box-section"
                  />
                  <button
                    onClick={() => {
                      bottomTrigger.click();
                      chatSender();
                    }}
                    className="btn btn-primary mt-2"
                  >
                    Send<i className="ms-2 far fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </Fragment>
          ) : (
            <div className="click-thread">
              <i className="far fa-comments"></i>
              <span className="click-thread-text">
                Click Thread to show message...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chats;
