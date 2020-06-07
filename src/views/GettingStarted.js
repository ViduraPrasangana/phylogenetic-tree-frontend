import React, { Component } from "react";
import {
  Row,
  Card,
  CardBody,
  Container,
  Button,
  Progress,
  FormInput,
  Col,
  FormRadio,
  Alert,
} from "shards-react";
import Files from "react-files";
import Axios from "axios";
import config from "../data/config";
import { connect } from "react-redux";
import YouTube from "react-youtube";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

class GettingStarted extends Component {
  state = {
    expanded: false,
  };
  handleChange = (panel) => (event, isExpanded) => {
    this.setState({ expanded: isExpanded ? panel : false });
  };

  render() {
    const { expanded } = this.state
    return (
      <Container
        fluid
        className="overflow-scroll pb-4"
        style={{ height: "100%" }}
      >
        <Row className="justify-content-center mt-3 ">
          <Card style={{ width: "90%" }}>
            <CardBody>
              <Row>
                <Col className="col-6">
                  <YouTube
                    videoId="54zTM3yMrU0"
                    opts={{
                      height: "480",
                      width: "640",
                    }}
                    onReady={this._onReady}
                  />
                </Col>
                <Col className="col-6">
                  <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>Expansion Panel 1</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse malesuada lacus ex, sit amet blandit leo
                        lobortis eget.
                      </Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Typography>Expansion Panel 2</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse malesuada lacus ex, sit amet blandit leo
                        lobortis eget.
                      </Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.userReducer,
  };
};

export default connect(mapStateToProps)(GettingStarted);
