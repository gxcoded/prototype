import { QRCode } from "react-qrcode-logo";
import swal from "sweetalert";
import Image from "../assets/images/psuLogo.png";
import "./subComponents/subCss/QrCodeDisplay.css";

const QrCodeDisplay = ({ value }) => {
  const download = async () => {
    swal("Download QR-Code ?").then((value) => {
      value && saveCanvas();
    });
  };
  const saveCanvas = () => {
    const canvas = document.querySelector("#qrCodeDownload");
    let canvasUrl = canvas.toDataURL();

    const createEl = document.createElement("a");
    createEl.href = canvasUrl;
    createEl.download = "PSU-Contact-Trace-QRCode";
    createEl.click();
    createEl.remove();
  };

  return (
    <div>
      <div className="qr-code-box">
        <div onClick={download} className="qr-code-download">
          <span className="qr-code-download-btn">
            <i className="fas fa-download ms-2"></i>
          </span>
        </div>
        {/* ========hidden=========== */}
        <QRCode
          id="qrCodeDownload"
          fgColor="#113CFC"
          value={value}
          logoHeight={"200"}
          logoWidth={"200"}
          size={"1000"}
          logoImage={Image}
          eyeRadius={[
            {
              // top/left eye
              outer: [0, 0, 0, 0],
              inner: [100, 100, 100, 100],
            },
            [0, 0, 0, 0], // top/right eye
            [0, 0, 0, 0], // bottom/left
          ]}
        />
        {/* ========Shown=========== */}
        <QRCode
          id="qrCodeDisplay"
          fgColor="#113CFC"
          bgColor="transparent"
          value={value}
          logoHeight={"50"}
          logoWidth={"50"}
          size={"250"}
          logoImage={Image}
          eyeRadius={[
            {
              // top/left eye
              outer: [0, 0, 0, 0],
              inner: [100, 100, 100, 100],
            },
            [0, 0, 0, 0], // top/right eye
            [0, 0, 0, 0], // bottom/left
          ]}
        />
      </div>

      {/* <div className="text-center  mt-2">
        <div
          style={{
            cursor: "pointer",
            fontWeight: "500",
            fontSize: "1.2em",
            color: "var(--blue)",
          }}
          className=""
          onClick={download}
        >
          Download
        </div>
      </div> */}
    </div>
  );
};

export default QrCodeDisplay;
