import "./Class.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Students = () => {
  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchList(
        "http://localhost:5000/static-data/studentList"
      );

      setStudentList(data);
    };
    loadData();
  }, []);
  const fetchList = async (url) => {
    const response = await axios.get(url);
    const data = await response.data;

    return data;
  };

  return (
    <div className="student-list-container">
      <div className="add-student-bar">
        <div className="form-group">
          <div>
            <label>
              <i className="me-2 fas fa-search"></i>Add Student
            </label>
            <div className="from-inline d-flex">
              <input
                placeholder="Student Name or ID Number"
                type="text"
                className="form-control"
              />
              <div className="btn btn-success">Search</div>
            </div>
          </div>
        </div>
      </div>
      <div className="student-list-table">
        <table className="campus-table table table-bordered">
          <thead>
            <tr>
              <th className="fw-bold" scope="col">
                <i className="ms-2 fas fa-hashtag"></i>
              </th>
              <th className="fw-bold" scope="col">
                Full Name
              </th>
              <th className="fw-bold" scope="col">
                ID Number
              </th>
              <th className="fw-bold" scope="col">
                Contact Number
              </th>
              <th className="fw-bold text-center" scope="col">
                <i className="ms-2 fas fas fa-tools"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            {studentList.map((list) => (
              <tr key={list.id}>
                <td>{list.id}</td>
                <td>{list.fullName}</td>
                <td>{list.idNumber}</td>
                <td>{list.phoneNumber}</td>
                <td>
                  <div className="table-options">
                    <span className="option-delete">
                      <i className="fas fa-trash-alt"></i>
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;
