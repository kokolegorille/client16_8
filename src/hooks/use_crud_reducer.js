import uuidv4 from 'uuid/v4';

import { useReducer } from 'react';

const defaultState = {};

const POPULATE = 'POPULATE';
const ADD = 'ADD';
const DELETE = 'DELETE';

const reducer = (state, action) => {
  let copy = {};

  console.log(state, action);

  switch (action.type) {
    case POPULATE:
      return action.payload

    case ADD:
      copy = Object.assign({}, state);
      copy[action.payload.uuid] = action.payload;
      return copy

    case DELETE:
      copy = Object.assign({}, state);
      delete copy[action.payload];
      return copy

    default:
      return state
  }
};

const useChannelsReducer = (initialState = defaultState) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Actions
  const add = params => dispatch({
    type: ADD, 
    payload: {...params, uuid: uuidv4()}
  });

  const remove = uuid => dispatch({
    type: DELETE, 
    payload: uuid
  });

  // Export state, dispatch and available actions
  return [state, dispatch, { add, remove }];
};

export default useChannelsReducer;