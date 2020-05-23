import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Container,
  Card,
  Row,
  Button,
  Col,
  CardHeader,
  CardBody,
} from "shards-react";
import Axios from "axios";
import config from "../data/config";

class PastVis extends Component {
  state = {
    treeList: [],
    matrixList: [],
  };

  componentDidMount() {
    this.loadData();
  }
  loadData = () => {
    console.log(Axios.defaults.headers);
    Axios.get(config.host_url + "cluster/allProcesses/")
      .then((res) => {
        console.log(res.data);
        this.setState({
          matrixList: res.data.matrix_processes.reverse(),
          treeList: res.data.tree_processes.reverse(),
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    const { treeList, matrixList } = this.state;
    return (
      <Container
        fluid
        className="overflow-scroll pb-4 change-scroll"
        style={{ height: "100%" }}
      >
        <Row className="justify-content-center p-5 ">
          <Col className="col-12 col-lg-6">
            <Card>
              <CardHeader className="text-center h5 border-bottom text-black font-weight-bold">
                Matrices
              </CardHeader>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="border-0 text-center">
                      Title
                    </th>
                    <th scope="col" className="border-0 text-center">
                      Method
                    </th>
                    <th scope="col" className="border-0 text-center">
                      Status
                    </th>
                    <th scope="col" className="border-0 text-center">Open</th>
                  </tr>
                </thead>
                <tbody>
                  {matrixList.map((e, i) => {
                    return (
                      <tr key={i}>
                        <td className="pl-4 text-center">{e.title}</td>
                        <td className="pl-4 text-center">{e.type}</td>
                        <td className="pl-4 text-center">{e.status}</td>
                        <td className="pl-4 text-center">
                          <Button
                            onClick={() => {
                              this.props.history.push(
                                "/matrix/" + e.process_id
                              );
                            }}
                            theme={"primary"}
                          >
                            Open
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </Col>
          <Col className="col-12 col-lg-6">
            <Card>
              <CardHeader className="text-center h5 border-bottom text-black font-weight-bold">
                Tree Visualizations
              </CardHeader>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="border-0 text-center">
                      Title
                    </th>
                    <th scope="col" className="border-0 text-center">
                      Method
                    </th>
                    <th scope="col" className="border-0 text-center">
                      Status
                    </th>
                    <th scope="col" className="border-0 text-center">Open</th>
                    <th scope="col" className="border-0 text-center">
                      Add Specie
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {treeList.map((e, i) => {
                    return (
                      <tr key={i}>
                        <td className="pl-4 text-center">{e.title}</td>
                        <td className="pl-4 text-center">{e.method}</td>
                        <td className="pl-4 text-center">{e.status}</td>
                        <td className="pl-4 text-center">
                          <Button
                            onClick={() => {
                              this.props.history.push("/tree/" + e.process_id);
                            }}
                            theme={"primary"}
                          >
                            Open
                          </Button>
                        </td>
                        <td className="pl-4 text-center">
                          {e.method === "KMER" && (
                            <Button
                              onClick={() => {
                                this.props.history.push(
                                  "/modify-tree/" + e.process_id
                                );
                              }}
                              theme={"secondary"}
                            >
                              Add specie
                            </Button>
                          )}
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

export default connect(mapStateToProps, mapDispatchToProps)(PastVis);
