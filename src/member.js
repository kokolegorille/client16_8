import { Socket } from 'phoenix';
import React, { useState, useEffect } from 'react';

import { ROOT_SOCKET } from './config/';
import useSocketReducer, {
  SOCKET_CONNECTED,
  SOCKET_ERROR,
  SOCKET_CLOSED,
  CHANNEL_DISCONNECTED,
} from './hooks/use_socket_reducer';
import TreeProperties from './components/tree_properties';

import setSystemChannel from './channels/set_system_channel';
import setLobbyChannel from './channels/set_lobby_channel';
import setUserChannel from './channels/set_user_channel';

const socketOptions = token => ({
  params: { token },
  logger: (kind, msg, data) => (
    // eslint-disable-next-line no-console
    console.log(`${kind}: ${msg}`, data)
  ),
});

const Member = ({authentication}) => {
  const [socket, setSocket] = useState(null);
  const [state, dispatch] = useSocketReducer();
  
  const openSocket = () => {
    const newSocket = new Socket(
      `${ROOT_SOCKET}/socket`, 
      socketOptions(authentication.token)
    );
    newSocket.connect();
    // This will also be triggered when socket reconnect
    newSocket.onOpen(() => dispatch({ type: SOCKET_CONNECTED }));

    newSocket.onError(() => dispatch({ type: SOCKET_ERROR }));
    newSocket.onClose(() => dispatch({ type: SOCKET_CLOSED }));
    setSocket(newSocket);
    return newSocket;
  };

  const closeSocket = () => {
    if (socket) {
      try {
        socket.disconnect();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
      setSocket(null);
    }
  }

  const joinChannel = (topic, socket) => {
    const topicPrefix = topic.split(':')[0];
    switch (topicPrefix) {
      case 'system':
        setSystemChannel(dispatch, socket, topic);
        break;
      case 'lobby':
        setLobbyChannel(dispatch, socket, topic);
        break;
      case 'user':
        setUserChannel(dispatch, socket, topic);
        break;
      default:
        // eslint-disable-next-line no-console
        console.log(`Unknown topic : ${topic}`);
    }
  }

  const leaveChannel = topic => {
    const channel = state.channels[topic];

    if (channel) {
      if (channel.state === 'joined') {
        try {
          channel.leave();
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      }
    };
    dispatch({type: CHANNEL_DISCONNECTED, payload: { topic }});
  }

  // Triggered when socket is on/off

  useEffect(() => {
    let message = state.isConnected ? 'ON' : 'OFF';
    console.log(message);

  }, [state.isConnected]);

  // Open socket on load
  useEffect(() => {
    const userTopic = `user:${authentication.currentUser.id}`;
    const newSocket = openSocket();

    joinChannel('system', newSocket);
    joinChannel('lobby', newSocket);
    joinChannel(userTopic, newSocket);
    return () => {
      leaveChannel('system');
      leaveChannel('lobby');
      leaveChannel(userTopic);
      closeSocket();
    };
  }, []);

  // console.log(state);
  // console.log(socket);

  // Do not print channels object!
  const printableState = {
    ...state,
    channels: Object.keys(state.channels).map(
      topic => ({ topic, state: state.channels[topic].state })
    ),
  };

  return (
    <div>
      <h1>Member</h1>
      <div className="d-flex">
        <div>
          <h3>Authentication</h3>
          <TreeProperties object={authentication} exclude={['token']} />
        </div>
        <div>
          <h3>Network</h3>
          <TreeProperties object={printableState} />
        </div>
      </div>      
    </div>
  )
};

export default Member;


// import { Socket } from 'phoenix';
// import React, { useState, useEffect } from 'react';

// import { ROOT_SOCKET } from './config/';
// import useSocketReducer, {
//   SOCKET_CONNECTED,
//   SOCKET_ERROR,
//   SOCKET_CLOSED,
//   CHANNEL_DISCONNECTED,
// } from './hooks/use_socket_reducer';
// import TreeProperties from './components/tree_properties';

// import setSystemChannel from './channels/set_system_channel';
// import setLobbyChannel from './channels/set_lobby_channel';
// import setUserChannel from './channels/set_user_channel';

// const socketOptions = token => ({
//   params: { token },
//   logger: (kind, msg, data) => (
//     // eslint-disable-next-line no-console
//     console.log(`${kind}: ${msg}`, data)
//   ),
// });

// const Member = ({authentication}) => {
//   const [socket, setSocket] = useState(null);
//   const [state, dispatch] = useSocketReducer();
  
//   const openSocket = () => {
//     const newSocket = new Socket(
//       `${ROOT_SOCKET}/socket`, 
//       socketOptions(authentication.token)
//     );
//     newSocket.connect();
//     // This will also be triggered when socket reconnect
//     newSocket.onOpen(() => dispatch({ type: SOCKET_CONNECTED }));

//     newSocket.onError(() => dispatch({ type: SOCKET_ERROR }));
//     newSocket.onClose(() => dispatch({ type: SOCKET_CLOSED }));
//     setSocket(newSocket);
//   };

//   const closeSocket = () => {
//     if (socket) {
//       try {
//         socket.disconnect();
//       } catch (err) {
//         // eslint-disable-next-line no-console
//         console.log(err);
//       }
//       setSocket(null);
//     }
//   }

//   const joinChannel = topic => {
//     const topicPrefix = topic.split(':')[0];
//     switch (topicPrefix) {
//       case 'system':
//         setSystemChannel(dispatch, socket, topic);
//         break;
//       case 'lobby':
//         setLobbyChannel(dispatch, socket, topic);
//         break;
//       case 'user':
//         setUserChannel(dispatch, socket, topic);
//         break;
//       default:
//         // eslint-disable-next-line no-console
//         console.log(`Unknown topic : ${topic}`);
//     }
//   }

//   const leaveChannel = topic => {
//     const channel = state.channels[topic];

//     if (channel) {
//       if (channel.state === 'joined') {
//         try {
//           channel.leave();
//         } catch (err) {
//           // eslint-disable-next-line no-console
//           console.log(err);
//         }
//       }
//     };
//     dispatch({type: CHANNEL_DISCONNECTED, payload: { topic }});
//   }

//   // Triggered when socket is on/off

//   useEffect(() => {
//     let message = state.isConnected ? 'ON' : 'OFF';
//     console.log('-----> ', message);

//     const userTopic = `user:${authentication.currentUser.id}`;
//     if (socket) {
//       joinChannel('system');
//       joinChannel('lobby');
//       joinChannel(userTopic);
//     };
//     // return () => {
//     //   leaveChannel('system');
//     //   leaveChannel('lobby');
//     //   leaveChannel(userTopic);      
//     // }
//   }, [state.isConnected]);

//   // Open socket on load
//   useEffect(() => {
//     openSocket();
//     return () => closeSocket();
//   }, []);

//   // console.log(state);
//   // console.log(socket);

//   // Do not print channels object!

//   // const printableState = {
//   //   ...state,
//   //   channels: Object.keys(state.channels),
//   // };

//   const printableState = {
//     ...state,
//     channels: Object.keys(state.channels).map(
//       topic => `${topic} : ${state.channels[topic].state}`
//     )
//   };

//   return (
//     <div>
//       <h2>Member</h2>
//       <h3>Authentication</h3>
//       <TreeProperties object={authentication} exclude={['token']} />
//       <h3>Network</h3>
//       <TreeProperties object={printableState} />
//     </div>
//   )
// };

// export default Member;
