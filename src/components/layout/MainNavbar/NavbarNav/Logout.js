import React from "react";
import { NavItem, NavLink, Tooltip} from "shards-react";
import { UserActions } from "../../../../actions/user.actions";
import { connect } from "react-redux";
import { IoIosLogOut } from "react-icons/io";

class Logout extends React.Component {

  logout() {
    this.props.logout()
  }

  render() {
    return (
      
        <NavLink
          className="nav-link-icon text-center"
          onClick={()=>this.logout()}
        >
          <div className="nav-link-icon__wrapper pb-2">
            <i class="text-danger material-icons"><IoIosLogOut/></i>
          </div>
        </NavLink>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.userReducer
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
