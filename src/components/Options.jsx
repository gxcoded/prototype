import "../assets/css/Options.css";
import BounceLoader from "react-spinners/BounceLoader";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";

const Options = () => {
  const [loading, setLoading] = useState(true);
  const [showPopUp, setShowPopUp] = useState(false);
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [url] = useState(process.env.REACT_APP_URL);
  const [firstStep, setFirstStep] = useState(true);
  const [secondStep, setSecondStep] = useState(false);
  const [thirdStep, setThirdStep] = useState(false);
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const checkAccount = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(`${url}/checkUsername`, {
      username,
    });
    if (Object.keys(data).length > 0) {
      console.log(data);
      localStorage.setItem("hashCodeToken", data.codeHash);
      localStorage.setItem("ctIdToken", data.id);
      swal(
        "Success!",
        "A verication Code was sent on your email",
        "success"
      ).then((res) => {
        setFirstStep(false);
        setSecondStep(true);
      });
    } else {
      swal("Error!", "Account not Found", "error");
      setUsername("");
    }
  };

  const checkVerification = async (e) => {
    e.preventDefault();

    const hashCode = localStorage.getItem("hashCodeToken");
    hashCode === null && window.location.reload();

    const { data } = await axios.post(`${url}/checkVerification`, {
      code,
      hashCode,
    });

    if (data) {
      swal("Success!", "Code Accepted!", "success").then((res) => {
        setFirstStep(false);
        setSecondStep(false);
        setThirdStep(true);
      });
    } else {
      swal("Error!", "Incorrect Verification Code", "error");
      setCode("");
    }
  };
  const submitVerifiedPassword = async (e) => {
    e.preventDefault();

    const id = localStorage.getItem("ctIdToken");
    id === null && window.location.reload();

    if (pass1 === pass2) {
      const { data } = await axios.post(`${url}/finalizeVerification`, {
        id,
        password: pass1,
      });
      if (data) {
        swal("Success!", "Verification Successful", "success");
        window.location.href = "/login";
      } else {
        swal("Error!", "Please Try Again", "error");
      }
    } else {
      swal("Error!", "Passwords are not the same", "error");
    }
  };

  return (
    <div className="wrapper wrapper-body">
      {showPopUp && (
        <div className={`options-pop-up`}>
          <div className="options-pop-up-form">
            <div className="options-pop-up-form-header">
              <span onClick={() => setShowPopUp(false)}>
                <i className="fas fa-times"></i>
              </span>
            </div>
            <div className="options-pop-up-form-body">
              {firstStep && (
                <div className="options-pop-up-form-body-content">
                  <div className="options-pop-up-form-sub-header">
                    Please Enter your Username.
                  </div>
                  <div className="options-pop-up-form-section">
                    <form onSubmit={checkAccount}>
                      <div className="form-group mt-3">
                        <input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          minLength={"5"}
                          required
                          type="text"
                          className="form-control"
                          placeholder="Username"
                        />
                      </div>
                      <div className="form-group">
                        <button className="btn btn-primary mt-4">Submit</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {secondStep && (
                <div className="options-pop-up-form-body-content">
                  <div className="options-pop-up-form-sub-header">
                    Enter Verification Code
                  </div>
                  <div className="options-pop-up-form-section">
                    <form onSubmit={checkVerification}>
                      <div className="form-group mt-3">
                        <input
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          minLength={"5"}
                          required
                          type="text"
                          className="form-control"
                          placeholder="Verification Code"
                        />
                      </div>
                      <div className="form-group">
                        <button className="btn btn-primary mt-4">Submit</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {thirdStep && (
                <div className="options-pop-up-form-body-content">
                  <div className="options-pop-up-form-sub-header">
                    Create a Password for your account
                  </div>
                  <div className="options-pop-up-form-section">
                    <form onSubmit={submitVerifiedPassword}>
                      <div className="form-group mt-3">
                        <input
                          value={pass1}
                          onChange={(e) => setPass1(e.target.value)}
                          minLength={"8"}
                          required
                          type="password"
                          className="form-control"
                          placeholder="Create Password"
                        />
                      </div>
                      <div className="form-group mt-3">
                        <input
                          value={pass2}
                          onChange={(e) => setPass2(e.target.value)}
                          minLength={"8"}
                          required
                          type="password"
                          className="form-control"
                          placeholder="Re-Type Password"
                        />
                      </div>
                      <div className="form-group">
                        <button className="btn btn-primary mt-4">Submit</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="wrapper-effect">
        <div className="wrapper-effect-left bg-light"></div>
        <div className="wrapper-effect-right"></div>
      </div>
      {loading ? (
        <div className="spinner">
          <BounceLoader color="#5dcea1" loading={loading} size={150} />
        </div>
      ) : (
        <div id="options" className="options">
          <div className="options-left "></div>
          <div className="options-right ">
            <div className="options-content">
              <div className="options-title">
                <span className="icon me-2">
                  <i className="fas fa-qrcode"></i>
                </span>
                PSU Contact Tracer
              </div>
              <p className="context">
                Let's help prevent the spread of COVID-19 within our campus.
                Register now and create your unique QR Code.
              </p>
              <hr />
              <div className="options-subtitle">Register Options..</div>
              <Link to="/signUp" state={{ userType: 3 }}>
                <button className="my-btn staff-btn">New Account</button>
              </Link>
              <button
                onClick={() => setShowPopUp(true)}
                className="my-btn student-btn"
              >
                Verify Account
              </button>
              <p className="bottom-control mt-5">
                <Link to="/login">
                  <i className="fas fa-arrow-left me-2"></i>Go Back
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Options;
