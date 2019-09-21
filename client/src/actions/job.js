import {
  JOBS_LOADING,
  ADD_JOB,
  ADD_ACTION,
  EDIT_JOB,
  GET_JOBS,
  GET_JOB,
  GET_TEMPLATES,
  SET_FIELD
} from './types';
import Axios from 'axios';

export const getJobs = () => dispatch => {
  Axios.get('/api/jobs').then(res =>
    dispatch({
      type: GET_JOBS,
      payload: res.data
    })
  );
};

export const getJob = id => dispatch => {
  Axios.get(`/api/jobs/${id}`).then(res => {
    const jobs = { ...res.data };
    jobs.company_name = jobs.company.name;
    dispatch({
      type: GET_JOB,
      payload: jobs
    });
  });
};

export const addJob = job => dispatch => {
  dispatch({
    type: JOBS_LOADING
  });
  Axios.post('/api/jobs', job).then(res =>
    dispatch({
      type: ADD_JOB,
      payload: res.data
    })
  );
};

export const addAction = (id, action) => dispatch => {
  Axios.post(`/api/jobs/${id}/addAction`, action).then(res => {
    return {
      type: ADD_ACTION,
      payload: action
    };
  });
};

export const editJob = job => dispatch => {
  dispatch({
    type: JOBS_LOADING
  });
  Axios.post(`/api/jobs/${job._id}`, job).then(res =>
    dispatch({
      type: EDIT_JOB,
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

export const setField = (field, value) => {
  return {
    type: SET_FIELD,
    payload: {
      field,
      value
    }
  };
};
