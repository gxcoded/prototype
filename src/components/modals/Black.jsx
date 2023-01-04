import MapViewContainer from "../contactTrace/MapViewContainer";

const Black = ({ uniqueRooms, defaultCenter, infoSetter }) => {
  return (
    <div>
      <div
        className="modal fade"
        id="exampleModal"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <MapViewContainer
            defaultCenter={defaultCenter}
            uniqueRooms={uniqueRooms}
            infoSetter={infoSetter}
          />
          {/* <div className="modal-content">
            <div className="modal-body">...</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Black;
