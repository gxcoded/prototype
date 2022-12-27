import "../assets/css/StudentSignUpForm.css";
import Image from "../assets/images/default.png";
import { useState } from "react";
import axios from "axios";
import swal from "sweetalert";

const GuestSignUpForm = ({ campus, genderList, vaxStatsList }) => {
  const [campusKey, setCampusKey] = useState("");
  const [file, setFile] = useState("");
  const [camp, setCamp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [vaxStats, setVaxStats] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState("");
  const [address, setAddress] = useState("");
  const [url] = useState(process.env.REACT_APP_URL);

  const courseSelection = async (chosen) => {
    const key = await fetchCampusKey(chosen.target.value);
    key.length > 0 && setCampusKey(key[0].key);
  };

  const fetchCampusKey = async (chosen) => {
    const response = await axios.get(`${url}/campusKey?id=${chosen}`);
    return await response.data;
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

  const validateInput = (e) => {
    if (
      e.keyCode === 69 ||
      e.keyCode === 190 ||
      e.keyCode === 187 ||
      e.keyCode === 189
    ) {
      document.querySelector("#guestPhoneNumber").value = "";
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (phone.charAt(0) === "9" && phone.length === 10) {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("campusKey", campusKey);
        formData.append("campus", camp);
        formData.append("purpose", purpose);
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("gender", gender);
        formData.append("vaxStats", vaxStats);
        formData.append("phoneNumber", phone);
        formData.append("email", email);
        formData.append("address", address);
        formData.append("role", "62cb91c52c5804049b716d4b");

        try {
          const res = await axios.post(
            "http://localhost:5000/ct-api/preRegister",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          const key = await res.data;
          localStorage.setItem("ctToken", key);
          window.location.href = "/verify";
        } catch (error) {
          console.log(error);
        }
      } else {
        swal("Please Include a Profile Picture");
      }
    } else {
      swal("Phone Number should be 10 digits and starts with 9").then((r) => {
        document.querySelector("#guestPhoneNumber").focus();
      });
    }
  };
  return (
    <div className="staff-form">
      <div className="signUp-form-title">
        <i className="far fa-id-card me-3 text-warning"></i>
        Register as Guest
      </div>
      <form onSubmit={submitForm} className="form-signUp mt-3 p-4">
        <div className="form-inline d-flex">
          <div className="form-inline-left d-flex justify-content-center">
            <img
              src={Image}
              id="preview"
              onClick={trigger}
              className="image-preview"
              alt="img"
            />
            <input
              accept="image/*"
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
            <div className="form-group mt-3">
              <label>First Name</label>
              <input
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                required
                type="text"
                className="form-control"
              />
            </div>
            <div className="form-group mt-3">
              <label>Last Name</label>
              <input
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                required
                type="text"
                className="form-control"
              />
            </div>
            <div className="form-group mt-3">
              <label>Gender</label>
              <select
                onChange={(e) => {
                  setGender(e.target.value);
                }}
                defaultValue={gender}
                required
                className="form-control"
              >
                <option value="">Select</option>
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
                defaultValue={vaxStats}
                onChange={(e) => {
                  setVaxStats(e.target.value);
                }}
                required
                className="form-control"
              >
                <option value="">Select</option>
                {vaxStatsList.map((list) => (
                  <option key={list._id} value={list._id}>
                    {list.description}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="form-inline mt-5 form-lower">
          <div className="form-group mt-3">
            <label>Campus</label>
            <select
              required
              onChange={(e) => {
                courseSelection(e);
                setCamp(e.target.value);
              }}
              className="form-control"
              defaultValue={camp}
            >
              <option value="" disabled>
                Select
              </option>
              {campus.map((list) => (
                <option key={list._id} value={list._id}>
                  {list.campusName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mt-3">
            <label>Purpose of Visitation</label>
            <select
              defaultValue={vaxStats}
              onChange={(e) => {
                setPurpose(e.target.value);
              }}
              required
              className="form-control"
            >
              <option value="">Select</option>
              <option value="Claim Transcript">Claim Transcript</option>
              <option value="College Application">College Application</option>
              <option value="Entrance Examination">Entrance Examination</option>
              <option value="Interview">Interview</option>
              <option value="Just Visiting">Just Visiting</option>
            </select>
          </div>
          <div className="form-group mt-3">
            <label>Phone Number</label>
            <div className="input-group">
              <span className=" bg-light input-group-text">+63</span>
              <input
                onKeyUp={validateInput}
                id="guestPhoneNumber"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                required
                type="number"
                className="form-control"
                placeholder="10 Digit Mobile Number"
                step="1"
              />
            </div>
          </div>
          <div className="form-group mt-3">
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
              type="email"
              className="form-control"
            />
          </div>
          <div className="form-group mt-3">
            <label>Address</label>
            <input
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              required
              type="text"
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

export default GuestSignUpForm;
