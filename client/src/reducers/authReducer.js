import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  USER_LOADED,
  LOGOUT,
  AUTH_ERROR
} from '../actions/types';

const initialState = {
  token: localStorage['token'],
  isAuthenticated: false,
  loading: true,
  user: null,
  errors: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload);
      return {
        ...state,
        isAuthenticated: true
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false
      };
    case LOGIN_FAILURE:
    case AUTH_ERROR:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        errors: null
      };
    default:
      return state;
  }
};
