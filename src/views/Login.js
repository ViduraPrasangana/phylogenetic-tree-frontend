import React, { Component } from "react";
import {
  Col,
  Form,
  FormInput,
  Card,
  CardHeader,
  Row,
  Button,
  FormFeedback,
  FormGroup,
  Alert,
} from "shards-react";
import { halfTrans, fullTrans, quarterTrans } from "../data/constants";
import { UserActions } from "../actions/user.actions";
import { connect } from "react-redux";

class Login extends Component {
  state = {
    username: "",
    password: "",
  };
  login = () => {
    const { username, password } = this.state;
    this.props.login(username, password);
  };
  render() {
    const { user } = this.props;
    if (user.user) this.props.history.push("/");
    return (
      <Card small className="mb-4 col-7" style={halfTrans}>
        <CardHeader className="border-bottom" style={fullTrans}>
          <h6 className="m-0">Login</h6>
        </CardHeader>
        <Col>
          <Form>
            <Row form className="form-group pt-3">
              <FormInput
                id="username"
                placeholder="username"
                onChange={(e) => {
                  this.setState({
                    username: e.target.value,
                  });
                }}
                style={quarterTrans}
              />
            </Row>
            <Row form className="pb-3">
              <FormInput
                id="password"
                placeholder="password"
                type="password"
                onChange={(e) => {
                  this.setState({
                    password: e.target.value,
                  });
                }}
                style={quarterTrans}
              />
            </Row>
            <Row form>
              {user.error && (
                <Alert
                  dismissible={false}
                  open={user.loginError != null}
                  theme="danger"
                  style={{ borderRadius: 5 }}
                >
                  {user.loginError &&
                    user.loginError.response?.data.error}
                </Alert>
              )}
            </Row>
            <Row form className="justify-content-end">
              <Button
                theme="primary"
                className="mb-3"
                onClick={() => this.login()}
                id ="login_btn"
              >
                Login
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
    login: (username, password) => {
      dispatch(UserActions.login(username, password));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
