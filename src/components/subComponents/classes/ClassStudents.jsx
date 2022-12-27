import "./ClassStudents.css";
import { useState, useEffect } from "react";
import AddNewStudent from "./AddNewStudent";
import StudentTable from "./StudentTable";
import axios from "axios";

const ClassStudents = ({ room }) => {
  const [addNew, setAddNew] = useState(false);
  const [studentTable, setStudentTable] = useState(true);
  const [classStudents, setClassStudents] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [url] = useState(process.env.REACT_APP_URL);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const students = await fetchStudentList();
    const studentsList = await fetchStudentsByCourse();
    setClassStudents(students);
    setStudentList(studentsList);
  };

  const fetchStudentList = async () => {
    const { data } = await axios.post(`${url}/getClassRoomStudents`, {
      classId: room._id,
    });
    return data;
  };

  const fetchStudentsByCourse = async () => {
    const { data } = await axios.post(`${url}/getStudentsByCourse`, {
      campus: room.campus,
      course: room.course._id,
    });
    console.log(data);
    return data;
  };

  return (
    <div className="class-students-container">
      <div className="class-students-header">
        <div className="class-students-title">
          <i className="fas fa-graduation-cap me-2 "></i>Class Students
        </div>
        <div className="class-students-options">
          <button
            onClick={() => {
              setAddNew(false);
              setStudentTable(true);
            }}
            className={`btn-sm ${studentTable && "chosen"}`}
          >
            <i className="fas fa-fax me-2"></i>Student List
          </button>
          <button
            onClick={() => {
              setStudentTable(false);
              setAddNew(true);
            }}
            className={`btn-sm ${addNew && "chosen"}`}
          >
            <i className="me-2 far fa-user"></i>Add Students
          </button>
        </div>
      </div>
      <hr />
      <div className="class-students-body">
        {addNew && (
          <AddNewStudent
            room={room}
            classStudents={classStudents}
            loadStudents={loadStudents}
          />
        )}
        {studentTable && (
          <StudentTable
            room={room}
            classStudents={classStudents}
            studentList={studentList}
            loadStudents={loadStudents}
          />
        )}
      </div>
    </div>
  );
};

export default ClassStudents;
