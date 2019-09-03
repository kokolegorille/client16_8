import { useState, useEffect } from 'react';

const useMousePosition = () => {
  const [position, setPosition] = useState({x: 0, y: 0});
  
  useEffect(() => {
    const handleMouse = e => {
      e.preventDt();
      setPosition({x: e.pageX, y: e.pageY})
    };
    document.addEventListener('mousemove', handleMouse);
    return () => document.removeEventListener('mousemove', handleMouse);
  });

  return position;
};

export default useMousePosition;