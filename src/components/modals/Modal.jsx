import "./Modal.css";
import { useState, useEffect, Fragment } from "react";

import ModalTable from "./ModalTable";
import ExcusedTable from "./ExcusedTable";

const ExcuseModal = ({
  classStudents,
  modalToggler,
  room,
  onGoing,
  currentRoomId,
  remarksToggler,
  reload,
}) => {
  const [showList, setShowList] = useState(true);

  return (
    <div className="excuse-modal-wrapper">
      <div className="excuse-modal-form position-relative">
        <div className="modal-form-header">
          <div className="header-options d-flex align-items-center">
            <div
              onClick={() => setShowList(true)}
              className={`h6 header-option ${
                showList && "header-option-active"
              } me-4 pointer`}
            >
              Students
            </div>
            <div
              onClick={() => setShowList(false)}
              className={`h6 header-option ${
                !showList && "header-option-active"
              } ms-4 pointer`}
            >
              Excused List
            </div>
          </div>
          <i onClick={() => modalToggler("")} className="fas fa-times"></i>
        </div>
        <div className="modal-form-body">
          {showList ? (
            <ModalTable
              reload={reload}
              onGoing={onGoing}
              data={classStudents}
              currentRoomId={currentRoomId}
              remarksToggler={remarksToggler}
            />
          ) : (
            <ExcusedTable reload={reload} onGoing={onGoing} />
          )}
        </div>
        <div className="modal-form-footer">
          <button onClick={() => modalToggler("")} className="btn btn-danger">
            <i className="fas fa-check me-2"></i> Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcuseModal;
