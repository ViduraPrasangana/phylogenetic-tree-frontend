import React, { Component } from "react";
import {
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "shards-react";
import Tree from "../components/graph/Tree";
import data from "../data/data";
import config from "../data/config";
import Axios from "axios";
import { addNamesToTree } from "../data/constants";
import Spinner from "react-spinkit";

class GraphScreen extends Component {
  state = {
    data: null,
    process: null,
    status: null,
    modelOpen: false,
    selected:null,
    method:null,
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
    this.setState({ width: window.innerWidth, height: window.innerHeight });
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
            method:res.data.method,
          });
          if (res.data.status === "PROGRESS") {
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

  toggle = () => {
    if (!this.state.modelOpen) {
    }
    this.setState({
      modelOpen: !this.state.modelOpen,
    });
  };
  startModifyProcess = () => {
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
          this.setState({ selected: null,modelOpen:false });
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
      modelOpen,
      dna_lst,
      selected,
      method,
    } = this.state;
    return (
      <Container fluid className="text-center">
        <Modal open={modelOpen} toggle={this.toggle}>
          <ModalHeader closeAriaLabel="Cancel">
            {/* <Row className="justify-content-between" style={{width:"200%"}}> */}
            Select a specie
            {/* <Button>Modify</Button> */}
            {/* </Row> */}
          </ModalHeader>
          <ModalBody className="px-0">
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
                {dna_lst && dna_lst.map((e, i) => {
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

            <Row className="justify-content-end pr-5"> <Button style={{width:150}} onClick={this.startModifyProcess}>Modify</Button></Row>
          </ModalBody>
        </Modal>
        {data && (
          <Row className="justify-content-center p-3 d-flex align-content-center">
            <h4 style={{ color: "white" }}>
              Tree Visualization - {process.title}
            </h4>
            {
              method==="KMER" && 
              <Button
              className="ml-3"
              style={{ width: 200 }}
              onClick={this.toggle}
            >
              Add Specie
            </Button>
            }
          </Row>
        )}
        {data && status === "SUCCESS" && (
          <Tree data={data} width={width * 0.9} height={height * 0.7} />
        )}
        {!data ||
          (status !== "SUCCESS" && (
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
          ))}
      </Container>
    );
  }
}

export default GraphScreen;
