import React from "react";
import { Group } from "@vx/group";
import { Tree } from "@vx/hierarchy";
import { LinearGradient } from "@vx/gradient";
import { hierarchy } from "d3-hierarchy";

// import Links from './Links';
import Links from "./LinksMove";

// import Nodes from './Nodes';
import Nodes from "./NodesMove";
import {
  FormSelect,
  Row,
  Col,
  FormInput,
  Slider,
  Button,
  FormRadio,
  FormCheckbox,
  Card,
  CardHeader,
  CardBody
} from "shards-react";
import {
  SketchPicker,
  PhotoshopPicker,
  CirclePicker,
  CompactPicker
} from "react-color";
import html2canvas from "html2canvas";
import ReactToPrint from "react-to-print";

function expandAll(tree) {
  if (tree.children) {
    tree.isExpanded = true;
    tree.children.forEach(element => {
      expandAll(element);
    });
  }
}
function triggerDownload(imgURI) {
  var evt = new MouseEvent("click", {
    view: window,
    bubbles: false,
    cancelable: true
  });

  var a = document.createElement("a");
  a.setAttribute("download", "MY_COOL_IMAGE.png");
  a.setAttribute("href", imgURI);
  a.setAttribute("target", "_blank");

  a.dispatchEvent(evt);
}
// Start file download.
export default class extends React.Component {
  state = {
    layout: "cartesian",
    orientation: "horizontal",
    linkType: "diagonal",
    stepPercent: 0.5,
    linkWidthPercentage: 0.8,
    linkHeightPercentage: 1,
    data: {},
    fontSize: 14,
    linkThick: 1,
    linkGap: 1,
    linkColor: null,
    backgroundColor: "#272b4d"
  };
  constructor(props) {
    super(props);
    this.data = props.data;
    expandAll(this.data);
  }

  update = () => {
    this.forceUpdate();
  };

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
      linkGap,
      linkColor,
      backgroundColor
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

