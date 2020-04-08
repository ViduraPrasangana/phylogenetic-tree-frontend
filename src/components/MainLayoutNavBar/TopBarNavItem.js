import React from "react";
import PropTypes from "prop-types";
import { NavLink as RouteNavLink,Link } from "react-router-dom";
import { NavItem, NavLink,Button } from "shards-react";

const TopBarNavItem = ({ item,current,onSelected }) => (
  <Button className="" outline={current!==item.to} size="sm" style={{height:"100%"}} tag={Link} to={item.to} onClick={()=>onSelected(item.to)}>
    {item.title}
  </Button>
);

TopBarNavItem.propTypes = {
  item: PropTypes.object,
  onSelected: PropTypes.func
};

export default TopBarNavItem;
