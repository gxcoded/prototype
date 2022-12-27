import "../assets/css/PasswordReset.css";
import { useState, useEffect } from "react";
import BounceLoader from "react-spinners/BounceLoader";
import { Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

const PasswordReset = () => {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [url] = useState(process.env.REACT_APP_URL);

  useEffect(() => {
    setInterval(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const findAccount = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(`${url}/checkUser`, {
      email,
    });

    if (data) {
      swal({
        title: "Email Sent!",
        text: "Please check your email and follow the instructions to reset your password.",
        icon: "success",
      }).then((event) => {
        window.location.href = "/login";
      });
    } else {
      swal(
        "Error",
        "There's no Account associated with the Email Address you entered",
        "error"
      );
    }
    setEmail("");
  };

  return (
    <div className="reset-container">
      {loading ? (
        <div className="spinner loader-effect">
          <BounceLoader color="#5dcea1" loading={loading} size={150} />
        </div>
      ) : (
        <div className="reset-main">
          <div className="reset-main-left"></div>
          <div className="reset-main-right">
            <div className="reset-header">Forgot Password?</div>
            <div className="reset-sub-header bg-light">
              Please Enter the email Address that is associated with your
              account.
            </div>
            <div className="form-reset">
              <form onSubmit={findAccount}>
                <div className="form-reset-field">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    minLength={"5"}
                    className="form-reset-input"
                    placeholder="Email Address"
                  />
                </div>
                <div className="reset-btn  py-3 text-end">
                  <button className="btn btn-custom-red">
                    Next<i className="fas fa-angle-double-right ms-1"></i>
                  </button>
                </div>

                <div className="back-to-login">
                  <Link to={"/login"}>
                    <i className="fas fa-arrow-left me-1"></i>Login Page
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordReset;
