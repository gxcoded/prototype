import "./subCss/StaffProfile.css";
import { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";

const StaffProfile = ({ accountDetails, reloadPage }) => {
  const [genderList, setGenderList] = useState([]);
  const [vaxStatusList, setVaxStatusList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [officeList, setOfficeList] = useState([]);
  const [firstName, setFirstName] = useState(accountDetails.firstName);
  const [lastName, setLastName] = useState(accountDetails.lastName);
  const [address, setAddress] = useState(accountDetails.address);
  const [gender, setGender] = useState(accountDetails.gender._id);
  const [email, setEmail] = useState(accountDetails.email);
  const [phoneNumber, setPhoneNumber] = useState(accountDetails.phoneNumber);
  const [department, setDepartment] = useState("");
  const [office, setOffice] = useState("");
  const [vaxStatus, setVaxStatus] = useState(accountDetails.vaxStats._id);
  const [editable, setEditable] = useState(false);
  const [url] = useState(process.env.REACT_APP_URL);

  useEffect(() => {
    const loadData = async () => {
      const genders = await fetchGender();
      const departments = await fetchDepartments();
      const offices = await fetchOffices();
      const vaxStats = await fetchVaxStatus();
      setGenderList(genders);
      setDepartmentList(departments);
      setOfficeList(offices);
      setVaxStatusList(vaxStats);
      accountDetails.department !== null &&
        setDepartment(accountDetails.department);
      accountDetails.office !== null && setOffice(accountDetails.office);
    };

    loadData();
  }, [accountDetails]);

  const fetchGender = async () => {
    const { data } = await axios.get(`${url}/getGender`);
    return data;
  };

  const fetchVaxStatus = async () => {
    const { data } = await axios.get(`${url}/getVaxStatus`);
    return data;
  };

  const fetchDepartments = async () => {
    const response = await axios.post(`${url}/getDepartments`, {
      campus: accountDetails.campus._id,
    });
    return await response.data;
  };

  const fetchOffices = async () => {
    const response = await axios.post(`${url}/getOffices`, {
      campus: accountDetails.campus._id,
    });
    return await response.data;
  };

  const submitUpdate = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(`${url}/updateStaffInfo`, {
      id: accountDetails._id,
      firstName,
      lastName,
      address,
      phoneNumber,
      email,
      gender,
      department,
      office,
      vaxStatus,
    });
    if (data) {
      swal({
        title: "Updated",
        text: "Information Successfully Updated",
        icon: "success",
      });
    } else {
      swal({
        title: "Unable to update",
        text: "Please try Again",
        icon: "error",
      });
    }
    setEditable(false);
    reloadPage();
  };

  return (
    <div className="staff-profile-display">
      <div className="staff-profile-display-content">
        <form onSubmit={submitUpdate}>
          <div className="staff-profile-display-content-header d-flex justify-content-between">
            <span className="profile-edit-btn">Profile Information</span>
            <div className="staff-profile-info-switch d-flex">
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
          <div className="profile-inline-content">
            <div className="profile-inline-content-left">First Name</div>
            <div className="profile-inline-content-right">
              <input
                disabled={!editable}
                required
                minLength={"3"}
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                type="text"
                className={`form-control staff-profile-input ${
                  !editable && "disabled"
                }`}
              />
            </div>
          </div>
          <div className="profile-inline-content">
            <div className="profile-inline-content-left">Last Name</div>
            <div className="profile-inline-content-right">
              <input
                disabled={!editable}
                required
                minLength={"3"}
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                type="text"
                className={`form-control staff-profile-input ${
                  !editable && "disabled"
                }`}
              />
            </div>
          </div>
          <div className="profile-inline-content">
            <div className="profile-inline-content-left">Address</div>
            <div className="profile-inline-content-right">
              <input
                disabled={!editable}
                required
                minLength={"5"}
                onChange={(e) => setAddress(e.target.value)}
                value={address}
                type="text"
                className={`form-control staff-profile-input ${
                  !editable && "disabled"
                }`}
              />
            </div>
          </div>
          <div className="profile-inline-content">
            <div className="profile-inline-content-left">Contact Number</div>
            <div className="profile-inline-content-right">
              <input
                disabled={!editable}
                required
                minLength={"10"}
                onChange={(e) => setPhoneNumber(e.target.value)}
                value={phoneNumber}
                type="number"
                className={`form-control staff-profile-input ${
                  !editable && "disabled"
                }`}
              />
            </div>
          </div>
          <div className="profile-inline-content">
            <div className="profile-inline-content-left">Email</div>
            <div className="profile-inline-content-right">
              <input
                disabled={!editable}
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                className={`form-control staff-profile-input ${
                  !editable && "disabled"
                }`}
              />
            </div>
          </div>
          <div className="profile-inline-content">
            <div className="profile-inline-content-left">Gender</div>
            <div className="profile-inline-content-right">
              {
                <select
                  disabled={!editable}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  className={`form-control staff-profile-input ${
                    !editable && "disabled"
                  }`}
                  value={gender}
                >
                  {genderList.map((list) => (
                    <option key={list._id} value={list._id}>
                      {list.description}
                    </option>
                  ))}
                </select>
              }
            </div>
          </div>
          {/* <div className="profile-inline-content">
            <div className="profile-inline-content-left">Role</div>
            <div className="profile-inline-content-right">
              {
                <select
                  disabled={!editable}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className={`form-control staff-profile-input ${
                    !editable && "disabled"
                  }`}
                  value={role}
                >
                  {roleList.map((list) => (
                    <option key={list._id} value={list._id}>
                      {list.description}
                    </option>
                  ))}
                </select>
              }
            </div>
          </div> */}
          {accountDetails.department !== null && (
            <div className="profile-inline-content">
              <div className="profile-inline-content-left">Department</div>
              <div className="profile-inline-content-right">
                {
                  <select
                    disabled={!editable}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    className={`form-control staff-profile-input ${
                      !editable && "disabled"
                    }`}
                    defaultValue={department}
                  >
                    {departmentList.map((list) => (
                      <option key={list._id} value={list._id}>
                        {list.description}
                      </option>
                    ))}
                  </select>
                }
              </div>
            </div>
          )}
          {accountDetails.office !== null && (
            <div className="profile-inline-content">
              <div className="profile-inline-content-left">Office</div>
              <div className="profile-inline-content-right">
                {
                  <select
                    disabled={!editable}
                    onChange={(e) => setOffice(e.target.value)}
                    required
                    className={`form-control staff-profile-input ${
                      !editable && "disabled"
                    }`}
                    defaultValue={office}
                  >
                    {officeList.map((list) => (
                      <option key={list._id} value={list._id}>
                        {list.description}
                      </option>
                    ))}
                  </select>
                }
              </div>
            </div>
          )}
          <div className="profile-inline-content">
            <div className="profile-inline-content-left">
              Vaccination Status
            </div>
            <div className="profile-inline-content-right">
              {
                <select
                  disabled={!editable}
                  onChange={(e) => setVaxStatus(e.target.value)}
                  required
                  className={`form-control staff-profile-input ${
                    !editable && "disabled"
                  }`}
                  value={vaxStatus}
                >
                  {vaxStatusList.map((list) => (
                    <option key={list._id} value={list._id}>
                      {list.description}
                    </option>
                  ))}
                </select>
              }
            </div>
          </div>
          <div className="staff-profile-btn-submit-section">
            <button disabled={!editable} className="btn btn-primary">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffProfile;
