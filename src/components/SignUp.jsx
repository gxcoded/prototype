import { useState, useEffect } from "react";
import "../assets/css/SignUp.css";
import BounceLoader from "react-spinners/BounceLoader";
import ManipulateSignUp from "./ManipulateSignUp";
import SideDecoration from "./SideDecoration";

const SignUp = ({ userType, campus, vaxStatsList, genderList }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const toggleSide = () => {
    document.querySelector("#leftBar").classList.toggle("show");
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
            <div className="signUp-right-section ">
              <div className="burger-menu  d-flex justify-content-end align-items-center">
                <div
                  onClick={() => {
                    toggleSide();
                  }}
                  className="burger-bar p-3"
                >
                  <i className="fas fa-bars"></i>
                </div>
              </div>
              <ManipulateSignUp
                campus={campus}
                genderList={genderList}
                vaxStatsList={vaxStatsList}
                userType={userType}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SignUp;
