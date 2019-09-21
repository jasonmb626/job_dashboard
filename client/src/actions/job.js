import { ADD_JOB, EDIT_JOB, GET_JOBS, GET_TEMPLATES } from './types';
import Axios from 'axios';

export const addJob = job => dispatch => {
  Axios.post('api/jobs', job).then(res =>
    dispatch({
      type: ADD_JOB,
      payload: res.data
    })
  );
};

export const getTemplates = () => dispatch => {
  Axios.get('/api/templates')
    .then(res =>
      dispatch({
        type: GET_TEMPLATES,
        payload: res.data
      })
    )
    .catch(err => console.error(err));
};
