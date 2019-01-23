import React from 'react';
import ReactDOM from 'react-dom'
import throttle from 'lodash/throttle'
import { VALUES, SQUARE_SIZE } from '../constants'

const bgStyle = {
  height: '100vh',
  width: '100vw',
  position: 'absolute',
  top: 0,
  left: 0,
};

const bgRowStyle = { display: 'flex' };

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

class Background extends React.Component{
  constructor() {
    super();
    this.state = {
      cols: [0],
      rows: [0]
    };
    this.throttledSetBGScale = throttle(this.setBGScale, 500);
  }
  componentDidMount() {
    this.setBGScale();
    window.addEventListener('resize', () => this.throttledSetBGScale());
    window.addEventListener('load', () => this.setBGScale());
  }
  setBGScale() {
    const el = ReactDOM.findDOMNode(this);
    const bound = el.parentElement.getBoundingClientRect();
    this.setState({
      cols: Array(Math.ceil(bound.width / SQUARE_SIZE)).fill(0),
      rows: Array(Math.ceil(bound.height / SQUARE_SIZE)).fill(0)
    });
  }
  render() {
    const { rows, cols } = this.state;
    let alpha = VALUES.ALPHA.MID;
    let angle = VALUES.ANGLE.MID;
    let scale = VALUES.SCALE.MID;
    
    return (
      <div className="background" style={bgStyle}>
        {rows.map((item, rowNum) => {
          return (
            <div style={bgRowStyle} key={rowNum} >
              {cols.map((item, colNum) => {
                alpha = randomNudgeAlpha(alpha);
                angle = randomNudgeAngle(angle);
                scale = randomNudgeScale(scale);
                const backgroundColor = `rgba(155, 155, 155, ${alpha})`;
                const transform = `scale(${scale}, ${scale}) rotate(${angle}deg)`
                const style = {
                  width: SQUARE_SIZE,
                  height: SQUARE_SIZE,
                  backgroundColor,
                  transform
                }
                return (
                  <div key={rowNum + '_' + colNum} style={style} />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
};

export default Background;
