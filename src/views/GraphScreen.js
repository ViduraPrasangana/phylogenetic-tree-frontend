import React, { Component } from "react";
import { Container, Row } from "shards-react";
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
    status:null,
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
            data: addNamesToTree(res.data.tree, 1,1),
            process: res.data,
            result_id: res.data.result_id,
            status:res.data.status
          });
          console.log(res.data);
          setTimeout(() => this.loadTree(id), 10000);
        })
        .catch((error) => {
          console.log("thi is err", error.response);
          if (error.response && error.response.status === 400) {
            this.setState({
              status: "PROGRESS",
            });
            setTimeout(()=>this.loadTree(id),10000)
          }
        });
    } else {
      alert("Id should be number");
      this.props.history.push("/");
    }
  };
  render() {
    const { height, width, data,status,process } = this.state;
    return (
      <Container fluid className="text-center">
      {data && <Row className="justify-content-center">
        <h4 style={{color:"white"}}>Tree Visualization - {process.title}</h4>
      </Row>}
        {data && status === "SUCCESS" &&<Tree data={data} width={width * 0.9} height={height * 0.7} />}
        {!data || status !== "SUCCESS" && (
          <Row className="d-flex justify-content-center align-items-center" style={{minHeight:500}}>
          <Spinner name="ball-scale-multiple" color="white" />
            <label style={{ color: "white" }} className="ml-5 mb-0">
              {status === "PROGRESS" ? "Generating visualization" : "Loading..."}
            </label>
          </Row>
        )}
      </Container>
    );
  }
}

export default GraphScreen;
