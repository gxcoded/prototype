import "./subCss/StaffList.css";
import "./subCss/StudentList.css";
import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import SignUpLink from "./SignUpLink";

const StudentList = ({ campus, courseList }) => {
  const [sendLink, setSendLink] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  const [url] = useState(process.env.REACT_APP_URL);
  const slide = document.querySelector("#slideTrigger");
  const [currentName, setCurrentName] = useState({});
  const [tracker, setTracker] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({});
  const [lastRoomScan, setLastRoomScan] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchList();

      setStudentList(data);
      setFilterList(data);
    };
    loadData();
  }, []);

  const fetchList = async () => {
    const response = await axios.post(`${url}/getStudents`, {
      campus: campus._id,
    });
    const data = await response.data;

    return data;
  };

  const filterStudent = (id) => {
    id === "0"
      ? setFilterList(studentList)
      : setFilterList(studentList.filter((list) => list.course._id === id));
  };

  const search = async (keyword) => {
    const result = await axios.post(`${url}/searchStudents`, {
      keyword,
      campus: campus._id,
    });

    const data = await result.data;

    setFilterList(data);
  };
  const staffTracker = async (list) => {
    const latest = await locateStaff(list._id);
    const lastScan = await lastLocationScan(list._id);
    setLastRoomScan(lastScan);
    setCurrentLocation(latest);
    setCurrentName(list);
    setTracker(false);
    slide.click();
  };

  const locateStaff = async (id) => {
    const { data } = await axios.post(`${url}/staffTracker`, {
      id,
    });
    console.log(data);
    return data;
  };

  const lastLocationScan = async (id) => {
    const { data } = await axios.post(`${url}/lastPersonalLog`, {
      id,
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

  const timeFormatter = (timeString) => {
    const date = new Date(Number(timeString)).toString().slice(4, 15);
    const time = new Date(Number(timeString)).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${time}`;
  };

  return (
    <div className="staff-list-container">
      <div
        onClick={() => setTracker(true)}
        className={`tracker-pop ${tracker && "hide-tracker"}`}
      >
        <div className="tracker-main-box">
          <div className="tracker-icon">
            <i className="fas fa-map-marker-alt"></i>
          </div>
          <div className="tracker-name">
            {currentName.lastName}, {currentName.firstName}
          </div>
          <div className="tracker-main-content">
            <div className="tracker-box-left">
              <div className="tracker-text-header">Last Personal QR Scan</div>
              {Object.keys(currentLocation).length > 0 ? (
                <Fragment>
                  <div className="tracker-text-room">
                    {currentLocation.room.description}
                  </div>

                  <div className="tracker-text">
                    <div>
                      <div>{dateFormatter(currentLocation.date)}</div>
                    </div>
                    {/* <div className="time-log-info">
                      <div>
                        Time In:
                        <span className="ms-2">
                          {timeFormatter(currentLocation.start)}
                        </span>
                      </div>
                      <div>
                        Time Out:
                        <span className="ms-2">
                          {currentLocation.end !== null
                            ? timeFormatter(currentLocation.end)
                            : "--"}
                        </span>
                      </div>
                    </div> */}
                  </div>
                </Fragment>
              ) : (
                <div className="tracker-text-unknown">Unknown</div>
              )}
            </div>
            <div className="tracker-box-right">
              <div className="tracker-text-header">Last Location QR Scan</div>
              {Object.keys(lastRoomScan).length > 0 ? (
                <Fragment>
                  <div className="tracker-text-room">
                    {lastRoomScan.locationId.description}
                  </div>

                  <div className="tracker-text">
                    <div>{dateFormatter(lastRoomScan.date)}</div>
                    {/* <div className="time-log-info">
                      <div>
                        Time In:
                        <span className="ms-2">
                          {timeFormatter(lastRoomScan.timeIn)}
                        </span>
                      </div>
                      <div>
                        Time Out:
                        <span className="ms-2">
                          {currentLocation.end !== null
                            ? timeFormatter(lastRoomScan.timeOut)
                            : "--"}
                        </span>
                      </div>
                    </div> */}
                  </div>
                </Fragment>
              ) : (
                <div className="tracker-text-unknown">Unknown</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className=" d-flex justify-content-between align-items-center"
        id="top"
      >
        <div className="staff-list-title">
          <i className="fas fa-user-graduate me-3"></i>Manage Students
        </div>
        <a href="#top" id="slideTrigger" style={{ display: "none" }}></a>
        {!sendLink ? (
          <div
            onClick={() => setSendLink(!sendLink)}
            className="send-sign-up-links-btn"
          >
            <span>
              <i className="me-2 fas fa-share-square"></i>Send SignUp Link
            </span>
          </div>
        ) : (
          <div
            onClick={() => setSendLink(!sendLink)}
            className="send-sign-up-links-btn"
          >
            <span>
              <i className="me-2 fas fa-times"></i>Close
            </span>
          </div>
        )}
      </div>
      {sendLink ? (
        <SignUpLink campusId={campus._id} type={2} />
      ) : (
        <div className="campus-staff-main">
          <div className="list-top-controls">
            <div className="list-counter-box">
              <div className="list-counter">{filterList.length}</div>
              <div className="list-counter-label">Total Records</div>
            </div>
            <div className="list-filter-controls">
              <div className="controls-title">
                <i className="me-2 fas fa-sliders-h"></i>Filter List
              </div>
              <div className="form-group">
                <label>Course</label>
                <select
                  onChange={(e) => filterStudent(e.target.value)}
                  defaultValue={"0"}
                  className="form-control-select"
                >
                  <option value="0">All</option>
                  {courseList.map((list) => (
                    <option key={list._id} value={list._id}>
                      {list.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="table-list staff-table py-5">
            <div className="table-header px-2 mb-5 d-flex justify-content-between align-items-center">
              <div className="table-header-text fw-bold">Student List</div>
              <div>
                <div className="input-group">
                  <input
                    placeholder="ID Number or Last Name"
                    onKeyUp={(e) => search(e.target.value)}
                    type="search"
                    className="form-control search-control rounded"
                    aria-label="Search"
                    aria-describedby="search-addon"
                  />
                  <button type="button" className="btn btn-outline-primary">
                    Search
                  </button>
                </div>
              </div>
            </div>
            <table className="campus-table table table-striped">
              <thead>
                <tr>
                  <th className="fw-bold" scope="col">
                    Img
                  </th>
                  <th className="fw-bold" scope="col">
                    Full Name
                  </th>
                  <th className="fw-bold" scope="col">
                    Course
                  </th>
                  <th className="fw-bold" scope="col">
                    ID Number
                  </th>
                  <th className="fw-bold" scope="col">
                    Contact Number
                  </th>
                  <th className="fw-bold" scope="col">
                    Address
                  </th>
                  <th className="fw-bold" scope="col">
                    Status
                  </th>
                  <th className="fw-bold text-center" scope="col">
                    <i className="ms-2 fas fas fa-tools"></i>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filterList.length > 0 ? (
                  filterList.map((list) => (
                    <tr key={list._id}>
                      <td>
                        <img
                          src={`${api}/${list.image}`}
                          // src={require(`../../../../server/uploads/${list.image}`)}
                          alt={list._id}
                          className="table-image"
                        />
                      </td>
                      <td>
                        {list.lastName}, {list.firstName}
                      </td>
                      <td>{list.course.description}</td>
                      <td>{list.idNumber}</td>
                      <td>{list.phoneNumber}</td>
                      <td>{list.address}</td>
                      <td>
                        {list.allowed ? (
                          <div className="text-success">Allowed</div>
                        ) : (
                          <div className="text-danger">Not Allowed</div>
                        )}
                      </td>
                      <td>
                        <div
                          className="table-options pointer"
                          onClick={() => {
                            staffTracker(list);
                          }}
                        >
                          <span className="text-warning me-2">
                            <i className="fas fa-expand-arrows-alt"></i>
                          </span>
                          {/* <span className="option-delete">
                            <i className="fas fa-trash-alt"></i>
                          </span> */}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="fw-bold fst-italic">No Records found...</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="show-count p-4">
              Showing{" "}
              <span className="text-primary fw-bold">{filterList.length}</span>{" "}
              out of{" "}
              <span className="text-primary fw-bold">{filterList.length}</span>{" "}
              Records
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
