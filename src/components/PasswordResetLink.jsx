import { useSearchParams } from "react-router-dom";
import "../assets/css/ResetLink.css";
import BounceLoader from "react-spinners/BounceLoader";
import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import swal from "sweetalert";

const PasswordResetLink = () => {
  const [loading, setLoading] = useState(true);
  const [valid, setValidity] = useState(true);
  const [info, setInfo] = useState({});
  const [params] = useSearchParams();
  const [url] = useState(process.env.REACT_APP_URL);
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  useEffect(() => {
    params.get("hash") === null && setValidity(false);

    const check = async () => {
      const data = await checkResetLink();
      Object.keys(data).length < 1 && setValidity(false);
      setInfo(data);
    };

    check();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const checkResetLink = async () => {
    const hash = params.get("hash");

    const { data } = await axios.post(`${url}/checkResetLink`, {
      hash,
    });

    return await data;
  };

  const saveNewPassword = async (e) => {
    e.preventDefault();
    if (pass1 === pass2) {
      const { data } = await axios.post(`${url}/resetPassword`, {
        id: info.account._id,
        password: pass1,
      });
      if (data) {
        console.log(data);
        swal("Successful", "Password Reset Successful", "success").then((s) => {
          window.location.href = "/login";
        });
      }
    } else {
      swal("Error", "Passwords are not the same.", "warning");
    }
  };
  return (
    <div className="reset-link-container">
      {loading ? (
        <div className="spinner">
          <BounceLoader color="#5dcea1" loading={loading} size={150} />
        </div>
      ) : (
        <Fragment>
          {valid ? (
            <div className="reset-link-main border">
              <div className="reset-link-main-left">
                <div className="reset-link-main-left-header">
                  Hi {info.account.firstName},
                </div>
                <div className="reset-link-main-left-sub-header">
                  Please create a new Password.
                </div>
                <div className="reset-link-main-left-form">
                  <form onSubmit={saveNewPassword}>
                    <div className=" mt-3">
                      <label>New Password</label>
                      <input
                        onChange={(e) => setPass1(e.target.value)}
                        value={pass1}
                        required
                        type="password"
                        minLength={"8"}
                        className="form-control"
                      />
                    </div>
                    <div className=" mt-3">
                      <label>Retype Password</label>
                      <input
                        onChange={(e) => setPass2(e.target.value)}
                        value={pass2}
                        required
                        type="password"
                        minLength={"8"}
                        className="form-control"
                      />
                    </div>
                    <div className=" mt-3">
                      <button className="btn btn-custom-red">
                        Submit
                        <i className="fas fa-level-up-alt ms-2"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="reset-link-main-right"></div>
            </div>
          ) : (
            <div className="h4">Your Link is Invalid or no Longer Valid...</div>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default PasswordResetLink;
