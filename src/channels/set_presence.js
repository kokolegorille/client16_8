  
import { Presence } from 'phoenix';

import { DISPATCH_PRESENCE_SYNC } from '../hooks/use_channels_reducer';
 
const listBy = (id, { metas: [first, ...rest] }) =>
  Object.assign({}, first, { id, count: rest.length + 1 });

const setPresence = (channel, dispatch) => {
  const presence = new Presence(channel);
  const { topic } = channel;

  presence.onSync(() => {
    // TODO: Fix Warning
    // This happens the first time You connect!
    // It might be related to presence object not being cleaned...
    //
    // Warning: Can't perform a React state update on an unmounted component. 
    // This is a no-op, but it indicates a memory leak in your application. 
    // To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
    // in Member (created by App)
    //
    dispatch({ 
      type: DISPATCH_PRESENCE_SYNC, 
      payload: {topic, presences: presence.list(listBy)}
    })
  });

  // detect if user has joined for the 1st time or from another tab/device
  presence.onJoin((_id, current, newPres) => {
    if(!current) {
      console.log("user has entered for the first time", newPres)
    } else {
      console.log("user additional presence", newPres)
    }
  });

  // detect if user has left from all tabs/devices, or is still present
  presence.onLeave((_id, current, leftPres) => {
    if(current.metas.length === 0) {
      console.log("user has left from all devices", leftPres)
    } else {
      console.log("user left from a device", leftPres)
    }
  });

  return presence;
}

export default setPresence;