    return (
      <div className="row justify-content-center">
        <svg width={width} height={height} ref={r => (this.canvas = r)}>
          <LinearGradient id="lg" from="#fd9b93" to="#fe6e9e" />
          <rect
            width={width}
            height={height}
            rx={14}
            fill={backgroundColor}
            onClick={e => {
              if (linkColor)
                this.setState({
                  backgroundColor: linkColor
                });
            }}
          />
          <Tree
            top={margin.top}
            left={margin.left}
            root={root}
            size={[sizeWidth, sizeHeight]}
            separation={(a, b) =>
              (a.parent == b.parent ? linkGap : 1) / a.depth
            }
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
                    color={linkColor}
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
                    linkColor={linkColor}
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
        <Card small style={{ width: width }} className="my-4">
          <CardHeader className="border-bottom">
            <h6 className="m-0">Tools for customize the visualization</h6>
          </CardHeader>
          <CardBody>
            <Row className="p-2 pl-4 pr-4">
              {/* <Col>
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
          </Col> */}
              <Col>
                <div>
                  <label>
                    <b>orientation</b>
                  </label>
                  <FormSelect
                    onChange={e =>
                      this.setState({ orientation: e.target.value })
                    }
                    value={orientation}
                    disabled={layout === "polar"}
                  >
                    <option value="vertical">vertical</option>
                    <option value="horizontal">horizontal</option>
                  </FormSelect>
                </div>
                <div className="my-3">
                  <label>
                    <b>Link width</b>
                  </label>
                  <Slider
                    theme="success"
                    className="my-1"
                    connect={[true, false]}
                    start={[linkWidthPercentage]}
                    range={{ min: 0, max: 1 }}
                    onSlide={e => {
                      this.setState({ linkWidthPercentage: parseFloat(e) });
                    }}
                    value={stepPercent}
                    disabled={layout === "polar"}
                  />
                </div>
              </Col>
              <Col>
                <div>
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
                  </FormSelect>
                </div>
                <div className="my-3">
                  <label>
                    <b>Link height</b>
                  </label>
                  <Slider
                    theme="success"
                    className="my-1"
                    connect={[true, false]}
                    start={[linkHeightPercentage]}
                    range={{ min: 0, max: 1 }}
                    onSlide={e => {
                      this.setState({ linkHeightPercentage: parseFloat(e) });
                    }}
                    value={stepPercent}
                    disabled={layout === "polar"}
                  />
                </div>
              </Col>

              <Col>
                <div className="mb-5">
                  <label>
                    <b>Step</b>
                  </label>
                  <Slider
                    theme={
                      linkType !== "step" || layout === "polar"
                        ? "secondary"
                        : "success"
                    }
                    className="my-1"
                    connect={[true, false]}
                    start={[stepPercent]}
                    range={{ min: 0, max: 1 }}
                    onSlide={e => {
                      this.setState({ stepPercent: parseFloat(e) });
                    }}
                    value={stepPercent}
                    disabled={linkType !== "step" || layout === "polar"}
                  />
                </div>
                <div className="my-3">
                  <label>
                    <b>Link Thick</b>
                  </label>
                  <Slider
                    theme="success"
                    className="my-1"
                    connect={[true, false]}
                    start={[linkThick]}
                    range={{ min: 0.1, max: 20 }}
                    onSlide={e => {
                      this.setState({ linkThick: parseFloat(e) });
                    }}
                    // value={stepPercent}
                    // disabled={layout === "polar"}
                  />
                </div>
              </Col>

              <Col>
                <div className="mb-5">
                  <label>
                    <b>Font Size</b>
                  </label>
                  <Slider
                    theme="success"
                    className="my-1"
                    connect={[true, false]}
                    start={[fontSize]}
                    range={{ min: 4, max: 30 }}
                    onSlide={e => {
                      this.setState({ fontSize: parseFloat(e) });
                    }}
                    value={stepPercent}
                    // disabled={layout === "polar"}
                  />
                </div>
                <div className="my-3">
                  <label>
                    <b>Link Gap</b>
                  </label>
                  <Slider
                    theme="success"
                    className="my-1"
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
                </div>
              </Col>
              <Col>
                <label>
                  <b>Link Color</b>
                </label>
                <Row className="justify-content-center p-3">
                  <FormCheckbox
                    toggle
                    small
                    onClick={e => {
                      if (linkColor) {
                        this.setState({
                          linkColor: null
                        });
                      } else {
                        this.setState({
                          linkColor: "#000000"
                        });
                      }
                    }}
                  >
                    Enable Coloring
                  </FormCheckbox>
                </Row>
                <CompactPicker
                  color={{ hex: linkColor }}
                  onChange={color => {
                    if (linkColor !== null)
                      this.setState({
                        linkColor: color.hex
                      });
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Button
                onClick={() => {
                  // html2canvas(this.canvas).then(canvas => {
                  //   const  img  = canvas.toDataURL("image/png");
                  //   var newData = img.replace(/^data:image\/png/, "data:application/octet-stream");
                  //   window.location = newData
                  //   console.log(newData)
                  // });
                  console.log(this.canvas)
                  var canvas = this.canvas;
                  var ctx = canvas.getContext("2d");
                  var data = new XMLSerializer().serializeToString(ctx);
                  var DOMURL = window.URL || window.webkitURL || window;

                  var img = new Image();
                  var svgBlob = new Blob([data], {
                    type: "image/svg+xml;charset=utf-8"
                  });
                  var url = DOMURL.createObjectURL(svgBlob);

                  img.onload = function() {
                    ctx.drawImage(img, 0, 0);
                    DOMURL.revokeObjectURL(url);

                    var imgURI = canvas
                      .toDataURL("image/png")
                      .replace("image/png", "image/octet-stream");

                    triggerDownload(imgURI);
                  };

                  img.src = url;
                }}
              >
                Download as PNG
              </Button>
              <ReactToPrint
                trigger={() => <Button onClick={() => {}}>Print ticket</Button>}
                content={() => this.canvas}
              />
            </Row>
          </CardBody>
        </Card>
      </div>
    );
  }
}
