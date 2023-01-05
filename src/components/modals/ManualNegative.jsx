import { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import DefaultImage from "../../assets/images/dimg.png";

const ManualNegative = ({ manualInfo, reloader }) => {
  const [file, setFile] = useState("");
  const [oneWeek] = useState(604800000);
  const [minDate] = useState(Number(Date.now().toString()) - oneWeek);
  const [url] = useState(process.env.REACT_APP_URL);
  const [adminInfo, setAdminInfo] = useState({});
  const [testTypes, setTestTypes] = useState([]);
  const [message] = useState("Manually Set By the Campus Nurse");

  const [selectedType, setSelectedType] = useState("");
  const [minimumDate, setMinimumDate] = useState("");
  const [dateTested, setDateTested] = useState(
    new Date().toISOString().toString().slice(0, 10)
  );

  const [resultDate, setResultDate] = useState(
    new Date().toISOString().toString().slice(0, 10)
  );

  const [defaultDate] = useState(
    new Date().toISOString().toString().slice(0, 10)
  );
  const [defaultMin] = useState(
    new Date(minDate).toISOString().toString().slice(0, 10)
  );
  useEffect(() => {
    loadTestTypes();
  }, []);

  //load test types
  const loadTestTypes = async () => {
    const types = await fetchTestTypes();
    // console.log(types);

    setTestTypes(types);
  };

  const fetchTestTypes = async () => {
    const { data } = await axios.post(`${url}/getTestTypes`);
    return data;
  };
  const prevImgImage = (e) => {
    const prevImg = document.querySelector("#prevImg");

    const reader = new FileReader();

    reader.onload = () => {
      prevImg.src = reader.result;
    };

    setFile(e.target.files[0]);
    reader.readAsDataURL(e.target.files[0]);
  };
  const trigger = () => {
    const uploader = document.querySelector("#pictureUploader");
    uploader.click();
  };
  const sendNow = async () => {
    if (selectedType) {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("campus", manualInfo.campus);
        formData.append("accountOwner", manualInfo._id);
        formData.append("testType", selectedType);
        formData.append("dateTested", new Date(dateTested).getTime());
        formData.append("resultDate", new Date(resultDate).getTime());
        formData.append("dateSent", Date.now().toString());
        formData.append("message", message);
        // formData.append("adminNumber", adminInfo.phoneNumber);
        // formData.append("adminEmail", adminInfo.email);
        // formData.append("accountId", adminInfo._id);

        try {
          const res = await axios.post(`${url}/manualNegative`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          swal({
            title: "Sent!",
            text: "Report has been sent",
            icon: "success",
          });
          reloader();
          setFile("");
          document.querySelector("#prevImg").src = DefaultImage;
        } catch (error) {
          console.log(error);
        }
      } else {
        swal("Please Include an Image of your test Result!");
      }
    } else {
      swal("Please Select Test Type");
    }
  };
  return (
    <div>
      <div
        className="modal fade"
        id="manualNegative"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header modal-header-success">
              <h5 className="modal-title">Create a Negative Test Report</h5>
            </div>
            <div className="modal-body">
              {Object.keys(manualInfo).length > 0 && (
                <div>
                  <span className="fw-bold me-2">Name: </span>
                  {manualInfo.firstName} {manualInfo.lastName}
                </div>
              )}
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
                  min={defaultMin}
                  max={defaultDate}
                  type="date"
                  className="form-control"
                />
              </div>
              <div className="mt-2">
                <span>Result Date</span>
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
            </div>
            <div className="p-5">
              <input
                onChange={(e) => prevImgImage(e)}
                id="pictureUploader"
                type="file"
                style={{ display: "none" }}
              />
              <div className="rp-test-res-label">
                Click to Attach an Image of your test result.
              </div>
              <img
                id="prevImg"
                src={DefaultImage}
                alt="rp-img-dis"
                className="rp-img-proof-img-display"
                onClick={() => trigger()}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-sm btn-custom-red"
                data-dismiss="modal"
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn-sm btn-primary"
                onClick={() => sendNow()}
                data-dismiss="modal"
              >
                Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualNegative;
