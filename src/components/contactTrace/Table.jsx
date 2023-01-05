const Table = ({
  data,
  showInteractions,
  api,
  showMsgProof,
  manualInfoSetter,
}) => {
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
            Create Report
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
                data-toggle="modal"
                data-target="#manualPositive"
                onClick={() => manualInfoSetter(list)}
                className="btn-sm btn-custom-red"
              >
                Positive
              </button>
              <button
                // onClick={() => showInteractions(list)}
                data-toggle="modal"
                data-target="#manualNegative"
                onClick={() => manualInfoSetter(list)}
                className="btn-sm btn-success"
              >
                Negative
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
