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
import PastVis from "../../views/PastVis";
import MyDNAs from "../../views/MyDNAs";
class MainNavBar extends Component {
  state = {
    current: ""
  };

  selectMenu() {
    const { current } = this.state;
    const { comp } = this.props;
    if (comp.type != PastVis && comp.type != MyDNAs && current !== "") this.setState({ current: "" });
    else if (comp.type == PastVis && current !== "/past-vis")
      this.setState({ current: "/past-vis" });
    else if (comp.type == MyDNAs && current !== "/my-dna-files")
      this.setState({ current: "/my-dna-files" });
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

              <h5 className="d-none d-md-inline ml-1 bold text-white"><b>Phylogentic Tree Visualizer</b></h5>
            </div>
          </NavbarBrand>
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
