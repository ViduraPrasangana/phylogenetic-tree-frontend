import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Col } from "shards-react";

const PageTitle = ({ title, subtitle, className, titleClass,subtitleClass,...attrs }) => {
  const classes = classNames(
    className,
    "text-center",
    "text-md-left",
    "mb-sm-0",    
  );

  return (
    <Col xs="12" sm="4" className={classes} { ...attrs } >
      <h3 className={"page-title "+titleClass}><b>{title}</b></h3>
      <p className={"text-uppercase page-subtitle mt-2 "+subtitleClass} >{subtitle}</p>
    </Col>
  )
};

PageTitle.propTypes = {
  /**
   * The page title.
   */
  title: PropTypes.string,
  /**
   * The page subtitle.
   */
  subtitle: PropTypes.string,
  titleClass: PropTypes.string,
  subtitleClass: PropTypes.string,
};

export default PageTitle;
