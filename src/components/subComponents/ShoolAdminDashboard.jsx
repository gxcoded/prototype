import "./subCss/SchoolAdminDashboard.css";
import Maintenance from "./Maintenance";
import { useState, useEffect } from "react";
import axios from "axios";

const SchoolAdminDashboard = ({ accountInfo }) => {
  const [maintenance] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [officeList, setOfficeList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [buildingList, setBuildingList] = useState([]);
  const [url] = useState(process.env.REACT_APP_URL);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const staffs = await fetchStaff();
    const students = await fetchStudents();
    const courses = await fetchCourses();
    const departments = await fetchDepartments();
    const offices = await fetchOffices();
    const rooms = await fetchRooms();
    const buildings = await fetchBuildings();
    setStaffList(staffs);
    setStudentList(students);
    setCourseList(courses);
    setDepartmentList(departments);
    setOfficeList(offices);
    setRoomList(rooms);
    setBuildingList(buildings);
  };

  const fetchStaff = async () => {
    const response = await axios.post(`${url}/staffAccounts`, {
      campus: accountInfo.campus._id,
    });
    return await response.data;
  };

  const fetchStudents = async () => {
    const response = await axios.post(`${url}/getStudents`, {
      campus: accountInfo.campus._id,
    });
    return await response.data;
  };

  const fetchCourses = async () => {
    const response = await axios.post(`${url}/courseList`, {
      campus: accountInfo.campus._id,
    });
    return await response.data;
  };

  const fetchDepartments = async () => {
    const response = await axios.post(`${url}/getDepartments`, {
      campus: accountInfo.campus._id,
    });
    return await response.data;
  };

  const fetchOffices = async () => {
    const response = await axios.post(`${url}/getOffices`, {
      campus: accountInfo.campus._id,
    });
    return await response.data;
  };

  const fetchRooms = async () => {
    const response = await axios.post(`${url}/roomList`, {
      campus: accountInfo.campus._id,
    });
    return await response.data;
  };

  const fetchBuildings = async () => {
    const response = await axios.post(`${url}/buildingList`, {
      campus: accountInfo.campus._id,
    });
    return await response.data;
  };

  return (
    <div>
      {maintenance ? (
        <Maintenance section={"Dashboard"} />
      ) : (
        <div className="school-admin-dashboard-container">
          <div className="admin-dashboard-title">
            <i className="fas fa-columns me-3"></i>School Admin Dashboard
          </div>
          <div className="admin-dashboard-main">
            <div className="admin-dashboard-box">
              <div className="admin-dashboard-box-left">
                <i className="fas fa-users"></i>
              </div>
              <div className="admin-dashboard-box-right">
                <div className="admin-dashboard-box-right-label">Staff</div>
                <div className="admin-dashboard-box-right-count">
                  {staffList.length}
                </div>
              </div>
            </div>
            <div className="admin-dashboard-box">
              <div className="admin-dashboard-box-left">
                <i className="fas fa-user-graduate"></i>
              </div>
              <div className="admin-dashboard-box-right">
                <div className="admin-dashboard-box-right-label">Students</div>
                <div className="admin-dashboard-box-right-count">
                  {studentList.length}
                </div>
              </div>
            </div>
            <div className="admin-dashboard-box">
              <div className="admin-dashboard-box-left">
                <i className="fas fa-book-reader"></i>
              </div>
              <div className="admin-dashboard-box-right">
                <div className="admin-dashboard-box-right-label">Courses</div>
                <div className="admin-dashboard-box-right-count">
                  {courseList.length}
                </div>
              </div>
            </div>
            <div className="admin-dashboard-box">
              <div className="admin-dashboard-box-left">
                <i className="fas fa-fax"></i>
              </div>
              <div className="admin-dashboard-box-right">
                <div className="admin-dashboard-box-right-label">
                  Departments
                </div>
                <div className="admin-dashboard-box-right-count">
                  {departmentList.length}
                </div>
              </div>
            </div>
            <div className="admin-dashboard-box">
              <div className="admin-dashboard-box-left">
                <i className="fas fa-swatchbook"></i>
              </div>
              <div className="admin-dashboard-box-right">
                <div className="admin-dashboard-box-right-label">Offices</div>
                <div className="admin-dashboard-box-right-count">
                  {officeList.length}
                </div>
              </div>
            </div>
            <div className="admin-dashboard-box">
              <div className="admin-dashboard-box-left">
                <i className="fas fa-city"></i>
              </div>
              <div className="admin-dashboard-box-right">
                <div className="admin-dashboard-box-right-label">Buildings</div>
                <div className="admin-dashboard-box-right-count">
                  {buildingList.length}
                </div>
              </div>
            </div>
            <div className="admin-dashboard-box">
              <div className="admin-dashboard-box-left">
                <i className="fas fa-puzzle-piece"></i>
              </div>
              <div className="admin-dashboard-box-right">
                <div className="admin-dashboard-box-right-label">Rooms</div>
                <div className="admin-dashboard-box-right-count">
                  {roomList.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolAdminDashboard;
