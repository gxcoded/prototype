import "./subCss/StaffSubjects.css";
import { useState, useEffect, Fragment } from "react";
import Image from "../../assets/images/class2.svg";
import axios from "axios";
import swal from "sweetalert";
import ViewClass from "./ViewClass";

const TeachingClasses = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [classList, setClassList] = useState([]);
  const [aYear, setAYear] = useState("");
  const [semester, setSemester] = useState("");
  const [course, setCourse] = useState("");
  const [level, setLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [nameClass, setNameClass] = useState("");
  const [section, setSection] = useState("");
  const [showClassList, setShowClassList] = useState(true);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const getList = async () => {
      const dataList = await fetchDataList(
        "http://localhost:5000/static-data/classList"
      );
      setClassList(dataList);
    };

    getList();
  }, []);

  const fetchDataList = async (url) => {
    const response = await axios.get(url);
    const data = await response.data;

    return data;
  };

  const randomKey = () => Math.floor(Math.random() * 15524251);

  const saveClass = () => {
    if (nameClass) {
      const newClass = {
        id: randomKey(),
        academicYear: aYear,
        semester,
        course,
        yearLevel: level,
        name: nameClass,
        section,
      };
      setClassList([...classList, newClass]);
      swal("Saved!", "New Class Created!", "success");
      setNameClass("");
    }
  };

  return (
    <div className="staff-subject-container">
      {showClassList ? (
        <Fragment>
          <div className="subject-header">
            <div className="staff-subject-title">
              <i className="fas fa-chalkboard-teacher me-3"></i>Manage Classes
            </div>
            {!showAddForm ? (
              <div
                onClick={() => {
                  setShowAddForm(!showAddForm);
                }}
                className="btn-sm btn-primary"
              >
                Create Class<i className="ms-1 fas fa-plus-circle"></i>
              </div>
            ) : (
              <div
                onClick={() => {
                  setShowAddForm(!showAddForm);
                }}
                className="btn-sm btn-warning"
              >
                Collapse<i className="ms-1 fas fa-angle-up"></i>
              </div>
            )}
          </div>
          {showAddForm && (
            <div className="staff-subject-form">
              <div className="staff-form-fields">
                {/* <div className="form-field-title">New Subject</div> */}
                <form className="">
                  <div className="subject-form">
                    <div className="form-group mt-1">
                      <label>Academic Year</label>
                      <select
                        onChange={(e) => setAYear(e.target.value)}
                        defaultValue={aYear}
                        className="form-control"
                      >
                        <option value={aYear} disabled>
                          Select
                        </option>
                        <option value="1">2022-2023</option>
                        <option value="2">2023-2024</option>
                      </select>
                    </div>
                    <div className="form-group mt-1">
                      <label>Semester</label>
                      <select
                        onChange={(e) => setSemester(e.target.value)}
                        defaultValue={semester}
                        className="form-control"
                      >
                        <option value={semester} disabled>
                          Select
                        </option>
                        <option value="1">1st Semester</option>
                        <option value="2">2nd Semester</option>
                        <option value="3">Mid Year</option>
                      </select>
                    </div>
                    <div className="form-group mt-1">
                      <label>Course</label>
                      <select
                        onChange={(e) => setCourse(e.target.value)}
                        defaultValue={course}
                        className="form-control"
                      >
                        <option value={course} disabled>
                          Select
                        </option>
                        <option value="BS CE">BS CE</option>
                        <option value="BS COE">BS COE</option>
                        <option value="BS IT">BS IT</option>
                        <option value="BS Math">BS Math</option>
                      </select>
                    </div>
                  </div>
                  <div className="subject-form mt-4">
                    <div className="form-group mt-1">
                      <label>Year Level</label>
                      <select
                        onChange={(e) => setLevel(e.target.value)}
                        defaultValue={level}
                        className="form-control"
                      >
                        <option value={level} disabled>
                          Select
                        </option>
                        <option value="First Year">First Year</option>
                        <option value="Second Year">Second Year</option>
                        <option value="Third Year">Third Year</option>
                        <option value="Fourth Year">Fourth Year</option>
                        <option value="Fifth Year">Fifth Year</option>
                      </select>
                    </div>
                    <div className="form-group mt-1">
                      <label>Section</label>
                      <select
                        onChange={(e) => setSection(e.target.value)}
                        defaultValue={section}
                        className="form-control"
                      >
                        <option value={section} disabled>
                          Select
                        </option>
                        <option value="1A">1A</option>
                        <option value="1B">1B</option>
                        <option value="1C">1C</option>
                        <option value="1D">1D</option>
                      </select>
                    </div>

                    <div className="form-group mt-1">
                      <label>Subject</label>
                      <select
                        onChange={(e) => setSubject(e.target.value)}
                        defaultValue={subject}
                        className="form-control"
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        <option value="CC 101">CC-101</option>
                        <option value="Computing">COM 101</option>
                        <option value="MMW">MMW 101</option>
                      </select>
                    </div>
                  </div>
                  <div className="subject-from mt-4">
                    <div className="form-group mt-1">
                      <label>Class Name</label>
                      <input
                        value={nameClass}
                        onChange={(e) => setNameClass(e.target.value)}
                        type="text"
                        className="form-control sub-field"
                      />
                    </div>
                  </div>
                  <div
                    onClick={() => saveClass()}
                    className=" mt-3 saveBtn text-end form-group"
                  >
                    <div className="btn btn-success">
                      <i className="fas fa-save me-2"></i>Save
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
          <div className="staff-class-grid-title">My Classes</div>
          <div className="filter-list">
            <div className="filter-list-title px-3 pb-4">
              {" "}
              <i className="fas fa-sliders-h me-2"></i>Filter List
            </div>
            <div className="subject-form pb-3">
              <div className="form-group mt-1">
                <label>Academic Year</label>
                <select
                  onChange={(e) => setAYear(e.target.value)}
                  defaultValue={aYear}
                  className="form-control"
                >
                  <option value={aYear} disabled>
                    Select
                  </option>
                  <option value="1">2022-2023</option>
                  <option value="2">2023-2024</option>
                </select>
              </div>
              <div className="form-group mt-1">
                <label>Semester</label>
                <select
                  onChange={(e) => setSemester(e.target.value)}
                  defaultValue={semester}
                  className="form-control"
                >
                  <option value={semester} disabled>
                    Select
                  </option>
                  <option value="1">1st Semester</option>
                  <option value="2">2nd Semester</option>
                  <option value="3">Mid Year</option>
                </select>
              </div>
            </div>
          </div>
          <div className="staff-class-grid">
            {classList.length > 0 &&
              classList.map((list) => (
                <div
                  key={randomKey()}
                  className="class-card"
                  onClick={() => {
                    setTitle(`${list.name} ${list.course}-${list.section}`);
                    setShowClassList(false);
                  }}
                >
                  <div className="class-card-body">
                    <div className="class-icon">
                      <img
                        src={Image}
                        alt={randomKey()}
                        className="class-img"
                      />
                    </div>
                    <div className="class-card-title">
                      {`${list.name} ${list.course}-${list.section}`}
                    </div>
                    <div className="class-card-sub-title">{list.yearLevel}</div>
                  </div>
                </div>
              ))}
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <ViewClass title={title} />
        </Fragment>
      )}
    </div>
  );
};

export default TeachingClasses;
