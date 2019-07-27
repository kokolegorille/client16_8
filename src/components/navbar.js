import React, { useContext  } from 'react';
import AuthContext from '../contexts/auth_context';

// Elements for main navbar
const build_elements = ({authentication, setSignMode, signout}) => (
  authentication.isAuthenticated ?
  [
    {type: 'text', label: `Welcome ${authentication.currentUser.name}!`},
    {type: 'link', label: 'Sign Out', handler: () => signout(authentication.token)},
  ] :
  [
    {type: 'link', label: 'Sign In', handler: () => setSignMode('SIGNIN')},
    {type: 'link', label: 'Sign Up', handler: () => setSignMode('SIGNUP')},
  ]
);

const Navbar = () => {
  const authentication = useContext(AuthContext);

  const content = build_elements(authentication).map(element => (
    <li className="nav-item" key={element.label}>
      {
        element.type === "text" ?
          <div className="navbar-text">
            { element.label }
          </div> :
           <a 
            onClick={element.handler}
            className="nav-link" >
            { element.label }
          </a>
      }
    </li>
  ));

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <div className="container">
        <button 
          className="navbar-toggler" 
          type="button" 
          data-toggle="collapse" 
          data-target="#navbarCollapse" 
          aria-controls="navbarCollapse" 
          aria-expanded="false" 
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav mr-auto">
            { content }
          </ul>
        </div>
      </div>
    </nav>
  )
};

export default Navbar;
