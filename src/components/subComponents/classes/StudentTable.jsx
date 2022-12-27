import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import swal from "sweetalert";

const StudentTable = ({ room, classStudents, studentList, loadStudents }) => {
  const [url] = useState(process.env.REACT_APP_URL);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const [api] = useState(process.env.REACT_APP_API_SERVER);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      search("");
    }, 1000);
  }, []);

  const checker = (id) => {
    let display = false;
    classStudents.forEach((student) => {
      if (student.student._id === id) {
        display = true;
      }
    });
    return display;
  };
  const search = async (keyword) => {
    const result = await axios.post(`${url}/searchClassStudents`, {
      keyword,
      campus: room.course.campus,
      course: room.course._id,
    });

    const data = await result.data;
    setSearchResults(data);
  };

  const removeStudent = async (id) => {
    swal({
      title: "Are you sure?",
      text: "Student will be removed",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await axios.post(`${url}/removeClassRoomStudent`, {
          id,
        });
        if (data) {
          swal("Success!", "Student Removed!", "success");
          loadStudents();
          setSearchResults(studentList);
        }
      }
    });
  };
  return (
    <div>
      <div className="class-add-new-student">
        <div className="class-student-header-part">
          <div className="class-student-header-title">
            {" "}
            <i className="fas fa-fax me-2"></i>Student List
          </div>
          <div className="input-group class-student-header-search">
            <input
              placeholder="ID Number or Last Name"
              onKeyUp={(e) => search(e.target.value)}
              type="search"
              className="form-control  rounded"
              aria-label="Search"
              aria-describedby="search-addon"
            />
            <button type="button" className="btn btn-outline-primary">
              Search
            </button>
          </div>
        </div>
        <table className="campus-table table table-striped mt-4">
          {loading ? (
            <tbody>
              <tr>
                <td>Loading ...</td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {classStudents.length > 0 ? (
                searchResults.map((list) => (
                  <Fragment key={list._id}>
                    {checker(list._id) && (
                      <tr>
                        <td>
                          <img
                            src={`${api}/${list.image}`}
                            // src={require(`../../../../../server/uploads/${list.image}`)}
                            alt={list._id}
                            className="table-image"
                          />
                        </td>
                        <td>
                          {list.lastName}, {list.firstName}
                        </td>

                        <td>{list.idNumber}</td>
                        <td>{list.phoneNumber}</td>
                        <td>{list.address}</td>
                        <td>
                          <div className="table-options">
                            <span
                              onClick={() => removeStudent(list._id)}
                              className="option-delete"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              ) : (
                <tr>
                  <td className="fw-bold fst-italic">No Students Yet..</td>
                </tr>
              )}
            </tbody>
          )}
        </table>
        <div className="show-count p-4">
          {/* Showing{" "}
          <span className="text-primary fw-bold">{studentList.length}</span> out
          of <span className="text-primary fw-bold">{studentList.length}</span>{" "}
          Records */}
        </div>
      </div>
    </div>
  );
};

export default StudentTable;
