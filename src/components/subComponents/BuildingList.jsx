import "./subCss/StaffList.css";
import { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";

const BuildingList = ({ campus }) => {
  const [building, setBuilding] = useState([]);
  const [description, setDescription] = useState("");
  const [filterList, setFilterList] = useState([]);
  const [url] = useState(process.env.REACT_APP_URL);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await fetchList();
    setBuilding(data);
    setFilterList(data);
    setDescription("");
  };

  const fetchList = async () => {
    const response = await axios.post(`${url}/buildingList`, {
      campus,
    });
    return await response.data;
  };

  const deleteBuilding = (id) => {
    swal({
      title: "Are you sure?",
      text: "You can not undo this.",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setBuilding(building.filter((list) => list.id !== id));
        swal("Deleted!", {
          icon: "success",
        });
      }
    });
  };

  const addBuilding = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${url}/addBuilding`, {
        campus,
        description,
      });
      const data = await response.data;
      swal("Added!", {
        icon: "success",
      });
      loadData();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="staff-list-container">
      <div className="staff-list-title">
        <i className="fas fa-city me-3"></i>Manage Buildings
      </div>
      <div className="campus-staff-main">
        <div className="list-top-controls">
          <div className="list-counter-box">
            <div className="list-counter">{building.length}</div>
            <div className="list-counter-label">Total Buildings</div>
          </div>
          <div className="list-filter-controls">
            <div className="controls-title">
              <i className="me-2 fas fa-plus"></i>Add Building
            </div>
            <form onSubmit={addBuilding}>
              <div className="form-inputs">
                <div className="form-group">
                  <label>Building Name</label>
                  <input
                    minLength={"5"}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="px-2 mt-4 text-end">
                <button type="submit" className="btn btn-primary">
                  <i className="me-2 fas fa-save"></i>Save
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="table-list staff-table py-5">
          <div className="table-header px-2 mb-5 d-flex justify-content-between align-items-center">
            <div className="table-header-text fw-bold">Buildings</div>
            <div>
              <div className="input-group">
                <input
                  placeholder="Description"
                  type="search"
                  className="form-control search-control rounded"
                  aria-label="Search"
                  aria-describedby="search-addon"
                />
                <button type="button" className="btn btn-outline-primary">
                  Search
                </button>
              </div>
            </div>
          </div>
          <table className="campus-table table table-striped">
            <thead>
              <tr>
                <th className="fw-bold" scope="col">
                  Description
                </th>
                <th className="fw-bold text-center" scope="col">
                  <i className="ms-2 fas fas fa-tools"></i>
                </th>
              </tr>
            </thead>
            <tbody>
              {filterList.length > 0 ? (
                filterList.map((list) => (
                  <tr key={list._id}>
                    <td>{list.description}</td>
                    <td>
                      <div className="table-options justify-content-center">
                        <span className="option-edit me-3">
                          <i className="fas fa-edit"></i>
                        </span>
                        <span className="option-delete">
                          <i className="fas fa-trash-alt"></i>
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="fw-bold fst-italic">No Records found...</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="show-count p-4">
            Showing{" "}
            <span className="text-primary fw-bold">{filterList.length}</span>{" "}
            out of{" "}
            <span className="text-primary fw-bold">{filterList.length}</span>{" "}
            Records
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingList;
