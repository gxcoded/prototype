import "./subCss/StaffSubjects.css";
import { useState, useEffect } from "react";
import axios from "axios";

const StaffSubjects = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [yearList, setYearList] = useState([]);
  const [selectionList, setSelectionList] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const getList = async () => {
      const dataList = await fetchDataList(
        "http://localhost:5000/records/yearList"
      );
      setYearList(dataList);
    };

    getList();
  }, []);

  const fetchDataList = async (url) => {
    const response = await axios.get(url);
    const data = await response.data;

    return data;
  };

  const updateSelections = (id) => {
    setSelectionList(yearList.filter((list) => list.yearId.toString() === id));
  };

  const randomKey = () => Math.floor(Math.random() * 15524251);

  return (
    <div className="staff-subject-container">
      <div className="subject-header">
        <div className="staff-subject-title">
          <i className="fas fa-cubes me-3"></i>Manage Subjects
        </div>
        {!showAddForm ? (
          <div
            onClick={() => {
              setShowAddForm(!showAddForm);
            }}
            className="btn-sm btn-primary"
          >
            Add Subject <i className="ms-1 fas fa-plus-circle"></i>
          </div>
        ) : (
          <div
            onClick={() => {
              setShowAddForm(!showAddForm);
            }}
            className="btn-sm btn-warning"
          >
            Collapse<i className="ms-1 fas fa-angle-up"></i>
          </div>
        )}
      </div>
      {showAddForm && (
        <div className="staff-subject-form">
          <div className="staff-form-fields">
            {/* <div className="form-field-title">New Subject</div> */}
            <form className="">
              <div className="subject-form">
                <div className="form-group mt-1">
                  <label>Academic Year</label>
                  <select defaultValue={""} className="form-control">
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="1">2022-2023</option>
                    <option value="2">2023-2024</option>
                  </select>
                </div>
                <div className="form-group mt-1">
                  <label>Semester</label>
                  <select defaultValue={""} className="form-control">
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="1">1st Semester</option>
                    <option value="2">2nd Semester</option>
                    <option value="3">Mid Year</option>
                  </select>
                </div>
              </div>
              <div className="subject-form mt-2">
                <div className="form-group mt-1">
                  <label>Description</label>
                  <input type="text" className="form-control sub-field" />
                </div>
                <div className="form-group mt-1">
                  <label>Course Code</label>
                  <input type="text" className="form-control sub-field" />
                </div>

                {/* <div className="form-group mt-1">
                                    <label>Course</label>
                                    <select  defaultValue={''} className='form-control'>
                                        <option value="" disabled>Select</option>
                                        <option value="1">BS Information Technology</option>
                                        <option value="2">BS Math</option>
                                    </select>
                            </div> */}
              </div>
              <div className="subject-form">
                <div className="form-group mt-3">
                  <label>Year Level</label>
                  <select
                    onChange={(e) => {
                      updateSelections(e.target.value);
                    }}
                    defaultValue={"0"}
                    className="form-control"
                  >
                    <option value="0" disabled>
                      Select
                    </option>
                    <option value="1">First Year</option>
                    <option value="2">Second Year</option>
                    <option value="3">Third Year</option>
                    <option value="4">Fourth Year</option>
                    <option value="4">Fifth Year</option>
                  </select>
                </div>
                {/* <div className="form-group mt-3">
                                    <label>Sections</label>
                                    <select onChange={(e)=>{setSelected(e.target.value)}}  defaultValue={selected} className='form-control'>
                                        <option value={selected} disabled>Select</option>
                                        {
                                            selectionList.length > 0 &&
                                            selectionList.map(list=>(
                                                <option key={randomKey()} value={list.sectionId}>{list.text}</option>
                                            ))
                                        }
                                    </select>
                            </div> */}
              </div>
              <div className=" mt-3 saveBtn text-end form-group">
                <div className="btn btn-success">
                  <i className="fas fa-save me-2"></i>Save
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="staff-subject-table">
        <table className="table subjects-table">
          <thead>
            <tr>
              <th scope="col">Course Code</th>
              <th scope="col">Description</th>
              <th scope="col">Course</th>
              <th scope="col">Options</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>CC 101</td>
              <td>Fundamentals of Programming</td>
              <td>First Year</td>
              <td>
                <div className="table-options">
                  <span className="controls option-view text-warning">
                    <i className="fas fa-pen"></i>
                  </span>
                  <span className="controls option-delete">
                    <i className="fas fa-trash-alt"></i>
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffSubjects;
