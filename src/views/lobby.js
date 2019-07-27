import React, { useContext, useEffect } from 'react';

import SocketContext from '../contexts/socket_context';
import useChannelsReducer from '../hooks/use_channels_reducer';
import TreeProperties from '../components/tree_properties';

// Channels setters
import setLobbyChannel from '../channels/set_lobby_channel';
const allowedChannels = {
  'lobby': setLobbyChannel,
};

const Lobby = () => {
  const state = useContext(SocketContext);
  const [channelsState, _channelsDispatch, channelsActions] = 
    useChannelsReducer(allowedChannels);
  const { joinChannel, leaveChannel } = channelsActions;

  const printableState = {
    ...channelsState,
    channels: Object.keys(channelsState.channels).map(
      topic => `${topic} : ${channelsState.channels[topic].state}`
    )
  };

  useEffect(() => {
    if (state.socket && !channelsState['lobby']) {
      joinChannel(state.socket, 'lobby');
    }
  }, [state.isConnected]);

  useEffect(() => {
    console.log("Mounted");

    return () => {
      leaveChannel('lobby');
    };
  }, []);

  return (
    <div>
      <h2>Lobby</h2>
      <p>{state.isConnected ? 'ON' : 'OFF'}</p>
      <TreeProperties object={printableState} />
    </div>
  )
};

export default Lobby;