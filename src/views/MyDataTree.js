import React, { Component } from "react";
import {
  Col,
  Card,
  CardHeader,
  Row,
  Container,
  Button,
  CardBody,
  FormInput,
  FormRadio,
  Alert,
  ButtonGroup,
  Tooltip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  FormSelect,
} from "shards-react";
import { halfTrans, fullTrans } from "../data/constants";
import { connect } from "react-redux";
import Axios from "axios";
import config from "../data/config";
import Tree from "../components/graph/Tree";
import { addNamesToTree } from "../data/constants";
import Spinner from "react-spinkit";


function isSquare(n) {
  for (var i = 0; i < n / 2 + 2; i++) {
    if (i * i == n) {
      return true;
    }
  }
  return false;
}

class MyDataTree extends Component {
  state = {
    error: null,
    method: "Matrix",
    startState: false,
    file: null,
    fileText: null,
    inputMode: "CSV",
    manual_species: [null, null, null],
    manual_showMatrix: false,
    manual_matrix: [],
    tooltipOpen: null,
    tree:null,
    width:null,
    height:null,
  };

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({
      width: window.innerWidth ,
      height: window.innerHeight,
    });
  };


  startProcess = () => {
    var i = this.state.fileText;
    console.log(i);
    if (this.validateCsv(i)) {
      this.setState({
        startState: true,
        error: null,
      });
      const { method } = this.state;
      var data = this.extractData();
      Axios.post(
        method === "Matrix"
          ? "http://phylogenetic-tree-api.herokuapp.com/api/get_tree_from_distance_matrix/"
          : "http://phylogenetic-tree-api.herokuapp.com/api/get_tree_from_similarities/",
        data
      )
        .then((res) => {
          this.setState({
            startState: false,
            error: null,
            tree:addNamesToTree(res.data.tree, 1, 1)
          });
          console.log(res.data);
        })
        .catch((err) => {
          this.setState({
            error: "Something went wrong",
            startState: false,
          });
          console.log(err.response);
        });
    }
  };
  startManualProcess = () => {
    const { manual_species, manual_matrix } = this.state;
    if (this.validateMatrix()) {
      var distance_matrix =[]
      manual_matrix.forEach(element => {
        distance_matrix.push(element.map(Number))
      });
      console.log({
        spieces:manual_species,
        distance_matrix
      })
      this.setState({
        startState: true,
        error: null,
      });
      Axios.post(
        "http://phylogenetic-tree-api.herokuapp.com/api/get_tree_from_distance_matrix/",
        {
          spieces:manual_species,
          distance_matrix
        }
      )
        .then((res) => {
          this.setState({
            startState: false,
            error: null,
            tree:addNamesToTree(res.data.tree, 1, 1)
          });

          console.log(res.data);
        })
        .catch((err) => {
          this.setState({
            error: "Something went wrong",
            startState: false,
          });
          console.log(err);
        });
    }else{
      this.setState({
        error:"Invalid matrix values"
      })
    }
  };
  validateMatrix = () => {
    const { manual_matrix } = this.state
    for(var i = 0;i<manual_matrix.length;i++){
      for(var j = 0;j<manual_matrix[i].length;j++){
         if(isNaN(manual_matrix[i][j])) return false
         if(parseFloat(manual_matrix[i][j])>1) return false
      }
    }
    return true
  };
  chooseFile = () => {
    this.file.click();
  };

  read = () => {
    const { file, fileText } = this.state;
    if (file && !fileText) {
      var fileReader = new FileReader();
      fileReader.onloadend = (e) => {
        if (this.validateCsv(fileReader.result.trim().split("\n"))) {
          this.setState({
            fileText: fileReader.result.trim().split("\n"),
          });
        }
      };
      fileReader.readAsText(this.state.file);
    }
  };

  extractData = () => {
    const { method, fileText } = this.state;
    if (fileText) {
      if (method === "Similarities") {
        return { similarities: fileText };
      } else if (method === "Matrix") {
        var spieces = [];
        var distance_matrix = [];
        fileText.forEach((element, i) => {
          var r = element.trim().split(",");
          if (i !== 0) {
            spieces.push(r.splice(0, 1));
            distance_matrix.push(r.map(Number));
          }
        });
        return { spieces, distance_matrix };
      }
    }
    return null;
  };
  validateCsv = (fileText) => {
    var state = true;
    var error = "";
    const { method } = this.state;
    if (fileText) {
      if (method === "Similarities") {
        if (!isSquare(8 * fileText.length + 1)) {
          state = false;
          error = "7";
        }
        fileText.forEach((element) => {
          var row = element.trim().split(",");
          if (row.length !== 3) {
            state = false;
            error = "6";
            return;
          }
          if (!isNaN(row[0])) {
            state = false;
            error = "1";
          }
          if (!isNaN(row[1])) {
            state = false;
            error = "2";
          }
          if (isNaN(row[2])) {
            state = false;
            error = "3";
          }
          if (row[0] === row[1]) {
            if (parseInt(row[2]) !== 1) {
              state = false;
              error = "4";
            }
          } else {
            if (parseFloat(row[2]) >= 1) {
              state = false;
              error = "5";
            }
          }
        });
      } else if (method === "Matrix") {
        fileText.forEach((element, index) => {
          var row = element.trim().split(",");
          if (index === 0) {
            row.forEach((ele, i) => {
              if (i !== 0) {
                if (!isNaN(ele)) {
                  state = false;
                  error = "8";
                }
              }
            });
          } else {
            if (!isNaN(row[0])) {
              state = false;
              error = "9";
            }
            row.forEach((ele, i) => {
              if (i !== 0) {
                if (isNaN(ele)) {
                  state = false;
                  error = "10";
                } else {
                  if (index === i) {
                    if (parseInt(ele) !== 1) {
                      state = false;
                      error = "11";
                    }
                  } else {
                    if (parseFloat(ele) >= 1) {
                      state = false;
                      error = "12";
                    }
                  }
                }
              }
            });
          }
        });
      }
      console.log(error);
      return state;
    }
    console.log(error);
    return false;
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
  handleManualSpecie = (e, i) => {
    const { manual_species } = this.state;
    manual_species[i] = e.target.value;
    this.setState({
      manual_species,
    });
  };
  render() {
    const {
      error,
      method,
      startState,
      file,
      fileText,
      inputMode,
      manual_species,
      manual_showMatrix,
      manual_matrix,
      width,
      tooltipOpen,
      tree,
      height
    } = this.state;

    this.read();
    const mxwdth = manual_species ? (width*0.5) / (manual_species.length * 2) : 0;
    return (
      <Container
        fluid
        className="overflow-scroll pb-4 change-scroll"
        style={{ height: "100%" }}
      >
      {startState &&
        <Row
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: 500 }}
            >
              <Spinner name="ball-scale-multiple" color="white" />
              <label style={{ color: "white" }} className="ml-5 mb-0">
                Generating visualization
                  
              </label>
            </Row>
      }
      { !tree && !startState &&  <Row className="my-3 d-flex justify-content-center">
          <ButtonGroup className="align-items-center" style={{ width: "60%" }}>
            <Button
              onClick={() =>
                this.setState({
                  inputMode: "Manually",
                  fileText: null,
                  file: null,
                  error: null,
                })
              }
              outline={inputMode !== "Manually"}
            >
              Manually Input
            </Button>
            <Button
              onClick={() =>
                this.setState({
                  inputMode: "CSV",
                  fileText: null,
                  file: null,
                  error: null,
                })
              }
              outline={inputMode !== "CSV"}
            >
              Input via CSV file
            </Button>
          </ButtonGroup>
        </Row>}
       
       {!tree &&  !startState &&<Row className="d-flex justify-content-center">
          {inputMode === "CSV" && (
            <Card className="p-2 mb-3 mt-3" style={{ width: "60%" }}>
              <Row className="mb-3  d-flex justify-content-center">
                <h5 className="mb-0 ">Choose CSV mode</h5>
              </Row>
              <Row className="d-flex justify-content-center">
                <FormRadio
                  checked={method === "Matrix"}
                  onClick={() =>
                    this.setState({
                      method: "Matrix",
                      fileText: null,
                      file: null,
                    })
                  }
                >
                  From Matrix CSV
                </FormRadio>
                <div style={{ width: 20 }} />
                <FormRadio
                  checked={method === "Similarities"}
                  onClick={() =>
                    this.setState({
                      method: "Similarities",
                      fileText: null,
                      file: null,
                    })
                  }
                >
                  From similarities CSV
                </FormRadio>
              </Row>
            </Card>
          )}

          {inputMode === "Manually" && !manual_showMatrix && (
            <>
              <Card className="p-2 mb-3 mt-3" style={{ width: "60%" }}>
                <Row className="mb-3  d-flex justify-content-center">
                  <Col className="d-flex justify-content-end align-content-center text-semibold">
                    <h5 className="mb-0 ">Number of Species</h5>
                  </Col>
                  <Col className="d-flex justify-content-start">
                  
                  <FormSelect >
                    
                  </FormSelect>
                    <FormInput
                      onChange={(e) => {
                        if (manual_species.length < e.target.value) {
                          for (
                            var i = manual_species.length;
                            i < Math.min(e.target.value, 10);
                            i++
                          ) {
                            manual_species.push(null);
                          }
                        } else {
                          for (
                            var i = manual_species.length;
                            i > Math.max(e.target.value, 3);
                            i--
                          ) {
                            manual_species.pop();
                          }
                        }

                        this.setState({
                          manual_species,
                        });
                      }}
                      id="title"
                      style={{ width: "80%" }}
                      value={manual_species.length}
                    />
                  </Col>
                </Row>
                {manual_species.map((ele, i) => {
                  return (
                    <Row className="d-flex justify-content-center mt-1">
                      <Col className="d-flex justify-content-end align-content-center text-semibold">
                        <h5 className="mb-0 ">Specie {i + 1}</h5>
                      </Col>
                      <Col className="d-flex justify-content-start">
                        <FormInput
                          onChange={(e) => this.handleManualSpecie(e, i)}
                          id={"specie_" + i}
                          style={{ width: "80%" }}
                          value={ele}
                        />
                      </Col>
                    </Row>
                  );
                })}
              </Card>
            </>
          )}
        </Row>}
        {inputMode === "Manually" && manual_showMatrix &&  !tree && !startState &&(
          <>
            <Row className="d-flex justify-content-center mt-3">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: mxwdth }}></th>
                    {manual_species.map((e, i) => {
                      var t = e.split("_").join(" ");
                      return (
                        <>
                          <th className="text-center" style={{ width: mxwdth }}>
                            <Card>
                              <CardBody id={"a" + i}>
                                {t.length > 15 ? t.substring(0, 10) + "..." : t}
                              </CardBody>
                            </Card>
                          </th>
                          <Tooltip
                            placement="bottom"
                            open={tooltipOpen === "a" + i}
                            target={"#" + "a" + i}
                            toggle={() => this.toggle("a" + i)}
                          >
                            <h6>{t}</h6>
                          </Tooltip>
                        </>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {manual_matrix.map((e, i) => {
                    var t = manual_species[i].split("_").join(" ");

                    return (
                      <tr className="text-center">
                        <th style={{ width: mxwdth }}>
                          <Card>
                            <CardBody
                              id={manual_species[i].replace(".", "") + "2"}
                            >
                              {t.length > 15 ? t.substring(0, 10) + "..." : t}
                            </CardBody>
                          </Card>
                        </th>
                        <Tooltip
                          placement="bottom"
                          open={
                            tooltipOpen ===
                            manual_species[i].replace(".", "") + "2"
                          }
                          target={
                            "#" + manual_species[i].replace(".", "") + "2"
                          }
                          toggle={() =>
                            this.toggle(
                              manual_species[i].replace(".", "") + "2"
                            )
                          }
                        >
                          <h6>{t}</h6>
                        </Tooltip>
                        {e.map((ele, index) => {
                          if (index <= i)
                            return (
                              <td style={{ width: mxwdth }}>
                                <Card>
                                  <CardBody>{ele}</CardBody>
                                </Card>
                              </td>
                            );
                          return (
                            <td style={{ width: mxwdth }}>
                              <Card>
                                <CardBody>
                                  <FormInput
                                    onChange={(e) => {
                                      // if (isNaN(e.target.value)) {
                                      //   manual_matrix[i][index] = 0;
                                      // } else
                                      if (parseFloat(e.target.value) >= 1) {
                                        manual_matrix[i][index] = 1;
                                        manual_matrix[index][i] = 1;
                                      } else if (
                                        parseFloat(e.target.value) < 0
                                      ) {
                                        manual_matrix[i][index] = 0;
                                        manual_matrix[index][i] = 0;
                                      } else {
                                        manual_matrix[i][index] =
                                          e.target.value;
                                          manual_matrix[index][i] =
                                          e.target.value;
                                      }
                                      this.setState({
                                        manual_matrix,
                                      });
                                    }}
                                    id={"matrix_" + i + "_" + index}
                                    style={{ width: 70 }}
                                    value={ele}
                                  />
                                </CardBody>
                              </Card>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Row>
          </>
        )}

        {error && (
          <Row className="d-flex justify-content-center mt-3">
            <Alert theme="danger" style={{ borderRadius: 5 }}>
              {error}
            </Alert>
          </Row>
        )}
        {inputMode === "Manually" && manual_showMatrix &&  !tree && !startState &&(
          <Row className="d-flex justify-content-center mt-3">
            <Button
              theme="info"
              style={{ width: "60%", height: 50, fontSize: 20 }}
              onClick={this.startManualProcess}
            >
              {startState ? "Starting process" : "Visualize the tree"}
            </Button>
          </Row>
        )}
        {inputMode === "Manually" && !manual_showMatrix &&  !tree && !startState &&(
          <Row className="d-flex justify-content-center">
            <Button
              theme="info"
              style={{ width: "60%", height: 50, fontSize: 20 }}
              onClick={() => {
                console.log(manual_species);
                if (
                  manual_species.includes(null) ||
                  manual_species.includes("")
                ) {
                  this.setState({
                    error: "Fill all fields",
                  });
                } else {
                  manual_species.forEach((ele, i) => {
                    var a = [];
                    manual_species.forEach((ele2, i2) => {
                      if (i !== i2) {
                        a.push(0);
                      } else {
                        a.push(1);
                      }
                    });
                    manual_matrix.push(a);
                  });
                  this.setState({
                    manual_showMatrix: true,
                    error: null,
                  });
                }
              }}
            >
              Next
            </Button>
          </Row>
        )}
        {tree && !startState &&<>
          <Tree data={tree} width={width * 0.9} height={height * 0.7} />
        </>}
        {inputMode === "CSV" &&  !tree && !startState &&(
          <>
          <Row className="d-flex justify-content-center mt-3">
         <Card>
         <CardHeader className="text-center">
           Sample {method} CSV
         </CardHeader>
        <CardBody>
        <img
              className=""
              src={require("../assets/images/sample-"+method+".JPG")}
              
            />
        </CardBody>
         </Card>
          </Row>
          <Row className="d-flex justify-content-center mt-3">
            <Button
              theme="info"
              style={{ width: "60%", height: 50, fontSize: 20 }}
              onClick={fileText ? this.startProcess : this.chooseFile}
            >
              {fileText
                ? startState
                  ? "Starting process"
                  : "Visualize the tree"
                : "Choose " + method + " CSV file"}
            </Button>
            <input
              type="file"
              ref={(r) => (this.file = r)}
              hidden
              onChange={(e) => {
                this.setState({
                  file: this.file.files[0],
                });
                console.log(this.file.files[0]);
              }}
              accept=".csv"
            />
          </Row>
          </>
        )}
        <Row className="justify-content-center pt-4 pb-2 mx-4"></Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.customerReducer,
  };
};

export default connect(mapStateToProps)(MyDataTree);
