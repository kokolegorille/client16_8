import { useReducer } from 'react';

export const defaultState = {
  isConnected: false,
  socket: null,
};

export const SOCKET_CONNECTED = 'SOCKET_CONNECTED';
export const SOCKET_ERROR = 'SOCKET_ERROR';
export const SOCKET_CLOSED = 'SOCKET_CLOSED';

const reducer = (state, action) => {

  console.log(state, action);

  switch (action.type) {
    // Socket
    case SOCKET_CONNECTED:
      return {
        isConnected: true,
        socket: action.payload,
      };
    
    case SOCKET_ERROR:
    case SOCKET_CLOSED:
      return {
        isConnected: false,
        socket: null,
      };    
    default:
      return state
  }
}

const useSocketReducer = (initialState = defaultState) => useReducer(reducer, initialState);

export default useSocketReducer;
