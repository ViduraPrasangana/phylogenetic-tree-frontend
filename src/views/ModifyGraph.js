import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  CardHeader,
  Alert,
} from "shards-react";
import Tree from "../components/graph/Tree";
import data from "../data/data";
import config from "../data/config";
import Axios from "axios";
import { addNamesToTree } from "../data/constants";
import Spinner from "react-spinkit";

class ModifyGraph extends Component {
  state = {
    data: null,
    process: null,
    status: null,
    already_in_file_names: [],
    dna_lst: null,
    selected: null,
    error: null,
    startState: false,
    small: false,
  };
  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0 };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.loadTree(this.props.match.params.process_id);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
      small: window.innerWidth < 992,
    });
  }

  loadTree = (id) => {
    var number = /^[0-9]+$/;
    if (id.match(number)) {
      const process_id = parseInt(id);
      console.log(id);
      Axios.post(config.host_url + "cluster/tree/result/", {
        process_id,
      })
        .then((res) => {
          console.log(res.data);

          this.setState({
            data: addNamesToTree(res.data.tree, 1, 1),
            process: res.data,
            process_id: res.data.process_id,
            already_in_file_names: res.data.file_names,
            is_default_user: res.data.is_default_user,
            status: res.data.status,
          });
          if(res.data.status==="PROGRESS"){
            setTimeout(() => this.loadTree(id), 10000);
          }
          var already_in_files = res.data.file_names;
          if (res.data.is_default_user) {
            Axios.get(config.host_url + "dnaStorage/getDefaultFiles/")
              .then((res) => {
                console.log(res.data);
                this.setState({
                  dna_lst: res.data.dna_files.filter((ele) => {
                    if (!already_in_files.includes(ele.file_name)) {
                      return ele;
                    }
                  }),
                });
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            Axios.get(config.host_url + "dnaStorage/getFiles/")
              .then((res) => {
                console.log(res.data);
                this.setState({
                  dna_lst: res.data.dna_files.filter((ele) => {
                    if (!already_in_files.includes(ele.file_name)) {
                      return ele;
                    }
                  }),
                });
              })
              .catch((err) => {
                console.log(err.response);
              });
          }
        })
        .catch((error) => {
          console.log("thi is err", error.response);
          if (error.response && error.response.status === 400) {
            this.setState({
              status: "PROGRESS",
            });
            setTimeout(() => this.loadTree(id), 10000);
          }
        });
    } else {
      alert("Id should be number");
      this.props.history.push("/");
    }
  };
  startProcess = () => {
    const { selected } = this.state;
    if (selected) {
      this.setState({
        startState: true,
        error: null,
      });
      const { process_id, selected, is_default_user } = this.state;
      Axios.post(config.host_url + "nn/update_tree/", {
        process_id,
        file_name: selected,
        is_default_user,
      })
        .then((res) => {
          console.log(res.data);
          this.setState({ selected: null });
          this.loadTree(this.props.match.params.process_id);
        })
        .catch((err) => {
          console.log(err.response);
          this.setState({
            startState: false,
            error: "Something went wrong",
          });
        });
    } else {
      this.setState({
        error: "Please select a specie",
      });
    }
  };

  render() {
    const {
      height,
      width,
      data,
      status,
      process,
      already_in_file_names,
      dna_lst,
      selected,
      startState,
      error,
      small,
    } = this.state;
    return (
      <Container fluid className="text-center">
        {data && (
          <Row className="justify-content-center">
            <h4 style={{ color: "white" }}>
              Add Specie To Tree - {process.title}
            </h4>
          </Row>
        )}
        {data && dna_lst && (
          <>
            <Row className="">
              <Col className="col-12 col-lg-6 mb-3">
                {status === "SUCCESS" && (
                  <Tree
                    data={data}
                    width={small ? width * 0.9 : width * 0.45}
                    height={height * 0.7}
                    noToolBox
                  />
                )}
                {status !== "SUCCESS" && (
                  <Row
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: height * 0.7 }}
                  >
                    <Spinner name="ball-scale-multiple" color="white" />
                    <label style={{ color: "white" }} className="ml-5 mb-0">
                      {status === "PROGRESS"
                        ? "Generating visualization"
                        : "Loading..."}
                    </label>
                  </Row>
                )}
              </Col>
              <Col className="col-12 col-lg-6">
                <Card style={{ height: height * 0.7 }} className="mx-2">
                  <CardHeader className="text-center h5 border-bottom text-black font-weight-bold">
                    Select One Specie
                  </CardHeader>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col" className="border-0 pl-4">
                          Specie Name
                        </th>
                        <th scope="col" className="border-0">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dna_lst.map((e, i) => {
                        const include = selected === e.file_name;
                        return (
                          <tr key={i} className="border-bottom">
                            <td className="pl-4">
                              {e.file_name.split("_").join(" ") +
                                " (" +
                                e.size +
                                "MB)"}
                            </td>
                            <td>
                              <Button
                                outline={!include}
                                onClick={() => {
                                  this.setState({ selected: e.file_name });
                                }}
                                style={{
                                  width: 100,
                                }}
                                theme={include ? "primary" : "secondary"}
                              >
                                {include ? "Selected" : "Select"}
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Card>
              </Col>
            </Row>

            {status === "SUCCESS" && error && (
              <Row className="d-flex justify-content-center m-2">
                <Alert theme="danger" style={{ borderRadius: 5 }}>
                  {error}
                </Alert>
              </Row>
            )}
            {status === "SUCCESS" && (
              <Row className="d-flex justify-content-center m-2">
                <Button
                  theme="info"
                  style={{ width: "60%", height: 50, fontSize: 20 }}
                  onClick={this.startProcess}
                >
                  {startState ? "Starting process" : "Visualize Tree"}
                </Button>
              </Row>
            )}
          </>
        )}
        {!data && status !== "SUCCESS" && (
          <Row
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: 500 }}
          >
            <Spinner name="ball-scale-multiple" color="white" />
            <label style={{ color: "white" }} className="ml-5 mb-0">
              {status === "PROGRESS"
                ? "Generating visualization"
                : "Loading..."}
            </label>
          </Row>
        )}
      </Container>
    );
  }
}

export default ModifyGraph;
