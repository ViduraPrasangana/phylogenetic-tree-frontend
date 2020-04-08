import React from "react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavItem,
  NavLink,
  Col,
  Row
} from "shards-react";
import { connect } from "react-redux";

class UserActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };

    this.toggleUserActions = this.toggleUserActions.bind(this);
  }

  toggleUserActions() {
    this.setState({
      visible: !this.state.visible
    });
  }

  render() {
    const { user } = this.props;
    return (
      // <NavItem  toggle={this.toggleUserActions}>
      <NavLink  className="text-nowrap px-3">
      <Row><Col> <img
          className="user-avatar rounded-circle mr-2"
          src={require("../../../../assets/images/avatars/default-avatar-admin.png")}
          alt="User Avatar"
        /></Col>
       
        <Col className="justify-content-center">
          <span className="d-none d-md-inline-block text-center">
            {user.first_name + " " + user.last_name}
          </span>
          <br />
          <span className="d-none d-md-inline-block text-success"><p><b>{user.category}</b></p></span>
        </Col></Row>
      </NavLink>

      // </NavItem>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.userReducer
  };
};
export default connect(mapStateToProps, null)(UserActions);
