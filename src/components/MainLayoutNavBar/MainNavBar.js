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
  Button,
  Collapse,
  NavbarToggler,
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
import Samples from "../../views/Samples";
class MainNavBar extends Component {
  state = {
    current: "",
    isNavOpen:false,
  };

  selectMenu=() =>{
    const { current } = this.state;
    const { comp } = this.props;
    if (comp.type != PastVis && comp.type != MyDNAs && comp.type != Samples && current !== ""){
      this.setState({ current: "" });
    }
    else if (comp.type == PastVis && current !== "/past-vis"){
      this.setState({ current: "/past-vis" });}
    else if (comp.type == MyDNAs && current !== "/my-dna-files"){
      this.setState({ current: "/my-dna-files" });
    }
    else if (comp.type == Samples && current !== "/samples"){
      this.setState({ current: "/samples" });
    }
  }

  toggleNav = () => {
    this.setState({ isNavOpen: !this.state.isNavOpen })
}
  render() {
    const { current } = this.state;
    this.selectMenu();
    return (
      <>
      <div className="main-navbar">
        <Navbar
          className="align-content-between flex-md-nowrap p-0"
          type="light"
          style={{ backgroundColor: "#ffffff00" }}
        >

          <NavItem className=" pl-5 col-6 col-md-4">
          <NavbarBrand
            className="m-0 p-0"
            tag={Link}
            to="/"
            style={{ lineHeight: "25px" }}
          >
            <div className=" align-items-center">
              <img
                id="main-logo"
                className="d-inline-block align-top mr-1"
                style={{ maxWidth: "40px", paddingBottom: "10px" }}
                src={require("../../assets/images/logo.png")}
                alt="DNA logo"
              />

              <h5 className="d-none d-md-inline ml-1 bold text-white">
                <b>Phylogentic Tree Visualizer</b>
              </h5>
            </div>
          </NavbarBrand>
          
          </NavItem>
        
          <NavItem className="col-0 d-none d-lg-flex">
            <ButtonGroup className="align-items-center">
              {itemsRight.map((element) => {
                if (!this.props.user && element.protect) return;
                return (
                  <TopBarNavItem
                    item={element}
                    current={current}
                    onSelected={(state) => {
                      this.setState({
                        current: state,
                      });
                    }}
                  />
                );
              })}
            </ButtonGroup>
          </NavItem>
          <NavItem className="col-6 col-md-4 col-lg-4">
            {this.props.user && (
              <>
                <UserActions /> <Logout />
              </>
            )}
            {!this.props.user && (
              <>
                <LoginButton /> <RegisterButton />
              </>
            )}
          </NavItem>
        
        </Navbar>
      
      </div>
      <Row className="main-navbar d-flex d-lg-none justify-content-center my-3">
        <Navbar
          className="align-content-between flex-md-nowrap p-0"
          type="light"
          style={{ backgroundColor: "#ffffff00" }}
        >

         
          <NavItem >
            <ButtonGroup className="align-items-center">
              {itemsRight.map((element) => {
                if (!this.props.user && element.protect) return;
                return (
                  <TopBarNavItem
                    item={element}
                    current={current}
                    onSelected={(state) => {
                      this.setState({
                        current: state,
                      });
                    }}
                  />
                );
              })}
            </ButtonGroup>
          </NavItem>
         
        
        </Navbar>
      
      </Row>
     
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.userReducer.user,
  };
};

export default connect(mapStateToProps, null)(MainNavBar);
