import { User } from "../data/redux-constants";

const initialUser = {
  user: null,
  error: null
};

export default (state = initialUser, action) => {
  switch (action.type) {
    case User.LOGIN:
      return {
        user: action.payload,
      };
    case User.LOGOUT:
      return {
        user:null
      };
    case User.ERROR:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};
