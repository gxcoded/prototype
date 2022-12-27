import { Fragment, useEffect, useState } from "react";
import Thread from "./Thread";
import axios from "axios";

const NewMsgsThread = ({ campusId, msgReload, currentPerson }) => {
  const [singleThread, setSingleThead] = useState(false);
  const [url] = useState(process.env.REACT_APP_URL);
  const [threads, setThreads] = useState([]);
  const [accountId, setAccountId] = useState("");
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  const [newThread] = useState(true);

  useEffect(() => {
    dataLoader();
    Object.keys(currentPerson).length > 0 && setAccountId(currentPerson._id);
    if (currentPerson) {
      setSingleThead(true);
    }
  }, []);

  const toggleThread = () => {
    setSingleThead(!singleThread);
  };

  const dataLoader = async () => {
    const array = [];
    const fetchedMessages = await fetchMessages();

    fetchedMessages.forEach((msg) => {
      let exist = false;

      if (array.length > 0) {
        array.forEach((element) => {
          if (element.accountOwner._id === msg.accountOwner._id) {
            exist = true;
          }
        });
        !exist && array.push(msg);
      } else {
        array.push(msg);
      }
      setThreads(array);
    });
  };

  //messages
  const fetchMessages = async () => {
    const { data } = await axios.post(`${url}/getAllNewMessages`, {
      campus: campusId,
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

  return (
    <div className="msgs-thread-container">
      {singleThread ? (
        <Thread
          accountId={accountId}
          toggleThread={toggleThread}
          msgReload={msgReload}
          newThread={newThread}
        />
      ) : (
        <Fragment>
          {threads.length > 0 ? (
            <Fragment>
              {threads.map((thread) => (
                <div
                  onClick={() => {
                    setAccountId(thread.accountOwner._id);
                    setSingleThead(true);
                  }}
                  key={thread._id}
                  className="msgs-thread"
                >
                  <div className="msgs-thread-content">
                    <img
                      src={`${api}/${thread.accountOwner.image}`}
                      // src={require(`../../../../../server/uploads/${thread.accountOwner.image}`)}
                      alt=""
                      className="msgs-thread-profile"
                    />
                  </div>
                  <div className="msgs-thread-captions">
                    <div className="msgs-thread-name">
                      {thread.accountOwner.firstName}{" "}
                      {thread.accountOwner.lastName}
                    </div>
                    <div className="msgs-thread-date">
                      {dateFormatter(thread.dateSent)}
                    </div>
                    <div className="msgs-thread-text">{thread.message}</div>
                  </div>
                </div>
              ))}
            </Fragment>
          ) : (
            <Fragment>
              <div className="thread-empty">...No New Notifications</div>
            </Fragment>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default NewMsgsThread;
