import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Container, Navbar, NavbarBrand } from "shards-react";
import { Link } from "react-router-dom";

const LoginMainNavbar = ({ layout, stickyTop }) => {
  const classes = classNames(
    "main-navbar",
  );

  return (
    <div className={classes}>
      <Navbar
      className="align-content-between flex-md-nowrap p-0"
        type="light"
        style={{ backgroundColor: "#ffffff00" }}
      >
        <NavbarBrand
          className="m-0 p-0"
          tag={Link} to="/"
          style={{ lineHeight: "25px" }}
        >
          <div className="pl-5 align-items-center">
            <img
              id="main-logo"
              className="d-inline-block align-top mr-1"
              style={{ maxWidth: "40px" }}
              src={require("../../../assets/images/logo-dark.png")}
              alt="DNA logo"
              
            />
            <h4 className="d-none d-md-inline ml-1 text-black"><b>DNA</b></h4>
          </div>
        </NavbarBrand>
      </Navbar>
    </div>
  );
};

LoginMainNavbar.propTypes = {
  /**
   * The layout type where the MainNavbar is used.
   */
  layout: PropTypes.string,
  /**
   * Whether the main navbar is sticky to the top, or not.
   */
  stickyTop: PropTypes.bool
};

LoginMainNavbar.defaultProps = {
  stickyTop: true
};

export default LoginMainNavbar;
