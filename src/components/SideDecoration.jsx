import { Link } from "react-router-dom";

const SideDecoration = () => {
  return (
    <div id="leftBar" className="wrapper-background-left">
      <div className="wrapper-left-content">
        <div className="left-header">
          <div className="psu-logo-section">
            <div className="psuLogo"></div>
          </div>
          <div className="psu-text">Pangasinan State University</div>
          <div className="campus-text">
            Region's Premier University of Choice
          </div>
        </div>
        <div className="sign-up-main-text">
          <i className="me-2 qr-logo fas fa-qrcode"></i>PSU Campus Contact
          Tracer
        </div>
        <div className="sub-text mt-3 p-4">
          Let's help prevent the spread of COVID-19 within our campus. Register
          now and create your unique QR Code.
        </div>
        <div className="back-btn-section">
          <p>
            <Link to="/signOptions">
              <i className="fas fa-arrow-left me-2"></i>Go Back
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SideDecoration;
