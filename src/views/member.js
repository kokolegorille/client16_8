import { Socket } from 'phoenix';
import React, { useEffect } from 'react';

import { ROOT_SOCKET } from '../config';
import useSocketReducer, {
  SOCKET_CONNECTED,
  SOCKET_ERROR,
  SOCKET_CLOSED,
} from '../hooks/use_socket_reducer';
import useChannelsReducer, 
  { CLEAR_MESSAGES } from '../hooks/use_channels_reducer';

import SocketContext from '../contexts/socket_context';

import TreeProperties from '../components/tree_properties';
import Lobby from './lobby';

const socketOptions = token => ({
  params: { token },
  logger: (kind, msg, data) => (
    // eslint-disable-next-line no-console
    console.log(`${kind}: ${msg}`, data)
  ),
});

// Channels setters
import setSystemChannel from '../channels/set_system_channel';
import setUserChannel from '../channels/set_user_channel';

const allowedChannels = {
  'system': setSystemChannel,
  'user': setUserChannel,
};

const Member = ({authentication}) => {
  const [state, dispatch] = useSocketReducer();
  const [channelsState, channelsDispatch, channelsActions] = 
    useChannelsReducer(allowedChannels);
  const { joinChannel, leaveChannel, send } = channelsActions;

  const openSocket = () => {
    const newSocket = new Socket(
      `${ROOT_SOCKET}/socket`, 
      socketOptions(authentication.token)
    );
    newSocket.connect();
    // This will also be triggered when socket reconnect
    newSocket.onOpen(() => dispatch({ type: SOCKET_CONNECTED, payload: newSocket }));
    newSocket.onError(() => dispatch({ type: SOCKET_ERROR }));
    newSocket.onClose(() => dispatch({ type: SOCKET_CLOSED }));
    return newSocket;
  };

  const closeSocket = () => {
    if (state.socket) {
      try {
        state.socket.disconnect();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    }
    dispatch({type: SOCKET_CLOSED});
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

    joinChannel(newSocket, 'system');
    // joinChannel(newSocket, 'lobby');
    joinChannel(newSocket, userTopic);
    return () => {
      leaveChannel('system');
      // leaveChannel('lobby');
      leaveChannel(userTopic);
      closeSocket();
    };
  }, []);

  // console.log(state);
  // console.log(socket);

  const printableState = {
    ...channelsState,
    channels: Object.keys(channelsState.channels).map(
      topic => `${topic} : ${channelsState.channels[topic].state}`
    )
  };

  // This will return a full topic, with interpolated variables
  const prefixToTopic = prefix => {
    switch(prefix) {
      case 'user':
        return `user:${authentication.currentUser.id}`;
      default:
        return prefix
    }
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
          <TreeProperties object={state} exclude={['socket']} />
          <TreeProperties object={printableState} />
          <ul>
            {
              Object.keys(allowedChannels)
                .map(topicPrefix => prefixToTopic(topicPrefix))
                .map(fullTopic => 
                channelsState.channels[fullTopic] ?
                <li key={fullTopic}>
                  {fullTopic}&nbsp;
                  <button 
                    onClick={() => leaveChannel(fullTopic)}
                    className='btn btn-link' >
                    Disconnect
                  </button>
                </li>
                :
                <li key={fullTopic}>
                  {fullTopic}&nbsp;
                  <button 
                    onClick={() => joinChannel(state.socket, fullTopic)}
                    className='btn btn-linkå' >
                    Reconnect
                  </button>
                </li>
              )
            }
          </ul>
          <button 
            onClick={() => send('system', 'ping', {ping_time: Date.now()})}
            className="btn btn-link">
            Ping
          </button>
          <button 
            onClick={() => channelsDispatch({type: CLEAR_MESSAGES})}
            className="btn btn-link">
            Clear messages
          </button>
        </div>
        <SocketContext.Provider 
          value={state}>
          <Lobby />
        </SocketContext.Provider>
      </div>      
    </div>
  )
};

export default Member;
