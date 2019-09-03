import React, { useState, useRef } from 'react';

const joystickStyle = {
  position: 'relative',
  bottom: '35px',
  width: '80px',
  height: '80px',
  background: 'rgba(126, 126, 126, 0.5)',
  // Do not set a border as it changes central points
  // border:'#444 solid medium', 
  borderRadius: '50%',
  left: '50%', 
  top: '0px',
  transform: 'translateX(-50%)',
};

const padStyle = {
  position: 'relative',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: '#fff',
};

const initialPosition = {top: 20, left: 20};
const initialOffset = {x: 0, y: 0};

const Joystick = ({ callback }) => {
  const padRef = useRef();
  // Pad position top and left
  const [position, setPosition] = useState(initialPosition);
  // Set when is tapped
  const [offset, setOffset] = useState(initialOffset);

  const getMousePosition = e => {
    e.preventDefault();
    let x = e.targetTouches ? e.targetTouches[0].pageX : e.clientX;
    let y = e.targetTouches ? e.targetTouches[0].pageY : e.clientY;
    return {x, y};
  }
  
  // Approximate offset when mouse enter the first time
  const handleMouseEnter = e => {
    if (offset.x === 0 && offset.y === 0) {
      const newOffset = getMousePosition(e);
      setOffset(newOffset);
    };
  }

  // Start when mouse down on the pad
  const handleMouseDown = e => {
    const newOffset = getMousePosition(e);
    setOffset(newOffset);
    captureMouseEvent();
  };

  // Start listening
  const captureMouseEvent = () => {
    if ('ontouchstart' in window) {
      document.addEventListener ('ontouchend', mouseupListener, true);
      document.addEventListener ('ontouchmove', mousemoveListener, true);
    } else {
      document.addEventListener ('mouseup', mouseupListener, true);
      document.addEventListener ('mousemove', mousemoveListener, true);
    }
  };

  // Clean up event listener after mouse up
  const mouseupListener = () => {
    if ('ontouchstart' in window) {
      document.removeEventListener ('ontouchend', mouseupListener, true);
      document.removeEventListener ('ontouchmove', mousemoveListener, true);
    } else {
      document.removeEventListener ('mouseup', mouseupListener, true);
      document.removeEventListener ('mousemove', mousemoveListener, true);
    };
    setPosition(initialPosition);
  };

  // Start when mouse move after mouse down on the pad
  // Stop after mouse up
  const mousemoveListener = e => {
    const mouse = getMousePosition(e);
    
    let left = mouse.x - offset.x;
    let top  = mouse.y - offset.y;

    const maxRadius = 40;
    const maxRadiusSquared = maxRadius * maxRadius;
    const sqMag = left * left + top * top;

    if (sqMag > maxRadiusSquared) {
      const magnitude = Math.sqrt(sqMag);
			left /= magnitude;
			top /= magnitude;
			left *= maxRadius;
			top *= maxRadius;
    };

    const padHeight = padRef.current.clientHeight;
    const padWidth = padRef.current.clientWidth;

    // forward : -1 to 1
    // turn    : -1 to 1
    const forward = -(top - initialPosition.top + padHeight / 2) / maxRadius;
    const turn = (left - initialPosition.left + padWidth / 2) / maxRadius;

    if (callback) callback({forward, turn});
    else console.log('Please define a callback handler for joystick');

    setPosition({
      top: top + padHeight / 2, 
      left: left + padWidth / 2
    });
  };
  
  return (
    <div 
      style={joystickStyle}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        ref={padRef}
        style={{
          ...padStyle,
          ...{top: position.top, left: position.left}
        }} />
    </div>
  )
};

export default Joystick;