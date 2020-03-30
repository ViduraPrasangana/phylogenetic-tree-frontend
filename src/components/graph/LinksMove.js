import React, { Fragment } from "react";
import { Group } from "@vx/group";
import { NodeGroup } from "react-move";

import Link from "./Link";
import { findCollapsedParent } from "./utils";

function Links({
  links,
  linkType,
  layout,
  orientation,
  stepPercent,
  linkThick,
  fontSize
}) {
  const parentGap = fontSize*0.7;
  return (
    <NodeGroup
      data={links}
      keyAccessor={(d, i) => `${d.source.data.name}_${d.target.data.name}`}
      start={({ source, target }) => {
        return {
          source: {
            x: source.data.x0 == null ? source.x : source.data.x0,
            y: source.data.y0 == null ? source.y : source.data.y0
          },
          target: {
            x: source.data.x0 == null ? source.x : source.data.x0,
            y: source.data.y0 == null ? source.y : source.data.y0
          }
        };
      }}
      enter={({ source, target }) => {
        const gap = target.data.children ? parentGap : 20;
        return {
          source: {
            x: [source.x],
            y: [source.y + parentGap]
          },
          target: {
            x: [target.x],
            y: [target.y - gap]
          }
        };
      }}
      update={({ source, target }) => {
        const gap = target.data.children ? parentGap : 20;
        return {
          source: {
            x: [source.x],
            y: [source.y + parentGap]
          },
          target: {
            x: [target.x],
            y: [target.y - gap]
          }
        };
      }}
      leave={({ source, target }) => {
        const collapsedParent = findCollapsedParent(source);
        return {
          source: {
            x: [collapsedParent.data.x0],
            y: [collapsedParent.data.y0 + 20]
          },
          target: {
            x: [collapsedParent.data.x0],
            y: [collapsedParent.data.y0 - 20]
          }
        };
      }}
    >
      {nodes => (
        <Group>
          {nodes.map(({ key, data, state }) => {
            return (
              <Link
                data={state}
                linkType={linkType}
                layout={layout}
                orientation={orientation}
                stepPercent={stepPercent}
                stroke="#374469"
                strokeWidth={linkThick}
                fill="none"
                key={key}
              />
            );
          })}
        </Group>
      )}
    </NodeGroup>
  );
}

export default Links;
