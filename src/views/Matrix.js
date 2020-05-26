import React, { Component } from "react";
import {
  Container,
  CardHeader,
  Button,
  Card,
  Row,
  Col,
  CardBody,
  Tooltip,
} from "shards-react";

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
    width: 0,
    csvData: null,
    tooltipOpen: null,
  };

  constructor(props) {
    super(props);
    this.loadMatrix(this.props.match.params.process_id);
  }
  componentDidMount() {
    this.updateWindowDimensions();

    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({
      width: window.innerWidth * 0.5,
      height: window.innerHeight,
    });
  };

  loadMatrix = (id) => {
    var number = /^[0-9]+$/;
    if (id.match(number)) {
      const process_id = parseInt(id);
      console.log(id);
      Axios.post(config.host_url + "cluster/matrix/result/", {
        process_id,
      })
        .then((res) => {
          this.setState({
            status: res.data.process.status,
            columns: res.data.matrix[0],
            data: res.data.matrix[1],
            process: res.data.process,
            result_id: res.data.matrix_result_id,
          });
          if (res.data.status === "PROGRESS") {
            setTimeout(() => this.loadMatrix(id), 10000);
          }
        })
        .catch((error) => {
          console.log("thi is err", error);
          if (error.response && error.response.status === 400) {
            this.setState({
              status: "PROGRESS",
            });
            setTimeout(() => this.loadMatrix(id), 10000);
          }
        });
    } else {
      alert("Id should be number");
      this.props.history.push("/");
    }
  };
  getCSVData = () => {
    const { data, process, csvData, columns } = this.state;
    console.log("csv data", csvData);
    if (csvData !== null) return csvData;
    const csv = [];
    const t = Array.from(columns);
    t.unshift("");
    csv.push(t);
    data.forEach((element, i) => {
      const e = Array.from(element);
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
    const { process, result_id, matrix_process_id } = this.state;
    console.log(result_id);
    Axios.post(config.host_url + "cluster/tree/generate/", {
      matrix_process_id: result_id,
      title: process.title,
      type: process.type,
    })
      .then((res) => {
        this.setState({
          startState: false,
        });
        this.props.history.push("/tree/" + res.data.process.process_id);
        console.log(res);
      })
      .catch((err) => {
        this.setState({
          startState: false,
        });
        console.log(err.response);
      });
  };
  toggle = (col) => {
    if (this.state.tooltipOpen)
      this.setState({
        tooltipOpen: null,
      });
    else {
      this.setState({
        tooltipOpen: col,
      });
    }
  };
  render() {
    const {
      status,
      columns,
      data,
      process,
      startState,
      width,
      tooltipOpen,
    } = this.state;
    const mxwdth = columns ? width / (columns.length*2) : 0;
    return (
      <Container
        fluid
        className="overflow-scroll pb-4"
        style={{ height: "100%" }}
      >
        <Row className="justify-content-center mt-3">
          <h2 className="m-0 text-white">Distance Matrix</h2>
        </Row>
        {status === "SUCCESS" && (
          <Row className="justify-content-center my-3" >
            <Card className="py-3 align-items-center" style={{width:mxwdth*(columns.length+1)}}>
              Distance Matrix - {process.title} - {process.type} Method
            </Card>
          </Row>
        )}
        <Row
          className="justify-content-center align-items-center d-flex"
          style={{ minHeight: "80%" }}
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
            <>
              <table >
                <thead>
                  <tr>
                    <th  style={{ width: mxwdth }}></th>
                    {columns.map((e, i) => {
                      var t = e.split("_").join(" ");
                      return (
                        <>
                          <th
                            className="text-center"
                            style={{ width: mxwdth }}
                          >
                            <Card>
                              <CardBody id={"a"+i}>
                                {t.length > 15 ? t.substring(0, 10) + "..." : t}
                              </CardBody>
                            </Card>
                          </th>
                          <Tooltip
                            placement="bottom"
                            open={tooltipOpen === "a"+i}
                            target={"#" + "a"+i}
                            toggle={() => this.toggle("a"+i)}
                          >
                            {t}
                          </Tooltip>
                        </>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {data.map((e, i) => {
                    var t = columns[i].split("_").join(" ");
                    
                    return (
                      <tr className="text-center">
                        <th  style={{ width: mxwdth }}>
                          <Card>
                            <CardBody id={columns[i].replace(".","") + "2"}>
                              {t.length > 15 ? t.substring(0, 10) + "..." : t}
                            </CardBody>
                          </Card>
                        </th>
                        <Tooltip
                          placement="bottom"
                          open={tooltipOpen === columns[i].replace(".","") + "2"}
                          target={"#" + columns[i].replace(".","") + "2"}
                          toggle={() => this.toggle(columns[i].replace(".","") + "2")}
                        >
                          {t}
                        </Tooltip>
                        {e.map((ele, index) => {
                          {/* if(index < i) return   <td  style={{ width: mxwdth }}>
                              <Card style={{overflow:"hidden",backgroundColor:"#1b1b1b"}}>
                                <CardBody >  &nbsp;&nbsp;&nbsp;&nbsp;</CardBody>
                              </Card>
                            </td> */}
                          return (  
                            <td  style={{ width: mxwdth }}>
                              <Card>
                                <CardBody>{Number(ele.toFixed(4))}</CardBody>
                              </Card>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* </Card> */}
            </>
          )}
        </Row>
        <Row className="justify-content-center mt-2">
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
