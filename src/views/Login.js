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
  Alert
} from "shards-react";
import { halfTrans, fullTrans, quarterTrans } from "../data/constants";
import { UserActions } from "../actions/customer.actions";
import { connect } from "react-redux";
import roles from "../data/roles";

class Login extends Component {
  state = {
    email: "",
    password: ""
  };
  login = () => {
    const { email, password } = this.state;
    this.props.login(email, password);
  };
  render() {
    const { user} = this.props
    if (user.user && user.user.role===roles.customer) this.props.history.push("/")
    else if (user.user && user.user.role===roles.management) this.props.history.push("/admin/flights-today")
    return (
      <Card small className="mb-4 col-7" style={halfTrans}>
        <CardHeader className="border-bottom" style={fullTrans}>
          <h6 className="m-0">Login</h6>
        </CardHeader>
        <Col>
          <Form>
            <Row form className="form-group pt-3">
              <FormInput
                id="email"
                placeholder="email"
                onChange={e => {
                  this.setState({
                    email: e.target.value
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
                onChange={e => {
                  this.setState({
                    password: e.target.value
                  });
                }}
                style={quarterTrans}
              />
            </Row>
            <Row form>
              <Alert dismissible={false} open={user.error!=null} theme="danger">
                {user.error && user.error.data.error.message}
              </Alert>
            </Row>
            <Row form className="justify-content-end">
              <Button
                theme="primary"
                className="mb-3"
                onClick={() => this.login()}
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

const mapStateToProps = state => {
  return {
    user: state.customerReducer
  };
};
const mapDispatchToProps = dispatch => {
  return {
    login: (username, password) => {
      dispatch(UserActions.login(username, password));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
