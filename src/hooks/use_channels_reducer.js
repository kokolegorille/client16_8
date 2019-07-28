import { useReducer } from 'react';

const defaultState = {
  channels: {},
  presences: {},
  messages: [],
};

export const CHANNEL_CONNECTED = 'CHANNEL_CONNECTED';
export const CHANNEL_DISCONNECTED = 'CHANNEL_DISCONNECTED';
// Messages from socket
export const MESSAGE_RECEIVED = 'MESSAGE_RECEIVED';
export const MESSAGE_SENT = 'MESSAGE_SENT';
export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';
// Errors
export const CONNECT_CHANNEL_ERROR = 'CONNECT_CHANNEL_ERROR';
export const CONNECT_CHANNEL_TIMEOUT = 'CONNECT_CHANNEL_TIMEOUT';
export const CHANNEL_ERROR = 'CHANNEL_ERROR';
export const CHANNEL_CLOSED = 'CHANNEL_CLOSE';

// Presences
export const DISPATCH_PRESENCE_SYNC = 'DISPATCH_PRESENCE_SYNC';

const reducer = (state, action) => {
  let copy = {};
  let copyPresences = {};
  
  console.log(state, action);

  switch (action.type) {    
    // Channels
    case CHANNEL_CONNECTED:
      copy = Object.assign({}, state.channels);
      copy[action.payload.topic] = action.payload.channel;

      return {
        ...state,
        channels: copy,
      }
    
    case CHANNEL_ERROR:
    case CHANNEL_CLOSED:
    case CONNECT_CHANNEL_ERROR:
    case CONNECT_CHANNEL_TIMEOUT:
      console.log(action.payload.error);

      copyPresences = Object.assign({}, state.presences);
      delete copyPresences[action.payload.topic];
      return {
        ...state,
        presences: copyPresences,
      }
  
    case CHANNEL_DISCONNECTED:
      copy = Object.assign({}, state.channels);
      delete copy[action.payload.topic];

      return {
        ...state,
        channels: copy,
      }
    
    // Presences
    case DISPATCH_PRESENCE_SYNC:
      copyPresences = Object.assign({}, state.presences);
      copyPresences[action.payload.topic] = action.payload.presences;
      return {
        ...state,
        presences: copyPresences,
      }
    
    // Messages
    case CLEAR_MESSAGES:
      return {
        ...state,
        messages: []
      }

    case MESSAGE_SENT:
      return {
        ...state,
        messages: [
          ...state.messages, 
          {
            ...action.payload, 
            type: 'OUT', 
            timestamp: Date.now()
          }
        ]
      }

    case MESSAGE_RECEIVED:
      return {
        ...state,
        messages: [
          ...state.messages, 
          {
            ...action.payload, 
            type: 'IN', 
            timestamp: Date.now()
          }
        ]
      }

    default:
      return state
  }
}

const useChannelsReducer = (
  allowedChannels, 
  initialState = defaultState
) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ACTIONS

  const joinChannel = (socket, topic) => {
    const topicPrefix = topic.split(':')[0];

    const setter = allowedChannels[topicPrefix];
    if (setter) {
      setter(dispatch, socket, topic);
    } else {
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

  const send = (topic, command, payload) => {
    const message = `SEND COMMAND -> Topic : ${topic}, ` +
    `Command : ${command}, Payload : ${payload}`;

    const channel = state.channels[topic];
    if (!!channel) {
      channel.push(command, payload);
      dispatch({type: MESSAGE_SENT, payload: {topic, command, payload}});
      
      // eslint-disable-next-line no-console
      console.log(message);
    } else {
      // eslint-disable-next-line no-console
      console.log(`${message} could not be sent`);
    }
  };

  // state, dispatch, actions object
  return [
    state, 
    dispatch, 
    { joinChannel, leaveChannel, send }
  ];
};

export default useChannelsReducer;
