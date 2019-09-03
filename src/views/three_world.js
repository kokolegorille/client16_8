import React, { useRef, useEffect } from 'react';
import * as THREE from "three";

import useResize from '../hooks/use_resize';
import useThreeReducer from '../hooks/use_three_reducer';
import Stats from '../libs/stats.min';

const ThreeWorld = () => {
  const ref = useRef();
  const size = useResize(ref);
  const [state, actions] = useThreeReducer();
  
  // Destructure state
  const { width, height } = size;
  const { renderer, scene, camera, meshes, isInitialized } = state;

  // This will points to window.requestAnimationFrame
  let frameId = null;

  // Stats
  let stats = null;

  const randomPosition = () => {
    const min = 0;
    const max = 50;
    return {
      x: Math.floor(Math.random() * (+max - +min)) + +min,
      y: Math.floor(Math.random() * (+max - +min)) + +min,
      z: Math.floor(Math.random() * (+max - +min)) + +min,
    }
  };

  const randomColor = () => '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);

  const handleAddMesh = () => {
    const position = randomPosition();
    const color = randomColor();
    const newMesh = { position, color };

    actions.addMesh(newMesh);
  };

  // https://threejs.org/docs/index.html#api/en/core/Raycaster
  const handleMouseDown = event => {
    event.preventDefault();

    // calculate mouse position in normalized device coordinates
		// (-1 to +1) for both components
    const mouse = new THREE.Vector2();
    
    // https://stackoverflow.com/questions/13542175/three-js-ray-intersect-fails-by-adding-div/13544277#13544277
    // If You do not use full screen, You must take canvas offset in consideration!

    mouse.x = ((event.clientX - renderer.domElement.offsetLeft) / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - ((event.clientY - renderer.domElement.offsetTop) / renderer.domElement.clientHeight) * 2 + 1;

    // mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    // mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

    // Raycaster
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObjects(scene.children);

    // It is not so easy to get intersects right at first 
    // You can try with a very close object to start with
    // This has to do with offset

    if (intersects.length > 0) {
      const firstObject = intersects[0].object
      console.log(`Intersects w/ ${intersects.length} objects, first UUID : ${firstObject.geometry.uuid}`);
    } else {
      console.log("No intersects");
    }
  };

  useEffect(
    () => {
      actions.init(size);

      // Initialize Stats
      // Stats prevents raycasting!
      // 
      stats = new Stats();
      ref.current.appendChild(stats.dom);

      // Cleanup
      return () => {
        cancelAnimationFrame(frameId);
        if (renderer) ref.current.removeChild(renderer.domElement);

        ref.current.removeChild(stats.dom);
        actions.reset();
      };
    }, []);

  useEffect(
    () => { if (isInitialized) ref.current.appendChild(renderer.domElement) }, 
    [isInitialized]
  );

  useEffect(
    () => actions.resize(size), 
    [width, height]
  );

  const animate = () => {
    if (isInitialized) {

      // Apply transformation to meshes
      meshes.forEach(mesh => {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
      });

      renderer.render(scene, camera)
    };
    frameId = window.requestAnimationFrame(() => animate());
    if (stats) stats.update();
  };

  animate();

  return (
    <div className='relative'>
      <div 
        style={{ 
          width: '80vw', 
          height: '40vw', 
        }}
        className='absolute'
        onMouseDown={handleMouseDown}
        ref={ref} />
      <div 
        className='threeControls absolute' >
        <center>
          {width} x {height}&nbsp;
          <button onClick={handleAddMesh} >Add mesh</button>
        </center>
      </div>
    </div>
  )
};

export default ThreeWorld;