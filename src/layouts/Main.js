import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";
import MainNavBar from "../components/MainLayoutNavBar/MainNavBar";
import { bgStyle ,scrollHide} from "../data/constants";
import backgroundImage from "../assets/images/home_background_1.jpg";

const Main = ({ children, noNavbar, noFooter, history }) => (
  <Container fluid className="change-scroll overflow-scroll" style={{...bgStyle(backgroundImage),...scrollHide}}>
    <Row style={{ height: "100%"}} >
      <Col
        className="main-content p-0"
        sm="12"
        tag="main"
      >
              <MainNavBar comp={children} />
       <Row className="error">
       {children}
       </Row> 
      </Col>
    </Row>
  </Container>
);

Main.propTypes = {
  noNavbar: PropTypes.bool,
  noFooter: PropTypes.bool
};

Main.defaultProps = {
  noNavbar: false,
  noFooter: false
};

export default Main;
