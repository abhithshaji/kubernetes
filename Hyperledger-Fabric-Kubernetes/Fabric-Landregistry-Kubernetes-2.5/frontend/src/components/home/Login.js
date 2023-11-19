import { Button, Stack, Badge, Alert, Form } from "react-bootstrap";
import React, { useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import "./Login.css";
import { useNavigate } from "react-router-dom";
// import image from '../../assets/login.jpg'

function Login() {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  //error
  const [showUseridError, setshowUseridError] = useState(false);
  const [showPasswordError, setshowPasswordError] = useState(false);
  const [showRoleError, setshowRoleError] = useState(false);
  const [showIdpassmismatchError, setshowIdpassmismatchError] = useState(false);

  const navigate = useNavigate();

  const useridChangeHandler = (e) => {
    setUserid(e.target.value);
  };

  const passwordChangeHandler = (e) => {
    setPassword(e.target.value);
  };

  const roleChangeHandler = (e) => {
    console.log(e.target);
    setRole(e.target.value);
  };

  const submitHandler = (event) => {
    if (userid.trim().length === 0) {
      setshowUseridError(true);
    } else {
      setshowUseridError(false);
    }

    if (password.trim().length === 0) {
      setshowPasswordError(true);
    } else {
      setshowPasswordError(false);
    }

    if (role.trim().length === 0) {
      setshowRoleError(true);
      return;
    } else {
      setshowRoleError(false);
    }

    if (role === "sro" && userid === "sro1" && password === "password") {
      setshowIdpassmismatchError(false);
      setShowAlert(true);
      navigate("/sroAddLand");
    } else {
      setshowIdpassmismatchError(true);
    }

    if (
      role === "revenue" &&
      userid === "revenue1" &&
      password === "password"
    ) {
      setshowIdpassmismatchError(false);
      setShowAlert(true);
      navigate("/revenueSearchLand");
    } else {
      setshowIdpassmismatchError(true);
    }

    if (role === "bank" && userid === "bank1" && password === "password") {
      setshowIdpassmismatchError(false);
      setShowAlert(true);
      navigate("/bankSearchLand");
    } else {
      setshowIdpassmismatchError(true);
    }

    event.preventDefault();
    console.log(userid, password, role);
  };

  const alertHandler = () => {
    setShowAlert(false);
  };

  const myStyle = {
    backgroundImage: "url(/login.jpg)",
    height: "100vh",
    // marginTop: '-70px',
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div style={myStyle}>
      <p className="God">God Help Me....</p>
      <Form>
        <Stack gap={3} className="col-md-3 mx-auto stack-box">
          <h4>Blockchain Land Registry Portal</h4>
          <Form.Control
            type="userid"
            placeholder="Enter Userid"
            onChange={useridChangeHandler}
          />
          {showUseridError && <p className="errorMessage">*Userid</p>}
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={passwordChangeHandler}
          />
          {showPasswordError && <p className="errorMessage">*Password</p>}
          <Stack direction="horizontal" gap={3}>
            <Form.Label className="fw-bold">Role</Form.Label>
            <Form.Check
              name="group1"
              type="radio"
              label="SRO"
              value="sro"
              onClick={roleChangeHandler}
            />
            <Form.Check
              name="group1"
              type="radio"
              label="Revenue"
              value="revenue"
              onClick={roleChangeHandler}
            />
            <Form.Check
              name="group1"
              type="radio"
              label="Bank"
              value="bank"
              onClick={roleChangeHandler}
            />
          </Stack>
          {showRoleError && <p className="errorMessage">*Role</p>}
          <Button variant="primary" type="submit" onClick={submitHandler}>
            Submit
          </Button>
          {showIdpassmismatchError && (
            <p className="errorMessage">Userid/password mismatch</p>
          )}

          {showAlert && (
            <SweetAlert success title="Woot!" onConfirm={alertHandler}>
              I did it!
            </SweetAlert>
          )}
        </Stack>
      </Form>
    </div>
  );
}

export default Login;
