import React, { Component } from "react";
import {
  Col,
  Form,
  FormInput,
  Card,
  CardHeader,
  Row,
  Button,
  InputGroupText,
  InputGroupAddon,
  InputGroup,
  FormSelect,
  DatePicker,
  Alert,
  FormFeedback,
} from "shards-react";

import SimpleReactValidator from "simple-react-validator";
import moment from "moment";
import { quarterTrans, fullTrans } from "../data/constants";
import Axios from "axios";
import config from "../data/config";
import { UserActions } from "../actions/user.actions";
import { connect } from "react-redux";

class Register extends Component {
  state = {
    username: null,
    email: null,
    firstName: null,
    lastName: null,
    password: null,
    confirmPassword: null,
    registered: null,
    message: "",
  };
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator();
  }
  submit() {
    if (this.validate()) {
      const {
        email,
        firstName,
        lastName,
        password,
        username,
        confirmPassword,
      } = this.state;
      const user = {
        username,
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        confirm_password: confirmPassword,
      };
      this.props.register(user);
    }
  }

  validate() {
    if (this.validator.allValid()) {
      return true;
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
    return false;
  }

  render() {
    const {
      lastName,
      confirmPassword,
      email,
      firstName,
      password,
      username,
      registered,
      message,
    } = this.state;
    if (this.props.user.user) this.props.history.push("/");
    const validUsername = this.validator.message(
      "firstName",
      username,
      "required|alpha"
    );
    const validFirstName = this.validator.message(
      "firstName",
      firstName,
      "required|alpha"
    );
    const validLastName = this.validator.message(
      "lastName",
      lastName,
      "required|alpha"
    );
    const validEmail = this.validator.message("email", email, "required|email");
    const validPassword = this.validator.message(
      "password",
      password,
      "required|min:6"
    );

    const passEquals = password === confirmPassword;
    const { user } = this.props;
    const fieldError = user.registerError?.response?.data;
    return (
      <Card small className="mb-4 col-7" style={quarterTrans}>
        <CardHeader className="border-bottom" style={fullTrans}>
          <h6 className="m-0">Register</h6>
        </CardHeader>
        <Col>
          <Form>
            <Row form className="form-group pt-3">
              <Col md className="px-0">
                <FormInput
                  id="username"
                  placeholder="username"
                  onChange={(e) => {
                    this.setState({ username: e.target.value });
                  }}
                  invalid={validUsername || fieldError?.username}
                  style={{...quarterTrans,fontWeight:500}}
                />
                <FormFeedback invalid>
                  {validUsername?.props?.children}
                  {fieldError?.username ? fieldError.username[0] : null}
                </FormFeedback>
              </Col>
            </Row>
            <Row form className="form-group">
              <Col md className="pl-0">
                <FormInput
                  id="firstName"
                  placeholder="First Name"
                  onChange={(e) => {
                    this.setState({ firstName: e.target.value });
                  }}
                  invalid={validFirstName || fieldError?.first_name}
                  style={{...quarterTrans,fontWeight:500}}
                />
                <FormFeedback invalid>
                  {validFirstName?.props?.children}
                  {fieldError?.first_name ? fieldError.first_name[0] : null}
                </FormFeedback>
              </Col>
              <Col md className="pr-0">
                <FormInput
                  id="lastName"
                  placeholder="Last Name"
                  onChange={(e) => {
                    this.setState({ lastName: e.target.value });
                  }}
                  invalid={validLastName || fieldError?.last_name}
                  style={{...quarterTrans,fontWeight:500}}
                />
                <FormFeedback invalid>
                  {validLastName?.props?.children}
                  {fieldError?.last_name ? fieldError.last_name[0] : null}
                </FormFeedback>
              </Col>
            </Row>
            <Row form className="form-group">
              <InputGroup>
                <InputGroupAddon type="prepend" style={{...quarterTrans,fontWeight:500}}>
                  <InputGroupText style={{...quarterTrans,fontWeight:500}}>@</InputGroupText>
                </InputGroupAddon>
                <FormInput
                  id="email"
                  placeholder="email"
                  onChange={(e) => {
                    this.setState({ email: e.target.value });
                  }}
                  invalid={validEmail || fieldError?.email}
                  style={{...quarterTrans,fontWeight:500}}
                />
                <FormFeedback invalid>
                  {validEmail?.props?.children}
                  {fieldError?.email ? fieldError.email[0] : null}
                </FormFeedback>
              </InputGroup>
            </Row>
            <Row form className="pb-3">
              <FormInput
                id="password"
                type="password"
                placeholder="Password"
                onChange={(e) => {
                  this.setState({ password: e.target.value });
                }}
                invalid={validPassword || fieldError?.password}
                style={{...quarterTrans,fontWeight:500}}
              />
              <FormFeedback invalid>
                {validPassword?.props?.children}
                {fieldError?.password ? fieldError.password[0] : null}
              </FormFeedback>
            </Row>
            <Row form className="pb-3">
              <FormInput
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => {
                  this.setState({ confirmPassword: e.target.value });
                }}
                style={{...quarterTrans,fontWeight:500}}
                invalid={confirmPassword !== null && !passEquals}
              />
              <FormFeedback invalid>
                {confirmPassword !== null &&
                  !passEquals &&
                  "Passwords does not match"}
              </FormFeedback>
            </Row>

            <Row form className="pt-2 pb-0">
              <Alert
                dismissible={true}
                style={{ width: "100%" }}
                open={registered !== null}
                theme={registered === false ? "danger" : "success"}
              >
                {message}
              </Alert>
            </Row>
            <Row form className="justify-content-end pt-3">
              <Button
                theme="primary"
                className="mb-3"
                onClick={() => {
                  this.submit();
                }}
                id="register_btn"
              >
                Register
              </Button>
            </Row>
          </Form>
        </Col>
      </Card>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.userReducer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    register: (user) => {
      dispatch(UserActions.register(user));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
