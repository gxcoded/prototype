import "./subCss/Sections.css";
import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import swal from "sweetalert";

const Sections = ({ accountInfo, courseInfo }) => {
  const [campus] = useState(accountInfo.campus._id);
  const [academics, setAcademics] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [yearLevels, setYearLevels] = useState([]);
  const [sections, setSections] = useState([]);
  const [showSem, setShowSem] = useState(false);
  const [showLevel, setShowLevel] = useState(false);
  const [showSections, setShowSections] = useState(false);
  const [statusList, setStatusList] = useState([]);

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
    setShowSections(false);
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
    loadStatus(id);
    const list = document.querySelectorAll(".yl-list");
    list.forEach((l) => {
      l.classList.remove("active-level");
    });
    target.classList.add("active-level");
    const { data } = await axios.post(`${url}/sectionList`, {
      yearLevel: id,
    });
    setSections(data);
    setLevelId(id);
    setTimeout(() => {
      setShowSections(true);
    }, 500);
  };

  const toggleReset = () => {
    setShowSem(false);
    setShowLevel(false);
    setShowSections(false);
    setTimeout(() => {
      setShowSem(true);
    }, 500);
  };

  const updateStatus = async (id) => {
    const { data } = await axios.post(`${url}/sectionStatus`, {
      campus,
      course: courseInfo._id,
      academic: yearId,
      semester: semId,
      yearLevel: levelId,
      section: id,
    });
    loadStatus(levelId);
    swal("Done!", "Status Updated", "success");
  };

  const fetchStatus = async (id) => {
    const { data } = await axios.post(`${url}/getSectionList`, {
      campus,
      course: courseInfo._id,
      academic: yearId,
      semester: semId,
      yearLevel: id,
    });
    return await data;
  };

  const loadStatus = async (id) => {
    const res = await fetchStatus(id);
    console.log(res);
    setStatusList(res);
  };

  const statusChecker = (id) => {
    let isOpen = false;
    statusList.forEach((list) => {
      if (list.section._id === id) {
        isOpen = true;
      }
    });
    return isOpen;
  };

  return (
    <div className="sections-container">
      <div className="sections-title">
        <i className="fas fa-puzzle-piece me-3"></i>Manage Sections{" > "}
        <span className={"text-primary"}>{courseInfo.description}</span>
      </div>
      <div className="sections-main">
        <div className="sections-main-content">
          <div className="section-cols first-col ">
            <div className="section-cols-title">Academic Year</div>
            <ul className="list-group list-group-light sections-ul">
              {academics.length > 0 &&
                academics.map((list) => (
                  <li
                    key={list._id}
                    className="list-group-item section-cols-li"
                  >
                    <div
                      onClick={(e) => {
                        toggleSem(list._id, e.target);
                      }}
                      className="section-li-btn ac-list"
                    >
                      <Fragment>{list.description}</Fragment>

                      <i className="fas fa-angle-double-right"></i>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
          {showSem && (
            <div className="section-cols second-col ">
              <div className="section-cols-title">Semester</div>
              <ul className="list-group list-group-light sections-ul">
                {semesters.length > 0 &&
                  semesters.map((list) => (
                    <li
                      key={list._id}
                      className="list-group-item section-cols-li"
                    >
                      <div
                        onClick={(e) => toggleLevel(list._id, e.target)}
                        className="section-li-btn sm-list"
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
            <div className="section-cols second-col ">
              <div className="section-cols-title">Year Level</div>
              <ul className="list-group list-group-light sections-ul">
                {yearLevels.length > 0 &&
                  yearLevels.map((list) => (
                    <li
                      key={list._id}
                      className="list-group-item section-cols-li"
                    >
                      <div
                        onClick={(e) => toggleSections(list._id, e.target)}
                        className="section-li-btn yl-list"
                      >
                        <Fragment>{list.description}</Fragment>

                        <i className="fas fa-angle-double-right"></i>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          {showSections && (
            <div className="section-cols second-col ">
              <div className="section-cols-title">Sections</div>
              <ul className="list-group list-group-light sections-ul">
                {sections.length > 0 &&
                  sections.map((list) => (
                    <li
                      key={list._id}
                      className="list-group-item section-cols-li"
                    >
                      <div className="section-li-btn-sec">
                        <span>{list.description}</span>
                        <div className="sections-switch">
                          <div className="form-check form-switch">
                            <input
                              checked={statusChecker(list._id)}
                              onChange={() => {
                                updateStatus(list._id);
                              }}
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                            />
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sections;
