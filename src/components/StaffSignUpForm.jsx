import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../assets/css/StaffSignUpForm.css";
import Image from "../assets/images/profile2.png";
import swal from "sweetalert";
import axios from "axios";

const StaffSignUpForm = ({ info, role, vaxStatsList, genderList }) => {
  const [idNumber, setIdNumber] = useState(info.idNumber);
  const [hash] = useState(info.hash);
  const [campus] = useState(info.campus._id);
  const [selectedRole, setSelectedRole] = useState("");
  const [department, setDepartment] = useState("");
  const [office, setOffice] = useState("");
  const [firstName, setFirstName] = useState(info.firstName);
  const [lastName, setLastName] = useState(info.lastName);
  const [gender, setGender] = useState("");
  const [vaxStats, setVaxStats] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(info.email);
  const [address, setAddress] = useState("");
  const [file, setFile] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [url] = useState(process.env.REACT_APP_URL);
  const [roleSelected, setRoleSelected] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [offices, setOffices] = useState([]);
  const [isTeaching, setIsTeaching] = useState(false);

  useEffect(() => {
    const loadList = async () => {
      const departmentList = await fetchDepartments();
      const officeList = await fetchOffices();
      setDepartments(departmentList);
      setOffices(officeList);
    };

    loadList();
  });

  const fetchDepartments = async () => {
    const { data } = await axios.post(`${url}/getDepartments`, {
      campus,
    });

    return await data;
  };

  const fetchOffices = async () => {
    const { data } = await axios.post(`${url}/getOffices`, {
      campus,
    });

    return await data;
  };

  const trigger = (e) => {
    const uploader = document.querySelector("#picUploader");
    uploader.click();
  };

  const previewImage = (e) => {
    const preview = document.querySelector("#preview");

    const reader = new FileReader();

    reader.onload = () => {
      preview.src = reader.result;
    };
    setFile(e.target.files[0]);
    reader.readAsDataURL(e.target.files[0]);
  };

  const submitForm = async (e) => {
    console.log(hash);
    e.preventDefault();

    if (password !== password2) {
      swal("Passwords are not the same");
    } else {
      if (file) {
        const formData = new FormData();

        formData.append("file", file);
        formData.append("campus", campus);

        formData.append("hash", hash);
        formData.append("idNumber", idNumber);
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("gender", gender);
        formData.append("vaxStats", vaxStats);
        formData.append("phoneNumber", phone);
        formData.append("email", email);
        formData.append("address", address);
        formData.append("role", selectedRole);
        formData.append("department", department);
        formData.append("office", office);
        formData.append("password", password);

        try {
          const res = await axios.post(`${url}/staffRegister`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          swal({
            title: "Success!",
            text: "Registration Successful",
            icon: "success",
          }).then((event) => {
            window.location.href = "/login";
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        swal("Please Include a Profile Picture");
      }
    }
  };

  const changeRole = (value) => {
    setDepartment("");
    setOffice("");
    if (value === "62cb8add107251b0d1d0b641") {
      setIsTeaching(true);
      setDepartment(value);
    } else if (value === "62cb8ae9107251b0d1d0b643") {
      setIsTeaching(false);
      setOffice(value);
    }

    setSelectedRole(value);
    setRoleSelected(true);
  };

  return (
    <div className="staff-form">
      <div className="signUp-form-title">
        <i className="fas fa-chalkboard-teacher me-3 text-warning"></i>
        Staff Registration
      </div>
      <form onSubmit={submitForm} className="form-signUp mt-3">
        <div className="form-inline d-flex ">
          <div className="form-inline-left  d-flex justify-content-center">
            <img
              src={Image}
              id="preview"
              onClick={trigger}
              className="image-preview"
              alt="img"
            />
            <input
              onChange={(e) => previewImage(e)}
              id="picUploader"
              type="file"
              style={{ display: "none" }}
            />
            <label onClick={trigger} className="mt-4">
              <i className="fas fa-upload me-3"></i>Upload Image
            </label>
          </div>
          <div className="form-inline-right">
            <div className="form-group">
              <div className="campus-form-title">
                PSU {info.campus.campusName} Campus
              </div>
            </div>
            <div className="form-group mt-3">
              <label>ID Number</label>
              <input
                readOnly
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                required
                type="text"
                className="form-control"
              />
            </div>
            <div className="form-group mt-3">
              <label>Role</label>
              <select
                required
                onChange={(e) => changeRole(e.target.value)}
                className="form-control"
                defaultValue={selectedRole}
              >
                <option value={selectedRole} disabled>
                  Select
                </option>
                {role.map((list) => (
                  <option key={list._id} value={list._id}>
                    {list.description}
                  </option>
                ))}
              </select>
            </div>
            {roleSelected &&
              (isTeaching ? (
                <div className="form-group mt-3">
                  <label>Department</label>
                  <select
                    required
                    onChange={(e) => setDepartment(e.target.value)}
                    className="form-control"
                    defaultValue={department}
                  >
                    <option value={department} disabled>
                      Select
                    </option>
                    {departments.map((list) => (
                      <option key={list._id} value={list._id}>
                        {list.description}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="form-group mt-3">
                  <label>Office</label>
                  <select
                    required
                    onChange={(e) => setOffice(e.target.value)}
                    className="form-control"
                    defaultValue={office}
                  >
                    <option value={office} disabled>
                      Select
                    </option>
                    {offices.map((list) => (
                      <option key={list._id} value={list._id}>
                        {list.description}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
          </div>
        </div>
        <div className="form-inline mt-5 form-lower">
          <div className="form-group mt-3">
            <label>First Name</label>
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              className="form-control"
            />
          </div>
          <div className="form-group mt-3">
            <label>Last Name</label>
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              className="form-control"
            />
          </div>
          <div className="form-group mt-3">
            <label>Gender</label>
            <select
              onChange={(e) => setGender(e.target.value)}
              required
              className="form-control"
              defaultValue={gender}
            >
              <option value={gender} disabled>
                Select
              </option>
              {genderList.map((list) => (
                <option key={list._id} value={list._id}>
                  {list.description}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mt-3">
            <label>Vaccination Status</label>
            <select
              onChange={(e) => setVaxStats(e.target.value)}
              required
              className="form-control"
              defaultValue={vaxStats}
            >
              <option value={vaxStats} disabled>
                Select
              </option>
              {vaxStatsList.map((list) => (
                <option key={list._id} value={list._id}>
                  {list.description}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mt-3">
            <label>Phone Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              type="number"
              className="form-control"
            />
          </div>
          <div className="form-group mt-3">
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              className="form-control"
            />
          </div>
          <div className="form-group mt-3">
            <label>Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              type="text"
              className="form-control"
            />
          </div>
        </div>
        <div className="form-inline mt-2 form-lower">
          <div className="form-group mt-3">
            <label>Username</label>
            <input
              readOnly
              value={idNumber}
              required
              type="text"
              className="form-control"
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              className="form-control"
            />
          </div>
          <div className="form-group mt-3">
            <label>Re-type Password</label>
            <input
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              type="password"
              className="form-control"
            />
          </div>
        </div>
        <div className="px-3 mt-5 d-flex justify-content-end">
          <button type="submit" className="btn btn-primary">
            Next
            <i className="fas fa-angle-double-right ms-2"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffSignUpForm;
