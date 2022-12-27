import "./subComponents/subCss/Classes.css";
import { useEffect, useState, Fragment } from "react";
import ClassRoom from "./subComponents/ClassRoom";
import axios from "axios";
import swal from "sweetalert";

const Classes = ({ accountInfo }) => {
  const [subjectDescription, setSubjectDescription] = useState("");
  const [showSubDesc, setShowSubDesc] = useState(false);
  const [currentAcademic, setCurrentAcademic] = useState("");
  const [currentSem, setCurrentSem] = useState("");
  const [icons, setIcons] = useState([]);
  const [classes, setClasses] = useState([]);
  const [academics, setAcademics] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [showSem, setShowSem] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [yearLevels, setYearLevels] = useState([]);
  const [showClasses, setShowClasses] = useState(true);
  const [showPopUp, setShowPopUp] = useState(false);
  const [showLevel, setShowLevel] = useState(false);
  const [showSections, setShowSections] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [iconView, setIconView] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [url] = useState(process.env.REACT_APP_URL);
  const [yearId, setYearId] = useState("");
  const [semId, setSemId] = useState("");
  const [classOptions, setClassOptions] = useState(true);
  const [classRoom, setClassRoom] = useState(false);
  const [room, setRoom] = useState({});
  const [defaultStart, setDefaultStart] = useState("");
  const [defaultRoom, setDefaultRoom] = useState("");
  const [roomList, setRoomList] = useState([]);
  const [showHidden, setShowHidden] = useState(false);
  const [api] = useState(process.env.REACT_APP_API_SERVER);

  useEffect(() => {
    loadData();
    loadClasses();
    loadRooms();
  }, []);

  const loadData = async () => {
    const academicList = await fetchAcademicYear();
    const semesterList = await fetchSemesters();
    const courseList = await fetchCourses();
    const yearLevelList = await fetchYearLevels();
    const iconList = await fetchIcons();
    setCourses(courseList);
    setAcademics(academicList);
    setSemesters(semesterList);
    setYearLevels(yearLevelList);
    setIcons(iconList);
  };
  const fetchCourses = async () => {
    const { data } = await axios.post(`${url}/courseList`, {
      campus: accountInfo.campus._id,
    });
    return data;
  };

  const fetchIcons = async () => {
    const { data } = await axios.get(`${url}/iconList`);
    return data;
  };

  const fetchAcademicYear = async () => {
    const { data } = await axios.get(`${url}/getAcademicYear`);
    return data;
  };

  const fetchYearLevels = async () => {
    const { data } = await axios.get(`${url}/getYearLevels`);
    return data;
  };

  const fetchSemesters = async () => {
    const { data } = await axios.get(`${url}/getSemesters`);
    return data;
  };

  const loadRooms = async () => {
    const rooms = await fetchRooms();
    setRoomList(rooms);
  };

  const fetchRooms = async () => {
    const { data } = await axios.post(`${url}/classRoomList`, {
      campus: accountInfo.campus._id,
    });
    return data;
  };

  const loadSections = async (id) => {
    const sectionList = await fetchSections(id);
    const subjectList = await fetchSubjects(id);

    setSelectedSection("");
    setShowSections(false);
    setShowSubmit(false);
    setSections(sectionList);
    setSubjects(subjectList);

    setTimeout(() => {
      setShowSections(true);
    }, 500);
  };

  const loadSubjects = async (id) => {
    const subjectList = await fetchSubjects(id);
    setSubjects(subjectList);
    setTimeout(() => {
      setShowSections(true);
    }, 500);
  };

  const fetchSubjects = async (id) => {
    const { data } = await axios.post(`${url}/getSubjects`, {
      campus: accountInfo.campus._id,
      // academic: yearId,
      course: selectedCourse,
      semester: id,
      yearLevel: selectedLevel,
    });
    return data;
  };

  const fetchSections = async (id) => {
    const { data } = await axios.post(`${url}/getSectionList`, {
      campus: accountInfo.campus._id,
      academic: yearId,
      course: selectedCourse,
      semester: semId,
      yearLevel: id,
    });
    return data;
  };
  const toggleSem = (element, target) => {
    const list = document.querySelectorAll(".academic-list");
    list.forEach((l) => {
      l.classList.remove("selected-academic");
    });
    target.classList.add("selected-academic");
    setCurrentAcademic(element.description);
    setShowSem(false);
    setYearId(element._id);
    setShowClasses(false);
    setTimeout(() => {
      setShowSem(true);
    }, 500);
  };

  const loadClasses = async () => {
    const classList = await fetchClasses();
    setClasses(classList);
  };

  const fetchClasses = async () => {
    const { data } = await axios.post(`${url}/getClasses`, {
      campus: accountInfo.campus._id,
      account: accountInfo._id,
      // academic: yearId,
      // semester: id,
    });

    return data;
  };

  const toggleClasses = (element, target) => {
    const list = document.querySelectorAll(".semester-list");

    list.forEach((l) => {
      l.classList.remove("selected-semester");
    });
    target.classList.add("selected-semester");
    setCurrentSem(element.description);
    setShowClasses(false);
    setSemId(element._id);
    loadClasses(element._id);
    setTimeout(() => {
      setShowClasses(true);
    }, 500);
  };

  const toggleLevel = () => {
    setSelectedSection("");
    setShowLevel(false);
    setShowSections(false);
    setShowSubmit(false);
    setSelectedLevel("");
    setTimeout(() => {
      setShowLevel(true);
    }, 500);
  };

  const submitClass = (e) => {
    e.preventDefault();
    setIconView(true);
  };
  const formReset = () => {
    setShowCourses(false);
    setShowLevel(false);
    setShowSections(false);
    setShowSubmit(false);
    setIconView(false);
    setShowSubDesc(false);
    setShowSem(false);
    setDefaultStart("");
    setSubjectDescription("");
    setDefaultRoom("");
    setSelectedSubject("");

    setTimeout(() => {
      setShowCourses(true);
    }, 500);
  };

  const saveClass = async (id) => {
    // console.log("campus" + accountInfo.campus._id);
    // console.log("account" + accountInfo._id);
    // console.log("course" + selectedCourse);
    // console.log("semester" + currentSem);
    // console.log("yearLevel" + selectedLevel);
    // console.log("section" + subjectDescription);
    // console.log("subject" + selectedSubject);
    // console.log("start" + defaultStart);
    // console.log("room" + defaultRoom);
    // console.log("icon" + id);

    const { data } = await axios.post(`${url}/saveClass`, {
      currentId,
      campus: accountInfo.campus._id,
      account: accountInfo._id,
      course: selectedCourse,
      semester: currentSem,
      yearLevel: selectedLevel,
      section: subjectDescription,
      subject: selectedSubject,
      defaultStart,
      defaultRoom,
      icon: id,
    });
    if (data) {
      loadClasses();
      setShowPopUp(false);
      formReset();
      swal("Saved!", {
        icon: "success",
      });
    }
  };

  const toggleOptions = () => {
    setClassRoom(false);
    setClassOptions(true);
  };

  const updateClassStatus = async (id, status) => {
    const { data } = await axios.post(`${url}/updateClassStatus`, {
      id,
      status,
    });
    return data;
  };

  const hideClassAlert = (id, status, type) => {
    if (type === "1") {
      swal({
        title: "Hide Class?",
        icon: "warning",
        buttons: true,
      }).then(async (yes) => {
        if (yes) {
          const success = await updateClassStatus(id, !status);
          if (success) {
            loadClasses();
            swal("Class Hidden!", {
              icon: "success",
            });
          } else {
            swal("Unable to update!", {
              icon: "warning",
            });
          }
        }
      });
    } else {
      swal({
        title: "Show Class?",
        icon: "warning",
        buttons: true,
      }).then(async (yes) => {
        if (yes) {
          const success = await updateClassStatus(id, !status);
          if (success) {
            loadClasses();
            swal("Class Shown!", {
              icon: "success",
            });
          } else {
            swal("Unable to update!", {
              icon: "warning",
            });
          }
        }
      });
    }
  };

  return (
    <div className="classes-container">
      {classOptions && (
        <Fragment>
          <div
            className={`add-class-pop-container ${
              showPopUp && "show-pop-class"
            }`}
          >
            <div className="add-class-pop-form">
              <div className={`add-pop-up-body ${iconView && "icons-view"}`}>
                <div className="first-section">
                  <div className="form-closer">
                    <i
                      onClick={() => {
                        formReset();
                        setShowPopUp(false);
                      }}
                      className="fas fa-times"
                    ></i>
                  </div>
                  <form onSubmit={submitClass}>
                    <div className="add-class-form-title">Create New Class</div>

                    {showCourses && (
                      <div className="form-group mt-3">
                        <label>Degree</label>
                        <select
                          required
                          onChange={(e) => {
                            setSelectedCourse(e.target.value);
                            toggleLevel();
                          }}
                          className="form-control"
                          defaultValue={selectedCourse}
                        >
                          <option value={selectedCourse} disabled>
                            Select
                          </option>
                          {courses.map((list) => (
                            <option key={list._id} value={list._id}>
                              {list.description}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {showLevel && (
                      <div className="form-group mt-3">
                        <label>Year Level</label>
                        <select
                          required
                          onChange={(e) => {
                            setSelectedLevel(e.target.value);
                            // loadSections(e.target.value);
                            setShowSem(true);
                          }}
                          className="form-control"
                          defaultValue={selectedLevel}
                        >
                          <option value={selectedLevel} disabled>
                            Select
                          </option>
                          {yearLevels.map((list) => (
                            <option key={list._id} value={list._id}>
                              {list.description}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {showSem && (
                      <div className="form-group mt-3">
                        <label>Semester</label>
                        <select
                          required
                          onChange={(e) => {
                            setCurrentSem(e.target.value);
                            loadSubjects(e.target.value);
                          }}
                          className="form-control"
                          defaultValue={currentSem}
                        >
                          <option value={currentSem} disabled>
                            Select
                          </option>
                          {semesters.map((list) => (
                            <option key={list._id} value={list._id}>
                              {list.description}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {showSections && (
                      <Fragment>
                        {/* <div className="form-group mt-3">
                          <label>Section</label>
                          <select
                            onChange={(e) => setSelectedSection(e.target.value)}
                            className="form-control"
                            defaultValue={selectedSection}
                          >
                            <option value={selectedSection} disabled>
                              Select
                            </option>
                            {sections.map((list) => (
                              <option key={list._id} value={list.section._id}>
                                {list.section.description}
                              </option>
                            ))}
                          </select>
                        </div> */}
                        <div className="form-group mt-3">
                          <label>Subject</label>
                          <select
                            required
                            onChange={(e) => {
                              setSelectedSubject(e.target.value);
                              setShowSubDesc(true);
                            }}
                            className="form-control"
                            defaultValue={selectedSubject}
                          >
                            <option value={""} disabled>
                              Select
                            </option>
                            {subjects.map((list) => (
                              <option key={list._id} value={list._id}>
                                {list.courseCode}
                                {"-"}
                                {list.courseDescription}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Fragment>
                    )}
                    {showSubDesc && (
                      <Fragment>
                        <div className="form-group mt-3">
                          <label>Class Name / Section</label>
                          <input
                            required
                            minLength={"2"}
                            type="text"
                            className="form-control"
                            value={subjectDescription}
                            onChange={(e) => {
                              setSubjectDescription(e.target.value);
                              setShowSubmit(true);
                            }}
                          />
                        </div>
                        <div className="form-group mt-3">
                          <label>Default Time Start</label>
                          <input
                            required
                            value={defaultStart}
                            onChange={(e) => {
                              setDefaultStart(e.target.value);
                            }}
                            type="time"
                            className="form-control"
                          />
                        </div>
                        <div className="form-group mt-3">
                          <label>Default Room</label>
                          <select
                            required
                            onChange={(e) => {
                              setDefaultRoom(e.target.value);
                              // setSelectedRoom(e.target.value);
                              // currentRoomInfo(e.target.value);
                            }}
                            className="form-control"
                            defaultValue={defaultRoom}
                          >
                            <option value={defaultRoom} disabled>
                              Select
                            </option>
                            {roomList.map((list) => (
                              <option key={list._id} value={list._id}>
                                {list.description}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Fragment>
                    )}
                    {showSubmit && (
                      <div className="mt-4 text-end form-group">
                        <button className="btn btn-custom-red ms-1">
                          Next
                        </button>
                      </div>
                    )}
                  </form>
                </div>
                <div className="second-section">
                  <div className="back-arrow">
                    <i
                      onClick={() => setIconView(false)}
                      className="fas fa-arrow-left"
                    ></i>
                  </div>
                  <div className="second-section-label">Select An Icon</div>
                  <div className="second-section-cards">
                    {icons.map((list) => (
                      <div
                        onClick={() => saveClass(list._id)}
                        key={list._id}
                        className="second-section-card border"
                      >
                        <img
                          src={`${api}/${list.description}`}
                          // src={require(`../../../server/icons/${list.description}`)}
                          alt={list._id}
                          className="class-icon-options"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="classes-title">Manage Classes</div>
          <div className="classes-main">
            {/* <div className="classes-controls">
              <div className="class-cols first-col ">
                <div className="subject-cols-title">Academic Year</div>
                <ul className="list-group list-group-light sub-top">
                  {academics.length > 0 &&
                    academics.map((list) => (
                      <li
                        key={list._id}
                        className="list-group-item subject-cols-li"
                      >
                        <div
                          onClick={(e) => {
                            toggleSem(list, e.target);
                          }}
                          className="subject-li-btn academic-list"
                        >
                          <Fragment>{list.description}</Fragment>

                          <i className="fas fa-angle-double-right"></i>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
              {showSem && (
                <div className="class-cols first-col ">
                  <div className="subject-cols-title">Semester</div>
                  <ul className="list-group list-group-light">
                    {semesters.length > 0 &&
                      semesters.map((list) => (
                        <li
                          key={list._id}
                          className="list-group-item subject-cols-li"
                        >
                          <div
                            onClick={(e) => {
                              toggleClasses(list, e.target);
                            }}
                            className="subject-li-btn semester-list"
                          >
                            <Fragment>{list.description}</Fragment>

                            <i className="fas fa-angle-double-right"></i>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div> */}
            <div className="classes-display">
              {!showHidden ? (
                <Fragment>
                  <div className="classes-display-header text-primary">
                    <span
                      onClick={() => setShowHidden(true)}
                      className="classes-display-title"
                    >
                      Hidden Classes<i className="fas fa-angle-right mx-2"></i>
                      {/* {currentAcademic}
                      <i className="fas fa-angle-right mx-2"></i>
                      {currentSem} */}
                    </span>
                  </div>
                  <div className="classes-display-body ">
                    <div
                      onClick={() => {
                        formReset();
                        setShowPopUp(true);
                      }}
                      className="class-list-card create-new-class"
                    >
                      <span>Create New</span>
                      <span>
                        <i className="fas fa-plus"></i>
                      </span>
                    </div>
                    {classes.map(
                      (list) =>
                        !list.isHidden && (
                          <div
                            key={list._id}
                            className="class-list-card class-render"
                          >
                            <div
                              onClick={() =>
                                hideClassAlert(list._id, list.isHidden, "1")
                              }
                              className="hide-class-btn"
                            >
                              <i className="fas fa-eye-slash"></i>
                            </div>
                            <div
                              onClick={() => {
                                setRoom(list);
                                setClassOptions(false);
                                setClassRoom(true);
                              }}
                              className="class-card-details"
                            >
                              <img
                                src={`${api}/${list.icon.description}`}
                                // src={require(`../../../server/icons/${list.icon.description}`)}
                                alt="as"
                                className="class-render-img"
                              />
                              <div className="class-render-name">
                                {list.subject.courseCode} - {list.section}
                              </div>
                              <div className="class-render-course">
                                {list.course.description}
                              </div>
                              <div className="class-render-course">
                                {list.yearLevel.description}
                              </div>
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  <div className="classes-display-header text-primary">
                    <span
                      onClick={() => setShowHidden(false)}
                      className="classes-display-title"
                    >
                      <i className="fas fa-angle-left mx-2"></i> Back
                    </span>
                  </div>
                  <div className="classes-display-body">
                    {classes.map(
                      (list) =>
                        list.isHidden && (
                          <div
                            key={list._id}
                            className="class-list-card class-render"
                          >
                            <div
                              onClick={() =>
                                hideClassAlert(list._id, list.isHidden, "2")
                              }
                              className="hide-class-btn"
                            >
                              <i className="fas fa-eye"></i>
                            </div>
                            <div
                              onClick={() => {
                                setRoom(list);
                                setClassOptions(false);
                                setClassRoom(true);
                              }}
                              className="class-card-details"
                            >
                              <img
                                src={`${api}/${list.icon.description}`}
                                // src={require(`../../../server/icons/${list.icon.description}`)}
                                alt="as"
                                className="class-render-img"
                              />
                              <div className="class-render-name">
                                {list.subject.courseCode} - {list.section}
                              </div>
                              <div className="class-render-course">
                                {list.course.description}
                              </div>
                              <div className="class-render-course">
                                {list.yearLevel.description}
                              </div>
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        </Fragment>
      )}
      {classRoom && <ClassRoom room={room} options={toggleOptions} />}
    </div>
  );
};

export default Classes;
