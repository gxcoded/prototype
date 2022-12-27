import "./subCss/AccountCard.css";
import axios from "axios";
import swal from "sweetalert";
import fileDownload from "js-file-download";

const AccountCard = ({ name, img, idNumber }) => {
  const download = async () => {
    swal("Download QR-Code ?").then((value) => {
      value && downLoadFile();
    });
  };
  const downLoadFile = async () => {
    const response = await axios.get("http://localhost:5000/api/download", {
      responseType: "blob",
    });
    const data = await response.data;

    fileDownload(data, "qr-code.png");
  };

  return (
    <div className="account-card">
      <div className="account-card-upper-section">
        <img
          src={require(`../../assets/images/${img}`)}
          alt="img"
          className="account-card-img"
        />
        <div className="account-card-profile-info">
          <div className="account-card-name">{name}</div>
          <div className="account-card-id">{idNumber}</div>
        </div>
      </div>
      <div className="account-card-lower-section">
        <img
          src={require(`../../assets/images/myqr.png`)}
          alt="img"
          className="account-card-qr-img"
        />
        <div className="card-qr-download-btn">
          <div onClick={() => download()} className="btn btn-primary">
            <i className="fas fa-download me-1"></i>Download Qr Code
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
