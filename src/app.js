import React, { useState, useEffect } from 'react';

import Auth from './services/auth';
import Api from './services/api';
import useAuthReducer, { 
  SIGNIN_SUCCESS, 
  SIGNUP_SUCCESS,
  SIGNOUT_SUCCESS,
  REFRESH_TOKEN_SUCCESS,
  SIGNIN_ERROR,
  SIGNUP_ERROR,
  SIGNOUT_ERROR,
  REFRESH_TOKEN_ERROR,
} from './hooks/use_auth_reducer';

import AuthContext from './contexts/auth_context';

import Member from './views/member';

import signinSchema from './schemas/signin_schema';
import signupSchema from './schemas/signup_schema';

import Navbar from './components/navbar';
import Form from './components/form';
import TreeProperties from './components/tree_properties';

import TodoApp from './views/todo_app';

import { formatTimestamp } from './utils/formatter';

const App = () => {
  const [bootupTime, setBootupTime] = useState(null);
  const [inProgress, setInProgress] = useState(false);
  const [signMode, setSignMode] = useState(null);
  const [authentication, dispatch] = useAuthReducer();
  const { token } = authentication;

  // Set Bootup Time only once
  useEffect(() => setBootupTime(Date.now()), []);

  // Refresh from token on load
  useEffect(
    () => {
      const startToken = Auth.getToken();
      if (!startToken) return;
      refreshToken(startToken);
    }, 
    []
  );

  // Persists token in Local storage when changed
  useEffect(
    () => {
      if (token) Auth.setToken(token)
      else Auth.removeToken();
    }, 
    [token]
  );

  // Extracts server error
  const errorPayload = error => (
    error.response && error.response.data ?
      error.response.data :
      error.toString()
  );

  // Signin 
  const signin = (params) => {
    // console.log(params);

    setInProgress(true);
    Api.signin(params)
    .then((response) => {
      setInProgress(false);
      setSignMode(null);
      dispatch({ type: SIGNIN_SUCCESS, payload: response.data });
    })
    .catch(error => {
      setInProgress(false);
      dispatch({ type: SIGNIN_ERROR, payload: errorPayload(error) });
    });
  };

  // Signup
  const signup = (params) => {
    // console.log(params);

    setInProgress(true);
    Api.signup(params)
    .then((response) => {
      setInProgress(false);
      setSignMode(null);
      dispatch({ type: SIGNUP_SUCCESS, payload: response.data });
    })
    .catch(error => {
      setInProgress(false);
      dispatch({ type: SIGNUP_ERROR, payload: errorPayload(error) });
    });
  };

  // Refresh status from token (eg. on page reload!)
  const refreshToken = token => {
    setInProgress(true);
    Api.refreshToken(token)
    .then((response) => {
      setInProgress(false);
      setSignMode(null);
      dispatch({ type: REFRESH_TOKEN_SUCCESS, payload: response.data });
    })
    .catch(error => {
      setInProgress(false);
      dispatch({ type: REFRESH_TOKEN_ERROR, payload: errorPayload(error) });
    });
  };

  // Signout
  const signout = token => {
    setInProgress(true);
    Api.signout(token)
    .then(_response => {
      setInProgress(false);
      dispatch({ type: SIGNOUT_SUCCESS });
    })
    .catch(error => {
      setInProgress(false);
      dispatch({ type: SIGNOUT_ERROR, payload: errorPayload(error) });
    });
    Auth.removeToken();
  };

  const handleSubmitSignin = formState => signin(formState);
  const handleSubmitSignup = formState => signup(formState);
  const handleCancel = () => setSignMode(null);

  // DEBUG
  //
  // console.log(JSON.stringify(authentication));

  return (
    <div>
      <AuthContext.Provider 
        value={{
          authentication,
          setSignMode,
          signout
        }}>
        <header>
          <Navbar />
        </header>
      
        <main role="main">
          <div className="container mt-4">
            {
                inProgress && 
                <img src='/images/spinner.png' />
            }  
            {
              authentication.errors && 
              <TreeProperties object={authentication.errors} />
            }
            {
              !authentication.isAuthenticated && !signMode &&
              <>
                <h2>Welcome</h2>
                <p>You are not connected.</p>
                <TodoApp />
              </>
            }
            {
              !authentication.isAuthenticated && signMode === 'SIGNIN' &&
              <>
                <h2>Sign In</h2>
                <Form 
                  schema={signinSchema} 
                  callback={handleSubmitSignin} 
                  handleCancel={handleCancel} />
              </>
            }
            {
              !authentication.isAuthenticated && signMode === 'SIGNUP' &&
              <>
                <h2>Sign Up</h2>
                <Form 
                  schema={signupSchema} 
                  callback={handleSubmitSignup} 
                  handleCancel={handleCancel} />
              </>
            }
            {
              authentication.isAuthenticated &&
              <>
                <Member authentication={authentication} />
              </>
            }
          </div>
        </main>
      </AuthContext.Provider>
      
      <footer className="page-footer font-small">
        <div className="container-fluid text-center text-md-left">
          <div className="footer-copyright text-center py-3">
            <p>
              &copy; Copyright klg 2019 | Bootup Time: {formatTimestamp(bootupTime)}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
};

export default App;