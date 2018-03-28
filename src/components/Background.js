import React from 'react';
import styled from 'styled-components'
import { VALUES, SQUARE_SIZE } from '../constants';

const BG = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
`

const BGRow = styled.div`
  display: flex;
`

function randomNudgeFactory(valueType) {
  const { MAX, MIN } = VALUES[valueType];
  const RANGE = MAX - MIN;
  const MID = MIN + RANGE / 2;
  VALUES[valueType].MID = MID;
  VALUES[valueType].RANGE = RANGE;
  return function(value) {
    if (value > MID) {
      value -= Math.random() * RANGE / 2;
    } else {
      value += Math.random() * RANGE / 2;
    }
    return Math.max(Math.min(value, MAX), MIN);
  }
}

const randomNudgeAlpha = randomNudgeFactory('ALPHA');
const randomNudgeAngle = randomNudgeFactory('ANGLE');
const randomNudgeScale = randomNudgeFactory('SCALE');

export default ({ rows, cols }) => {
  let alpha = VALUES.ALPHA.MID;
  let angle = VALUES.ANGLE.MID;
  let scale = VALUES.SCALE.MID;
  
  return (
    <BG>
      {rows.map((item, rowNum) => {
        return (
          <BGRow key={rowNum} style={{ height: SQUARE_SIZE }} >
            {cols.map(num => {
              alpha = randomNudgeAlpha(alpha);
              angle = randomNudgeAngle(angle);
              scale = randomNudgeScale(scale);
              const backgroundColor = `rgba(155, 155, 155, ${alpha})`;
              const transform = `scale(${scale}, ${scale}) rotate(${angle}deg)`
              return (
                <div style={{ width: SQUARE_SIZE, backgroundColor, transform }} />
              );
            })}
          </BGRow>
        );
      })}
    </BG>
  );
}