import React, { Component } from "react";
import { Container } from "shards-react";
import Tree from "../components/graph/Tree";
import data from '../data/data';

class GraphScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0 };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }
  render() {
    const {height,width} = this.state
    return <Container fluid className="text-center">
        <Tree data={data} width={width*0.8} height={height*0.7} />
    </Container>;
  }
}

export default GraphScreen;
