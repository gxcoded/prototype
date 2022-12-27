import "./Pop.css";
import { useState } from "react";
import axios from "axios";
import swal from "sweetalert";

const Pop = ({ popModalToggler, accountInfo, reloadAccountInfo }) => {
  const [url] = useState(process.env.REACT_APP_URL);
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  const [file, setFile] = useState("");
  const [changed, setChanged] = useState(false);

  const previewImage = (e) => {
    const preview = document.querySelector("#updatePreview");

    const reader = new FileReader();

    reader.onload = () => {
      preview.src = reader.result;
    };
    setFile(e.target.files[0]);

    console.log(e.target.files[0]);
    reader.readAsDataURL(e.target.files[0]);
    setChanged(true);
  };

  const trigger = (e) => {
    const uploader = document.querySelector("#picUpdater");

    uploader.click();
  };

  const updateNow = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", accountInfo._id);

      try {
        const res = await axios.post(`${url}/updateProfilePic`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        swal({
          title: "Success!",
          text: "Updated",
          icon: "success",
        }).then((event) => {
          popModalToggler();
          reloadAccountInfo();
          // window.location.reload();
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="pop-container">
      <div className="update-profile-pic-form">
        <div className="update-img-preview">
          <img
            id="updatePreview"
            src={`${api}/${accountInfo.image}`}
            alt="img"
            className="me-3 "
          />
          <input
            accept="image/*"
            onChange={(e) => previewImage(e)}
            id="picUpdater"
            type="file"
            style={{ display: "none" }}
          />
        </div>
        <div className="change-pic text-center">
          <span onClick={() => trigger()}>
            <i className="fas fa-user-edit me-2"></i>Change
          </span>
        </div>
        <div className="pic-update-options">
          <button
            onClick={() => popModalToggler()}
            className="btn-sm btn-warning"
          >
            Close
          </button>
          <button
            onClick={() => updateNow()}
            className={`btn-sm btn-primary ${!changed && "d-none"}`}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pop;
