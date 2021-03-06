import React, { Fragment } from "react";
import { Group } from "@vx/group";
import NodeGroup from "react-move/NodeGroup";

import Node from "./Node";
import { findCollapsedParent, getTopLeft } from "./utils";

function Nodes({ nodes, layout, orientation, onNodeClick ,...props}) {
  nodes.map(node => {
    node.data.x0 = node.x;
    node.data.y0 = node.y;
  });
  return (
    <NodeGroup
      data={nodes}
      keyAccessor={d => d.data.name}
      start={node => {
        const parentTopLeft = getTopLeft(
          node.parent || { x: 0, y: 0 },
          layout,
          orientation
        );
        return {
          top: parentTopLeft.top,
          left: parentTopLeft.left,
          opacity: 0
        };
      }}
      enter={node => {
        const topLeft = getTopLeft(node, layout, orientation);
        return {
          top: [topLeft.top],
          left: [topLeft.left],
          opacity: [1]
        };
      }}
      update={node => {
        const topLeft = getTopLeft(node, layout, orientation);
        return {
          top: [topLeft.top],
          left: [topLeft.left],
          opacity: [1]
        };
      }}
      leave={node => {
        const collapsedParent = findCollapsedParent(node.parent);
        const collapsedParentPrevPos = {
          x: collapsedParent == null ? node.x : collapsedParent.data.x0,
          y: collapsedParent == null ? node.y : collapsedParent.data.y0
        };
        const topLeft = getTopLeft(collapsedParentPrevPos, layout, orientation);

        return {
          top: [topLeft.top],
          left: [topLeft.left],
          opacity: [0]
        };
      }}
    >
      {nodes => (
        <Group>
          {nodes.map(({ key, data: node, state }) => {
            const width = 40;
            const height = 20;
            {
              /* node.data.isExpanded = true */
            }
            {
              /* node.data.x0 = node.x;
            node.data.y0 = node.y; */
            }
            return (
              <Group
                top={state.top}
                left={state.left}
                key={key}
                opacity={state.opacity}
                
              >
                <Node
                  node={node}
                  layout={layout}
                  orientation={orientation}
                  onClick={() => {
                    // node.x= newPos.x;
                    // node.y = newPos.y
                    onNodeClick(node)
                    }}
                  key={key}
                  orientation={orientation}
                  {...props}
                />
              </Group>
            );
          })}
        </Group>
      )}
    </NodeGroup>
  );
}

export default Nodes;
