import axios from 'axios';

import { ROOT_URL } from '../config/';

const authHeaders = token => ({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  credentials: 'same-origin',
});

const Api = {
  signin: params => axios.post(`${ROOT_URL}/authentication`, { session: params }),
  signup: params => axios.post(`${ROOT_URL}/registration`, { user: params }),
  refreshToken: token => (
    axios.patch(
      `${ROOT_URL}/authentication/refresh`,
      { session: { token } },
      authHeaders(token),
    )
  ),
  signout: token => axios.delete(`${ROOT_URL}/authentication`, authHeaders(token)),
};

export default Api;