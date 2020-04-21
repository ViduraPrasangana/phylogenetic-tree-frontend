import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Card, Row, Button, Col, FormInput, FormRadio, Alert } from "shards-react";
import Axios from "axios";
import config from "../data/config";

class MyDNAs extends Component {
  state = {
    myDnaS: [],
    selected: [],
    title: null,
    method:null,
    error:null,
    startState:false,
  };

  componentDidMount() {
    this.loadData();
  }
  loadData = () => {
    console.log(Axios.defaults.headers);
    Axios.get(config.host_url + "dnaStorage/getFiles/")
      .then((res) => {
        this.setState({
          myDnaS: res.data.dna_files,
        });
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  
  validate = () => {
    const { selected, title, method } = this.state;
    if (selected.length > 0 && title && title.length > 0 && method) {
      this.setState({
        error:null
      })
      return true;
    } else {
      this.setState({
        error:"Fill all sections"
      })
      return false;
    }
  };

  startProcess = () => {
    if (this.validate()) {
      this.setState({
        startState:true,
        error:null
      })
      const { title, selected } = this.state;
      Axios.post(config.host_url + "cluster/lsh/matrix/generate/", {
        title,
        file_names: selected,
      })
        .then((res) => {
          this.setState({
            startState:false,
            error:null
          })
          console.log(res);
        })
        .catch((err) => {
          this.setState({
            error:"Something went wrong",
            startState:false,
          })
          console.log(err.response);
          alert(err.response);
        });
    }
  };

  render() {
    const { myDnaS, selected,title,method,startState,error } = this.state;
    return (
      <Container fluid className="overflow-scroll pb-4 change-scroll" style={{ height: "100%" }}>
        <Row className="justify-content-center pt-4 pb-2 mx-4">
          <FormInput
            onChange={(e) =>
              this.setState({
                title: e.target.value,
              })
            }
            className="mr-4"
            placeholder="Title here"
            style={{ width: "20%" }}
            value={title}
          />
           <FormRadio
                checked={method === "LSH"}
                onClick={() => this.setState({ method: "LSH" })}
              >
                LHS method
              </FormRadio>
              <div style={{ width: 20 }} />
              <FormRadio
                checked={method === "K-MER"}
                onClick={() => this.setState({ method: "K-MER" })}
              >
                K-Mer method
              </FormRadio>
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
            {startState?"Starting process":"Generate Distance Matrix"}
          </Button>
        </Row>
        <Row className="justify-content-center pt-5">
          <Col className="col-9">
            <Card>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="border-0 pl-4">
                      Name
                    </th>
                    <th scope="col" className="border-0">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {myDnaS.map((e, i) => {
                    return (
                      <tr key={i}>
                        <td className="pl-4">{e.file_name}</td>
                        <td>
                          <Button
                            onClick={() => {
                              if (selected.includes(e.file_name))
                                selected.splice(
                                  selected.indexOf(e.file_name),
                                  1
                                );
                              else selected.push(e.file_name);
                              this.setState({ selected });
                            }}
                            theme={
                              selected.includes(e.file_name)
                                ? "primary"
                                : "secondary"
                            }
                          >
                            {selected.includes(e.file_name)
                              ? "Selected"
                              : "Select"}
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
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MyDNAs);
