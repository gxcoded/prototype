import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import swal from "sweetalert";

const Thread = ({ accountId, toggleThread, newThread }) => {
  const [url] = useState(process.env.REACT_APP_URL);
  const [threads, setThreads] = useState([]);
  const [reply, setReply] = useState("");
  const [api] = useState(process.env.REACT_APP_API_SERVER);

  const loadThread = async () => {
    const msgs = await fetchMessages();
    setThreads(msgs);
    updateMessageStatus();
  };

  const fetchMessages = async () => {
    const { data } = await axios.post(`${url}/getSentMessages`, {
      account: accountId,
    });
    console.log(data);
    return data;
  };

  const updateMessageStatus = async () => {
    const { data } = await axios.post(`${url}/updateMessageStatus`, {
      accountId,
    });
    console.log(data);
    return data;
  };

  useEffect(() => {
    loadThread();
  }, []);

  const sendReply = async (threadId) => {
    const { data } = await axios.post(`${url}/setMessageReply`, {
      id: threadId,
      reply,
    });

    return data;
  };
  const checkReply = async (threadId) => {
    if (reply.length > 2) {
      const isSent = await sendReply(threadId);

      if (isSent) {
        swal({
          title: "Success!",
          text: "Reply Sent!",
          icon: "success",
        });
        setTimeout(() => {
          setReply("");
          loadThread();
        }, 1000);
      }
    } else {
      swal("Reply is too short");
    }
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
    <div className="single-thread-container">
      <div className="single-thread-header">
        <span onClick={() => toggleThread()} className="back-thread">
          <i className="me-2 fas fa-caret-left"></i>Back
        </span>
      </div>
      <div className="single-thread-main">
        {threads.map((thread) => (
          <Fragment key={thread._id}>
            <div className="single-thread-main-profile mt-3">
              <img
                src={`${api}/${thread.accountOwner.image}`}
                // src={require(`../../../../../server/uploads/${thread.accountOwner.image}`)}
                alt="$$$"
                className="msgs-thread-profile"
              />

              <div className="msgs-thread-captions">
                <div className="msgs-thread-name">
                  {thread.accountOwner.firstName} {thread.accountOwner.lastName}
                </div>
                <div className="msgs-thread-date">
                  {dateFormatter(thread.dateSent)}
                </div>
                <div className="msgs-thread-text">{thread.message}</div>
                {thread.reply.length === 0 ? (
                  <div className="reply-form">
                    <input
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Aa"
                      type="text"
                      className="form-control"
                    />
                    <button
                      onClick={() => checkReply(thread._id)}
                      className="btn btn-custom-red"
                    >
                      Reply
                    </button>
                  </div>
                ) : (
                  <div className="show-reply">
                    <div className="show-reply-message">{thread.reply}</div>
                    <div className="show-reply-date">
                      <i className="fas fa-check-double me-2"></i>{" "}
                      {dateFormatter(thread.replyDate)}
                    </div>
                  </div>
                )}
                {/* {newThread && (
                  <button className="btn btn-primary mt-2">
                    Trace Contacts
                  </button>
                )} */}
              </div>
            </div>
            <div className="single-thread-msgs mt-5">
              <div className="single-thread-details">
                <div className="single-thread-details-label">
                  Report Details
                </div>
                <div className="single-thread-dates-details">
                  <div className="date-tested-label">Date Tested Positive</div>
                  <div className="date-tested-date">
                    {new Date(Number(thread.dateTested))
                      .toString()
                      .slice(0, 16)}
                  </div>
                  <div className="date-tested-label mt-2">
                    Last Campus Visitation Date
                  </div>
                  <div className="date-tested-date">
                    {new Date(Number(thread.lastVisit)).toString().slice(0, 16)}
                  </div>
                </div>
                <div className="img-proof-label">Test Result Image</div>
                <div className="img-proof-wrap">
                  {
                    <img
                      src={`${api}/${thread.imgProof}`}
                      // src={require(`../../../../../server/uploads/${thread.imgProof}`)}
                      alt={thread._id}
                      className="single-thread-img-proof"
                    />
                  }
                </div>
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Thread;
