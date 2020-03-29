import React from "react";
import { Group } from "@vx/group";
import { Tree } from "@vx/hierarchy";
import { LinearGradient } from "@vx/gradient";
import { hierarchy } from "d3-hierarchy";

// import Links from './Links';
import Links from "./LinksMove";

// import Nodes from './Nodes';
import Nodes from "./NodesMove";
import { FormSelect, Row, Col, FormInput, Slider } from "shards-react";

function expandAll(tree){
    if(tree.children){
      tree.isExpanded=true
      tree.children.forEach(element => {
        expandAll(element)
      });
    }
}

export default class extends React.Component {
  state = {
    layout: "cartesian",
    orientation: "horizontal",
    linkType: "diagonal",
    stepPercent: 0.5,
    linkWidthPercentage:0.8,
    linkHeightPercentage:1

  };
  constructor(props){
    super(props)
    this.data = props.data
    expandAll(this.data);
  }

  render() {
    setTimeout(()=>{
      if(this.nodes){
        this.nodes.onNodeClick()
        }
    },5000)
    const {
      width,
      height,
      events = false,
      margin = {
        top: 30,
        left: 30,
        right: 30,
        bottom: 30
      }
    } = this.props;
    const { layout, orientation, linkType, stepPercent,linkWidthPercentage,linkHeightPercentage } = this.state;
    var data = this.data
    if (width < 10) return null;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    let origin;
    let sizeWidth;
    let sizeHeight;

    if (layout === "polar") {
      origin = {
        x: innerWidth / 2,
        y: innerHeight / 2
      };
      sizeWidth = 2 * Math.PI;
      sizeHeight = Math.min(innerWidth, innerHeight) / 2;
    } else {
      origin = { x: 0, y: 0 };
      if (orientation === "vertical") {
        sizeWidth = innerWidth*linkWidthPercentage;
        sizeHeight = innerHeight*linkHeightPercentage;
      } else {
        sizeWidth = innerHeight*linkHeightPercentage;
        sizeHeight = innerWidth*linkWidthPercentage;
      }
    }

    const root = hierarchy(data, d => {
    
      return(d.isExpanded ? d.children : null)
    });
    // root.data.children[0].
    // root.each((node, i) => node.onClick = () => {
    //   console.log('clicked');
    // });
    console.log("Root ",root)
    return (
      <div>
        <Row className="p-2 pl-4 pr-4">
          <Col>
            <label>
              <b>Layout</b>
            </label>
            <FormSelect
              onChange={e => this.setState({ layout: e.target.value })}
              value={layout}
            >
              <option value="cartesian">cartesian</option>
              <option value="polar">polar</option>
            </FormSelect>
          </Col>
          <Col>
            <label><b>orientation</b></label>
            <FormSelect
              onChange={e => this.setState({ orientation: e.target.value })}
              value={orientation}
              disabled={layout === "polar"}
            >
              <option value="vertical">vertical</option>
              <option value="horizontal">horizontal</option>
            </FormSelect>
          </Col>
          <Col>
            <label><b>link</b></label>
            <FormSelect
              onChange={e => this.setState({ linkType: e.target.value })}
              value={linkType}
            >
              <option value="diagonal">diagonal</option>
              <option value="step">step</option>
              <option value="curve">curve</option>
              <option value="line">line</option>
              <option value="elbow">elbow</option>
            </FormSelect>
          </Col>

          <Col>
            <label>
              <b>Step</b>
            </label>
            <Slider
              theme="success"
              className="my-4"
              connect={[true, false]}
              start={[stepPercent]}
              range={{ min: 0, max: 1 }}
              onSlide={e => {
                this.setState({ stepPercent: parseFloat(e) });
              }}
              value={stepPercent}
              disabled={linkType !== "step" || layout === "polar"}
            />
          </Col>
          <Col>
            <label>
              <b>Link width</b>
            </label>
            <Slider
              theme="success"
              className="my-4"
              connect={[true, false]}
              start={[linkWidthPercentage]}
              range={{ min: 0, max: 1 }}
              onSlide={e => {
                this.setState({ linkWidthPercentage: parseFloat(e) });
              }}
              
              value={stepPercent}
              disabled={ layout === "polar"}
            />
          </Col>
          <Col>
            <label>
              <b>Link height</b>
            </label>
            <Slider
              theme="success"
              className="my-4"
              connect={[true, false]}
              start={[linkHeightPercentage]}
              range={{ min: 0, max: 1 }}
              onSlide={e => {
                this.setState({ linkHeightPercentage: parseFloat(e) });
              }}
              value={stepPercent}
              disabled={ layout === "polar"}
            />
          </Col>
        </Row>

        <svg width={width} height={height}>
          <LinearGradient id="lg" from="#fd9b93" to="#fe6e9e" />
          <rect width={width} height={height} rx={14} fill="#272b4d" />
          <Tree
            top={margin.top}
            left={margin.left}
            root={root}
            size={[sizeWidth, sizeHeight]}
            separation={(a, b) => (a.parent == b.parent ? 1 : 0.5) / a.depth}
          >
            {({ data }) => (
              <Group top={origin.y} left={origin.x}>
              {/* {console.log(data.links())} */}
                <Links
                  links={data.links()}
                  linkType={linkType}
                  layout={layout}
                  orientation={orientation}
                  stepPercent={stepPercent}
                />

                <Nodes
                  nodes={data.descendants()}
                  layout={layout}
                  orientation={orientation}
                  ref={r => this.nodes = r}
                  onNodeClick={node => {
                    if (!node.data.isExpanded) {
                      node.data.x0 = node.x;
                      node.data.y0 = node.y;
                    }
                    node.data.isExpanded = !node.data.isExpanded;
                    this.forceUpdate();
                  }}
                />
              </Group>
            )}
          </Tree>
        </svg>
      </div>
    );
  }
}
