import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Row,
  ButtonGroup,
  Button
} from "shards-react";
import Logout from "../layout/MainNavbar/NavbarNav/Logout";
import TopBarNavItem from "./TopBarNavItem";
import { itemsRight, itemsLeft } from "../../data/topbar-nav-items";
import UserActions from "../layout/MainNavbar/NavbarNav/UserActions";
import { connect } from "react-redux";
import LoginButton from "../LoginButton";
import RegisterButton from "../RegisterButton";
class MainNavBar extends Component {
  state = {
    current: ""
  };

  selectMenu() {
    // const { current } = this.state;
    // const { comp } = this.props;
    // if (comp.type == Home && current !== "/") this.setState({ current: "/" });
    // else if (comp.type == Tickets && current !== "/tickets")
    //   this.setState({ current: "/tickets" });
    // else if (comp.type == Bookings && current !== "/bookings")
    //   this.setState({ current: "/bookings" });
  }
  render() {
    const { current } = this.state;
    this.selectMenu();
    return (
      <div className="main-navbar">
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
                style={{ maxWidth: "40px", paddingBottom:"10px"}}
                src={require("../../assets/images/logo.png")}
                alt="DNA logo"
              />

              <h4 className="d-none d-md-inline ml-1 bold text-white"><b>DNA</b></h4>
            </div>
          </NavbarBrand>

          {/* <a
            className="toggle-sidebar d-sm-inline d-md-none d-lg-none"
            // onClick={this.handleToggleSidebar}
          >
            <i className="material-icons">&#xE5C4;</i>
          </a> */}
          <NavItem>
            <ButtonGroup className="align-items-center">
              {itemsRight.map(element => {
                if (!this.props.user && element.protect) return;
                return (
                  <TopBarNavItem
                    item={element}
                    current={current}
                    onSelected={state => {
                      this.setState({
                        current: state
                      });
                    }}
                  />
                );
              })}
            </ButtonGroup>
          </NavItem>
          <NavItem>
            {this.props.user && (
              <>
                <UserActions /> <Logout />
              </>
            )}
            {!this.props.user && <><LoginButton /> <RegisterButton/></>}
          </NavItem>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.userReducer.user
  };
};

export default connect(mapStateToProps, null)(MainNavBar);
