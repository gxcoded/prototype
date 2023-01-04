import { useState, useEffect } from "react";
import swal from "sweetalert";
import Swal from "sweetalert2";

import axios from "axios";

const ContactList = ({ data, api, message, proofId }) => {
  const [url] = useState(process.env.REACT_APP_URL);

  const notifyContacts = () => {
    Swal.fire({
      title: "Notify Close Contacts?",
      text: `This will also mark this case as Traced.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        swal("Done", {
          icon: "success",
        });
        notificationSent(data);
        traceUpdated(true);
      }
    });
    // if (Object.keys(notified).length > 0) {
    //   console.log(notified.dateNotified);
    //   if (notified.dateNotified !== null) {
    //     swal({
    //       title: "Notify Status",
    //       text:
    //         `Contacts are Already Notified On ` +
    //         dateFormatter(notified.dateNotified),
    //     });
    //   } else {
    //     if (uniqueContacts.length > 0) {
    //       // console.log(uniqueContacts);
    //       swal({
    //         title: "Notify Close Contacts?",
    //         text: `This will also mark this case as Traced.`,
    //         // uniqueContacts.length,
    //         buttons: true,
    //       }).then((willNotify) => {
    //         if (willNotify) {
    //           if (notificationSent(allContacts)) {
    //             traceUpdated(true);
    //             swal("Done", {
    //               icon: "success",
    //             });
    //             contactTraced();
    //             isNotified();
    //             loadNotified();
    //           }
    //         }
    //       });
    //     } else {
    //       swal({
    //         text: `No close Contacts Found`,
    //       });
    //     }
    //   }
    // }
  };
  const notificationSent = async (contacts) => {
    return await sendNotification(contacts);
  };

  const sendNotification = async (contacts) => {
    const { data } = await axios.post(`${url}/sendNotification`, {
      contacts,
      message,
      reportId: proofId,
    });

    return data;
  };
  const traceUpdated = async (status) => {
    const updated = await traceUpdateRequest(status);
    console.log(updated);
    return updated;
  };

  const traceUpdateRequest = async (status) => {
    const { data } = await axios.post(`${url}/caseUpdater`, {
      id: proofId,
      status: status,
    });

    return data;
  };
  return (
    <div>
      <div
        className="modal fade"
        id="listModal"
        role="dialog"
        aria-labelledby="listModalTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Notify</h5>
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
                Cancel
              </button>
              {data.length > 0 && (
                <button
                  onClick={() => notifyContacts()}
                  data-dismiss="modal"
                  type="button"
                  className="btn-sm btn-primary"
                >
                  Notify
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactList;
