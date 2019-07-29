import React, { useState, useContext, useEffect } from 'react';
import * as THREE from 'three';

import AuthContext from '../contexts/auth_context';
import SocketContext from '../contexts/socket_context';
import useChannelsReducer from '../hooks/use_channels_reducer';
import useGameReducer from '../hooks/use_game_reducer';
import TreeProperties from '../components/tree_properties';
import ChannelsControl from '../components/channels_control';
import PlayerInfo from '../components/player_info';

// Channels setters
import setGameChannel from '../channels/set_game_channel';
const allowedChannels = {
  'game': setGameChannel,
};

import Joystick from '../components/joystick';

const Game = ({id}) => {
  const [animation, setAnimation] = useState('Idle');
  const [motion, setMotion] = useState();
  const [vector, setVector] = useState({
    x: 0, y: 0, z: 0, h: 0, pb: 0
  });

  const { authentication } = useContext(AuthContext);
  const [worldState, worldDispatch] = useGameReducer();
  
  const fullTopic = `game:${id}`;

  // Local user is made from multiple states
  const localUser = {
    uuid: (worldState.local ? worldState.local.uuid : null),
    id: authentication.currentUser.id,
    name: authentication.currentUser.name,
    model: 'default model',
    colour: 'default colour',
    action: animation,
    ...vector,
  };

  // On callback
  const onCallback = (topic, type, payload) => {
    console.log('GAME ON_CALLBACK: ', topic, type, payload);
    if (topic === fullTopic) worldDispatch({type: type.toUpperCase(), payload});
  };

  // Network
  const state = useContext(SocketContext);
  const [channelsState, _channelsDispatch, channelsActions] = 
    useChannelsReducer({ allowedChannels, onCallback });
  const { joinChannel, leaveChannel, send } = channelsActions;

  useEffect(() => {
    if (state.socket && !channelsState.channels[fullTopic]) {
      joinChannel(state.socket, fullTopic);
    }

    const user_id = authentication.currentUser ?
      authentication.currentUser.id :
      null;

    const name = authentication.currentUser ?
      authentication.currentUser.name :
      'guest';

    worldDispatch({type: 'SET_LOCAL', payload: {
      id: user_id,
      name,
      model: 'default model',
      colour: 'default colour',
      ...vector,
      action: animation,
    }});

  }, [state.isConnected]);

  useEffect(() => {
    if (state.socket && channelsState.channels[fullTopic]) {
      const message = {
        ...localUser,
        ...vector,
        action: animation,
      };
      send(fullTopic, 'init', message);
      send(fullTopic, 'player_ready', {});
    }
  }, [!!channelsState.channels[fullTopic]]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("Mounted");

    return () => {
      leaveChannel(fullTopic);
    };
  }, []);

  // Object is mutable!
  const [object, _setObject] = useState(new THREE.Object3D());

  // Create a clock for better rendering
  const clock = new THREE.Clock();

  // Joystick callback handler
  const playerControl = ({ forward, turn }) => {
    turn = - turn;
    let newMotion;
    let newAnimation = animation || 'Idle';

    // Set animation and motion
    if (forward > 0.3) {
      if (animation != 'Walking' && animation != 'Running') newAnimation = 'Walking';
    } else if (forward < -0.3) {
      if (animation != 'Walking Backwards') newAnimation = 'Walking Backwards';
    } else {
      forward = 0;
      if (turn > 0.1) {
        if (animation != 'Left Turn') newAnimation = 'Left Turn';
      } else if (turn < -0.1) {
        if (animation != 'Right Turn') newAnimation = 'Right Turn';
        else {
          turn = 0;
          if (animation != 'Idle') newAnimation = 'Idle';
        }
      }
    };
    if (forward==0 && turn==0) {
      newMotion = null;
    } else {
      newMotion = { forward, turn };
    }

    setAnimation(newAnimation);
    setMotion(newMotion);

    // This will calculate the new vector position after movement!
    const newVector = move(newMotion, clock.getDelta());

    // Send new state to server
    // Be careful not to send outdated data!
    const newLocalPlayer = {
      ...localUser,
      ...newVector,
      action: newAnimation,
    };
    send(fullTopic, 'update', newLocalPlayer);
    worldDispatch({type: 'SET_LOCAL', payload: newLocalPlayer});
  };

  const move = (motion, dt) => {
    // Can be blocked by collision...
    let blocked = false;

    // Set vector
    let dir = new THREE.Vector3();
    object.getWorldDirection(dir);

    if (motion) {
      if (!blocked) {
        if (motion.forward > 0) {
          const speed = animation == 'Running' ? 500 : 150;
          object.translateZ(dt * speed);
        } else {
          object.translateZ(-dt * 30);
        }
      };

      if (motion.forward < 0) dir.negate();
      object.rotateY(motion.turn * dt);
    }
    // console.log(object);

    const newVector = {
      ...vector,
      ...object.position,
      h: object.rotation.y,
      pb: object.rotation.x,
    };

    setVector(newVector);
    return newVector;
  }

  const printableState = {
    ...channelsState,
    channels: Object.keys(channelsState.channels).map(
      topic => `${topic} : ${channelsState.channels[topic].state}`
    )
  };

  // This will return a full topic, with interpolated variables
  const prefixToTopic = prefix => {
    switch(prefix) {
      case 'game':
        return fullTopic;
      default:
        return prefix
    }
  };

  const listOfChannels = Object
    .keys(allowedChannels)
    .map(topicPrefix => prefixToTopic(topicPrefix))
    .map(topic => ({topic, state: !!channelsState.channels[topic]}));

  return (
    <div style={{border: 'solid 1px'}}> 
      <div className="d-flex justify-content-between">
        <div>
        <TreeProperties object={printableState} exclude={['messages']} />
        <ChannelsControl 
          channels={listOfChannels} 
          socket={state.socket} 
          join={joinChannel} 
          leave={leaveChannel}/>
        </div>
        <div>
          <h3>Local</h3>
          <PlayerInfo player={localUser} />

          <h3>Remote</h3>
          <ul className='list-unstyled'>
            {
              worldState.remote.map(player => 
                <li key={player.id}><PlayerInfo player={player} /></li>)
            }
          </ul>
        </div>
      </div>
      <Joystick callback={playerControl} />
    </div>
  );
};

export default Game;