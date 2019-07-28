import React, { useState } from 'react';
import * as THREE from 'three';

import Joystick from '../components/joystick';

// {
//   model,
//   color,
//   x, y, z,
//   h, pb,
//   animation
// }

const Room = () => {
  const [animation, setAnimation] = useState('Idle');
  const [motion, setMotion] = useState();
  const [vector, setVector] = useState({
    x: 0, y: 0, z: 0, h: 0, pb: 0
  });
  // Object is mutable!
  const [object, _setObject] = useState(new THREE.Object3D());

  const playerControl = ({ forward, turn }) => {
    turn = - turn;
    let newMotion;

    // Set animation and motion
    if (forward > 0.3) {
      if (animation != 'Walking' && animation != 'Running') setAnimation('Walking');
    } else if (forward < -0.3) {
      if (animation != 'Walking Backwards') setAnimation('Walking Backwards');
    } else {
      forward = 0;
      if (turn > 0.1) {
        if (animation != 'Left Turn') setAnimation('Left Turn');
      } else if (turn < -0.1) {
        if (animation != 'Right Turn') setAnimation('Right Turn');
        else {
          turn = 0;
          if (animation != 'Idle') setAnimation('Idle');
        }
      }
      if (forward==0 && turn==0) {
        newMotion = null;
      } else {
        newMotion = { forward, turn };
      }
    };
    setMotion(newMotion);

    // Normally You should pass a delta time
    move(newMotion, 1);
  };

  const move = (motion, dt) => {
    let blocked = false;

    // Set vector
    let dir = new THREE.Vector3();
    object.getWorldDirection(dir);

    if (motion) {
      if (!blocked) {
        if (motion.forward > 0) {
          const speed = animation == 'Running' ? 500 : 150;
          this.object.translateZ(dt * speed);
        } else {
          object.translateZ(-dt * 30);
        }
      };

      if (motion.forward < 0) dir.negate();
      object.rotateY(motion.turn * dt);
    }
    // console.log(object);

    setVector({
      ...vector,
      ...object.position,
      h: object.rotation.y,
      pb: object.rotation.x,
    });
  }

  return (
    <div style={{border: 'solid 1px'}}> 
      <p>{animation}</p>
      <dl>
        <dt>x</dt>
        <dd>{vector.x}</dd>
        <dt>y</dt>
        <dd>{vector.y}</dd>
        <dt>z</dt>
        <dd>{vector.z}</dd>
        <dt>h</dt>
        <dd>{vector.h}</dd>
        <dt>pb</dt>
        <dd>{vector.pb}</dd>
      </dl>
      <Joystick callback={playerControl} />
    </div>
  );
};

export default Room;