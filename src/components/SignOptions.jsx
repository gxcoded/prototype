import { Link } from "react-router-dom";
import "../assets/css/SignOptions.css";
import BounceLoader from "react-spinners/BounceLoader";
import { useEffect, useState } from "react";

const SignOptions = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="wrapper wrapper-bg wrapper-body">
      {loading ? (
        <div className="spinner">
          <BounceLoader color="#5dcea1" loading={loading} size={150} />
        </div>
      ) : (
        <div className=" option-container ">
          <div className="options">
            <div className="options-left">
              <div className="options-left-title">
                Let's help stop the spread of COVID-19
              </div>
              <p className="context">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Delectus mollitia quae qui possimus et dolor totam molestiae
                sapiente omnis eligendi.
              </p>
              <Link to="/login">
                <button className="my-btn back-btn">
                  <i className="fas fa-angle-double-left me-2"></i>Back
                </button>
              </Link>
            </div>
            <div className="options-right">
              <div className="options-right-form">
                <div className="options-right-title">Register as ..</div>
                <Link to="/staffSignUp">
                  <button className="my-btn staff-btn">Staff</button>
                </Link>
                <Link to="/studentSignUp">
                  <button className="my-btn student-btn">Student</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignOptions;
