import { Presence } from 'phoenix';

import {
  CHANNEL_CONNECTED,
  CONNECT_CHANNEL_ERROR,
  CONNECT_CHANNEL_TIMEOUT,
  CHANNEL_ERROR,
  CHANNEL_CLOSED,
  //
  DISPATCH_PRESENCE_STATE,
  DISPATCH_PRESENCE_DIFF,
} from '../hooks/use_socket_reducer';

const setSystemChannel = (dispatch, socket, topic = 'system') => {
  const channel = socket.channel(topic, {});
  let presences = {};

  // Presences
  const listBy = (id, { metas: [first, ...rest] }) =>
    Object.assign({}, first, { id, count: rest.length + 1 });

  const render = presences => (Presence.list(presences, listBy));

  channel.on('presence_state', payload => {
    presences = Presence.syncState(presences, payload);
    dispatch({ 
      type: DISPATCH_PRESENCE_STATE, 
      payload: {topic, presences:render(presences)}
    });
  });
  
  channel.on('presence_diff', payload => {
    presences = Presence.syncDiff(presences, payload);
    dispatch({ 
      type: DISPATCH_PRESENCE_DIFF, 
      payload: {topic, presences:render(presences)} 
    });
  });

  // Join
  if (channel.state !== 'joined') {
    channel.join()
      .receive('ok', () =>
        dispatch({ type: CHANNEL_CONNECTED, payload: { topic, channel } }))
      .receive('error', ({reason}) =>
        dispatch({ type: CONNECT_CHANNEL_ERROR, payload: { topic, error: reason } }))
      .receive('timeout', () =>
        // eslint-disable-next-line no-console
        console.log('Networking issue. Still waiting...'));
        dispatch({ type: CONNECT_CHANNEL_TIMEOUT, payload: { topic, error: 'Networking issue. Still waiting...' } });
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

export default setSystemChannel;