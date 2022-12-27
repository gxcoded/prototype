import "./subCss/SudoAccount.css";
import AccountCredentials from "./AccountCredentials";

const SudoAccount = () => {
  return (
    <div className="account-container">
      <div className="account-title-text">
        <i className="me-3 fas fa-cogs"></i>Account Credentials
      </div>
      <div className="account-credential-main">
        <AccountCredentials username={"sudo"} />
      </div>
    </div>
  );
};

export default SudoAccount;
