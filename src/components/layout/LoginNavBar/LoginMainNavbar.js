import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Container, Navbar, NavbarBrand } from "shards-react";

const LoginMainNavbar = ({ layout, stickyTop }) => {
  const classes = classNames(
    "main-navbar",
    "full-width",
    "sticky-top"
  );

  return (
    <div className={classes}>
      <Navbar
        type="light"
        style={{ backgroundColor: "#ffffff00" }}
      >
        <NavbarBrand
          className="w-100 mr-0"
          href="#"
          style={{ lineHeight: "25px" }}
        >
          <div className="d-table m-auto">
            <img
              id="main-logo"
              className="d-inline-block align-top mr-1"
              style={{ maxWidth: "25px" }}
              src={require("../../../logo.svg")}
              alt="Airline logo"
            />
            <span className="d-none d-md-inline ml-1">Airlines</span>
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
