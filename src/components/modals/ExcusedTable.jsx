import React from "react";
import { Fragment, useEffect, useState } from "react";
import swal from "sweetalert";
import axios from "axios";

const ExcusedTable = ({ onGoing, reload }) => {
  const [sortedList, setSortedList] = useState([]);
  const [excuseList, setExcuseList] = useState([]);
  const [url] = useState(process.env.REACT_APP_URL);
  const [api] = useState(process.env.REACT_APP_API_SERVER);

  useEffect(() => {
    loadExcuseList();
    loadData();
  }, [reload]);

  const loadExcuseList = async () => {
    const list = await fetchExcuseList();
    setExcuseList(list);
  };
  const fetchExcuseList = async () => {
    const { data } = await axios.post(`${url}/getExcusedStudents`, {
      meeting: onGoing,
    });

    console.log(data);
    return data;
  };

  const compare = (current, next) => {
    if (current.student.lastName < next.student.lastName) {
      return -1;
    }
    if (current.student.lastName > next.student.lastName) {
      return 1;
    }
    return 0;
  };

  const loadData = async () => {
    setSortedList(excuseList.sort(compare));
  };

  const removeMe = (id) => {
    swal({
      title: "Are you sure?",
      text: "Remove From Excused List?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        if (isRemoved(id)) {
          swal("Removed", {
            icon: "success",
          });
          loadExcuseList();
        }
      }
    });
  };

  const isRemoved = async (id) => {
    const removed = await removeExcuse(id);

    return removed;
  };
  const removeExcuse = async (id) => {
    const { data } = await axios.post(`${url}/removeExcuse`, {
      id,
    });
    return data;
  };

  return (
    <div className="position-relative">
      <table className="campus-table table table-striped mt-4">
        <tbody>
          {excuseList.length > 0 ? (
            excuseList.map((list) => (
              <Fragment key={list._id}>
                <tr>
                  <td>
                    <img
                      src={`${api}/${list.student.image}`}
                      // src={require(`../../../../../server/uploads/${list.image}`)}
                      alt={list._id}
                      className="table-image"
                    />
                  </td>
                  <td>
                    {list.student.lastName}, {list.student.firstName}
                  </td>

                  <td>{list.student.idNumber}</td>
                  <td>{list.remarks}</td>

                  <td>
                    <div className="table-options">
                      <span
                        onClick={() => {
                          removeMe(list._id);
                        }}
                        className="fw-normal pointer"
                      >
                        Remove
                      </span>
                    </div>
                  </td>
                </tr>
              </Fragment>
            ))
          ) : (
            <tr>
              <td className="fw-bold fst-italic">No Students Yet..</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExcusedTable;
