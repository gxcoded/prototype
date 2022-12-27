import "./subCss/Profile.css";
import { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";

const Profile = ({ accountInfo, vaxStatsList, genderList, type }) => {
  const [editable, setEditable] = useState(false);
  const [courseList, setCourseList] = useState([]);

  // information
  const [course, setCourse] = useState("");
  const [firstName, setFirstName] = useState(accountInfo.firstName);
  const [lastName, setLastName] = useState(accountInfo.lastName);
  const [gender, setGender] = useState(accountInfo.gender._id);
  const [vaxStats, setVaxStats] = useState(accountInfo.vaxStats._id);
  const [phoneNumber, setPhoneNumber] = useState(accountInfo.phoneNumber);
  const [email, setEmail] = useState(accountInfo.email);
  const [address, setAddress] = useState(accountInfo.address);
  const [url] = useState(process.env.REACT_APP_URL);

  useEffect(() => {
    const getCourses = async () => {
      const courses = await fetchCourses();
      setCourseList(courses);
      {
        type === 1 && setCourse(accountInfo.course._id);
      }
    };

    getCourses();
    loadLastLog();
  }, []);

  const fetchCourses = async () => {
    const response = await axios.post(`${url}/courseList`, {
      campus: accountInfo.campus._id,
    });
    return await response.data;
  };
  const formSubmit = async (e) => {
    e.preventDefault();

    const postRequest = await axios.post(`${url}/updateAccountInfo`, {
      id: accountInfo._id,
      course,
      firstName,
      lastName,
      gender,
      vaxStats,
      phoneNumber,
      email,
      address,
    });
    const isUpdated = await postRequest.data;
    if (isUpdated) {
      swal({
        title: "Updated",
        text: "Information Successfully Updated",
        icon: "success",
      }).then((r) => {
        window.location.reload();
      });
    } else {
      swal({
        title: "Unable to update",
        text: "Please try Again",
        icon: "error",
      });
    }
    setEditable(false);
  };

  const loadLastLog = async () => {
    const last = await fetchLastLog();
    console.log(dateFormatter(last.date));
  };
  const fetchLastLog = async () => {
    const { data } = await axios.post(`${url}/getLastLog`, {
      id: accountInfo._id,
    });
    return data;
  };

  const dateFormatter = (timeString) => {
    const date = new Date(Number(timeString)).toString().slice(4, 15);
    const time = new Date(Number(timeString)).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${date} ${time}`;
  };

  return (
    <div className="profile-info-container">
      <div className="profile-info-header">
        <div className="profile-info-title">
          <i className="fas fa-info-circle me-2"></i>Profile Info
        </div>
        <div className="profile-info-switch">
          <div className="editable-text me-2">
            <i className="me-2 far fa-edit"></i>Editable
          </div>
          <div className="form-check form-switch">
            <input
              checked={editable}
              onChange={(e) => setEditable(!editable)}
              className="form-check-input"
              type="checkbox"
              role="switch"
            />
          </div>
        </div>
      </div>
      <hr />
      <div className="profile-body">
        <form onSubmit={formSubmit}>
          <div className="profile-form">
            {type === 1 && (
              <div className="form-group mt-3">
                <label>Course</label>
                {
                  <select
                    onChange={(e) => setCourse(e.target.value)}
                    disabled={!editable}
                    required
                    className="form-control"
                    value={course}
                  >
                    {courseList.map((list) => (
                      <option key={list._id} value={list._id}>
                        {list.description}
                      </option>
                    ))}
                  </select>
                }
              </div>
            )}
            <div className="form-group mt-3">
              <label>First Name</label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                readOnly={!editable}
                type="text"
                className="form-control"
              />
            </div>
            <div className="form-group mt-3">
              <label>Last Name</label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                readOnly={!editable}
                type="text"
                className="form-control"
              />
            </div>
            <div className="form-group mt-3">
              <label>Gender</label>
              {
                <select
                  onChange={(e) => setGender(e.target.value)}
                  disabled={!editable}
                  required
                  className="form-control"
                  defaultValue={gender}
                >
                  {genderList.map((list) => (
                    <option key={list._id} value={list._id} readOnly>
                      {list.description}
                    </option>
                  ))}
                </select>
              }
            </div>
            <div className="form-group mt-3">
              <label>Vaccination Status</label>
              {
                <select
                  onChange={(e) => setVaxStats(e.target.value)}
                  disabled={!editable}
                  required
                  className="form-control"
                  defaultValue={vaxStats}
                >
                  {vaxStatsList.map((list) => (
                    <option key={list._id} value={list._id} readOnly>
                      {list.description}
                    </option>
                  ))}
                </select>
              }
            </div>
            <div className="form-group mt-3">
              <label>Phone Number</label>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                readOnly={!editable}
                type="text"
                className="form-control"
              />
            </div>
            <div className="form-group mt-3">
              <label>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                readOnly={!editable}
                type="text"
                className="form-control"
              />
            </div>
            <div className="form-group mt-3">
              <label>Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                readOnly={!editable}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="profile-update-btn p-3 text-end">
            <button disabled={!editable} className="btn btn-primary">
              Update<i className="ms-3 far fa-save"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
