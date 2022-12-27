import "./Messages.css";
import { useState, useEffect } from "react";
import AllMsgsThread from "./AllMsgsThread";
import NewMsgsThread from "./NewMsgsThread";

const Messages = ({
  accountInfo,
  msgToggler,
  msgReload,
  currentPerson,
  currentState,
}) => {
  const [showNew, setShowNew] = useState(currentState);
  const [showAll, setShowAll] = useState(!currentState);

  const reset = () => {
    setShowAll(false);
    setShowNew(false);
  };

  const toggleActive = (element) => {
    const msgsActive = document.querySelectorAll(`.msgs-list`);

    msgsActive.forEach((nav) => {
      nav.classList.remove("msgs-active");
    });

    element.classList.add("msgs-active");
    reset();
  };

  return (
    <div className="msgs-container">
      <div className="msgs-main">
        <div className="msgs-main-header">
          <div
            onClick={(e) => {
              toggleActive(e.target);
              setShowNew(true);
            }}
            className="msgs-active msgs-list msgs-new"
          >
            New<i className="ms-2 far fa-envelope"></i>
          </div>
          <div
            onClick={(e) => {
              toggleActive(e.target);
              setShowAll(true);
            }}
            className="msgs-list msgs-all"
          >
            All<i className="ms-2 far fa-envelope-open"></i>
          </div>
          <div onClick={() => msgToggler()} className="msgs-list msgs-all">
            Close<i className="ms-2 fas fa-times"></i>
          </div>
        </div>
        <div className="msgs-main-thread">
          {showNew && (
            <NewMsgsThread
              currentPerson={currentPerson}
              campusId={accountInfo.campus._id}
              msgReload={msgReload}
            />
          )}

          {showAll && (
            <AllMsgsThread
              currentPerson={currentPerson}
              campusId={accountInfo.campus._id}
              msgReload={msgReload}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
