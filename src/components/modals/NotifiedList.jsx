import React from "react";

const NotifiedList = ({ data, api, message, proofId, notified }) => {
  const dateFormatter = (timeString) => {
    const date = new Date(Number(timeString)).toString().slice(4, 15);
    const time = new Date(Number(timeString)).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${date}`;
  };

  return (
    <div>
      <div
        className="modal fade"
        id="notifiedModal"
        role="dialog"
        aria-labelledby="listModalTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Notified Contacts</h5>
            </div>
            <div className="modal-body">
              {data.length > 0 ? (
                <table className="table">
                  <tbody>
                    {data.map((d) => (
                      <tr key={d._id}>
                        <td>
                          <img
                            src={`${api}/${d.image}`}
                            // src={require(`../../../../server/uploads/${list.image}`)}
                            alt={d._id}
                            className="table-image"
                          />
                        </td>
                        <td>{`${d.firstName} ${d.lastName}`}</td>
                        <td>
                          <i className="fas fa-check me-2 text-success"></i>
                          {dateFormatter(notified.dateNotified)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div>No Close Contacts found!</div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-sm btn-custom-red"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotifiedList;
