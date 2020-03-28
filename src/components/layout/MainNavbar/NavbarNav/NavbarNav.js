import React from "react";
import { Nav } from "shards-react";

import Notifications from "./Logout";
import UserActions from "./UserActions";

export default () => (
  <Nav navbar className="flex-row">
    <UserActions />
    <Notifications />
  </Nav>
);
