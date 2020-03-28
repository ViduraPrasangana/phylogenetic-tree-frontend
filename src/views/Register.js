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
  Alert
} from "shards-react";

import SimpleReactValidator from "simple-react-validator";
import moment from "moment";
import { quarterTrans, fullTrans } from "../data/constants";
import Axios from "axios";
import config from "../data/config";

export default class Register extends Component {
  state = {
    email: null,
    firstName: null,
    lastName: null,
    password: null,
    confirmPassword: null,
    isErrorDate: false,
    errorDate: "You should be 18+",
    registered: null,
    message: ""
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
        country,
        gender,
        nic,
        date
      } = this.state;
      const user = {
        email,
        first_name: firstName,
        last_name: lastName,
        password,
        country,
        gender,
        NIC: nic,
        birthday: moment(date).format("YYYY-MM-DD")
      };
      this.register(user);
    }
  }

  register = user => {
    Axios.post(config.host_url + "customers", user)
      .then(res =>
        this.setState({ registered: true, message: "Registered Successfully" })
      )
      .catch(err => {
        console.log(err.response.data.error.message);
        this.setState({
          registered: false,
          message: err.response.data.error.message
        });
      });
  };
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
      registered,
      message
    } = this.state;

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
      "required"
    );
    const validPasswordConfirm = this.validator.message(
      "passwordConfirm",
      confirmPassword,
      "required"
    );
    const passEquals = password === confirmPassword;
    return (
      <Card small className="mb-4 col-7" style={quarterTrans}>
        <CardHeader className="border-bottom" style={fullTrans}>
          <h6 className="m-0">Register</h6>
        </CardHeader>
        <Col>
          <Form>
            <Row form className="form-group pt-3">
              <Col md className="pl-0">
                <FormInput
                  id="firstName"
                  placeholder="First Name"
                  onChange={e => {
                    this.setState({ firstName: e.target.value });
                  }}
                  invalid={validFirstName}
                  style={quarterTrans}
                />
              </Col>
              <Col md className="pr-0">
                <FormInput
                  id="lastName"
                  placeholder="Last Name"
                  onChange={e => {
                    this.setState({ lastName: e.target.value });
                  }}
                  invalid={validLastName}
                  style={quarterTrans}
                />
              </Col>
            </Row>
            <Row form className="form-group">
              <InputGroup>
                <InputGroupAddon type="prepend" style={quarterTrans}>
                  <InputGroupText>@</InputGroupText>
                </InputGroupAddon>
                <FormInput
                  id="email"
                  placeholder="email"
                  onChange={e => {
                    this.setState({ email: e.target.value });
                  }}
                  invalid={validEmail}
                  style={quarterTrans}
                />
              </InputGroup>
            </Row>
            <Row form className="pb-3">
              <FormInput
                id="password"
                type="password"
                placeholder="Password"
                onChange={e => {
                  this.setState({ password: e.target.value });
                }}
                invalid={validPassword}
                style={quarterTrans}
              />
            </Row>
            <Row form className="pb-3">
              <FormInput
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                onChange={e => {
                  this.setState({ confirmPassword: e.target.value });
                }}
                style={quarterTrans}
                invalid={
                  validPasswordConfirm ||
                  (confirmPassword !== null && !passEquals)
                }
              />
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
