import React, { Fragment } from 'react';

import {
  LinkHorizontal, LinkVertical, LinkRadial,
  LinkHorizontalStep, LinkVerticalStep, LinkRadialStep,
  LinkHorizontalCurve, LinkVerticalCurve, LinkRadialCurve,
  LinkHorizontalLine, LinkVerticalLine, LinkRadialLine
} from '@vx/shape';
import { LinkHorizontalElbow, LinkVerticalElbow } from './elbow';

function Link({ data, linkType, layout, orientation, stepPercent, ...props }) {
  let LinkComponent;

  if (layout === 'polar') {
    if (linkType === 'step') {
      LinkComponent = LinkRadialStep;
    } else if (linkType === 'curve') {
      LinkComponent = LinkRadialCurve
    } else if (linkType === 'line') {
      LinkComponent = LinkRadialLine
    } else {
      LinkComponent = LinkRadial
    }
  } else {
    if (orientation === 'vertical') {
      if (linkType === 'step') {
        LinkComponent = LinkVerticalStep;
      } else if (linkType === 'curve') {
        LinkComponent = LinkVerticalCurve
      } else if (linkType === 'line') {
        LinkComponent = LinkVerticalLine
      } else if (linkType === 'elbow') {
        LinkComponent = LinkVerticalElbow
      } else {
        LinkComponent = LinkVertical;
      }
    } else {
      if (linkType === 'step') {
        LinkComponent = LinkHorizontalStep;
      } else if (linkType === 'curve') {
        LinkComponent = LinkHorizontalCurve
      } else if (linkType === 'line') {
        LinkComponent = LinkHorizontalLine
      } else if (linkType === 'elbow') {
        LinkComponent = LinkHorizontalElbow
      } else {
        LinkComponent = LinkHorizontal;
      }
    }
  }
  // console.log(data)
  // const  tempData = {...data}
  // tempData.target.y =tempData.target.y-20 

  return (
    <LinkComponent
      data={data}
      percent={stepPercent}
      stroke="#374469"
      strokeWidth="1"
      fill="none"
      onClick={()=>console.log("CLicked")}
      {...props}
      
    />
  )
}

export default Link;