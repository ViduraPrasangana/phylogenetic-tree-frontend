import React, { Component } from "react";
import { Container, CardHeader, Button, Card, Row, Col } from "shards-react";

import {} from "../data/constants";
import { halfTrans, fullTrans } from "../data/constants";
import { connect } from "react-redux";
import Axios from "axios";
import config from "../data/config";
import moment from "moment";
import Table from "../components/TableComponents/TableDemo";
import Spinner from "react-spinkit";
import { CSVLink, CSVDownload } from "react-csv";

class Matrix extends Component {
  state = {
    status: null,
    columns: null,
    data: null,
    process: null,
    startState: false,
    result_id: null,
    width:0,
    csvData:null,
  };

  constructor(props){
    super(props)
    this.loadMatrix(this.props.match.params.process_id);
    
  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  

updateWindowDimensions=()=> {
  this.setState({ width: window.innerWidth*0.5, height: window.innerHeight });
}

  loadMatrix = (id) => {
    var number = /^[0-9]+$/;
    if (id.match(number)) {
      const process_id = parseInt(id);
      console.log(id)
      Axios.post(config.host_url + "cluster/matrix/result/", {
        process_id,
      })
        .then((res) => {
          this.setState({
            status: res.data.process.status,
            columns: res.data.matrix[0],
            data: res.data.matrix[1],
            process: res.data.process,
            result_id: res.data.result_id,
          });
          console.log(res.data);
        })
        .catch((error) => {
          console.log("thi is err",error);
          if (error.response && error.response.status === 400) {
            this.setState({
              status: "PROGRESS",
            });
          }
        });
    } else {
      alert("Id should be number");
      this.props.history.push("/");
    }
  };
  getCSVData = () => {
    const {  data, process,csvData,columns } = this.state;
    console.log("csv data",csvData)
    if(csvData!==null) return csvData
    const csv = [];
    const t =  Array.from(columns)
    t.unshift("");
    csv.push(t);
    data.forEach((element, i) => {
      const e = Array.from(element)
      e.unshift(t[i + 1]);
      csv.push(e);
    });
    // this.setState({csvData:csv})
    console.log(csv);
    return csv;
  };

  startProcess = () => {
    this.setState({
      startState: true,
    });
    const { process, result_id } = this.state;
    console.log(result_id)
    Axios.post(config.host_url + "cluster/lsh/tree/generate/", {
      title: process.title,
      result_id,
    })
      .then((res) => {
        this.setState({
          startState: false,
        });
        console.log(res);
      })
      .catch((err) => {
        this.setState({
          startState: false,
        });
        console.log(err.response);
      });
  };
  render() {
    const { status, columns, data, process, startState,width } = this.state;
    const mxwdth = columns ? width / columns.length : 0;
    return (
      <Container
        fluid
        className="overflow-scroll pb-4"
        style={{ height: "100%" }}
      >
        <Row className="justify-content-center mt-3">
          <h2 className="m-0 text-white">Distance Matrix</h2>
        </Row>
        <Row
          className="justify-content-center align-items-center d-flex"
          style={{width: "100%",minHeight:"80%" }}
        >
         
            {status !== "SUCCESS" && (
              <Spinner name="ball-scale-multiple" color="white" />
            )}
            {status !== "SUCCESS" && (
              <label style={{ color: "white" }} className="ml-5 mb-0">
                {status === "PROGRESS" ? "Generating matrix" : "Loading..."}
              </label>
            )}
          {status === "SUCCESS" && (
            <Card>
              <CardHeader className="text-center">
                Distance Matrix - {process.title} - {process.method} Method
              </CardHeader>
              <table className="table">
                <thead>
                  <tr>
                    <th className="border" style={{ maxWidth: mxwdth }}></th>
                    {columns.map((e, i) => {
                      return (
                        <th
                          className="text-center border"
                          style={{ maxWidth: mxwdth }}
                        >
                          {e}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {data.map((e, i) => {
                    return (
                      <tr  className="text-center">
                        <th className="border" style={{ maxWidth: mxwdth }}>
                          {columns[i]}
                        </th>
                        {e.map((ele, index) => {
                          return (
                            <td
                              className="border"
                              style={{ maxWidth: mxwdth }}
                            >
                              {ele}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
           
          )}
        </Row>
        <Row
          className="justify-content-center mt-2"
        >
          {data && (
            <Button>
              <CSVLink
                ref={(r) => (this.csv = r)}
                data={this.getCSVData()}
                filename={process.title + " - " + process.method + ".csv"}
                style={{ color: "white" }}
              >
                Download Data as CSV
              </CSVLink>
            </Button>
          )}
        </Row>
        {data && (
          <Row className="d-flex justify-content-center mt-3">
            <Button
              theme="info"
              style={{ width: "60%", height: 50, fontSize: 20 }}
              onClick={this.startProcess}
            >
              {startState ? "Starting process" : "Visualize Phylogenetic Tree"}
            </Button>
          </Row>
        )}
      </Container>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.customerReducer,
  };
};
const mapDispatchToProps = () => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(Matrix);
