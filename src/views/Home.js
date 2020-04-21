import React, { Component } from "react";
import {
  Container,
  Card,
  Row,
  CardBody,
  CardHeader,
  Col,
  Button
} from "shards-react";
import PageTitle from "../components/PageTitle";
import {} from "../data/constants";

import { connect } from "react-redux";
import Axios from "axios";
import config from "../data/config";
import moment from "moment";
import { Link } from "react-router-dom";
const innerStyle = {
  backgroundColor: "#ffffff00",
  borderColor: "#00000033"
};

class Home extends Component {
  state = {};
  componentDidMount() {
  }

  handleClickSamples = ()=>{
    this.props.history.push("\samples")
  }

  handleGettingStarted=()=> {
    const { history } = this.props;
    history.push("/getting-started");
  }

  render() {
    return (
      <Container fluid>
        <Row noGutters className="pt-5 justify-content-center">
          <img
            id="main-logo"
            className="d-inline-block align-top mr-1"
            style={{ maxWidth: "120px", paddingBottom: "10px" }}
            src={require("../assets/images/logo.png")}
            alt="DNA logo"
          />
        </Row>
        <Row noGutters className="page-header py-4 justify-content-center">
          <PageTitle
            sm="5"
            title="DNA analyzer"
            subtitle="Analyse, Visualize, Customize, Save, Modify any DNA Sequences"
            className="text-sm-center text-center absolute-center"
            titleClass="text-center text-white"
            subtitleClass="text-center"
          />
        </Row>

        <Row className="justify-content-center pt-3">
          <Col className="text-center">
            <Button
              size="lg"
              theme="danger"
              className="m-1"
              style={{ width: "200px" }}
              onClick={this.handleGettingStarted}
            >
              Get Started
            </Button>
            <br />
            <Button
              size="lg"
              theme="primary"
              outline
              className="m-1"
              style={{ width: "200px" }}
              onClick={this.handleClickSamples}
            >
              Try with samples
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.userReducer
  };
};
const mapDispatchToProps = () => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
