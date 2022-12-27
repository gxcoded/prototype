import "./subCss/WalkIn.css";
import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import Image from "../../assets/images/default.png";
import ImageCapture from "react-image-data-capture";
import swal from "sweetalert";

const WalkIn = ({ accountInfo }) => {
  const [openCam, setOpenCam] = useState(true);
  const [toggleCam, setToggleCam] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [key] = useState(accountInfo.campus.key);
  const [account] = useState(accountInfo._id);
  const [campus] = useState(accountInfo.campus._id);
  const [vaxStatsList, setVaxStatsList] = useState([]);
  const [file, setFile] = useState("");
  const [url] = useState(process.env.REACT_APP_URL);
  const [genderList, setGenderList] = useState([]);
  const [gender, setGender] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [purpose, setPurpose] = useState("");
  const [vaxStats, setVaxStats] = useState("");
  const [walkInList, setWalkInList] = useState([]);
  const [api] = useState(process.env.REACT_APP_API_SERVER);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const genders = await fetchGender();
    const vaxStatus = await fetchVaxStats();
    const walkIns = await fetchWalkIns();
    setGenderList(genders);
    setVaxStatsList(vaxStatus);
    setWalkInList(walkIns);
  };

  const fetchWalkIns = async () => {
    const { data } = await axios.post(`${url}/getWalkIns`, {
      campus,
      addedBy: account,
    });
    return data;
  };

  const fetchVaxStats = async () => {
    const { data } = await axios.get(`${url}/getVaxStatus`);

    return data;
  };
  const fetchGender = async () => {
    const { data } = await axios.get(`${url}/getGender`);

    return data;
  };
  const trigger = (e) => {
    const uploader = document.querySelector("#walkInPic");

    uploader.click();
  };

  const previewImage = (e) => {
    const preview = document.querySelector("#walkInPicPreview");

    const reader = new FileReader();

    reader.onload = () => {
      preview.src = reader.result;
    };

    setFile(e.target.files[0]);
    console.log(e.target.files[0]);

    reader.readAsDataURL(e.target.files[0]);
  };

  const walkInSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      // let imgFile = file;

      // const split = imgFile.name.split(".");
      // imgFile.type = `image/${split[1]}`;
      // console.log(imgFile);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("key", key);
      formData.append("campus", campus);
      formData.append("account", account);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("phoneNumber", phoneNumber);
      formData.append("email", email);
      formData.append("address", address);
      formData.append("gender", gender);
      formData.append("vaxStats", vaxStats);
      formData.append("purpose", purpose);
      formData.append("role", "62cb91c52c5804049b716d4b");
      console.log(formData);
      try {
        const res = await axios.post(`${url}/walkInReg`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        resetField();
        swal("Success!", "Account Created!", "success");
      } catch (error) {
        console.log(error);
      }
    } else {
      swal("Please Include a Profile Picture");
    }
  };
  const resetField = async () => {
    const list = await fetchWalkIns();
    setWalkInList(list);
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setAddress("");
    setEmail("");
    setFile("");
    document.querySelector("#walkInPicPreview").src = Image;
  };

  const toggleCamera = async () => {
    setToggleCam(!toggleCam);
  };

  const onCapture = (imageData) => {
    // read as webP
    const preview = document.querySelector("#walkInPicPreview");
    preview.src = imageData.webP;

    setImgSrc(imageData.webP);
    // console.log(imageData.webP);
    // read as file
    console.log(imageData.file);
    setFile(imageData.file);
    console.log(imageData.file);
    setToggleCam(false);
    // read as blob
    // imageData.blob
  };

  const onError = useCallback((error) => {
    console.log(error);
  }, []);
  const config = useMemo(() => ({ video: true }), []);
  return (
    <div className="walk-in-container">
      {toggleCam && (
        <div className="capture-image-pop">
          <div className="capture-image-box ">
            <div className="image-capture-frame">
              {!openCam ? (
                <div className="capture-image-preview"></div>
              ) : (
                <ImageCapture
                  className={"capture-cam "}
                  onCapture={onCapture}
                  onError={onError}
                  width={300}
                  userMediaConfig={config}
                  type="image/png"
                />
              )}
              <div
                className="close-image-capture"
                onClick={() => toggleCamera()}
              >
                Close
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="walk-in-form">
        <form onSubmit={walkInSubmit}>
          <div className="walk-in-form-top">
            <div className="walk-in-form-top-left">
              <div className="form-inline-left d-flex justify-content-center">
                <img
                  src={Image}
                  id="walkInPicPreview"
                  onClick={() => toggleCamera()}
                  className="walk-in-preview-img"
                  alt="img"
                />
                <input
                  accept="image/*"
                  onChange={(e) => previewImage(e)}
                  id="walkInPic"
                  type="file"
                  style={{ display: "none" }}
                />
                <label onClick={trigger} className="mt-4">
                  <i className="fas fa-upload me-3"></i>Upload Image
                </label>
              </div>
            </div>
            <div className="walk-in-form-top-right">
              <div>
                <div className="form-group mb-2 ">
                  <label>First Name</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    minLength={"3"}
                    type="text"
                    className="form-control walkIn-form"
                  />
                </div>
                <div className="form-group mb-2 ">
                  <label>Last Name</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    minLength={"3"}
                    type="text"
                    className="form-control walkIn-form"
                  />
                </div>
                <div className="form-group mt-3">
                  <label>Gender</label>
                  {
                    <select
                      onChange={(e) => {
                        setGender(e.target.value);
                      }}
                      defaultValue={gender}
                      required
                      className="form-control walkIn-form"
                    >
                      <option value="">Select</option>
                      {genderList.map((list) => (
                        <option key={list._id} value={list._id}>
                          {list.description}
                        </option>
                      ))}
                    </select>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="walk-in-form-bottom mt-3">
            <div className="form-group mb-2 ">
              <label>Contact Number</label>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                minLength={"3"}
                type="number"
                className="form-control walkIn-form"
              />
            </div>
            <div className="form-group mb-2 ">
              <label>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                minLength={"3"}
                type="email"
                className="form-control walkIn-form"
              />
            </div>
            <div className="form-group mb-2 ">
              <label>Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                minLength={"3"}
                type="text"
                className="form-control walkIn-form"
              />
            </div>
            <div className="form-group mb-2">
              <label>Vaccination Status</label>
              {
                <select
                  onChange={(e) => setVaxStats(e.target.value)}
                  required
                  className="form-control walkIn-form"
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
              }
            </div>
            <div className="form-group mb-2">
              <label>Purpose of Visitation</label>
              <select
                required
                defaultValue={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="form-control walkIn-form"
              >
                <option value="">Select</option>
                <option value="Claim Transcript">Claim Transcript</option>
                <option value="College Application">College Application</option>
                <option value="Entrance Examination">
                  Entrance Examination
                </option>
                <option value="Interview">Interview</option>
                <option value="Just Visiting">Just Visiting</option>
              </select>
            </div>
          </div>
          <div className="text-end px-3 mt-3">
            <button className="btn btn-primary">
              <i className="fas fa-check me-2"></i>Submit
            </button>
          </div>
        </form>
      </div>
      <div className="walk-in-logs">
        <div className="walk-in-logs-header">
          <i className="me-2 fas fa-file-import"></i>Recently Added
        </div>
        <div className="walk-in-logs-content">
          <table className="table table-striped recent-logs-table">
            <tbody>
              {walkInList.length > 0 &&
                walkInList.map((list) => (
                  <tr key={list._id}>
                    <td>
                      <img
                        src={`${api}/${list.image}`}
                        // src={require(`../../../../server/uploads/${list.image}`)}
                        alt="alt"
                        className="recent-logs-img"
                      />
                    </td>
                    <td className="py-4">
                      {list.firstName} {list.lastName}
                    </td>
                    <td className="py-4">{list.username}</td>
                    <td className="py-4">
                      {Date(list.dateAdded).toString().slice(0, 16)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WalkIn;
