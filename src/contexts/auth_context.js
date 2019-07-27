import React from 'react';

import { defaultState } from '../hooks/use_auth_reducer';

const AuthContext = React.createContext(defaultState);

export default AuthContext;