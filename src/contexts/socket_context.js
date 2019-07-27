import React from 'react';

import { defaultState } from '../hooks/use_socket_reducer';

const SocketContext = React.createContext(defaultState);

export default SocketContext;