import { useEffect, useState } from "react";
import axios from "axios";
import "./subCss/Logs.css";
import swal from "sweetalert";

const Logs = ({
  accountInfo,
  url,
  reLoad,
  entranceLogs,
  assignedRoom,
  pendingLogs,
}) => {
  const [logList, setLogList] = useState([]);
  const [api] = useState(process.env.REACT_APP_API_SERVER);

  useEffect(() => {
    logs();
  }, [reLoad]);

  const logs = async () => {
    const fetchedLogs = await fetchLogs();
    setLogList(fetchedLogs);
    if (Object.keys(assignedRoom).length > 0) {
      entranceLogs();
    } else {
      pendingLogs();
    }
  };

  const fetchLogs = async () => {
    const response = await axios.post(`${url}/fetchLogs`, {
      campus: accountInfo.campus._id,
      id: accountInfo._id,
    });
    return await response.data;
  };

  const compute = (value) => {
    const now = Number(Date.now());
    const val = Number(value);
    const rem = Math.floor((now - val) / 60000);

    if (rem >= 60) {
      return `${Math.floor(rem / 60)} Hr.`;
    } else {
      return `${rem} Min.`;
    }
    return rem;
  };

  const endTransaction = async (list) => {
    const response = await axios.post(`${url}/updateLog`, {
      id: list._id,
      start: list.start,
    });

    const updated = await response.data;

    if (updated) {
      swal("Done!", "Transaction Done!", "success");
      logs();
    }
  };

  return (
    <div className="log-list-container">
      <div className="log-list-title">
        <i className="me-2 fas fa-retweet"></i>Logs
      </div>
      <div className="log-cards">
        {logList.length > 0 ? (
          logList.map((list) => (
            <div key={list._id} className="log-card">
              <div className="log-card-image">
                <img
                  className="scan-result-box-image"
                  src={`${api}/${list.accountScanned.image}`}
                  // src={require(`../../../../server/uploads/${list.accountScanned.image}`)}
                  alt={list._id}
                />
              </div>
              <div className="log-card-info">
                <div className="log-card-info-name">
                  {list.accountScanned.firstName} {list.accountScanned.lastName}
                </div>
                <div className="log-card-info-room">
                  {list.room.description}
                </div>
                <div className="log-card-info-date">{compute(list.date)}</div>
                <div className="log-card-info-button mt-4">
                  <div
                    onClick={() => endTransaction(list)}
                    className="btn btn-custom-red"
                  >
                    <i className="me-2 fas fa-vote-yea"></i>Done
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No Pending Logs</div>
        )}
      </div>
    </div>
  );
};
export default Logs;
