import {
  CHANNEL_CONNECTED,
  CONNECT_CHANNEL_ERROR,
  CONNECT_CHANNEL_TIMEOUT,
  CHANNEL_ERROR,
  CHANNEL_CLOSED,
  MESSAGE_RECEIVED,
} from '../hooks/use_channels_reducer';
import setPresence from './set_presence';

const setSystemChannel = (dispatch, socket, topic, _onCallback) => {
  const channel = socket.channel(topic, {});

  // Presences
  setPresence(channel, dispatch);

  // Control and Lag estimation
  channel.on('ping', payload =>  channel.push('pong', payload));

  // Testing
  channel.on('pong', payload => 
    dispatch({ 
      type: MESSAGE_RECEIVED, 
      payload: {topic, command: 'pong', payload} 
    }));

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
  channel.onClose(() => {
    dispatch({ 
      type: CHANNEL_CLOSED, 
      payload: { topic, error: 'the channel has gone away gracefully' } 
    })
  });

  // return channel;
};

export default setSystemChannel;
