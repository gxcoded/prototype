const Table = ({ data, showInteractions, api, showMsgProof }) => {
  return (
    <table className="campus-table table table-striped">
      <thead>
        <tr>
          <th className="fw-bold" scope="col">
            Img
          </th>
          <th className="fw-bold" scope="col">
            Full Name
          </th>
          <th className="fw-bold" scope="col">
            Role
          </th>
          <th className="fw-bold" scope="col">
            ID Number
          </th>
          <th className="fw-bold" scope="col">
            Contact Number
          </th>
          <th className="fw-bold" scope="col">
            Address
          </th>
          <th className="fw-bold text-center" scope="col">
            <i className="ms-2 fas fas fa-tools"></i>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((list) => (
          <tr key={list._id}>
            <td>
              <img
                src={`${api}/${list.image}`}
                // src={require(`../../../../server/uploads/${list.image}`)}
                alt={list._id}
                className="table-image"
              />
            </td>
            <td>
              {list.lastName}, {list.firstName}
            </td>
            <td>{list.role.description}</td>
            <td>{list.username}</td>
            <td>{list.phoneNumber}</td>
            <td>{list.address}</td>
            <td className="text-center">
              <button
                onClick={() => showInteractions(list)}
                className="btn btn-primary"
              >
                Trace Contacts
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
