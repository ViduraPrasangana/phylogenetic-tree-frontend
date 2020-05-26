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
} from "shards-react";
import { halfTrans, fullTrans } from "../data/constants";
import { connect } from "react-redux";
import Axios from "axios";
import config from "../data/config";

class Samples extends Component {
  state = {
    allSamples: [],
    selected: [],
    title: null,
    error: null,
    method: null,
    startState: false,
    search:null,
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

  validate = () => {
    const { selected, title, method } = this.state;
    if (selected.length > 0 && title && title.length > 0 && method) {
      this.setState({
        error: null,
      });
      return true;
    } else {
      this.setState({
        error: "Fill all sections",
      });
      return false;
    }
  };

  startProcess = () => {
    if (this.validate()) {
      this.setState({
        startState: true,
        error: null,
      });
      const { title, selected, method } = this.state;
      Axios.post(config.host_url + "cluster/matrix/generate/", {
        title,
        file_names: selected,
        is_default_user: true,
        type: method,
      })
        .then((res) => {
          this.setState({
            startState: false,
            error: null,
          });
          this.props.history.push("/matrix/" + res.data.process.process_id);
          console.log(res);
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

  render() {
    const {
      allSamples,
      selected,
      title,
      error,
      method,
      startState,
      search,
    } = this.state;

    return (
      <Container
        fluid
        className="overflow-scroll pb-4 change-scroll"
        style={{ height: "100%" }}
      >
       
        <Row className="d-flex justify-content-center">
          <Card className="p-2 mb-3" style={{ width: "60%" }}>
          <Row
          className="mb-3 pt-3 d-flex justify-content-center"
        >
          <Col className="d-flex justify-content-end align-content-center text-semibold">
            <h5 className="mb-0 ">
            Title for Process
            </h5>
          </Col>
          <Col className="d-flex justify-content-start">
            <FormInput
              onChange={(e) =>
                this.setState({
                  title: e.target.value,
                })
              }
              style={{ width: "80%" }}
              value={title}
            />
          </Col>
        </Row>
            <Row className="d-flex justify-content-center">
              <FormRadio
                checked={method === "LSH"}
                onClick={() => this.setState({ method: "LSH" })}
              >
                LHS method
              </FormRadio>
              <div style={{ width: 20 }} />
              <FormRadio
                checked={method === "KMER"}
                onClick={() => this.setState({ method: "KMER" })}
              >
                K-Mer method
              </FormRadio>
            </Row>
          </Card>
        </Row>

        {error && (
          <Row className="d-flex justify-content-center">
            <Alert theme="danger" style={{ borderRadius: 5 }}>
              {error}
            </Alert>
          </Row>
        )}
        <Row className="d-flex justify-content-center">
          <Button
            theme="info"
            style={{ width: "60%", height: 50, fontSize: 20 }}
            onClick={this.startProcess}
          >
            {startState ? "Starting process" : "Generate Distance Matrix"}
          </Button>
        </Row>
        <Row className="justify-content-center pt-4 pb-2 mx-4">
          <Col className="col-12 col-lg-7">
            <Card>
              <CardHeader className="border-bottom text-black font-weight-bold ">
               <Row className="justify-content-between pr-3">
               Our samples
                <FormInput
              onChange={(e) =>
                this.setState({
                  search: e.target.value,
                })
              }
              placeholder="Search here"
              style={{ width: "30%", }}
              value={search}
            />
               </Row>
              </CardHeader>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col" className="border-0 text-center">
                      Name
                    </th>
                    <th scope="col" className="border-0 text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                {allSamples.map((e, i) => {
                  const include = selected.includes(e.file_name);
                  if(search!==null && !e.file_name.toLowerCase().includes(search)) return
                  return (
                    <tr key={i}>
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
                            if (include)
                              selected.splice(selected.indexOf(e.file_name), 1);
                            else selected.push(e.file_name);
                            this.setState({ selected });
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
              </table>
            </Card>
          </Col>
          <Col className="col-12 col-lg-5">
            <Card>
              <CardHeader className="text-center h5 border-bottom text-black font-weight-bold">
                Selected
              </CardHeader>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="border-0 text-center">
                      Name
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selected.map((e, i) => {
                    const include = selected.includes(e.file_name);
                    return (
                      <tr key={i}>
                        <td className="pl-4">{e}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.customerReducer,
  };
};

export default connect(mapStateToProps)(Samples);
