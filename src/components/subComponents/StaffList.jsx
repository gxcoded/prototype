import "./subCss/StaffList.css";
import { Fragment, useEffect, useState } from "react";
import SignUpLink from "./SignUpLink";
import axios from "axios";
import swal from "sweetalert";

const StaffList = ({ accountInfo, roles }) => {
  const [sendLink, setSendLink] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [tracker, setTracker] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({});
  const [url] = useState(process.env.REACT_APP_URL);
  const [currentName, setCurrentName] = useState({});
  const [api] = useState(process.env.REACT_APP_API_SERVER);

  const fetchList = async () => {
    const response = await axios.post(`${url}/staffAccounts`, {
      campus: accountInfo.campus._id,
    });
    return await response.data;
  };

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchList();
      console.log(data);
      setStaffList(data);
      setFilterList(data);
    };

    loadData();
  }, []);

  const filterStaff = (id) => {
    console.log(id);
    console.log(staffList);
    id === "0"
      ? setFilterList(staffList)
      : setFilterList(staffList.filter((list) => list.role._id === id));
  };

  const search = async (keyword) => {
    const result = await axios.post(`${url}/searchStaffs`, {
      keyword,
      campus: accountInfo.campus._id,
    });

    const data = await result.data;
    console.log(data);
    setFilterList(data);
  };

  const deleteStaff = (id) => {
    swal({
      title: "Are you sure?",
      text: "You can not undo this.",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setStaffList(staffList.filter((list) => list.id !== id));
        setFilterList(filterList.filter((list) => list.id !== id));
        swal("Deleted!", {
          icon: "success",
        });
      }
    });
  };

  const staffTracker = async (list) => {
    const latest = await locateStaff(list._id);
    setCurrentLocation(latest);
    setCurrentName(list);
    setTracker(false);
  };

  const locateStaff = async (id) => {
    const { data } = await axios.post(`${url}/staffTracker`, {
      id,
    });
    console.log(data);
    return data;
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
          {Object.keys(currentLocation).length > 0 ? (
            <Fragment>
              <div className="tracker-text-room">
                {currentLocation.room.description}
              </div>
              <div className="tracker-text-header">Last Scan</div>
              <div className="tracker-text">
                <div>
                  {new Date(Number(currentLocation.date))
                    .toString()
                    .slice(0, 25)}
                </div>
              </div>
            </Fragment>
          ) : (
            <div className="tracker-text-unknown">Unknown Location</div>
          )}
        </div>
      </div>
      <div className=" d-flex justify-content-between align-items-center">
        <div className="staff-list-title">
          <i className="fas fa-users-cog me-3"></i>Manage Campus Staff
        </div>
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
        <SignUpLink campusId={accountInfo.campus._id} type={1} />
      ) : (
        <div className="campus-staff-main ">
          <div className="list-top-controls ">
            <div className="list-counter-box">
              <div className="list-counter">{filterList.length}</div>
              <div className="list-counter-label">Total Records</div>
            </div>
            <div className="list-filter-controls">
              <div className="controls-title">
                <i className="me-2 fas fa-sliders-h"></i>Filter List
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  onChange={(e) => filterStaff(e.target.value)}
                  defaultValue={"0"}
                  className="form-control-select"
                >
                  <option value="0">All</option>
                  {roles.map((list) => (
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
              <div className="table-header-text fw-bold">Staff List</div>
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
                    Role
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
                      <td>{list.role.description}</td>
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
                          className="table-options staff-track"
                          onClick={() => {
                            staffTracker(list);
                          }}
                        >
                          <span className="me-2">
                            <i className="fas fa-map-marked-alt"></i>
                          </span>
                          {/* <span className="text-warning me-2">
                            <i className="fas fa-expand-arrows-alt"></i>
                          </span>
                          <span className="option-delete">
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

export default StaffList;
