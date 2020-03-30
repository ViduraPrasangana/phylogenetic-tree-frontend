import React, { Fragment } from "react";
import { Group } from "@vx/group";
import { Drag } from "@vx/drag";
var textWidth = 10;

function Node({ node, onClick, orientation, fontSize }) {
  var width = 40;
  const height = 20;
  const fontShownText =
    orientation === "horizontal"
      ? node.data.name
      : node.data.name.length < 10
      ? node.data.name
      : node.data.name.substring(0,8) + "...";
  const fontShownTextLength =
    orientation === "horizontal"
      ? node.data.name
      : node.data.name.length < 10
      ? node.data.name
      : node.data.name.substring(0,8) + "...";
  const calcWidth = Math.max((fontShownText.length * fontSize) / 1.8, width);
  const calcHeight = Math.max(fontSize * 1.5, height);
  return (
    <Drag
      // key={`${d.id}`}
      width={width}
      height={height}
      onDragStart={() => {
        // svg follows the painter model
        // so we need to move the data item
        // to end of the array for it to be drawn
        // "on top of" the other data items
        // this.setState((state, props) => {
        //   return {
        //     items: raise(state.items, i),
        //   };
        // });
      }}
    >
      {({ dragStart, dragEnd, dragMove, isDragging, dx, dy }) => {
        node.x = node.x + (orientation === "vertical" ? dx : dy);
        node.y = node.y + (orientation === "vertical" ? dy : dx);
        return (
          <Fragment>
            {(node.depth === 0 || node.data.children) && (
              <circle
                r={fontSize * 0.7}
                fill="url('#lg')"
                onClick={onClick}
                onMouseMove={e => dragMove(e)}
                transform={`translate(${dx}, ${dy})`}
                onMouseUp={e => dragEnd(e)}
                onMouseDown={e => dragStart(e)}
                onTouchStart={dragStart}
                onTouchMove={dragMove}
                onTouchEnd={dragEnd}
              />
            )}
            {node.depth !== 0 && !node.data.children && (
              <rect
                height={calcHeight}
                width={calcWidth}
                y={-calcHeight / 2}
                x={-width / 2}
                fill={"#272b4d"}
                transform={`translate(${dx}, ${dy})`}
                stroke={node.data.children ? "#03c0dc" : "#26deb0"}
                strokeWidth={1}
                strokeDasharray={!node.data.children ? "2,2" : "0"}
                strokeOpacity={!node.data.children ? 0.6 : 1}
                rx={!node.data.children ? 10 : 0}
                onClick={onClick}
                onMouseMove={dragMove}
                onMouseUp={e => dragEnd(e)}
                onMouseDown={dragStart}
                onTouchStart={dragStart}
                onTouchMove={dragMove}
                onTouchEnd={dragEnd}
              />
            )}
            <text
              dy={".33em"}
              fontSize={fontSize}
              fontFamily="Arial"
              textAnchor={"middle"}
              style={{ pointerEvents: "none", userSelect: "none" }}
              x={calcWidth / 2 - width / 2}
              fill={node.children ? "white" : "#26deb0"}
              transform={`translate(${dx}, ${dy})`}
              onMouseMove={dragMove}
              onMouseUp={dragEnd}
              onMouseDown={dragStart}
              onTouchStart={dragStart}
              onTouchMove={dragMove}
              onTouchEnd={dragEnd}
            >
              {fontShownText}
            </text>
          </Fragment>
        );
      }}
    </Drag>
  );
}

export default Node;
