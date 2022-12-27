import "../../assets/css/Movement.css";
import Image from "../../assets/images/calendar.png";
import { useEffect, useState } from "react";
import axios from "axios";

const Movement = ({ accountInfo }) => {
  const [hideLogs, setHideLogs] = useState(true);
  const [url] = useState(process.env.REACT_APP_URL);
  const [travelLogs, setTravelLogs] = useState([]);
  const [oneDay] = useState(86400000);
  const [dates, setDates] = useState([]);
  const [chosenDate, setChosenDate] = useState("");
  const [roomLogs, setRoomLogs] = useState([]);
  const [limit] = useState(14);
  const [defaultDate] = useState(
    new Date().toISOString().toString().slice(0, 10)
  );
  const [customDate, setCustomDate] = useState(
    new Date().toISOString().toString().slice(0, 10)
  );

  useEffect(() => {
    loadData();
    loadDates();
  }, []);

  const loadData = async () => {
    const allLogs = await fetchContacts();
    console.log(allLogs);
    setTravelLogs(allLogs);
  };

  const fetchContacts = async () => {
    const { data } = await axios.post(`${url}/showInteractions`, {
      id: accountInfo._id,
    });
    return data;
  };

  const loadDates = () => {
    let array = [];

    let now = Number(Date.now().toString());

    for (let i = 0; i < limit; i++) {
      let day = {
        numeric: "",
        string: "",
      };

      day.numeric = new Date(new Date(now).toString().slice(4, 16)).getTime();
      day.string = new Date(now).toString().slice(4, 16);
      array.push(day);
      setDates(array);
      now -= oneDay;
    }
  };

  const updateDates = (start) => {
    let array = [];

    for (let i = 0; i < limit; i++) {
      let day = {
        numeric: "",
        string: "",
      };

      day.numeric = new Date(new Date(start).toString().slice(4, 16)).getTime();
      day.string = new Date(start).toString().slice(4, 16);
      array.push(day);
      setDates(array);
      start -= oneDay;
    }
  };

  const checkVisited = (value) => {
    let counter = 0;
    const limit = Number(value) + oneDay;
    travelLogs.forEach((con) => {
      if (Number(con.date) >= value && Number(con.date) <= limit) {
        counter++;
      }
    });
    return counter;
  };

  const gatherRooms = (value) => {
    let array = [];
    const limit = Number(value) + oneDay;
    travelLogs.forEach((con) => {
      if (Number(con.date) >= value && Number(con.date) <= limit) {
        array.push(con);

        console.log(array);
      }
    });

    setRoomLogs(array);
  };

  const dateFormatter = (timeString) => {
    // const date = new Date(Number(timeString)).toString().slice(4, 15);
    const time = new Date(Number(timeString)).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${time}`;
  };

  return (
    <div className="movement-container">
      <div className="movement-main">
        <div
          onClick={() => setHideLogs(true)}
          className={`movement-logs ${hideLogs && "hide-movement-logs"}`}
        >
          <div className="movement-log-box">
            <div className="mlb-header">
              <div>
                <i className="me-2 fas fa-calendar-alt"></i>
                {chosenDate}
              </div>
            </div>
            <div className="mlb-list">
              <table className="table">
                <thead>
                  <tr>
                    <td>Location</td>
                    <td>In</td>
                    <td>Out</td>
                  </tr>
                </thead>
                <tbody>
                  {roomLogs.length > 0 ? (
                    roomLogs.map((rl) => (
                      <tr key={rl._id}>
                        <td>{rl.room.description}</td>
                        <td> {dateFormatter(rl.start)}</td>
                        <td> {dateFormatter(rl.end)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>No Recorded Visit</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="movement-main-left">
          <div className="mml-content">
            <img src={Image} alt={"av"} className="mml-content-img" />
            <div className="mml-content-text">
              In this page you can view your movement within your campus. It
              shows the rooms you visited on each specific day.
            </div>
          </div>
        </div>
        <div className="movement-main-right">
          <div className="mmr-header">
            {" "}
            <i className="fas fa-history me-3"></i>Movement Logs
          </div>
          <div className="interaction-starting-date">
            <span>Starting Date</span>
            <input
              value={customDate}
              onChange={(e) => {
                {
                  // customStartDate(e.target.value);
                  setCustomDate(e.target.value);
                  updateDates(Number(new Date(e.target.value).getTime()));
                }
              }}
              max={defaultDate}
              type="date"
              className="form-control"
            />
          </div>
          <hr />
          <div className="date-grid travel-grid">
            {dates.map((d) => (
              <div
                onClick={() => {
                  setChosenDate(d.string);
                  gatherRooms(d.numeric);
                  setHideLogs(false);
                }}
                className="date-box travel-box  border"
                key={Math.floor(Math.random() * 1000000)}
              >
                <div className="date-content-date"> {d.string}</div>
                <div className="date-content-visited">
                  <div className="visited-total">{checkVisited(d.numeric)}</div>
                  <div className="visited-text">Visits</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movement;
