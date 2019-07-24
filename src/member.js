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

  const joinChannel = topic => {
    const topicPrefix = topic.split(':')[0];
    switch (topicPrefix) {
      case 'system':
        setSystemChannel(dispatch, socket, topic);
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
    dispatch({
      type: CHANNEL_DISCONNECTED,
      payload: { topic: topic },
    });
  }

  // Open socket on load
  useEffect(() => {
    openSocket();
    return () => closeSocket();
  }, []);

  // Triggered when socket is on/off
  useEffect(() => {
    const userTopic = `user:${authentication.currentUser.id}`;
    if (socket) {
      // console.log('ON');

      // Connect to system channel
      joinChannel('system');

      // Connect to user channel
      joinChannel(userTopic);
    } else {
      // console.log('OFF');

      // Disconnect from system channel
      leaveChannel('system');

      // Disconnect from user channel
      leaveChannel(userTopic);;
    }
  }, [state.isConnected])

  // console.log(state);
  // console.log(socket);

  const printableState = {
    ...state,
    channels: Object.keys(state.channels),
  };

  return (
    <div>
      <h2>Member</h2>
      <h3>Authentication</h3>
      <TreeProperties object={authentication} />
      <h3>Network</h3>
      <TreeProperties object={printableState} />
    </div>
  )
};

export default Member;
