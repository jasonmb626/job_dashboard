import axios from 'axios';
import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  USER_LOADED,
  LOGOUT,
  AUTH_ERROR
} from './types';

const setToken = token => {
  if (token) axios.defaults.headers.common['x-auth-token'] = token;
  else delete axios.defaults.headers.common['x-auth-token'];
};

export const login = (login, password) => dispatch => {
  axios
    .post('/api/auth', { login, password })
    .then(res => {
      localStorage.setItem('token', res.data);
      dispatch(loadUser());
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: LOGIN_FAILURE,
        payload: err.message
      })
    );
};

export const register = (name, login, password) => dispatch => {
  axios
    .post('/api/users', { name, login, password })
    .then(res => {
      localStorage.setItem('token', res.data);
      dispatch(loadUser());
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: LOGIN_FAILURE,
        payload: err.message
      })
    );
};

export const logout = () => {
  return {
    type: LOGOUT
  };
};

export const loadUser = () => dispatch => {
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
