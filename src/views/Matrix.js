import React, { Component } from "react";
import {
  Container,
  CardHeader,
  Button,
  Card
} from "shards-react";

import { } from "../data/constants";
import { halfTrans, fullTrans} from "../data/constants";
import { connect } from "react-redux";
import Axios from "axios";
import config from "../data/config";
import moment from "moment";
import Table from "../components/TableComponents/TableDemo"
const innerStyle = {
  backgroundColor: "#ffffff00",
  borderColor: "#00000033"
};

class Matrix extends Component {
    state = {
  
    };
    componentDidMount() {
      // this.props.getAllRoutes();
    }
    search() {
      const { selectedRoute, selectedDate } = this.state;
      if (selectedDate !== null && selectedDate !== null) {
        Axios.get(
          config.host_url +
            "schedule/" +
            selectedRoute.toString() +
            "/" +
            moment(selectedDate).format("YYYY-MM-DD")
        )
          .then(result => {
            this.setState({
              flights: result.data.data
            });
          })
          .catch(() => {});
      }
    }
  
    render() {
      const {
  
      } = this.state;
  
      return (
        <Container flex justify-content="center" flex-direction="row">
          
          <Card small className="mb-4 col-7"  align-item-center>
          <CardHeader className="border-bottom" style={halfTrans} color = "black">
          <h2 className="m-0" color = "white">Distance Matrix</h2>
        </CardHeader>
        
          <Table></Table>
          <br></br>
          <Button size="lg" theme="danger"  className="m-1" style={{width:"200px"}}>
            Generate Tree
          </Button>
          <br></br>
          </Card>
  
          
        
        </Container>
      );
    }
  }
  const mapStateToProps = state => {
    return {
      user: state.customerReducer.user
    };
  };
  const mapDispatchToProps = () => {
    return {
    
    };
  };
  export default connect(mapStateToProps, mapDispatchToProps)(Matrix);
  