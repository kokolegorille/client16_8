import {
  CHANNEL_CONNECTED,
  CONNECT_CHANNEL_ERROR,
  CONNECT_CHANNEL_TIMEOUT,
  CHANNEL_ERROR,
  CHANNEL_CLOSED,
} from '../hooks/use_channels_reducer';
import setPresence from './set_presence';

const setGameChannel = (dispatch, socket, topic, onCallback) => {
  const channel = socket.channel(topic, {});

  // Presences
  setPresence(channel, dispatch);

  // Events from server
  channel.on('uuid_init', payload => onCallback(topic, 'uuid_init', payload));
  channel.on('world_init', payload => onCallback(topic, 'world_init', payload));
  channel.on('world_update', payload => onCallback(topic, 'world_update', payload));
  channel.on('game_joined', payload => onCallback(topic, 'game_joined', payload));
  channel.on('game_left', payload => onCallback(topic, 'game_left', payload));

  // Join
  if (channel.state !== 'joined') {
    channel.join()
      .receive('ok', () =>
        dispatch({ type: CHANNEL_CONNECTED, payload: { topic, channel } }))
      .receive('error', ({reason}) =>
        dispatch({ type: CONNECT_CHANNEL_ERROR, payload: { topic, error: reason } }))
      .receive('timeout', () => {
        // eslint-disable-next-line no-console
        console.log('Networking issue. Still waiting...');
        dispatch({ type: CONNECT_CHANNEL_TIMEOUT, payload: { topic, error: 'Networking issue. Still waiting...' } });
      }); 
  }

  channel.onError(() => 
    dispatch({ 
      type: CHANNEL_ERROR, 
      payload: { topic, error: 'there was an error!' } 
    })
  );
  channel.onClose(() => 
    dispatch({ 
      type: CHANNEL_CLOSED, 
      payload: { topic, error: 'the channel has gone away gracefully' } 
    })
  );

  // return channel;
};

export default setGameChannel;