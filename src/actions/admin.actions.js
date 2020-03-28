import { User } from "../data/redux-constants";
import Axios from "axios";
import config from "../data/config";

const login = (username, password) => {
  return dispatch => {
    dispatch(request());
    Axios.post(config.host_url + "management/login", {
      username,
      password
    })
      .then(res => dispatch(success({...res.data,role:"management"})))
      .catch(err => dispatch(failure(err.response)))
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


export const UserActions={
    login
}