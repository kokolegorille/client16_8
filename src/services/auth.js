// It is not possible to decode Phoenix.Token on the client side!
// https://elixirforum.com/t/how-to-decode-phoenix-token-client-side/9680

// This requires plugin @babel/plugin-proposal-class-properties

import { TOKEN_KEY } from '../config/';

const Auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: token => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
}

export default Auth;