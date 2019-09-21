import { combineReducers } from 'redux';
import authReducer from './authReducer';
import companyReducer from './companyReducer';
import jobReducer from './jobReducer';

export default combineReducers({
  auth: authReducer,
  company: companyReducer,
  job: jobReducer
});
