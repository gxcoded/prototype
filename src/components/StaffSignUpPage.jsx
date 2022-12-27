import { useSearchParams } from "react-router-dom";
import StaffSignUpForm from "./StaffSignUpForm";
import BounceLoader from "react-spinners/BounceLoader";
import { Fragment, useEffect, useState } from "react";
import "../assets/css/StaffSignUpPage.css";
import axios from "axios";
import swal from "sweetalert";

const StaffSignUpPage = ({ role, genderList, vaxStatsList }) => {
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(true);
  const [info, setInfo] = useState({});
  const [url] = useState(process.env.REACT_APP_URL);

  const [params] = useSearchParams();

  useEffect(() => {
    (params.get("campus") === null || params.get("hash") === null) &&
      setValid(false);
    const check = async () => {
      const data = await checkValidity();
      Object.keys(data).length < 1 && setValid(false);
      setInfo(data);
      console.log(data);
    };

    check();
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const checkValidity = async () => {
    const campus = params.get("campus");
    const hash = params.get("hash");

    const response = await axios.post(`${url}/getLink`, {
      campus,
      hash,
    });

    return await response.data;
  };

  return (
    <div className="staff-sign-up-page-container">
      {loading ? (
        <div className="spinner">
          <BounceLoader color="#5dcea1" loading={loading} size={150} />
        </div>
      ) : (
        <Fragment>
          {valid ? (
            <StaffSignUpForm
              info={info}
              role={role}
              genderList={genderList}
              vaxStatsList={vaxStatsList}
            />
          ) : (
            <div className="h4">Your Link is Invalid or no Longer Valid...</div>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default StaffSignUpPage;
