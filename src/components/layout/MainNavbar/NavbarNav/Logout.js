import React from "react";
import { NavItem, NavLink, Tooltip} from "shards-react";
import { UserActions } from "../../../../actions/customer.actions";
import { connect } from "react-redux";

class Logout extends React.Component {

  logout() {
    this.props.logout()
  }

  render() {
    return (
      // <NavItem className="border-right dropdown notifications border-left">
      
        <NavLink
          className="nav-link-icon text-center border-left"
          onClick={()=>this.logout()}
        >
          <div className="nav-link-icon__wrapper">
            <i class="text-danger material-icons">&#xE879;</i>
          </div>
        </NavLink>
      // </NavItem>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.customerReducer
  };
};
const mapDispatchToProps = dispatch => {
  return {
    logout: () => {
      dispatch(UserActions.logout());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
