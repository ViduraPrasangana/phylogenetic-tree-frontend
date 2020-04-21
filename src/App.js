import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { BrowserRouter as Router, Route,Switch } from "react-router-dom";
import routes from "./routes";
import withTracker from "./withTracker";

import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import 'rc-time-picker/assets/index.css';
import PrivateRoute from "./components/PrivateRoute";
import { useSelector } from "react-redux";
import Axios from "axios";
function App() {
  const user = useSelector(state => state.userReducer);
  if(user.user){
    Axios.defaults.headers.Authorization = "Token "+user.user.token
  }
  return (
    <Router>
      <div>
      <Switch>
        {routes.map((route, index) => {
          return (
            <PrivateRoute
              key={index}
              path={route.path}
              exact={route.exact}
              roles={route.roles}
              component={withTracker(props => {
                return (
                  <route.layout>
                    {route.component && <route.component {...props}/>}
                  </route.layout>
                );
              })}
            />
          );
        })}
        </Switch>
      </div>
    </Router>
  );
}


export default App;
