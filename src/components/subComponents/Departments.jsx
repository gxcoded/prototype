import "./subCss/StaffList.css";
import "./subCss/PopUp.css";
import { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";

const Departments = ({ campus }) => {
  const [department, setDepartment] = useState([]);
  const [description, setDescription] = useState("");
  const [filterList, setFilterList] = useState([]);
  const [url] = useState(process.env.REACT_APP_URL);
  const [popUpHide, setPopUpHide] = useState(true);
  const [editDescription, setEditDescription] = useState("");
  const [currentId, setCurrentId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await fetchList();
    setDepartment(data);
    setFilterList(data);
    setDescription("");
  };

  const fetchList = async () => {
    const response = await axios.post(`${url}/getDepartments`, {
      campus,
    });
    return await response.data;
  };

  const deleteDepartment = (id) => {
    swal({
      title: "Are you sure?",
      text: "You can not undo this.",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const sendRequest = await axios.post(`${url}/deleteDepartment`, {
          id: id,
        });
        if (await sendRequest.data) {
          swal("Deleted!", {
            icon: "success",
          });
          loadData();
        }
      }
    });
  };
  const addDepartment = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${url}/addDepartment`, {
        campus,
        description,
      });
      const added = await response.data;
      if (added) {
        swal("Added!", {
          icon: "success",
        });
      }
      loadData();
    } catch (error) {
      console.log(error);
    }
  };

  const searchDepartment = async (keyword) => {
    const result = await axios.post(`${url}/searchDepartments`, {
      keyword,
      campus,
    });

    const data = await result.data;

    setFilterList(data);
  };

  const editData = (value, id) => {
    setEditDescription(value);
    setCurrentId(id);
    setPopUpHide(false);
  };

  const saveEdit = async (e) => {
    e.preventDefault();

    const sendRequest = await axios.post(`${url}/updateDepartment`, {
      id: currentId,
      description: editDescription,
    });
    if (await sendRequest.data) {
      swal("Updated!", {
        icon: "success",
      });
      setPopUpHide(true);
      setEditDescription("");
      loadData();
    }
  };

  const isUpdated = async (list) => {
    const { data } = await axios.post(`${url}/updateDepartmentStatus`, {
      id: list._id,
      isOpen: !list.isOpen,
    });
    console.log(data);
    return data;
  };

  const updateStatus = async (list) => {
    if (await isUpdated(list)) {
      swal("Status Updated!", {
        icon: "success",
      });
    }
  };

  return (
    <div className="staff-list-container">
      <div className={`custom-pop-up ${popUpHide && "hide-pop-up"}`}>
        <div className="custom-pop-up-form">
          <form onSubmit={saveEdit}>
            <div className="pop-up-icon">
              <i className="far fa-edit"></i>
            </div>
            <div className="form-group">
              <input
                required
                minLength={"3"}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                type="text"
                className="form-control"
                placeholder="Description"
              />
            </div>
            <div className="px-3 mt-3 text-end">
              <div
                onClick={() => setPopUpHide(true)}
                className="btn btn-warning"
              >
                Cancel
              </div>
              <button className="btn btn-success mx-1">Save</button>
            </div>
          </form>
        </div>
      </div>
      <div className="staff-list-title">
        <i className="fas fa-fax me-3"></i>Manage Departments
      </div>
      <div className="campus-staff-main">
        <div className="list-top-controls">
          <div className="list-counter-box">
            <div className="list-counter">{department.length}</div>
            <div className="list-counter-label">Total Departments</div>
          </div>
          <div className="list-filter-controls">
            <div className="controls-title">
              <i className="me-2 fas fa-plus"></i>Add Department
            </div>
            <form onSubmit={addDepartment}>
              <div className="form-inputs">
                <div className="form-group">
                  <label>Department Name</label>
                  <input
                    minLength={"5"}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="px-2 mt-4 text-end">
                <button type="submit" className="btn btn-primary">
                  <i className="me-2 fas fa-save"></i>Save
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="table-list staff-table py-5">
          <div className="table-header px-2 mb-5 d-flex justify-content-between align-items-center">
            <div className="table-header-text fw-bold">Departments</div>
            <div>
              <div className="input-group">
                <input
                  onKeyUp={(e) => searchDepartment(e.target.value)}
                  placeholder="Description"
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
                  Description
                </th>
                <th className="fw-bold" scope="col">
                  Available
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
                    <td>{list.description}</td>
                    <td>
                      {list.isOpen ? (
                        <div className="form-check form-switch">
                          <input
                            onChange={() => updateStatus(list)}
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            defaultChecked={true}
                          />
                        </div>
                      ) : (
                        <div className="form-check form-switch">
                          <input
                            onChange={() => updateStatus(list)}
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            defaultChecked={false}
                          />
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="table-options justify-content-center">
                        <span
                          onClick={(e) => editData(list.description, list._id)}
                          className="option-edit me-3"
                        >
                          <i className="fas fa-edit"></i>
                        </span>
                        {/* <span
                          onClick={(e) => deleteDepartment(list._id)}
                          className="option-delete"
                        >
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
    </div>
  );
};

export default Departments;
