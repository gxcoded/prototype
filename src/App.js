import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Options from "./components/Options";
import Verification from "./components/Verification";
import CreatePassword from "./components/CreatePassword";
import SuperAdmin from "./components/SuperAdmin";
import SchoolAdmin from "./components/SchoolAdmin";
import Student from "./components/Student";
import Teaching from "./components/Teaching";
import Printable from "./components/subComponents/Printable";
import Guest from "./components/Guest";
import Guard from "./components/Guard";
import PasswordReset from "./components/PasswordReset";
import StaffSignUpPage from "./components/StaffSignUpPage";
import PasswordResetLink from "./components/PasswordResetLink";
import NonTeaching from "./components/NonTeaching";
import Nurse from "./components/Nurse";
import AttendanceReport from "./components/subComponents/reports/AttendanceReport";
import ContactTracingReport from "./components/subComponents/reports/ContactTracingReport";
import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [campus, setCampus] = useState([]);
  const [genderList, setGenderList] = useState([]);
  const [vaxStatsList, setVaxStatsList] = useState([]);
  const [role, setRole] = useState([]);
  const [url] = useState(process.env.REACT_APP_URL);

  useEffect(() => {
    const serveList = async () => {
      const fetchedCampuses = await fetchList(`${url}/campusList`);
      const fetchedVaxStatus = await fetchList(`${url}/getVaxStatus`);
      const fetchedGender = await fetchList(`${url}/getGender`);
      const fetchedRole = await fetchList(`${url}/getRole`);

      setCampus(fetchedCampuses);
      setVaxStatsList(fetchedVaxStatus);
      setGenderList(fetchedGender);
      setRole(fetchedRole);
    };
    serveList();
  }, []);

  const fetchList = async (url) => {
    const response = await axios.get(url);
    const data = await response.data;

    return data;
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resetPassword" element={<PasswordReset />} />
        <Route
          path="/signUp"
          element={
            <SignUp
              userType={3}
              campus={campus}
              genderList={genderList}
              vaxStatsList={vaxStatsList}
            />
          }
        />
        <Route path="/signOptions" element={<Options />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/create-password" element={<CreatePassword />} />
        <Route path="/sudo" element={<SuperAdmin />} />
        <Route path="/school-admin" element={<SchoolAdmin />} />
        <Route
          path="/student-account"
          element={
            <Student genderList={genderList} vaxStatsList={vaxStatsList} />
          }
        />
        <Route
          path="/guest-account"
          element={
            <Guest genderList={genderList} vaxStatsList={vaxStatsList} />
          }
        />
        <Route path="/teaching-account" element={<Teaching />} />
        <Route path="/school-nurse" element={<Nurse />} />
        <Route path="/non-teaching-account" element={<NonTeaching />} />
        <Route path="/print" element={<Printable />} />
        <Route path="/security" element={<Guard />} />
        <Route path="/password-reset-link" element={<PasswordResetLink />} />
        <Route
          path="/staff-sign-up"
          element={
            <StaffSignUpPage
              genderList={genderList}
              vaxStatsList={vaxStatsList}
              role={role}
            />
          }
        />
        <Route
          path="/student-sign-up"
          element={
            <SignUp
              userType={2}
              campus={campus}
              genderList={genderList}
              vaxStatsList={vaxStatsList}
            />
          }
        />
        <Route path="/attendance-report" element={<AttendanceReport />} />
        <Route
          path="/contact-tracing-report"
          element={<ContactTracingReport />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
