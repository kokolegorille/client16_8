import { useReducer } from 'react';

const defaultState = {
  isConnected: false,
  channels: {},
  presences: {},
  errors: {},
};

export const SOCKET_CONNECTED = 'SOCKET_CONNECTED';
export const SOCKET_ERROR = 'SOCKET_ERROR';
export const SOCKET_CLOSED = 'SOCKET_CLOSED';

export const CHANNEL_CONNECTED = 'CHANNEL_CONNECTED';
export const CHANNEL_DISCONNECTED = 'CHANNEL_DISCONNECTED';
// Errors
export const CONNECT_CHANNEL_ERROR = 'CONNECT_CHANNEL_ERROR';
export const CHANNEL_ERROR = 'CHANNEL_ERROR';
export const CHANNEL_CLOSED = 'CHANNEL_CLOSED';
export const CONNECT_CHANNEL_TIMEOUT = 'CONNECT_CHANNEL_TIMEOUT';
// Presences
export const DISPATCH_PRESENCE_STATE = 'DISPATCH_PRESENCE_STATE';
export const DISPATCH_PRESENCE_DIFF = 'DISPATCH_PRESENCE_DIFF';

const reducer = (state, action) => {
  let copy = {};
  let copyErrors = {};
  let copyPresences = {};
  switch (action.type) {
    // Socket
    case SOCKET_CONNECTED:
      return {
        ...state,
        isConnected: true,
      };
    
    case SOCKET_ERROR:
    case SOCKET_CLOSED:
      return {
        ...state,
        isConnected: false,
      };
    
    // Channels
    case CHANNEL_CONNECTED:
      copy = Object.assign({}, state.channels);
      copy[action.payload.topic] = action.payload.channel;

      copyErrors = Object.assign({}, state.errors);
      delete copyErrors[action.payload.topic];
      return {
        ...state,
        channels: copy,
        errors: copyErrors,
      }
    
    case CHANNEL_CLOSED:
    case CHANNEL_ERROR:
    case CONNECT_CHANNEL_ERROR:
    case CONNECT_CHANNEL_TIMEOUT:
      copy = Object.assign({}, state.channels);
      delete copy[action.payload.topic];

      copyErrors = Object.assign({}, state.errors);
      copyErrors[action.payload.topic] = action.payload.error;
      return {
        ...state,
        channels: copy,
        errors: copyErrors,
      }

    case CHANNEL_DISCONNECTED:
      copy = Object.assign({}, state.channels);
      delete copy[action.payload.topic];

      copyErrors = Object.assign({}, state.errors);
      delete copyErrors[action.payload.topic];
      return {
        ...state,
        channels: copy,
        errors: copyErrors,
      }
    
    // Presences
    case DISPATCH_PRESENCE_STATE:
    case DISPATCH_PRESENCE_DIFF:
      copyPresences = Object.assign({}, state.presences);
      copyPresences[action.payload.topic] = action.payload.presences;
      return {
        ...state,
        presences: copyPresences,
      }
    default:
      return state
  }
}

const useSocketReducer = (initialState = defaultState) => useReducer(reducer, initialState);

export default useSocketReducer;