import "./ReportPositive.css";
import Image from "../../../assets/images/negative.jpg";
import DefaultImage from "../../../assets/images/dimg.png";
import { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";

const ReportPositive = ({ accountInfo }) => {
  const [url] = useState(process.env.REACT_APP_URL);
  const [file, setFile] = useState("");
  const [adminInfo, setAdminInfo] = useState({});
  const [testTypes, setTestTypes] = useState([]);

  const [selectedType, setSelectedType] = useState("");
  const [minimumDate, setMinimumDate] = useState("");
  const [dateTested, setDateTested] = useState(
    new Date().toISOString().toString().slice(0, 10)
  );

  const [resultDate, setResultDate] = useState(
    new Date().toISOString().toString().slice(0, 10)
  );

  const [message, setMessage] = useState("");
  const [defaultDate] = useState(
    new Date().toISOString().toString().slice(0, 10)
  );

  useEffect(() => {
    loadAdminInfo();
    loadTestTypes();
  }, []);

  //load test types
  const loadTestTypes = async () => {
    const types = await fetchTestTypes();
    console.log(types);

    setTestTypes(types);
  };

  const fetchTestTypes = async () => {
    const { data } = await axios.post(`${url}/getTestTypes`);
    return data;
  };

  const loadAdminInfo = async () => {
    const info = await fetchAdminInfo();
    console.log(info);
    setAdminInfo(info);
  };

  const fetchAdminInfo = async () => {
    const { data } = await axios.post(`${url}/getAdminAccount`, {
      campus: accountInfo.campus._id,
    });

    return data;
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

  const trigger = () => {
    const uploader = document.querySelector("#picUploader");
    uploader.click();
  };

  const sendNow = async () => {
    if (selectedType) {
      if (file) {
        if (message) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("campus", accountInfo.campus._id);
          formData.append("accountOwner", accountInfo._id);
          formData.append("testType", selectedType);
          formData.append("dateTested", new Date(dateTested).getTime());
          formData.append("resultDate", new Date(resultDate).getTime());
          formData.append("dateSent", Date.now().toString());
          formData.append("message", message);
          formData.append("adminNumber", adminInfo.phoneNumber);
          formData.append("adminEmail", adminInfo.email);

          try {
            const res = await axios.post(`${url}/reportNegative`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            swal({
              title: "Sent!",
              text: "Notification was sent to School Admin",
              icon: "success",
            });

            setMessage("");
            setFile("");
            document.querySelector("#preview").src = DefaultImage;
          } catch (error) {
            console.log(error);
          }
        } else {
          swal("Please Type a Message!");
        }
      } else {
        swal("Please Include an Image of your test Result!");
      }
    } else {
      swal("Please Select Test Type");
    }
  };

  return (
    <div className="rp-container">
      <div className="rp-right">
        <div className="rp-right-header text-success">Report Details.</div>
        <div className="rp-right-main">
          <div className="rp-right-main-input">
            <div className="mt-3">
              <span>Test Type</span>
              <select
                required
                onChange={(e) => {
                  setSelectedType(e.target.value);
                }}
                className="form-control"
                defaultValue={selectedType}
              >
                <option value={selectedType} disabled>
                  Select
                </option>
                {testTypes.map((list) => (
                  <option key={list._id} value={list._id}>
                    {list.description}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2">
              <span>Date Tested</span>
              <input
                value={dateTested}
                onChange={(e) => {
                  {
                    setDateTested(e.target.value);
                    setMinimumDate(e.target.value);
                  }
                }}
                max={defaultDate}
                type="date"
                className="form-control"
              />
            </div>
            <div className="mt-2">
              <span>Date when you get the test Result</span>
              <input
                value={resultDate}
                onChange={(e) => {
                  {
                    setResultDate(e.target.value);
                  }
                }}
                min={minimumDate}
                max={defaultDate}
                type="date"
                className="form-control"
              />
            </div>
            <div className="rp-right-proof">
              <div className="rp-right-proof-img">
                <input
                  onChange={(e) => previewImage(e)}
                  id="picUploader"
                  type="file"
                  style={{ display: "none" }}
                />
                <div className="rp-test-res-label">
                  Click to Attach an Image of your test result.
                </div>
                <img
                  id="preview"
                  src={DefaultImage}
                  alt="rp-img-dis"
                  className="rp-img-proof-img-display"
                  onClick={() => trigger()}
                />
              </div>
              <div className="rp-right-proof-msg">
                <div className="text-group">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type Custom Message Here"
                    className="form-control positive-text-area m-0"
                    required
                    // minLength={"20"}
                    rows="10"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="rp-right-send text-end">
              <button onClick={() => sendNow()} className="btn btn-success">
                <i className="fas fa-paper-plane me-2"></i>Send Report
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="rp-left">
        <img src={Image} alt="nfw-img" className="rp-left-img" />
        <div className="rp-left-text bg-success">
          By this, you can notify the campus Nurse that you are already free
          from COVID-19.
        </div>
      </div>
    </div>
  );
};

export default ReportPositive;
