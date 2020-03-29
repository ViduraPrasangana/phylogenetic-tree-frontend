import React, { Fragment } from "react";
import { Group } from "@vx/group";
var textWidth = 10;

function Node({ node, onClick }) {
  var width = 40;
  const height = 20;
  const calcWidth = Math.max(node.data.name.length * 7, width)
  return (
    <Fragment>
      {node.depth === 0 && (
        <circle r={12} fill="url('#lg')" onClick={onClick} />
      )}
      {node.depth !== 0 && (
        <rect
          height={height}
          width={calcWidth}
          y={-height / 2}
          x={-width / 2}
          fill={"#272b4d"}
          stroke={node.data.children ? "#03c0dc" : "#26deb0"}
          strokeWidth={1}
          strokeDasharray={!node.data.children ? "2,2" : "0"}
          strokeOpacity={!node.data.children ? 0.6 : 1}
          rx={!node.data.children ? 10 : 0}
          onClick={onClick}
        ></rect>
      )}
      <text
        dy={".33em"}
        fontSize={14}
        fontFamily="Arial"
        textAnchor={"middle"}
        style={{ pointerEvents: "none" }}
        x={calcWidth/2 - width / 2}
        fill={
          node.depth === 0 ? "#71248e" : node.children ? "white" : "#26deb0"
        }
      >
        {node.data.name}
      </text>
    </Fragment>
  );
}

export default Node;
