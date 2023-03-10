import "./subCss/StaffList.css";
import { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";

const CourseList = ({ accountInfo }) => {
  const [courseList, setCourseList] = useState([]);
  const [description, setDescription] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [currentId, setCurrentId] = useState("");
  const [url] = useState(process.env.REACT_APP_URL);
  const [popUpHide, setPopUpHide] = useState(true);
  const slide = document.querySelector("#slideTrigger");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await fetchList();
    setCourseList(data);
  };

  const fetchList = async () => {
    const { data } = await axios.post(`${url}/courseList`, {
      campus: accountInfo.campus._id,
    });

    return data;
  };

  const deleteCourse = (id) => {
    swal({
      title: "Are you sure?",
      text: "You can not undo this.",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setCourseList(courseList.filter((list) => list.id !== id));
        swal("Deleted!", {
          icon: "success",
        });
      }
    });
  };

  const addCourse = () => {
    if (description) {
      const newCourse = {
        id: Math.floor(Math.random() * 1000),
        description: description,
      };
      setCourseList([...courseList, newCourse]);
      setDescription("");
      swal("Saved!", {
        icon: "success",
      });
    }
  };

  const isUpdated = async (list) => {
    const { data } = await axios.post(`${url}/updateCourseStatus`, {
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

  const saveEdit = async (e) => {
    e.preventDefault();

    const sendRequest = await axios.post(`${url}/updateCourse`, {
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

  const editData = (value, id) => {
    setEditDescription(value);
    setCurrentId(id);
    setPopUpHide(false);
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
      <div className="staff-list-title" id="top">
        <a href="#top" id="slideTrigger" style={{ display: "none" }}></a>
        <i className="fas fa-book-reader me-3"></i>Manage Degrees
      </div>
      <div className="campus-staff-main">
        <div className="list-top-controls">
          <div className="list-counter-box">
            <div className="list-counter">{courseList.length}</div>
            <div className="list-counter-label">Total Degrees</div>
          </div>
          <div className="list-filter-controls">
            <div className="controls-title">
              <i className="me-2 fas fa-plus"></i>Add Degree
            </div>
            <div className="form-inputs">
              <div className="form-group">
                <label>Course Description</label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  type="text"
                  className="form-control"
                />
              </div>
            </div>
            <div className="px-2 mt-4 text-end">
              <div onClick={() => addCourse()} className="btn btn-primary">
                <i className="me-2 fas fa-save"></i>Save
              </div>
            </div>
          </div>
        </div>
        <div className="table-list staff-table">
          <table className="campus-table table table-striped">
            <thead>
              <tr>
                <th className="fw-bold" scope="col">
                  Degree Description
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
              {courseList.map((list) => (
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
                    <div
                      onClick={() => {
                        editData(list.description, list._id);
                        slide.click();
                      }}
                      className="table-options justify-content-center"
                    >
                      <span className="option-edit me-3">
                        <i className="fas fa-edit"></i>
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseList;
