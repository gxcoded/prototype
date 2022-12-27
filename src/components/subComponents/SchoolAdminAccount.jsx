import "./subCss/SchoolAdminAccount.css";
import AccountCard from "./AccountCard";
import AccountCredentials from "./AccountCredentials";

const SchoolAdminAccount = () => {
  return (
    <div className="school-admin-account-container">
      <div className="school-admin-account-title">
        <i className="me-2 fas fa-cogs"></i>Manage My Account
      </div>
      <div className="school-admin-account-main">
        <div className="personal-profile">
          <div className="personal-profile-main ">
            <div className="personal-profile-main-left">
              <div className="personal-profile-title">
                <i className="fas fa-user-circle me-2"></i>My Profile
              </div>
              <AccountCard
                name={"Shaira Cruz"}
                idNumber={"12-UR-8372"}
                img={"img.jpg"}
              />
            </div>
            <div className="personal-profile-main-right ">
              <div className="personal-profile-title">
                <i className="fas fa-user-cog me-2"></i>Account Credentials
              </div>
              <AccountCredentials username={"12-UR-8372"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminAccount;
