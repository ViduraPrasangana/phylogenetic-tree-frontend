import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

class PrivateRoute extends React.Component {
  render() {
    const { component: Component, roles, user, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props => {
          const currentUser = user.user;
          // if (
          //   !currentUser &&
          //   rest.location.pathname !== "/login" &&
          //   rest.location.pathname !== "/register" &&
          //   rest.location.pathname !== "/"
          // ) {
          //   return (
          //     <Redirect
          //       to={{ pathname: "/", state: { from: props.location } }}
          //     />
          //   );
          // }
          if (roles && roles.indexOf(currentUser.role) === -1) {
            return <Redirect to={{ pathname: "/login" }} />;
          }

          return <Component {...props} />;
        }}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.customerReducer
  };
};

export default connect(mapStateToProps, null)(PrivateRoute);
