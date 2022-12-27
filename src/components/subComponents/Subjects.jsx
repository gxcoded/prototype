import "./subCss/Subjects.css";
import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import swal from "sweetalert";

const Subjects = ({ accountInfo, courseInfo }) => {
  const [currentId, setCurrentId] = useState("");
  const [campus] = useState(accountInfo.campus._id);
  const [academics, setAcademics] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [yearLevels, setYearLevels] = useState([]);
  const [showSem, setShowSem] = useState(true);
  const [showLevel, setShowLevel] = useState(false);
  const [showSubjects, setShowSubjects] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [yearId, setYearId] = useState("");
  const [semId, setSemId] = useState("");
  const [levelId, setLevelId] = useState("");

  const [url] = useState(process.env.REACT_APP_URL);
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const academicList = await fetchAcademicYear();
    const semesterList = await fetchSemesters();
    const yearLevelList = await fetchYearLevels();

    setAcademics(academicList);
    setSemesters(semesterList);
    setYearLevels(yearLevelList);
  };

  const loadSubjects = async (id) => {
    const subs = await fetchSubjects(id);
    setSubjects(subs);
  };

  const fetchSubjects = async (id) => {
    const { data } = await axios.post(`${url}/getSubjects`, {
      campus,
      course: courseInfo._id,
      // academic: yearId,
      semester: semId,
      yearLevel: id,
    });
    return data;
  };

  const fetchAcademicYear = async () => {
    const { data } = await axios.get(`${url}/getAcademicYear`);
    return data;
  };

  const fetchSemesters = async () => {
    const { data } = await axios.get(`${url}/getSemesters`);
    return data;
  };

  const fetchYearLevels = async () => {
    const { data } = await axios.get(`${url}/getYearLevels`);
    return data;
  };

  const toggleLevel = (id, target) => {
    const list = document.querySelectorAll(".sm-list");
    list.forEach((l) => {
      l.classList.remove("active-sem");
    });
    target.classList.add("active-sem");
    setSemId(id);
    setShowLevel(false);
    setShowSubjects(false);
    setTimeout(() => {
      setShowLevel(true);
    }, 500);
  };

  const toggleSem = (id, target) => {
    const list = document.querySelectorAll(".ac-list");
    list.forEach((l) => {
      l.classList.remove("active-academic");
    });
    target.classList.add("active-academic");
    toggleReset();
    setYearId(id);
  };

  const toggleSections = async (id, target) => {
    const list = document.querySelectorAll(".yl-list");
    list.forEach((l) => {
      l.classList.remove("active-level");
    });
    target.classList.add("active-level");
    setLevelId(id);
    setTimeout(() => {
      setShowSubjects(true);
      loadSubjects(id);
    }, 500);
  };

  const toggleReset = () => {
    setShowSem(false);
    setShowLevel(false);
    setShowSubjects(false);
    setTimeout(() => {
      setShowSem(true);
    }, 500);
  };

  const addSubject = async (e) => {
    e.preventDefault();

    const { data } = await axios.post(`${url}/addSubject`, {
      campus,
      course: courseInfo._id,
      // academic: yearId,
      semester: semId,
      yearLevel: levelId,
      currentId,
      courseCode,
      courseDescription,
    });
    if (data) {
      swal("Saved!", {
        icon: "success",
      });
      setCourseCode("");
      setCourseDescription("");
      setAddNew(false);
      loadSubjects(levelId);
    }
  };

  const deleteSubject = async (id) => {
    swal({
      title: "Are you sure?",
      text: "You can not undo this.",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const sendRequest = await axios.post(`${url}/deleteSubject`, {
          id: id,
        });
        if (await sendRequest.data) {
          swal("Deleted!", {
            icon: "success",
          });
          loadSubjects(levelId);
        }
      }
    });
  };

  const isUpdated = async (list) => {
    const { data } = await axios.post(`${url}/updateSubjectStatus`, {
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
    <div className="subjects-container">
      <div className={`subject-pop-container ${addNew && "pop-show"}`}>
        <div className="subject-pop-box">
          <div className="sub-pop-title">Add Subject</div>
          <form onSubmit={addSubject} className="px-2">
            <div className="mt-3">
              <input
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                required
                minLength={"4"}
                placeholder="Course Code"
                type="text"
                className="form-control"
              />
            </div>
            <div className="mt-3">
              <input
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                required
                minLength={"4"}
                placeholder="Course Description"
                type="text"
                className="form-control"
              />
            </div>
            <div className="mt-3 text-end">
              <div
                onClick={() => setAddNew(false)}
                className="btn btn-warning ms-1"
              >
                Cancel
              </div>
              <button className="btn btn-custom-red ms-1">Save</button>
            </div>
          </form>
        </div>
      </div>

      <div className="subjects-title">
        <i className="fas fa-box me-3"></i>Manage Subjects{" > "}
        <span className={"text-primary"}>{courseInfo.description}</span>
      </div>
      <div className="subjects-main">
        <div className="subjects-main-content">
          {/* <div className="subject-cols first-col ">
            <div className="subject-cols-title">Academic Year</div>
            <ul className="list-group list-group-light subjects-ul">
              {academics.length > 0 &&
                academics.map((list) => (
                  <li
                    key={list._id}
                    className="list-group-item subject-cols-li"
                  >
                    <div
                      onClick={(e) => {
                        toggleSem(list._id, e.target);
                      }}
                      className="subject-li-btn ac-list"
                    >
                      <Fragment>{list.description}</Fragment>

                      <i className="fas fa-angle-double-right"></i>
                    </div>
                  </li>
                ))}
            </ul>
          </div> */}
          <div className="left-col">
            {showSem && (
              <div className="subject-cols second-col ">
                <div className="subject-cols-title">Semester</div>
                <ul className="list-group list-group-light subjects-ul">
                  {semesters.length > 0 &&
                    semesters.map((list) => (
                      <li
                        key={list._id}
                        className="list-group-item subject-cols-li"
                      >
                        <div
                          onClick={(e) => toggleLevel(list._id, e.target)}
                          className="subject-li-btn sm-list"
                        >
                          <Fragment>{list.description}</Fragment>

                          <i className="fas fa-angle-double-right"></i>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            )}
            {showLevel && (
              <div className="subject-cols second-col ">
                <div className="subject-cols-title">Year Level</div>
                <ul className="list-group list-group-light subjects-ul">
                  {yearLevels.length > 0 &&
                    yearLevels.map((list) => (
                      <li
                        key={list._id}
                        className="list-group-item subject-cols-li"
                      >
                        <div
                          onClick={(e) => toggleSections(list._id, e.target)}
                          className="subject-li-btn yl-list"
                        >
                          <Fragment>{list.description}</Fragment>

                          <i className="fas fa-angle-double-right"></i>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
          {showSubjects && (
            <div className="subject-cols-main second-col ">
              <div className="subjects-col-table">
                <div className="sub-table-title">
                  <div className="subject-cols-title ">Subjects</div>
                  <span
                    onClick={() => {
                      setCurrentId("");
                      setAddNew(true);
                    }}
                    className="add-sub-btn"
                  >
                    <i className="fas fa-plus me-1"></i>New
                  </span>
                </div>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th className="fw-bold" scope="col">
                        Course Code
                      </th>
                      <th className="fw-bold" scope="col">
                        Description
                      </th>
                      <th className="fw-bold" scope="col">
                        is Open
                      </th>
                      <th className="fw-bold text-center" scope="col">
                        <i className="ms-2 fas fas fa-tools"></i>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.length > 0 ? (
                      subjects.map((list) => (
                        <tr key={list._id}>
                          <td>{list.courseCode}</td>
                          <td>{list.courseDescription}</td>
                          <td>
                            {list.isOpen ? (
                              <div className="form-check form-switch">
                                <input
                                  onChange={() => {
                                    updateStatus(list);
                                  }}
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  defaultChecked={true}
                                />
                              </div>
                            ) : (
                              <div className="form-check form-switch">
                                <input
                                  onChange={() => {
                                    updateStatus(list);
                                  }}
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
                                onClick={() => {
                                  setCurrentId(list._id);
                                  setCourseCode(list.courseCode);
                                  setCourseDescription(list.courseDescription);
                                  setAddNew(true);
                                }}
                                className="option-edit me-3"
                              >
                                <i className="fas fa-edit"></i>
                              </span>
                              {/* <span
                                onClick={() => deleteSubject(list._id)}
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
                        <td>No Subjects Yet..</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subjects;
