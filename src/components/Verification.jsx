import { useState, useEffect } from "react";
import "../assets/css/SignUp.css";
import "../assets/css/Verify.css";
import BounceLoader from "react-spinners/BounceLoader";
import SideDecoration from "./SideDecoration";
import { Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

const Verification = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [url] = useState(process.env.REACT_APP_URL);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const submitCode = async () => {
    const hash = localStorage.getItem("ctToken");
    const response = await axios.post(`${url}/authenticate`, {
      hash,
      code,
    });
    return await response.data;
  };

  const submitVerification = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      swal({ text: "Code must be 6 Digit", icon: "warning" });
    } else {
      const verified = await submitCode();
      verified
        ? swal({
            title: "Verified!",
            text: "Verification Successful",
            icon: "success",
          }).then((event) => {
            window.location.href = "/create-password";
          })
        : swal({ text: "Wrong verification Code", icon: "error" });
    }
  };

  return (
    <div className="wrapper">
      {loading ? (
        <div className="spinner">
          <BounceLoader color="#5dcea1" loading={loading} size={150} />
        </div>
      ) : (
        <div className="wrapper-background">
          <SideDecoration />
          <div className="wrapper-background-right">
            <div className="verify-section">
              <div className="verify-logo"></div>
              <div className="verify-label">
                <div className="verify-title mb-3">Verification</div>
                <form onSubmit={submitVerification}>
                  <div className="form-group">
                    <label className="verify-label">
                      Enter Verification Code
                    </label>
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      type="number"
                      min={"1"}
                      className="form-control verify-field"
                      placeholder="******"
                    />
                  </div>
                  <div className="form-group mt-3">
                    {/* <Link to='/create-password'> */}
                    <button
                      type="submit"
                      className="next btn btn-primary btn-block"
                    >
                      Verify
                    </button>
                    {/* </Link> */}
                  </div>
                </form>
                <div className="verify-texts mt-3">
                  We sent a 6 digit verification code on the email address you
                  provided. Please enter the code here to continue your
                  registration.
                </div>
                <div className="back-btn-section verify-bck-btn">
                  <p>
                    <Link to="/signOptions">
                      <i className="fas fa-arrow-left me-2"></i>Go Back
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verification;
