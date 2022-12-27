import "./ClassStudents.css";
import { useState } from "react";
import axios from "axios";
import swal from "sweetalert";

const AddNewStudent = ({ room, classStudents, loadStudents }) => {
  const [url] = useState(process.env.REACT_APP_URL);
  const [searchResults, setSearchResults] = useState([]);
  const [api] = useState(process.env.REACT_APP_API_SERVER);

  const search = async (keyword) => {
    if (keyword.length > 0) {
      const result = await axios.post(`${url}/searchClassStudents`, {
        keyword,
        campus: room.course.campus,
        course: room.course._id,
      });

      const data = await result.data;
      setSearchResults(data);
    } else {
      setSearchResults([]);
    }
  };

  const checkStatus = (id) => {
    let isAdded = false;
    classStudents.forEach((student) => {
      if (student.student._id === id) {
        isAdded = true;
      }
    });
    return isAdded;
  };
  const addStudent = async (id) => {
    const { data } = await axios.post(`${url}/addClassRoomStudent`, {
      classId: room._id,
      studentId: id,
    });
    if (data) {
      swal("Success!", "Student Added!", "success");
      loadStudents();
    }
  };
  return (
    <div>
      <div className="class-add-new-student">
        <div className="class-student-header-part">
          <div className="class-student-header-title">
            <i className="me-2 far fa-user"></i>Add Students
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
          <tbody>
            {searchResults.length > 0 ? (
              searchResults.map((list) => (
                <tr key={list._id}>
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
                  <td>{list.course.description}</td>
                  <td>{list.idNumber}</td>
                  <td>{list.phoneNumber}</td>
                  <td>{list.address}</td>
                  <td>
                    {checkStatus(list._id) ? (
                      <span className="text-muted">
                        <i className="text-success fas fa-check me-1"></i>Added
                      </span>
                    ) : (
                      <button
                        onClick={() => addStudent(list._id)}
                        className="btn btn-primary"
                      >
                        Add
                      </button>
                    )}
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
          <span className="text-primary fw-bold">{searchResults.length}</span>{" "}
          out of{" "}
          <span className="text-primary fw-bold">{searchResults.length}</span>{" "}
          Records
        </div>
      </div>
    </div>
  );
};

export default AddNewStudent;
