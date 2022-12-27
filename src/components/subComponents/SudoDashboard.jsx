import "./subCss/SudoDashboard.css";

const SudoDashboard = () => {
  return (
    <div className="sudo-dashboard">
      <div className="sudo-dashboard-title">
        <i className="fas fa-table me-3"></i>Dashboard
      </div>
      <div className="sudo-dashboard-summary py-4">
        <div className="dashboard-box">
          <div className="dashboard-box-left">
            <i className="fas fa-school"></i>
          </div>
          <div className="dashboard-box-right">
            <div className="box-title">Campus</div>
            <div className="box-number">9</div>
          </div>
        </div>
        <div className="dashboard-box">
          <div className="dashboard-box-left">
            <i className="fas fa-users-cog"></i>
          </div>
          <div className="dashboard-box-right">
            <div className="box-title">Admins</div>
            <div className="box-number">14</div>
          </div>
        </div>
        <div className="dashboard-box">
          <div className="dashboard-box-left">
            <i className="far fa-clock"></i>
          </div>
          <div className="dashboard-box-right">
            <div className="box-title">Recent</div>
            <div className="box-number">10</div>
          </div>
        </div>
      </div>
      <div className="dashboard-table p-4">
        <div className="dashboard-table-title">
          <i className="far fa-clock me-2 "></i>Recent Activities
        </div>
        <div className="dashboard-table-container p-4">
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="fw-bold" scope="col">
                  ID
                </th>
                <th className="fw-bold" scope="col">
                  Action
                </th>
                <th className="fw-bold" scope="col">
                  Data
                </th>
                <th className="fw-bold" scope="col">
                  Time Stamp
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Updated a data</td>
                <td>Campuses</td>
                <td>2022-06-18 11:59am</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Added a New Data</td>
                <td>Admins</td>
                <td>2022-06-18 11:59am</td>
              </tr>
              <tr>
                <th scope="row">1</th>
                <td>Deleted a data</td>
                <td>Campuses</td>
                <td>2022-06-18 11:59am</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SudoDashboard;
