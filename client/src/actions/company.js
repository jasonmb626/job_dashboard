import { CLEAR_POSSIBLE_COMPANIES, ADD_POSSIBLE_COMPANIES } from './types';
import Axios from 'axios';

const excludes = ['the', 'of', 'at'];

export const clearPossibleCompanies = () => {
  return {
    type: CLEAR_POSSIBLE_COMPANIES
  };
};

export const addPossibleCompanies = text => dispatch => {
  text
    .toLowerCase()
    .split(' ')
    .forEach(word => {
      if (!excludes.includes(word)) {
        Axios.get(`/api/companies/string/${encodeURIComponent(word)}`)
          .then(res => {
            dispatch({
              type: ADD_POSSIBLE_COMPANIES,
              payload: res.data
            });
          })
          .catch();
      }
    });
  return {
    type: CLEAR_POSSIBLE_COMPANIES
  };
};
