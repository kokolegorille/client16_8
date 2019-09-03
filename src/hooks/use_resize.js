import { useState, useLayoutEffect } from 'react';

// Pass a ref element
const useResize = ref => {
  const [size, setSize] = useState({width: 0, height: 0})

  const resize = () => setSize({
    width: ref.current.clientWidth, 
    height: ref.current.clientHeight
  });

  useLayoutEffect(() => {
    resize();
  }, []);

  useLayoutEffect(() => {
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    }
  }, []);

  return size;
};

export default useResize;