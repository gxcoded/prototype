import "../../assets/css/StaffSignUpForm.css";
import Image from "../../assets/images/profile2.png";
import SudoAdminCredentials from "./SudoAdminCredentials";
import { useState } from "react";

const AddStaffForm = () => {
  const [showForm, setShowForm] = useState(true);

  const trigger = (e) => {
    const uploader = document.querySelector("#picUploader");

    uploader.click();
  };
  const previewImage = (e) => {
    const preview = document.querySelector("#preview");

    const reader = new FileReader();

    reader.onload = () => {
      preview.src = reader.result;
    };
    console.log(e.target.files[0]);
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="form-wrapper">
      {showForm ? (
        <div className="staff-form">
          <div className="signUp-form-title">
            <i className="fas fa-chalkboard-teacher me-3 text-warning"></i>
            Add Staff
          </div>

          <form action="" className="form-signUp mt-3">
            <div className="form-inline d-flex ">
              <div className="form-inline-left  d-flex justify-content-center">
                <img
                  src={Image}
                  id="preview"
                  onClick={trigger}
                  className="image-preview"
                  alt="img"
                />
                <input
                  onChange={(e) => previewImage(e)}
                  id="picUploader"
                  type="file"
                  style={{ display: "none" }}
                />
                <label onClick={trigger} className="mt-4">
                  <i className="fas fa-upload me-3"></i>Upload Image
                </label>
              </div>
              <div className="form-inline-right">
                <div className="form-group">
                  <label>Campus</label>
                  <select defaultValue={"0"} className="form-control-select">
                    <option value="0" disabled>
                      Select
                    </option>
                    <option value="1">Asingan</option>
                    <option value="2">Lingayen</option>
                    <option value="3">Sta Maria</option>
                    <option value="4">Urdaneta</option>
                  </select>
                </div>
                <div className="form-group mt-3">
                  <label>ID Number</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="form-group mt-3">
                  <label>Position</label>
                  <select defaultValue={"0"} className="form-control-select">
                    <option value="0" disabled>
                      Select
                    </option>
                    <option value="1">Teaching</option>
                    <option value="2">Non Teaching</option>
                    <option value="3">Security</option>
                  </select>
                </div>
                <div className="form-group mt-3">
                  <label>Department</label>
                  <select defaultValue={"0"} className="form-control-select">
                    <option value="0" disabled>
                      Select
                    </option>
                    <option value="1">College of Computing</option>
                    <option value="2">Education</option>
                    <option value="3">Engineering</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-inline mt-5 form-lower">
              <div className="form-group mt-3">
                <label>First Name</label>
                <input type="text" className="form-control" />
              </div>
              <div className="form-group mt-3">
                <label>Last Name</label>
                <input type="text" className="form-control" />
              </div>
              <div className="form-group mt-3">
                <label>Gender</label>
                <select className="form-control">
                  <option value="1">Male</option>
                  <option value="2">Female</option>
                </select>
              </div>
              <div className="form-group mt-3">
                <label>Vaccination Status</label>
                <select className="form-control">
                  <option value="1">First Dose</option>
                  <option value="2">Fully Vaccinated</option>
                  <option value="2">Booster Shot</option>
                </select>
              </div>
              <div className="form-group mt-3">
                <label>Phone Number</label>
                <input type="text" className="form-control" />
              </div>
              <div className="form-group mt-3">
                <label>Email</label>
                <input type="text" className="form-control" />
              </div>
              <div className="form-group mt-3">
                <label>Address</label>
                <input type="text" className="form-control" />
              </div>
            </div>
            <div className="px-3 mt-5 d-flex justify-content-end">
              <div
                onClick={() => setShowForm(false)}
                className="btn btn-primary"
              >
                Next
                <i className="fas fa-angle-double-right ms-2"></i>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <SudoAdminCredentials />
      )}
    </div>
  );
};

export default AddStaffForm;
