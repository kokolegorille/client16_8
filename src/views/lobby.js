import React, { useContext, useEffect } from 'react';

import SocketContext from '../contexts/socket_context';
import useChannelsReducer from '../hooks/use_channels_reducer';
import TreeProperties from '../components/tree_properties';
import ChannelsControl from '../components/channels_control';

// Channels setters
import setLobbyChannel from '../channels/set_lobby_channel';
const allowedChannels = {
  'lobby': setLobbyChannel,
};

const Lobby = () => {
  const state = useContext(SocketContext);
  const [channelsState, _channelsDispatch, channelsActions] = 
    useChannelsReducer({ allowedChannels });
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
    // eslint-disable-next-line no-console
    console.log("Mounted");

    return () => {
      leaveChannel('lobby');
    };
  }, []);

  const listOfChannels = Object
    .keys(allowedChannels)
    .map(topic => ({topic, state: !!channelsState.channels[topic]}));

  return (
    <div>
      <h2>Lobby</h2>
      <TreeProperties object={printableState} />
      
      <ChannelsControl 
        channels={listOfChannels} 
        socket={state.socket} 
        join={joinChannel} 
        leave={leaveChannel}/>
    </div>
  )
};

export default Lobby;