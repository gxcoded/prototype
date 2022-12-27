import "./subCss/CredentialPage.css";
import { useState } from "react";
import swal from "sweetalert";
import axios from "axios";

const AccountInfo = ({ accountInfo, popModalToggler, reloadAccountInfo }) => {
  const [firstName, setFirstName] = useState(accountInfo.firstName);
  const [lastName, setLastName] = useState(accountInfo.lastName);
  const [number, setNumber] = useState(accountInfo.phoneNumber);
  const [url] = useState(process.env.REACT_APP_URL);
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  const [showHint, setShowHint] = useState(false);

  const submitUpdate = (e) => {
    e.preventDefault();

    if (number.length !== 10) {
      swal("Phone Number Should be 10 digits and starts with ( 9 )");
    } else {
      if (updateInfo()) {
        reloadAccountInfo();
        swal("Success!", "Updated", "success");
      }
    }
  };

  const updateInfo = async () => {
    const updated = await isUpdated();

    return updated;
  };

  const isUpdated = async () => {
    const { data } = await axios.post(`${url}/updateStaticInfo`, {
      id: accountInfo._id,
      firstName,
      lastName,
      number,
    });

    return data;
  };
  const validateInput = (e) => {
    console.log(e.keyCode);
    if (number.length === 1 && e.keyCode !== 57) {
      setNumber("");
      setShowHint(true);
      setTimeout(() => {
        setShowHint(false);
      }, 2000);
    }
    if (e.keyCode === 69 || e.keyCode === 190) {
      document.querySelector("#phoneNumber").value = "";
    }
  };
  return (
    <div className="account-credentials-container">
      <div className="account-title-text p-3">
        <i className="me-3 fas fa-user-cog"></i>Account Information
      </div>
      <div className=" account-info-main">
        <form
          onSubmit={(e) => {
            submitUpdate(e);
          }}
        >
          <div className="account-info-img ">
            <img
              onClick={() => popModalToggler()}
              src={`${api}/${accountInfo.image}`}
              alt="img"
              className="me-3 "
            />
          </div>
          <div className="credentials-fields">
            <div className="from-group">
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
            <div className="from-group">
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
            <div className="from-group">
              <label>Contact Number</label>
              {showHint && (
                <div className="text-danger" style={{ fontSize: ".7rem" }}>
                  ( Contact Number Should Start with (9))
                </div>
              )}
              <input
                onKeyUp={validateInput}
                id="phoneNumber"
                value={number}
                onChange={(e) => {
                  setNumber(e.target.value);
                }}
                required
                type="number"
                className="form-control"
                placeholder="10 Digit Mobile Number"
                step="1"
              />
            </div>

            <div className="from-group mt-4">
              <button type="submit" className="btn w-100 btn-outline-primary">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountInfo;
