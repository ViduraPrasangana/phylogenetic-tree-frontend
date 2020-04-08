import { User } from "../data/redux-constants";
import Axios from "axios";
import config from "../data/config";

const login = (username, password) => {
  return dispatch => {
    dispatch(request());
    Axios.post(config.host_url + "users/login/", {
      username,
      password
    })
      .then(res => {
        console.log(res)
        dispatch(success(res.data ))
      })
      .catch(err => dispatch(failure(err)));
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

const register = (user) => {
  return dispatch => {
    dispatch(request());
    Axios.post(config.host_url + "users/register/",user)
      .then(res => {
        console.log(res)
        dispatch(success(res.data))
      })
      .catch(err => dispatch(failure(err)));
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
  register,
  logout
};
