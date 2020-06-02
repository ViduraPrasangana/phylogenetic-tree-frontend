import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Card, Row, Button, Col, FormInput, FormRadio, Alert, CardHeader } from "shards-react";
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
      const { title, selected,method } = this.state;
      Axios.post(config.host_url + "cluster/matrix/generate/", {
        title,
        file_names: selected,
        type:method,
        is_default_user:false,
      })
        .then((res) => {
          this.setState({
            startState:false,
            error:null
          })
          this.props.history.push("/matrix/"+res.data.process.process_id)
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
              id="title"
              style={{ width: "80%" }}
              value={title}
            />
          </Col>
        </Row>
            <Row className="d-flex justify-content-center">
              <FormRadio
                checked={method === "LSH"}
                onClick={() => this.setState({ method: "LSH" })}
                id="lsh"
              >
                LHS method
              </FormRadio>
              <div style={{ width: 20 }} />
              <FormRadio
              id="kmer"
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
            id="start_btn"
          >
            {startState?"Starting process":"Generate Distance Matrix"}
          </Button>
        </Row>
        <Row className="justify-content-center pt-5 mx-4">
          <Col className="col-12 col-lg-7">
            <Card>
              <CardHeader className="text-center h5 border-bottom text-black font-weight-bold">
                My Species
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
                {myDnaS.map((e, i) => {
                  const include = selected.includes(e.file_name);
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
                          id={"select_"+i}
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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MyDNAs);
