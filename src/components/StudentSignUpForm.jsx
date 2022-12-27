import "../assets/css/StudentSignUpForm.css";
import { useSearchParams } from "react-router-dom";
import Image from "../assets/images/default.png";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import swal from "sweetalert";

const StudentSignUpForm = ({ vaxStatsList, genderList, campus }) => {
  const [courseList, setCourseList] = useState([]);
  const [campusKey, setCampusKey] = useState("");
  const [file, setFile] = useState("");
  const [camp, setCamp] = useState("");
  const [campusName, setCampusName] = useState("");
  const [course, setCourse] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [vaxStats, setVaxStats] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [params] = useSearchParams();
  const [valid, setValidity] = useState(true);
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  const [url] = useState(process.env.REACT_APP_URL);

  useEffect(() => {
    (params.get("campus") === null || params.get("hash") === null) &&
      setValidity(false);

    const check = async () => {
      const data = await checkValidity();
      Object.keys(data).length < 1 && setValidity(false);
      console.log(data);
      setCamp(data.campus._id);
      setCampusKey(data.campus.key);
      setCampusName(data.campus.campusName);
      setIdNumber(data.idNumber);
      const courses = await fetchCourses(data.campus._id);
      setCourseList(courses);
      setEmail(data.email);
      setFirstName(data.firstName);
      setLastName(data.lastName);
    };

    check();
  }, []);

  const checkValidity = async () => {
    const campus = params.get("campus");
    const hash = params.get("hash");

    const response = await axios.post(`${url}/getLink`, {
      campus,
      hash,
    });

    return await response.data;
  };

  const fetchCourses = async (id) => {
    const response = await axios.post(`${url}/courseList`, { campus: id });
    return await response.data;
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

    console.log(e.target.files[0]);
    reader.readAsDataURL(e.target.files[0]);
  };

  const validateInput = (e) => {
    if (e.keyCode === 69 || e.keyCode === 190) {
      document.querySelector("#studentPhoneNumber").value = "";
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (phone.charAt(0) === "9" && phone.length === 10) {
      if (file) {
        const formData = new FormData();

        formData.append("file", file);
        formData.append("campus", camp);
        formData.append("hashKey", params.get("hash"));
        formData.append("course", course);
        formData.append("idNumber", idNumber);
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("gender", gender);
        formData.append("vaxStats", vaxStats);
        formData.append("phoneNumber", phone);
        formData.append("email", email);
        formData.append("address", address);
        formData.append("role", "62cb91ba2c5804049b716d49");

        const response = await axios.post(`${url}/checkId`, {
          userId: idNumber,
        });
        const exist = await response.data;

        if (exist) {
          swal("The Id Number you Entered is Already registered.");
        } else {
          try {
            const res = await axios.post(`${url}/preRegister`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            const key = await res.data;
            localStorage.setItem("ctToken", key);
            window.location.href = "/verify";
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        swal("Please Include a Profile Picture");
      }
    } else {
      swal("Phone Number should be 10 digits and starts with 9").then((r) => {
        document.querySelector("#studentPhoneNumber").focus();
      });
    }
  };
  return (
    <div className="staff-form">
      {valid ? (
        <Fragment>
          <div className="signUp-form-title">
            <i className="fas fa-user-graduate me-3 text-warning"></i>
            Student Registration
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
                <div className="form-group">
                  <label>Campus</label>
                  <input
                    readOnly
                    required
                    className="form-control"
                    value={campusName}
                  />
                </div>

                <div className="form-group mt-3">
                  <label>Course</label>
                  {
                    <select
                      onChange={(e) => {
                        setCourse(e.target.value);
                      }}
                      required
                      className="form-control"
                      defaultValue={course}
                    >
                      <option value="" readOnly>
                        Select
                      </option>
                      {courseList.map((list) => (
                        <option key={list._id} value={list._id}>
                          {list.description}
                        </option>
                      ))}
                    </select>
                  }
                </div>
                <div className="form-group mt-3">
                  <label>ID Number</label>
                  <div className="input-group">
                    <input
                      className="form-control"
                      value={idNumber}
                      onChange={(e) => {
                        setIdNumber(e.target.value);
                      }}
                      readOnly
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-inline mt-5 form-lower">
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
              <div className="form-group mt-3">
                <label>Phone Number</label>
                <div className="input-group">
                  <span className=" bg-light input-group-text">+63</span>
                  <input
                    onKeyUp={validateInput}
                    id="studentPhoneNumber"
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
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
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
              {/* <Link to='/verify'> */}
              <button type="submit" className="btn btn-primary">
                Next
                <i className="fas fa-angle-double-right ms-2"></i>
              </button>
              {/* </Link> */}
            </div>
          </form>
        </Fragment>
      ) : (
        <div className="">Your Link is Invalid or no Longer Valid...</div>
      )}
    </div>
  );
};

export default StudentSignUpForm;
