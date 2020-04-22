import { User } from "../data/redux-constants";

const initialUser = {
  user: null,
  error: null,
};

export default (state = initialUser, action) => {
  switch (action.type) {
    case User.LOGIN:
      return {
        user: action.payload,
        registerError: null,
        loginError: null
      };
    case User.LOGOUT:
      return {
        user: null,
      };
    case User.REGISTER_ERROR:
      return {
        ...state,
        registerError: action.payload,
      };
    case User.LOGIN_ERROR:
      return {
        ...state,
        loginError: action.payload,
      };
    default:
      return state;
  }
};
