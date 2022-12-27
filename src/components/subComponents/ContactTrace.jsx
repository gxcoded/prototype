import "./subCss/ContactTrace.css";
import swal from "sweetalert";
import { useEffect, useState } from "react";
import ReportPreview from "./ReportPreview";
import axios from "axios";

const ContactTrace = () => {
  const [id, setId] = useState("");
  const [dataList, setDataList] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [preview, setPreview] = useState(false);

  const searchList = () => {
    setSearchResult(dataList.filter((list) => list.fullName === search));
  };

  useEffect(() => {
    const sendRequest = async () => {
      const data = await fetchData("http://localhost:5000/static-data");

      setDataList(data);
    };
    sendRequest();
  }, []);

  const fetchData = async (url) => {
    const response = await axios.get(url);

    const data = response.data;
    return data;
  };

  const sendNotification = () => {
    swal({
      title: "Notify Close Contacts?",
      text: "This will send a notification message via SMS.",
    }).then((willDelete) => {
      if (willDelete) {
        swal({
          title: "Sending SMS Notification",
          text: `Sending to message close Contacts.`,
          button: false,
        });
      }
      setTimeout(() => {
        if (willDelete) {
          swal(`Notification Successfully sent!`, {
            icon: "success",
          });
        }
      }, 2000);
    });
  };

  return (
    <div className="contact-trace-container ">
      <div className="contact-trace-title">
        <i className="fas fa-bezier-curve me-3"></i>Contact Tracer
      </div>
      {preview ? (
        <ReportPreview id={id} setPreview={setPreview} />
      ) : (
        <div className="contact-trace-main  mt-3">
          <div className="contact-trace-top-controls ">
            <div className="contact-trace-search">
              <div className="input-group">
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  type="search"
                  className="form-control search-control rounded"
                  placeholder="Type Name Here"
                  aria-label="Search"
                  aria-describedby="search-addon"
                />
                <button
                  onClick={() => searchList()}
                  type="button"
                  className="btn btn-outline-primary"
                >
                  Search
                </button>
              </div>
            </div>
            {searchResult.length > 0 ? (
              searchResult.map((list) => (
                <div key={list.id} className="trace-result-container">
                  <div className="trace-result mt-4">
                    <div className="trace-result-information">
                      <div className="card-image card-l">
                        <img
                          src={require(`../../assets/images/${list.image}`)}
                          alt="pic"
                          className="card-image-preview sr-img"
                        />
                        <div className="profile-text-display sr-t-d">
                          {list.fullName}
                        </div>
                        <div className="profile-id-display p-id-d">
                          {list.idNumber}
                        </div>
                      </div>
                      <div className="profile-lower-section card-r">
                        <div className="profile-details">
                          <div className="profile-details-icon p-d-i text-success">
                            <i className="fas fa-poll"></i>
                          </div>
                          <div className="profile-details-text">
                            <div className="profile-details-title">Course</div>
                            <div className="profile-details-display">
                              {list.course}
                            </div>
                          </div>
                        </div>
                        <div className="profile-details ">
                          <div className="profile-details-icon p-d-i text-warning">
                            <i className="fas fa-phone"></i>
                          </div>
                          <div className="profile-details-text">
                            <div className="profile-details-title">Contact</div>
                            <div className="profile-details-display">
                              {list.phoneNumber}
                            </div>
                          </div>
                        </div>
                        <div className="profile-details">
                          <div className="profile-details-icon p-d-i text-primary">
                            <i className="fas fa-envelope"></i>
                          </div>
                          <div className="profile-details-text">
                            <div className="profile-details-title">Email</div>
                            <div className="profile-details-display">
                              {list.email}
                            </div>
                          </div>
                        </div>
                        <div className="profile-details">
                          <div className="profile-details-icon p-d-i text-danger">
                            <i className="fas fa-map-marked-alt"></i>
                          </div>
                          <div className="profile-details-text">
                            <div className="profile-details-title">Address</div>
                            <div className="profile-details-display">
                              {list.address}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="trace-result-controls">
                      <div className="trace-result-counter">
                        <div className="result-count">
                          {Math.floor(Math.random() * 100)}
                        </div>
                        <div className="result-text">
                          <i className="me-2 fas fa-users"></i>Close Contacts
                        </div>
                      </div>
                      <hr />
                      <div className="trace-result-buttons">
                        <div
                          onClick={() => sendNotification()}
                          className="btn btn-block btn-warning"
                        >
                          <i className="me-2 fas fa-bell"></i>Notify Close
                          Contacts
                        </div>
                        <div
                          onClick={() => {
                            setId(list.idNumber);
                            setPreview(true);
                          }}
                          className="btn btn-block btn-primary"
                        >
                          <i className="far fa-file-pdf me-2"></i>Generate
                          Report
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted empty">
                <i className="me-2 fas fa-poll-h"></i> Search Result will Appear
                Here ...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactTrace;
