import "./subCss/SignUpLink.css";
import { useState } from "react";
import { parse } from "papaparse";
import fileDownload from "js-file-download";
import swal from "sweetalert";
import axios from "axios";

const SignUpLink = ({ campusId, type }) => {
  const [highLighted, setHighlighted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [email, setEmail] = useState("");
  const [hide, setHide] = useState(true);
  const [emails, setEmails] = useState([]);
  const [url] = useState(process.env.REACT_APP_URL);

  const sendLinks = async () => {
    swal({
      title: "Send All?",
      text: "Link will be sent to listed Emails",
      buttons: true,
    }).then((willSend) => {
      if (willSend) {
        emails.forEach(async (e) => {
          await sendNow(e.idNumber, e.firstName, e.lastName, e.email);
        });
        setEmails([]);
        setHide(true);
        swal("Sent!", {
          icon: "success",
        });
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setEmails([]);
    setHide(false);

    Array.from(e.dataTransfer.files)
      .filter((file) => file.type === "text/csv")
      .forEach(async (file) => {
        const text = await file.text();
        const result = parse(text, { header: true });
        console.log(result);
        setEmails(result.data.filter((d) => d.email !== undefined));
      });
  };

  const sendSingle = async (e) => {
    e.preventDefault();
    const data = sendNow(idNumber, firstName, lastName, email);

    if (data) {
      swal("Email Sent!", { icon: "success" });
    }
    setIdNumber("");
    setEmail("");
    setFirstName("");
    setLastName("");
  };

  const sendNow = async (idNum, fName, lName, emailAdd) => {
    const response = await axios.post(`${url}/sendLink`, {
      campus: campusId,
      firstName: fName,
      lastName: lName,
      idNumber: idNum,
      email: emailAdd,
      type,
    });

    return await response.data;
  };
  const removeEmail = (emailAdd) => {
    swal({
      title: "Are you sure?",
      text: "Email Address will be removed!",
      icon: "warning",
      buttons: true,
    }).then((willDelete) => {
      if (willDelete) {
        setEmails(emails.filter((e) => e.email !== emailAdd));
        swal("Email Address Removed", {
          icon: "success",
        });
      }
    });
  };

  const downloadTemplate = async () => {
    swal({
      title: "Download",
      text: "Download CSV Template?",
      buttons: true,
    }).then(async (yes) => {
      if (yes) {
        const { data } = await axios.get(`${url}/get-sample-csv`, {
          responseType: "blob",
        });
        fileDownload(data, "template.csv");
      }
    });
  };
  return (
    //drag and drop
    <div
      onDragEnter={() => {
        setHighlighted(true);
      }}
      onDragLeave={() => {
        setHighlighted(false);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        console.log("Dragging");
      }}
      onDrop={(e) => {
        handleDrop(e);
        setHighlighted(false);

        // console.log(e.dataTransfer.files[0].type)
      }}
      className="sign-up-links-container "
    >
      <div className={`sign-up-links-pop-up ${hide && "hide-this"}`}>
        <div className="email-list-container shadow">
          <div className="email-list-header">
            <div className="email-list-header-title">Emails</div>
            <div className="email-list-options">
              <button
                onClick={() => setHide(true)}
                className="mx-1 btn btn-warning"
              >
                Cancel
              </button>
              <button
                onClick={() => sendLinks()}
                className="mx-1 btn btn-primary"
              >
                <i className="me-1 far fa-share-square"></i>Send All
              </button>
            </div>
          </div>
          <div className="email-list-body">
            {emails.length > 0 && (
              <table className=" table table-hover">
                <thead>
                  <tr>
                    <th className="list-label">Id Number</th>
                    <th className="list-label">First Name</th>
                    <th className="list-label" scope="col">
                      Last Name
                    </th>
                    <th className="list-label" scope="col">
                      Email Address
                    </th>
                    <th className="list-label text-center" scope="col">
                      <i className="ms-2 fas fas fa-tools"></i>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {emails.map((email) => (
                    <tr key={Math.floor(Math.random() * 100000)}>
                      <td>{email.idNumber}</td>
                      <td>{email.firstName}</td>
                      <td>{email.lastName}</td>
                      <td>{email.email}</td>
                      <td>
                        <div
                          onClick={() => {
                            removeEmail(`${email.email}`);
                          }}
                          className="table-options justify-content-center"
                        >
                          <span className="option-delete">
                            <i className="fas fa-trash-alt"></i>
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <div className="send-sign-up-links-board border">
        <div className="send-link-options">
          <div className="single-email">
            <div className="single-email-header">
              <i className="fas fa-share me-2"></i>Send Link Through Email
            </div>
            <form onSubmit={sendSingle}>
              <div className="mt-4">
                <input
                  required
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder={"Id Number"}
                  type="text"
                  className="form-control"
                />
              </div>
              <div className="mt-4">
                <input
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={"First Name"}
                  type="text"
                  className="form-control"
                />
              </div>
              <div className=" mt-4">
                <input
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={"Last Name"}
                  type="text"
                  className="form-control"
                />
              </div>
              <div className=" mt-4">
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={"Email"}
                  type="email"
                  className="form-control"
                />
              </div>
              <div className="mt-4">
                <button type="submit" className="btn btn-primary btn-block">
                  <i className="me-2 far fa-share-square"></i>Send Link
                </button>
              </div>
            </form>
          </div>
          <div className="drag-drop-form">
            <div className={`drop-box bg-light ${highLighted && "highlight"}`}>
              <div className="csv-icon">
                <i className="me-2 fas fa-file-csv"></i>
                <br />
              </div>
              Drop CSV File Here for Multiple Emails
              <button
                onClick={() => downloadTemplate()}
                className="btn btn-success mt-4"
              >
                <i className="me-1 fas fa-file-download"></i>Download CSV
                Template
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="table-email-list-container border">
        <div className="email-table-list-header">
          <div className="email-table-list-title">Pending</div>
          {emails.length > 0 && (
            <div onClick={() => sendLinks()} className="email-table-button">
              <button className="btn btn-primary">
                <i className="me-2 far fa-share-square"></i>Send All
              </button>
            </div>
          )}
        </div>
        {emails.length > 0 && (
          <table className="campus-table table table-striped">
            <thead>
              <tr>
                <th className="fw-bold">First Name</th>
                <th className="fw-bold" scope="col">
                  Last Name
                </th>
                <th className="fw-bold" scope="col">
                  Email Address
                </th>
                <th className="fw-bold text-center" scope="col">
                  <i className="ms-2 fas fas fa-tools"></i>
                </th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email) => (
                <tr key={Math.floor(Math.random() * 100000)}>
                  <td>{email.firstname}</td>
                  <td>{email.lastname}</td>
                  <td>{email.email}</td>
                  <td>
                    <div
                      onClick={() => {
                        removeEmail(`${email.email}`);
                      }}
                      className="table-options justify-content-center"
                    >
                      <span className="option-delete">
                        <i className="fas fa-trash-alt"></i>
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div> */}
    </div>
  );
};

export default SignUpLink;
