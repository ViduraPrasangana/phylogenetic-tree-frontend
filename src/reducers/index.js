import { combineReducers } from "redux";
import customerReducer from "./customer.reducer";


const rootReducer = combineReducers({
  customerReducer,
});

export default rootReducer;
