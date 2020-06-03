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
} from "shards-react";
import { halfTrans, fullTrans } from "../data/constants";
import { connect } from "react-redux";
import Axios from "axios";
import config from "../data/config";

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
    inputMode: null,
  };

  componentDidMount() {
    this.getSamples();
  }
  getSamples = () => {
    Axios.get(config.host_url + "dnaStorage/getDefaultFiles/")
      .then((res) => {
        this.setState({
          allSamples: res.data.dna_files,
        });
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
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
  render() {
    const { error, method, startState, file, fileText, inputMode } = this.state;

    this.read();
    return (
      <Container
        fluid
        className="overflow-scroll pb-4 change-scroll"
        style={{ height: "100%" }}
      >
        <Row className="mt-3 d-flex justify-content-center">
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
        </Row>
        <Row className="d-flex justify-content-center">
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
        </Row>

        {error && (
          <Row className="d-flex justify-content-center">
            <Alert theme="danger" style={{ borderRadius: 5 }}>
              {error}
            </Alert>
          </Row>
        )}
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
