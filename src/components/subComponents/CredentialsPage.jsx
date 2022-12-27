import AccountCredentials from "./AccountCredentials";
import "./subCss/CredentialPage.css";

const CredentialsPage = ({ accountInfo }) => {
  return (
    <div className="account-credentials-container">
      <div className="account-title-text p-3">
        <i className="me-3 fas fa-cogs"></i>Account Credentials
      </div>
      <div className="account-credential-main">
        <AccountCredentials accountInfo={accountInfo} />
      </div>
    </div>
  );
};

export default CredentialsPage;
