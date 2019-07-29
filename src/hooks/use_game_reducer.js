import { useReducer } from 'react';

import mergeByKey from '../utils/merged_by_keys';

const defaultState = {
  local: {},
  remote: []
};

// This reducer is not using constant as type for simplicity.
// As the action will be uppercase from socket event
const reducer = (state, action) => {
  
  console.log(state, action);

  switch (action.type) {
    case 'SET_LOCAL':
      return {
        ...state, 
        local: {
          ...state.local,
          ...action.payload
        }
      }
    
    case 'UUID_INIT':
      return {
        ...state, 
        local: {
          ...state.local,
          ...action.payload
        }
      }

    case 'WORLD_INIT':
      return {
          ...state,
          remote: action.payload.world
            .filter(p => p.uuid !== (state.local ? state.local.uuid : null)) 
        };
    
    case 'WORLD_UPDATE':
      const filteredPayload = action.payload.world
        .filter(p => p.uuid !== (state.local ? state.local.uuid : null));

      const newRemote = mergeByKey(
        'uuid', 
        state.remote,
        filteredPayload
      );

      return {
        ...state,
        remote: newRemote
      };
    
    case 'GAME_JOINED':
      return {
        ...state,
        remote: [...state.remote, action.payload.player]
      };
    
    case 'GAME_LEFT':
      return {
        ...state,
        remote: state.remote
          .filter(p => p.uuid !== action.payload.uuid) 
      }

    default:
      return state
  }
}

const useGameReducer = (initialState = defaultState) => useReducer(reducer, initialState);

export default useGameReducer;