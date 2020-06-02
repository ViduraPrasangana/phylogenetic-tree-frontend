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
  FormInput,
} from "shards-react";
import Axios from "axios";
import config from "../data/config";

class PastVis extends Component {
  state = {
    treeList: [],
    matrixList: [],
    width: 0, height: 0,
    searchMatrix:null,
    searchTree:null,
  };

  componentDidMount() {
        this.loadData();
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }


  componentWillUnmount=()=> {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions=()=> {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
      small: window.innerWidth < 992,
    });
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
    const { treeList, matrixList,width,height,searchMatrix,searchTree } = this.state;
    return (
      <Container
        fluid
        className="overflow-scroll pb-4 change-scroll"
        
      >
        <Row className="justify-content-center p-5 ">
          <Col className="col-12 col-lg-6">
            <Card style={{height:height*0.8}}>
              <CardHeader className="border-bottom text-black font-weight-bold">
              <Row className="justify-content-between pr-3">
                Matrices
                <FormInput
              onChange={(e) =>
                this.setState({
                  searchMatrix: e.target.value,
                })
              }
              id="search_matrix"
              placeholder="Search here"
              style={{ width: "30%", }}
              value={searchMatrix}
            />
            </Row>
              </CardHeader>
              <table className="table table-responsive  change-scroll"  >
                <thead>
                  <tr>
                    <th scope="col" style={{width:"100%"}} className="border-0 text-center">
                      Title
                    </th>
                    <th scope="col" className="border-0 text-center">
                      Method
                    </th>
                    <th scope="col" className="border-0 text-center">
                      Status
                    </th>
                    <th scope="col" className="border-0 text-center pr-4">Open</th>
                  </tr>
                </thead>
                <tbody >
                  {matrixList.map((e, i) => {
                    if(searchMatrix!==null && !e.title.toLowerCase().includes(searchMatrix)) return
                    return (
                      <tr key={i}>
                        <td className="pl-4 text-center">{e.title}</td>
                        <td className="pl-4 text-center">{e.type}</td>
                        <td className="pl-4 text-center">{e.status}</td>
                        <td className="pl-4 text-center pr-4">
                          <Button
                            onClick={() => {
                              this.props.history.push(
                                "/matrix/" + e.process_id
                              );
                            }}
                            theme={"primary"}
                            id={"open_"+i}
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
            <Card style={{height:height*0.8}}>
              <CardHeader className="border-bottom text-black font-weight-bold">
                
                <Row className="justify-content-between pr-3">
                Tree Visualizations
                <FormInput
              onChange={(e) =>
                this.setState({
                  searchTree: e.target.value,
                })
                
              }
              id="search_tree"
              placeholder="Search here"
              style={{ width: "30%", }}
              value={searchTree}
            />
            </Row>
              </CardHeader>
              <table className="table table-responsive  change-scroll" >
                <thead>
                  <tr>
                    <th scope="col" className="border-0 text-center" style={{width:"100%"}}>
                      Title
                    </th>
                    <th scope="col" className="border-0 text-center">
                      Method
                    </th>
                    <th scope="col" className="border-0 text-center">
                      Status
                    </th>
                    <th scope="col" className="border-0 text-center  pr-4">Open</th>
                    {/* <th scope="col" className="border-0 text-center">
                      Add Specie
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {treeList.map((e, i) => {
                    if(searchTree!==null && !e.title.toLowerCase().includes(searchTree)) return
                    return (
                      <tr key={i}>
                        <td className="pl-4 text-center">{e.title}</td>
                        <td className="pl-4 text-center">{e.method}</td>
                        <td className="pl-4 text-center">{e.status}</td>
                        <td className="pl-4 text-center pr-4">
                          <Button
                            onClick={() => {
                              this.props.history.push("/tree/" + e.process_id);
                            }}
                            theme={"primary"}
                            id={"open_tree_"+i}
                          >
                            Open
                          </Button>
                        </td>
                        {/* <td className="pl-4 text-center">
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
                        </td> */}
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
