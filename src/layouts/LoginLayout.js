import React, { useState } from "react";
import { Container, Row, Col, Button, ButtonGroup } from "shards-react";
import LoginMainNavbar from "../components/layout/LoginNavBar/LoginMainNavbar";
import Register from "../views/Register";
import Login from "../views/Login";
import backgroundImage from "../assets/images/login_background_1.png";
import { bgStyle } from "../data/constants";
import { Link } from "react-router-dom";
const style = {
  width: 1000
};

const LoginLayout = ({ children }) => {
  const [state, setState] = useState("");
  if (children.type == Register && state !== "register") setState("register");
  else if (children.type == Login && state !== "login") setState("login");
  return (
    <Container fluid className="main-content-container p-0 m-0 change-scroll" style={bgStyle(backgroundImage)}>
      <LoginMainNavbar />

      <div className="error">
        <div className="error__content" style={style}>
          <Col className="col-10">
            <Row className="justify-content-center">
              <ButtonGroup className="mb-3">
                <Button
                tag={Link}
                  theme={state === "login" ? "primary" : "white"}
                  style={{ width: 100 }}
                  to="login"
                >
                  Sign in
                </Button>
                <Button
                tag={Link}
                  theme={state === "register" ? "primary" : "white"}
                  style={{ width: 100 }}
                  to="register"
                >
                  Register
                </Button>
              </ButtonGroup>
            </Row>
            <Row className="justify-content-center">{children}</Row>
          </Col>
        </div>
      </div>
    </Container>
  );
};

export default LoginLayout;
