import {
  CHANNEL_CONNECTED,
  CONNECT_CHANNEL_ERROR,
  CONNECT_CHANNEL_TIMEOUT,
  CHANNEL_ERROR,
  CHANNEL_CLOSED,
} from '../hooks/use_channels_reducer';
import setPresence from './set_presence';

const setSystemChannel = (dispatch, socket, topic = 'system') => {
  const channel = socket.channel(topic, {});

  // Presences
  setPresence(channel, dispatch);

  // Control and Lag estimation
  channel.on('ping', payload =>  channel.push('pong', payload));

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

// import { Presence } from 'phoenix';

// import {
//   CHANNEL_CONNECTED,
//   CONNECT_CHANNEL_ERROR,
//   CONNECT_CHANNEL_TIMEOUT,
//   CHANNEL_ERROR,
//   CHANNEL_CLOSED,
//   //
//   // Presences
//   DISPATCH_PRESENCE_SYNC,
// } from '../hooks/use_socket_reducer';

// const setSystemChannel = (dispatch, socket, topic = 'system') => {
//   const channel = socket.channel(topic, {});

//   // Presences
//   const presence = new Presence(channel);

//   const listBy = (id, { metas: [first, ...rest] }) =>
//     Object.assign({}, first, { id, count: rest.length + 1 });

//   presence.onSync(() => {
//     dispatch({ 
//       type: DISPATCH_PRESENCE_SYNC, 
//       payload: {topic, presences: presence.list(listBy)}
//     });
//   });

//   // detect if user has joined for the 1st time or from another tab/device
//   presence.onJoin((_id, current, newPres) => {
//     if(!current){
//       console.log("user has entered for the first time", newPres)
//     } else {
//       console.log("user additional presence", newPres)
//     }
//   });

//   // detect if user has left from all tabs/devices, or is still present
//   presence.onLeave((_id, current, leftPres) => {
//     if(current.metas.length === 0){
//       console.log("user has left from all devices", leftPres)
//     } else {
//       console.log("user left from a device", leftPres)
//     }
//   });

//   // Control and Lag estimation
//   channel.on('ping', payload =>  channel.push('pong', payload));

//   // Join
//   if (channel.state !== 'joined') {
//     channel.join()
//       .receive('ok', () =>
//         dispatch({ type: CHANNEL_CONNECTED, payload: { topic, channel } }))
//       .receive('error', ({reason}) =>
//         dispatch({ type: CONNECT_CHANNEL_ERROR, payload: { topic, error: reason } }))
//       .receive('timeout', () => {
//         // eslint-disable-next-line no-console
//         console.log('Networking issue. Still waiting...');
//         dispatch({ type: CONNECT_CHANNEL_TIMEOUT, payload: { topic, error: 'Networking issue. Still waiting...' } });
//       }); 
//   }

//   channel.onError(() => 
//     dispatch({ 
//       type: CHANNEL_ERROR, 
//       payload: { topic, error: 'there was an error!' } 
//     })
//   );
//   channel.onClose(() => {
//     dispatch({ 
//       type: CHANNEL_CLOSED, 
//       payload: { topic, error: 'the channel has gone away gracefully' } 
//     })
//   });

//   // return channel;
// };

// export default setSystemChannel;