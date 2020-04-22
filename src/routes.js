import React from "react";
import { Redirect } from "react-router-dom";

// import {DashboardLayout} from "./layouts";
// import FlightsToday from "./views/FlightsToday";
// import ScheduleFlight from "./views/ScheduleFlight";
// import Passengers from "./views/Passengers";
// import Reports from "./views/Reports"
// import Bookings from "./views/Bookings";
// import FlightsHistory from "./views/FlightsHistory";
import LoginLayout from "./layouts/LoginLayout";
import Login from "./views/Login";
import Register from "./views/Register";
import Samples from "./views/Samples";
// import AdminLogin from "./views/AdminLogin";
// import StaticFlights from "./views/StaticFlights";
import Errors from "./layouts/Error";
import Main from "./layouts/Main";
import Home from "./views/Home";
import Matrix from "./views/Matrix"
import GettingStarted from "./views/GettingStarted";
import PastVis from "./views/PastVis";
import MyDNAs from "./views/MyDNAs";
// import Tickets from "./views/Customer/Tickets";
// import MyBookings from "./views/Customer/Bookings";
// import Ticket from "./components/Ticket";
// import Booking from "./components/Booking";
// import BookTicket from "./views/Customer/BookTicket";
// import roles from "./data/roles";

export default [
  {
    path: "/login",
    exact: true,
    layout: LoginLayout,
    component: Login
  },
  {
    path: "/register",
    exact: true,
    layout: LoginLayout,
    component: Register
  },
  {
    path: "/",
    exact: true,
    layout: Main,
    component: Home,
  },
  {

    path: "/getting-started",
    exact: true,
    layout: Main,
    component: GettingStarted,
  },
  {
    path: "/past-vis",
    exact: true,
    layout: Main,
    component: PastVis,
  },
  {
    path: "/my-dna-files",
    exact: true,
    layout: Main,
    component: MyDNAs,
  },
  {
    path: "/samples",
    exact: true,
    layout: Main,
    component: Samples,
  },
  {
    path: "/matrix/:process_id",
    exact: true,
    layout: Main,
    component: Matrix,
  },
  {
    exact:true,
    layout: Errors,
  },
 

];
