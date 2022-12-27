import "./subCss/Chairs.css";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import swal from "sweetalert";

const Chairs = ({ accountInfo }) => {
  const [url] = useState(process.env.REACT_APP_URL);
  const [courses, setCourses] = useState([]);
  const [chairs, setChairs] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState({});
  const [show, setShow] = useState(false);
  const [api] = useState(process.env.REACT_APP_API_SERVER);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const chairsList = await fetchChairs();
    const courseList = await fetchCourses();
    setCourses(courseList);
    setChairs(chairsList);
  };
  const fetchChairs = async () => {
    const { data } = await axios.post(`${url}/getChairs`, {
      campus: accountInfo.campus._id,
    });
    return data;
  };
  const fetchCourses = async () => {
    const { data } = await axios.post(`${url}/courseList`, {
      campus: accountInfo.campus._id,
    });
    return data;
  };

  const togglePopUp = (obj) => {
    setSelectedCourse(obj);
    setShow(true);
  };

  const search = async (keyword) => {
    const result = await axios.post(`${url}/searchTeaching`, {
      keyword,
      campus: accountInfo.campus._id,
    });

    const data = await result.data;
    setFilterList(data);
  };

  const tester = (id) => {
    let isChair = false;
    chairs.forEach((c) => {
      if (c.account._id === id) isChair = true;
    });

    return isChair;
  };

  const assignMe = async (id) => {
    swal({
      title: "Assign",
      text: "Assign As Chairperson",
      buttons: true,
    }).then(async (yes) => {
      if (yes) {
        const { data } = await axios.post(`${url}/assignChair`, {
          campus: accountInfo.campus._id,
          course: selectedCourse._id,
          account: id,
        });

        if (data) {
          swal("Assigned!", {
            icon: "success",
          });
          setFilterList([]);
          setShow(false);
          loadData();
        }
      }
    });
  };

  const unAssign = async (id) => {
    swal({
      title: "Are you sure?",
      text: "Unassign Chairperson",
      buttons: true,
      dangerMode: true,
    }).then(async (yes) => {
      if (yes) {
        const { data } = await axios.post(`${url}/unAssignChair`, {
          id,
        });

        if (data) {
          swal("Done!", {
            icon: "success",
          });
          setFilterList([]);
          setShow(false);
          loadData();
        }
      }
    });
  };

  const getChairInfo = (id) => {
    return chairs.filter((list) => list.course._id === id);
  };
  return (
    <div id="assignTop" className="chairs-container">
      {show && (
        <div className="assign-pop-up">
          <div className="assign-dialog-box">
            <div className="assign-dialog-box-header">
              <i onClick={() => setShow(false)} className="fas fa-times"></i>
            </div>
            <div className="assign-dialog-box-body">
              <h5>{selectedCourse.description}</h5>
              <div className="">
                <label>Type Last Name / ID Number</label>
                <input
                  onKeyUp={(e) => search(e.target.value)}
                  type="text"
                  className="form-control"
                />
              </div>
              <div className="assign-search-result">
                <table className="table table-hover">
                  <tbody>
                    {filterList.length > 0 &&
                      filterList.map((list) => (
                        <Fragment key={list._id}>
                          {!tester(list._id) && (
                            <tr
                              onClick={() => assignMe(list._id)}
                              className="assign-choosen"
                            >
                              <td>
                                <img
                                  src={`${api}/${list.image}`}
                                  // src={require(`../../../../server/uploads/${list.image}`)}
                                  alt={list._id}
                                  className="assign-res-img"
                                />
                              </td>
                              <td className="td">
                                {list.lastName} {list.firstName}
                              </td>
                              <td className="td">{list.idNumber}</td>
                            </tr>
                          )}
                        </Fragment>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="chair-header">
        <i className="fas fa-user-tag me-3 "></i>
        <div className="header-title">Manage Chairpersons</div>
      </div>{" "}
      <div className="campus-staff-main">
        <div className="table-list staff-table py-5">
          <div className="table-header px-2 mb-5 d-flex justify-content-between align-items-center">
            <div className="table-header-text fw-bold">Chairpersons</div>
            <div>
              <div className="input-group">
                <input
                  placeholder="Course"
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
                  Course
                </th>
                <th className="fw-bold" scope="col">
                  Img
                </th>
                <th className="fw-bold" scope="col">
                  Full Name
                </th>
                <th className="fw-bold" scope="col">
                  <i className="ms-2 fas fas fa-tools"></i>
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 &&
                courses.map((course) => (
                  <tr key={course._id}>
                    <td className="py-4">{course.description}</td>
                    {getChairInfo(course._id).length > 0 ? (
                      <Fragment>
                        <td>
                          <img
                            src={`${api}/${
                              getChairInfo(course._id)[0].account.image
                            }`}
                            // src={require(`../../../../server/uploads/${
                            //   getChairInfo(course._id)[0].account.image
                            // }`)}
                            alt={getChairInfo(course._id)[0].account.firstName}
                            className="assign-res-img"
                          />
                        </td>
                        <td className="py-4">
                          {getChairInfo(course._id)[0].account.firstName}{" "}
                          {getChairInfo(course._id)[0].account.lastName}
                        </td>
                        <td className="py-4">
                          <div className={"assign d-flex"}>
                            <a href="#assignTop">
                              <i
                                onClick={() => togglePopUp(course)}
                                className="assign-chair fas fa-user-plus"
                              ></i>
                            </a>
                            <div>
                              <i
                                onClick={() =>
                                  unAssign(getChairInfo(course._id)[0]._id)
                                }
                                className="unassign-chair fas fa-trash"
                              ></i>
                            </div>
                          </div>
                        </td>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <td>--</td>
                        <td>--</td>
                        <td>
                          <div className={"assign"}>
                            <a href="#assignTop">
                              <i
                                onClick={() => togglePopUp(course)}
                                className="assign-chair fas fa-user-plus"
                              ></i>
                            </a>
                          </div>
                        </td>
                      </Fragment>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="show-count p-4">
            Showing{" "}
            <span className="text-primary fw-bold">{courses.length}</span> out
            of <span className="text-primary fw-bold">{courses.length}</span>{" "}
            Records
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chairs;
