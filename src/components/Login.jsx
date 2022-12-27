import "../assets/css/Login.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import BounceLoader from "react-spinners/BounceLoader";
import axios from "axios";
import swal from "sweetalert";

const Login = () => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url] = useState(process.env.REACT_APP_URL);

  useEffect(() => {
    localStorage.removeItem("ctToken");
    localStorage.removeItem("ctIdToken");
    localStorage.removeItem("hashCodeToken");
    console.log(url);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const sendRequest = async () => {
    const { data } = await axios.post(`${url}/login`, {
      username: username,
      password: password,
    });
    return data;
  };

  const checkLogin = async (e) => {
    e.preventDefault();
    const data = await sendRequest();
    console.log(data);
    if (Object.keys(data).length === 0) {
      swal("Login Failed!", "Account not Found", "error");
      resetFields();
    } else {
      localStorage.setItem("ctIdToken", data._id);

      switch (data.role) {
        case "62cb91b12c5804049b716d47":
          window.location.href = "/school-admin";
          break;
        case "637ef41babeb211183ca4824":
          window.location.href = "/school-nurse";
          break;
        case "62cb8add107251b0d1d0b641":
          window.location.href = "/teaching-account";
          break;
        case "62cb8ae9107251b0d1d0b643":
          window.location.href = "/non-teaching-account";
          break;
        case "62cb91ba2c5804049b716d49":
          window.location.href = "/student-account";
          break;
        case "62cb91c52c5804049b716d4b":
          window.location.href = "/guest-account";
          break;
        default:
          swal("Login Failed!", "Account not Found!", "error");
          resetFields();
      }
    }
  };

  const resetFields = () => {
    setUsername("");
    setPassword("");
  };

  return (
    <div id="loginWrapper" className="wrapper">
      <div className="wrapper-bg">
        <div className="wrapper-left"></div>
        <div className="wrapper-right"></div>
      </div>
      {loading ? (
        <div className="spinner">
          <BounceLoader color="#5dcea1" loading={loading} size={150} />
        </div>
      ) : (
        <div className="login-form ">
          <div className="login-form-contents bg-primary">
            <div className="login-form-logo">
              <div className="login-psu-logo border"></div>
            </div>
            <form onSubmit={checkLogin} className="form-fields" action="">
              <div className="login-form-title">
                <div className="qr-icon">
                  <i className="fas fa-qrcode"></i>
                </div>
                <div className="ti">Login</div>
              </div>
              <div className="form-group mt-4">
                <label>Username</label>
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  className="form-control"
                  value={username}
                  required
                />
              </div>
              <div className="form-group mt-2">
                <label>Password</label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="form-control"
                  value={password}
                  required
                />
              </div>
              <Link to={"/resetPassword"}>
                <div className="forgot-password">Forgot Password ?</div>
              </Link>
              <div className="form-group mt-4">
                <button className="btn btn-custom-red btn-block">Login</button>
              </div>
              <div className="form-group mt-4 text-center">
                <Link to="/signOptions">
                  <span className="register-link">Register As Guest</span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
