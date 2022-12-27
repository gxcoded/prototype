import "./subCss/StaffList.css";
import { Fragment, useEffect, useState } from "react";

import axios from "axios";
import swal from "sweetalert";

const Assign = ({ accountInfo }) => {
  const [staffList, setStaffList] = useState([]);
  const [url] = useState(process.env.REACT_APP_URL);
  const [assignedList, setAssignedList] = useState([]);
  const [officeList, setOfficeList] = useState([]);
  const [current, setCurrent] = useState({});
  const [showPopUp, setShowPopUp] = useState(false);
  const [currentRoom, setCurrentRoom] = useState("");
  const [api] = useState(process.env.REACT_APP_API_SERVER);

  const fetchList = async () => {
    const { data } = await axios.post(`${url}/getNonTeachingAccounts`, {
      campus: accountInfo.campus._id,
    });
    return data;
  };

  const fetchAssigned = async () => {
    const { data } = await axios.post(`${url}/getAssignedRooms`, {
      campus: accountInfo.campus._id,
    });
    console.log(data);
    return data;
  };

  const fetchOffices = async () => {
    const { data } = await axios.post(`${url}/roomList`, {
      campus: accountInfo.campus._id,
    });
    console.log(data);
    return data;
  };
  const loadData = async () => {
    const data = await fetchList();
    const assigned = await fetchAssigned();
    const offices = await fetchOffices();
    setAssignedList(assigned);
    setStaffList(data);
    setOfficeList(offices);
  };

  useEffect(() => {
    loadData();
  }, []);

  const assignRoom = async () => {
    const saved = await assignNow();
    if (saved) {
      swal("Done!", "Room Assigned!", "success");
      setShowPopUp(false);
      loadData();
    }
  };

  const assignNow = async () => {
    const { data } = await axios.post(`${url}/assignRoom`, {
      campus: accountInfo.campus._id,
      account: current._id,
      room: currentRoom,
    });
    return data;
  };

  const checker = (id) => {
    let room = "None";

    assignedList.forEach((a) => {
      a.account === id && (room = a.room.description);
    });

    return room;
  };

  return (
    <div className="staff-list-container non-teaching-con">
      <div className={`assign-room-pop ${!showPopUp && "hide-pop-box"}`}>
        <div className="assign-room-form">
          {Object.keys(current).length > 0 && (
            <div>
              <div className="assign-room-form-header">Designate</div>
              <img
                src={`${api}/${current.image}`}
                // src={require(`../../../../server/uploads/${current.image}`)}
                alt={current._id}
                className="table-image"
              />
              <div className="assign-room-form-name">
                {current.lastName}, {current.firstName}
              </div>
              <div className="form-group office-select">
                <select
                  onChange={(e) => setCurrentRoom(e.target.value)}
                  defaultValue={currentRoom}
                  className="form-control-select"
                >
                  <option value={currentRoom} disabled>
                    Select Room
                  </option>
                  {officeList.map((list) => (
                    <option key={list._id} value={list._id}>
                      {list.description}
                    </option>
                  ))}
                </select>
              </div>
              <div className="result-btn-options mt-3">
                <button
                  onClick={() => setShowPopUp(false)}
                  className="shadow btn-sm btn-custom-red"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    assignRoom();
                  }}
                  className="shadow btn-sm btn-primary"
                >
                  Assign
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className=" d-flex justify-content-between align-items-center">
        <div className="staff-list-title">
          <i className="fab fa-trello me-3"></i>Designate Scan Location
        </div>
      </div>

      <div className="campus-staff-main ">
        <div className="table-list staff-table py-5">
          <div className="table-header px-2 mb-5 d-flex justify-content-between align-items-center">
            <div className="table-header-text fw-bold">
              Non Teaching Accounts
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
                  ID Number
                </th>
                <th className="fw-bold" scope="col">
                  Designated
                </th>
                <th className="fw-bold" scope="col">
                  <i className="ms-2 fas fas fa-tools"></i>
                </th>
              </tr>
            </thead>
            <tbody>
              {staffList.length > 0 ? (
                staffList.map((list) => (
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

                    <td>{list.idNumber}</td>

                    <td>{checker(list._id)}</td>
                    <td>
                      <button
                        onClick={() => {
                          setCurrent(list);
                          setShowPopUp(true);
                        }}
                        className="btn btn-primary"
                      >
                        Assign
                      </button>
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
            <span className="text-primary fw-bold">{staffList.length}</span> out
            of <span className="text-primary fw-bold">{staffList.length}</span>{" "}
            Records
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assign;
