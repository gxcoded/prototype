import "./subCss/SudoCampuses.css";
import { useState } from "react";
import swal from "sweetalert";

const SudoCampuses = ({ campusList }) => {
  const [add, setAdd] = useState(false);
  const [campus, setCampus] = useState(campusList);
  const [campusName, setCampusName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");

  const toggleAdd = () => {
    setAdd(!add);
  };

  const deleteCampus = (id) => {
    swal({
      title: "Are you sure?",
      text: "You can not undo this.",

      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setCampus(campus.filter((list) => list.id !== id));
        swal("Deleted!", {
          icon: "success",
        });
      }
    });
  };
  const addCampus = () => {
    const id = Math.floor(Math.random() * 999);
    const newCampus = {
      id: id,
      text: campusName,
      address: address,
      contact: contact,
    };
    setCampus([...campus, newCampus]);
    swal("Added!", {
      icon: "success",
    });
    fieldReset();
  };

  const fieldReset = () => {
    setCampusName("");
    setAddress("");
    setContact("");
  };

  return (
    <div className="campuses-container">
      <div className="campuses-title">
        <div className="campuses-title-text">
          <i className="fas fa-school me-3"></i>
          Manage Campuses
        </div>
        <div className="campuses-add-button">
          {!add ? (
            <div onClick={toggleAdd} className="btn btn-primary campus-add-btn">
              Add<i className="ms-1 fas fa-plus"></i>
            </div>
          ) : (
            <div onClick={toggleAdd} className="btn btn-danger campus-add-btn">
              Hide<i className="ms-1 fas fa-times-circle"></i>
            </div>
          )}
        </div>
      </div>
      {add && (
        <div className="campuses-add-form">
          <div className="campuses-add-form-left">
            <div className="campuses-add-form-left-top">
              <div className="date">
                <i className="fas fa-calendar-alt me-2"></i>
                {Date().toString().slice(0, 16)}
              </div>
            </div>
            <div className="campuses-add-form-left-bottom">
              <div className="campus-count">{campus.length}</div>
              <div className="campus-count-label">Campuses Listed</div>
            </div>
          </div>
          <div className="campuses-add-form-right">
            <div className="campus-add-form-title">
              Add New Campus<i className="ms-2 fas fa-plus"></i>
            </div>
            <div className="add-form-fields">
              <div className="form-group mt-3">
                <label>
                  Campus Name <i className="ms-2 fas fa-file-signature"></i>
                </label>
                <input
                  value={campusName}
                  onChange={(e) => setCampusName(e.target.value)}
                  type="text"
                  className="form-control form-field"
                />
              </div>
              <div className="form-group mt-3">
                <label>
                  Contact Number<i className="ms-2 fas fa-phone"></i>
                </label>
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  type="text"
                  className="form-control form-field"
                />
              </div>
              <div className="form-group mt-3">
                <label>
                  Address<i className="ms-2 fas fa-map-marked-alt"></i>
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  type="text"
                  className="form-control form-field"
                />
              </div>
            </div>
            <div className="px-3 mt-3 d-flex justify-content-end">
              <div onClick={addCampus} className="float-end btn btn-primary">
                Save<i className="ms-2 fas fa-save"></i>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="campuses-table-container">
        <div className="table-title pb-5 fw-bold">
          <i className="fas fa-clipboard-list me-2"></i>Campus List
        </div>
        <table className="campus-table table table-striped">
          <thead>
            <tr>
              <th className="fw-bold" scope="col">
                <i className="ms-2 fas fa-hashtag"></i>
              </th>
              <th className="fw-bold" scope="col">
                Campus
              </th>
              <th className="fw-bold" scope="col">
                Location
              </th>
              <th className="fw-bold" scope="col">
                Contact
              </th>
              <th className="fw-bold text-center" scope="col">
                <i className="ms-2 fas fas fa-tools"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            {campus.length > 0 ? (
              campus.map((list) => (
                <tr key={list.id}>
                  <th scope="row">{list.id}</th>
                  <td>{list.text}</td>
                  <td>{list.address}</td>
                  <td>{list.contact}</td>
                  <td>
                    <div className="table-options">
                      <span className="me-3 option-edit">
                        <i className="fas fa-edit"></i>
                      </span>
                      <span
                        onClick={() => deleteCampus(list.id)}
                        className="option-delete"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="no-result fst-italic p-5 fw-bold text-muted">
                <td>No Data Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default SudoCampuses;
