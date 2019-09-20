import axios from 'axios';
import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  USER_LOADED,
  LOGOUT,
  AUTH_ERROR
} from './types';

const setToken = token => {
  if (token) console.log(`token: ${token}`);
  if (token) axios.defaults.headers.common['x-auth-token'] = token;
  else delete axios.defaults.headers.common['x-auth-token'];
};

export const login = login_info => dispatch => {
  axios
    .post('/api/auth', login_info)
    .then(res => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
      dispatch(loadUser());
    })
    .catch(err => console.error(err));
};

export const logout = () => {
  return {
    type: LOGOUT
  };
};

export const loadUser = () => dispatch => {
  console.log('Loading user');
  const token = localStorage.token;
  if (token) {
    setToken(localStorage.token);
    axios
      .get('/api/auth')
      .then(res =>
        dispatch({
          type: USER_LOADED,
          payload: res.data
        })
      )
      .catch(err => {
        console.error(err);
        dispatch({
          type: AUTH_ERROR
        });
      });
  } else {
    dispatch({
      type: AUTH_ERROR
    });
  }
};
