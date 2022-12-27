import Image from "../../assets/images/r1.jpg";

const Maintenance = ({ section }) => {
  return (
    <div
      className={"d-flex justify-content-center align-items-center flex-column"}
    >
      <img style={{ height: "500px" }} src={Image} alt="prev" />
      <p style={{ fontWeight: "500", textAlign: "center" }}>
        <i
          className="fab fa-react me-2 text-primary"
          style={{ fontSize: "4rem" }}
        ></i>
        <br />
        {section} is under Maintenance
      </p>
    </div>
  );
};

export default Maintenance;
