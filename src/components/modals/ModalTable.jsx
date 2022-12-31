import React from "react";
import { Fragment, useEffect, useState } from "react";
import swal from "sweetalert";
import Swal from "sweetalert2";
import axios from "axios";

const ModalTable = ({
  classStudents,
  onGoing,
  remarksToggler,
  reload,
  currentRoomId,
  currentLogs,
}) => {
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [sortedList, setSortedList] = useState([]);
  const [excuseList, setExcuseList] = useState([]);
  const [url] = useState(process.env.REACT_APP_URL);
  const [api] = useState(process.env.REACT_APP_API_SERVER);

  useEffect(() => {
    console.log("reloaded");
    console.log(classStudents);
    loadData();
    loadExcuseList();
  }, [reload]);

  const loadExcuseList = async () => {
    const list = await fetchExcuseList();
    setExcuseList(list);
  };
  const fetchExcuseList = async () => {
    const { data } = await axios.post(`${url}/getMeetingExcused`, {
      meeting: onGoing,
    });

    console.log(data);
    return data;
  };

  const filterList = () => {
    let array = [];

    classStudents.forEach((cs) => {
      let logged = false;
      currentLogs.forEach((cl) => {
        cl.accountScanned._id === cs.student._id && (logged = true);
      });
      if (!logged) {
        console.log("logged");
        array.push(cs);
        setSortedList(array.sort(compare));
      }
    });
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
    filterList();
  };

  const isExcused = (id) => {
    let exist = false;

    if (excuseList.length > 0) {
      excuseList.forEach((list) => {
        list.student._id === id && (exist = true);
      });
    }

    return exist;
  };

  return (
    <div className="position-relative">
      <table className="campus-table table table-striped mt-4">
        <tbody>
          {sortedList.length > 0 ? (
            sortedList.map(
              (list) =>
                !isExcused(list.student._id) && (
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

                      <td>
                        <div className="table-options">
                          <span
                            onClick={() =>
                              remarksToggler(list.student._id, onGoing)
                            }
                            className="fw-normal pointer"
                          >
                            Set as Excused
                          </span>
                        </div>
                      </td>
                    </tr>
                  </Fragment>
                )
            )
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

export default ModalTable;
