import { useState, useEffect } from "react";
import "../assets/css/SignUp.css";
import "../assets/css/CreatePassword.css";
import BounceLoader from "react-spinners/BounceLoader";
import SideDecoration from "./SideDecoration";
import { Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

const CreatePassword = () => {
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [userName, setUserName] = useState("");
  const [url] = useState(process.env.REACT_APP_URL);

  useEffect(() => {
    const fetchedUsername = async () => {
      const name = await fetchUsername();
      setUserName(name);
    };

    setTimeout(() => {
      fetchedUsername();
      setLoading(false);
    }, 2000);
  }, []);

  const fetchUsername = async () => {
    const hash = localStorage.getItem("ctToken");

    const response = await axios.post(`${url}/getUsername`, {
      hash,
    });
    return await response.data;
  };

  const submitCredentials = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      swal({ text: "Password must be 8 Characters or More", icon: "warning" });
    } else {
      if (password !== password2) {
        swal({ text: "Passwords are not the same", icon: "error" });
      } else {
        getResponse();
        swal({
          title: "Account Created!",
          text: "You may now login to the system.",
          icon: "success",
        }).then((event) => {
          window.location.href = "/login";
        });
      }
    }
  };

  const getResponse = async () => {
    const registered = await registerAccount();
    console.log(registered);
  };

  const registerAccount = async () => {
    const token = localStorage.getItem("ctToken");
    const response = await axios.post(`${url}/registerAccount`, {
      token,
      password,
    });
    return await response.data;
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
          <div className="wrapper-background-right wrap-create">
            <div className="create-section">
              <div className="display-section">
                <div className="img-section"></div>
                <div className="create-text mt-4 text-center">
                  Let's finish up setting your account. The username is provided
                  by the system. Please create a password.
                </div>
              </div>
              <div className="form-section">
                <div className="create-title text-success">Account</div>
                <form onSubmit={submitCredentials} className="mt-3">
                  <div className="form-group mt-3">
                    <label>Username</label>
                    <input
                      type="text"
                      className="form-control finalize"
                      value={userName}
                      readOnly
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label>Password</label>
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      required
                      type="password"
                      className="form-control "
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label>Confirm Password</label>
                    <input
                      onChange={(e) => setPassword2(e.target.value)}
                      value={password2}
                      required
                      type="password"
                      className="form-control "
                    />
                  </div>
                  <div className="form-group mt-3">
                    <button type="submit" className="btn btn-primary">
                      Finish
                    </button>
                  </div>
                </form>
              </div>
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
      )}
    </div>
  );
};

export default CreatePassword;
