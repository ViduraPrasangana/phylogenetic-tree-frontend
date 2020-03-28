import { User } from "../data/redux-constants";
import Axios from "axios";
import config from "../data/config";

const login = (email, password) => {
  return dispatch => {
    dispatch(request());
    Axios.post(config.host_url + "customers/login", {
      email,
      password
    })
      .then(res => dispatch(success({ ...res.data, role: "customer" })))
      .catch(err => dispatch(failure(err.response)));
  };

  function request() {
    return { type: User.LOGIN_IN };
  }
  function success(user) {
    return { type: User.LOGIN, payload: user };
  }
  function failure(error) {
    return { type: User.ERROR, payload: error };
  }
};

const logout = () => {
  return dispatch => {
    dispatch(success());
  };

  function success() {
    console.log("logout");
    return { type: User.LOGOUT };
  }
};



export const UserActions = {
  login,
  logout
};
