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

function expandAll(tree) {
  if (tree.children) {
    tree.isExpanded = true;
    tree.children.forEach(element => {
      expandAll(element);
    });
  }
}

export default class extends React.Component {
  state = {
    layout: "cartesian",
    orientation: "horizontal",
    linkType: "diagonal",
    stepPercent: 0.5,
    linkWidthPercentage: 0.8,
    linkHeightPercentage: 1,
    data: {},
    fontSize:14,
    linkThick:1,
    linkGap:1,
  };
  constructor(props) {
    super(props);
    this.data = props.data;
    expandAll(this.data);
  }

  update = () => {
    this.forceUpdate();
  };

  // moveNode(newNode) {
  //   const { data } = this.state;
  //   data[newNode.data.name] = {x:newNode.data.x0, y:newNode.data.y0};
  //   this.setState({
  //     data
  //   })
  // }
  // getNodePos(links) {
  //   const { data } = this.state;
  //   links.forEach(element => {
  //     if(data[element.source.data.name]) {
  //       console.log(data[element.source.data.name].x,data[element.source.data.name].y)
  //     element.source.x = data[element.source.data.name].x
  //     element.source.y = data[element.source.data.name].y
  //     }
  //   });
  // }

  render() {
    setTimeout(() => {
      if (this.nodes) {
        this.nodes.onNodeClick();
      }
    }, 5000);
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
    const {
      layout,
      orientation,
      linkType,
      stepPercent,
      linkWidthPercentage,
      linkHeightPercentage,
      fontSize,
      linkThick,
      linkGap
    } = this.state;
    var data = this.data;
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
        sizeWidth = innerWidth * linkWidthPercentage;
        sizeHeight = innerHeight * linkHeightPercentage;
      } else {
        sizeWidth = innerHeight * linkHeightPercentage;
        sizeHeight = innerWidth * linkWidthPercentage;
      }
    }

    const root = hierarchy(data, d => {
      return d.isExpanded ? d.children : null;
    });
    // root.data.children[0].
    // root.each((node, i) => node.onClick = () => {
    //   console.log('clicked');
    // });
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
            <label>
              <b>orientation</b>
            </label>
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
            <label>
              <b>link</b>
            </label>
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
              theme={linkType !== "step" || layout === "polar" ? "secondary":"success"}
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
              disabled={layout === "polar"}
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
              disabled={layout === "polar"}
            />
          </Col>
          <Col>
            <label>
              <b>Font Size</b>
            </label>
            <Slider
              theme="success"
              className="my-4"
              connect={[true, false]}
              start={[fontSize]}
              range={{ min: 0, max: 40 }}
              onSlide={e => {
                this.setState({ fontSize: parseFloat(e) });
              }}
              value={stepPercent}
              // disabled={layout === "polar"}
            />
          </Col>
          <Col>
            <label>
              <b>Link Thick</b>
            </label>
            <Slider
              theme="success"
              className="my-4"
              connect={[true, false]}
              start={[linkThick]}
              range={{ min: 0.1, max: 20 }}
              onSlide={e => {
                this.setState({ linkThick: parseFloat(e) });
              }}
              // value={stepPercent}
              // disabled={layout === "polar"}
            />
          </Col>
          <Col>
            <label>
              <b>Link Gap</b>
            </label>
            <Slider
              theme="success"
              className="my-4"
              connect={[true, false]}
              start={[linkGap]}
              range={{ min: 0.01, max: 3 }}
              onSlide={e => {
                this.setState({ linkGap: parseFloat(e) });
              }}
              tooltips
              // value={stepPercent}
              // disabled={layout === "polar"}
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
            separation={(a, b) => (a.parent == b.parent ? linkGap : 1) / a.depth}
          >
            {({ data }) => {
              {
                /* if( data.links()[0])data.links()[0].target.x=6 */
              }
              return (
                <Group top={origin.y} left={origin.x}>
                
                  <Nodes
                    nodes={data.descendants()}
                    layout={layout}
                    orientation={orientation}
                    fontSize={fontSize}
                    ref={r => (this.nodes = r)}
                    onNodeClick={node => {
                      if (!node.data.isExpanded) {
                        node.data.x0 = node.x;
                        node.data.y0 = node.y;
                        
                      }
                      node.data.isExpanded = !node.data.isExpanded;
                      this.update();
                    }}
                  />
                 <Links
                    links={data.links()}
                    linkType={linkType}
                    layout={layout}
                    orientation={orientation}
                    stepPercent={stepPercent}
                    linkThick={linkThick}
                    fontSize={fontSize}
                  />
                </Group>
              );
            }}
          </Tree>
        </svg>
      </div>
    );
  }
}
