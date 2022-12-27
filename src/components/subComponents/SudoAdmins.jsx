import "./subCss/SudoAdmin.css";
import { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import AddStaffForm from "./AddStaffForm";

const SudoAdmins = ({ campusList }) => {
  const [staff, setStaff] = useState([]);
  const [campusState, setCampusState] = useState("Asingan");
  const [showAll, setShowAll] = useState(true);
  const [addStaff, setAddStaff] = useState(false);

  useEffect(() => {
    const serveList = async () => {
      const staffList = await fetchStaffList();
      setStaff(staffList);
    };
    serveList();
  }, []);

  const fetchStaffList = async () => {
    const response = await axios.get("http://localhost:5000/api/staffList");
    const data = await response.data;
    return data;
  };

  const deleteStaff = (id) => {
    swal({
      title: "Are you sure?",
      text: "You can not undo this.",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setStaff(staff.filter((list) => list.id !== id));
        swal("Deleted!", {
          icon: "success",
        });
      }
    });
  };
  const changeStatus = () => {
    swal("Updated!", {
      icon: "success",
    });
  };

  return (
    <div className="admin-container ">
      <div className=" d-flex justify-content-between align-items-center px-2">
        <div className="admin-title-text">
          <i className="fas fa-users-cog me-3"></i>Manage School Admins
        </div>
        <div onClick={() => setAddStaff(!addStaff)} className="add-staff-btn">
          {!addStaff ? (
            <span>
              <i className="fas fa-user-plus me-2"></i>Add Staff
            </span>
          ) : (
            <span>
              <i className="fas fa-times me-2"></i>Close Form
            </span>
          )}
        </div>
      </div>

      {addStaff ? (
        <div className="mt-5 add-staff-form-container d-flex justify-content-center py-2">
          <AddStaffForm />
        </div>
      ) : (
        <div className="admin-main">
          <div className="admin-main-controls">
            <div className="group d-flex align-items-center justify-content-center">
              <label className="select-label">Show</label>
              <select
                onChange={() => setShowAll(!showAll)}
                className="form-control m-0"
              >
                <option value="0">All</option>
                <option value="1">Admin Only</option>
              </select>
            </div>
            <div className="group d-flex align-items-center justify-content-center">
              <label className="select-label">Campus</label>
              <select
                className="form-control m-0"
                onChange={(e) => setCampusState(e.target.value)}
              >
                {campusList.map((list) => (
                  <option key={list.id} id={list.id} value={list.text}>
                    {list.text}
                  </option>
                ))}
              </select>
            </div>
            <div className="group d-flex align-items-center justify-content-center">
              <label className="select-label">
                Search<i className="fas fa-search ms-2"></i>
              </label>
              <input
                type="text"
                className="form-control top-field-control m-0"
              />
            </div>
          </div>
          <div className="admin-main-table mt-5">
            <table className="campus-tables table table-striped">
              <thead>
                <tr>
                  <th className="fw-bold" scope="col">
                    <i className="ms-2 fas fa-hashtag"></i>
                  </th>
                  <th className="fw-bold" scope="col">
                    Full Name
                  </th>
                  <th className="fw-bold" scope="col">
                    Campus
                  </th>
                  <th className="fw-bold" scope="col">
                    Department
                  </th>
                  <th className="fw-bold" scope="col">
                    ID Number
                  </th>
                  <th className="fw-bold" scope="col">
                    Contact
                  </th>
                  <th className="fw-bold" scope="col">
                    Admin
                  </th>
                  <th className="fw-bold text-center" scope="col">
                    <i className="ms-2 fas fas fa-tools"></i>
                  </th>
                </tr>
              </thead>
              <tbody>
                {staff.length > 0 ? (
                  staff.map(
                    (list) =>
                      list.campus === campusState && (
                        <tr key={list.id}>
                          <th scope="row">{list.id}</th>
                          <td>
                            <span className="me-2">{list.firstName}</span>
                            {list.lastName}
                          </td>
                          <td>{list.campus}</td>
                          <td>{list.department}</td>
                          <td>{list.idNumber}</td>
                          <td>{list.phoneNumber}</td>
                          <td>
                            {list.isAdmin === 1 ? (
                              <div className="form-check form-switch">
                                <input
                                  onChange={() => changeStatus()}
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  defaultChecked={true}
                                />
                              </div>
                            ) : (
                              <div className="form-check form-switch">
                                <input
                                  onChange={() => changeStatus()}
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  defaultChecked={false}
                                />
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="table-options">
                              <span
                                onClick={() => deleteStaff(list.id)}
                                className="option-delete"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                  )
                ) : (
                  <tr className="no-result fst-italic p-5 fw-bold text-muted">
                    <td>No Data Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SudoAdmins;
