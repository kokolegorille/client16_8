import { useReducer } from 'react';

export const SIGNIN_SUCCESS = 'SIGNIN_SUCCESS';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const REFRESH_TOKEN_SUCCESS = 'REFRESH_TOKEN_SUCCESS';
export const SIGNOUT_SUCCESS = 'SIGNOUT_SUCCESS';
export const SIGNIN_ERROR = 'SIGNIN_ERROR';
export const SIGNUP_ERROR = 'SIGNUP_ERROR';
export const REFRESH_TOKEN_ERROR = 'REFRESH_TOKEN_ERROR';
export const SIGNOUT_ERROR = 'SIGNOUT_ERROR';

export const defaultState = {
  isAuthenticated: false,
  currentUser: null,
  token: null,
  errors: null,
}

const reducer = (state, action) => {
  
  console.log(action);

  switch (action.type) {
    case REFRESH_TOKEN_SUCCESS:
    case SIGNIN_SUCCESS:
    case SIGNUP_SUCCESS:
      const {token, user} = action.payload;
      return {
        isAuthenticated: true,
        currentUser: user,
        token,
        errors: null,
      }
    
    case SIGNIN_ERROR:
    case SIGNUP_ERROR:
    case REFRESH_TOKEN_ERROR:
    case SIGNOUT_ERROR:
      return {
        isAuthenticated: false,
        currentUser: null,
        token: null,
        errors: action.payload,
      }

    case SIGNOUT_SUCCESS:
      return {
        isAuthenticated: false,
        currentUser: null,
        token: null,
        errors: null,
      }

    default:
      return state
  }
}

const useAuthReducer = (initialState = defaultState) => useReducer(reducer, initialState);

export default useAuthReducer;