import uuid from 'uuid';
import {
  JOBS_LOADING,
  JOB_LOADING,
  ADD_JOB,
  CLEAR_JOB,
  ADD_ACTION,
  ADD_HIRING_MANAGER,
  EDIT_JOB,
  GET_JOBS,
  GET_JOB,
  GET_TEMPLATES,
  SET_FIELD,
  CLEAR_ACTION,
  CLEAR_HIRING_MANAGER,
  UPDATE_HIRING_MANAGER
} from './types';
import Axios from 'axios';

export const getJobs = () => dispatch => {
  dispatch({
    type: JOBS_LOADING
  });
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
    dispatch({
      type: GET_JOB,
      payload: jobs
    });
  });
};

export const addJob = job => dispatch => {
  dispatch({
    type: JOB_LOADING
  });
  dispatch({
    type: JOBS_LOADING
  });
  const action = {
    _id: uuid.v4(),
    name: job.action_name,
    description: job.action_description,
    date: job.action_date
  };
  const hiring_manager = {
    _id: uuid.v4(),
    name: job.hiring_manager_name,
    title: job.hiring_manager_title,
    contact_linkedin: job.hiring_manager_contact_linkedin,
    contact_email: job.hiring_manager_contact_email,
    contact_phone: job.hiring_manager_contact_phone
  };
  if (action.name) job.actions.unshift(action);
  if (hiring_manager.name) job.hiring_managers.unshift(hiring_manager);
  console.log(job);
  Axios.post('/api/jobs', job).then(res =>
    dispatch({
      type: ADD_JOB,
      payload: res.data
    })
  );
};

export const clearJob = () => {
  return {
    type: CLEAR_JOB
  };
};

export const getCoverLetter = id => {
  Axios({
    url: `/api/jobs/${id}/cover_letter`,
    method: 'GET',
    responseType: 'blob' // important
  }).then(response => {
    let headers = '';
    Object.keys(response.headers).forEach(
      key =>
        (headers += response.headers[key] === '' ? ' ' : response.headers[key])
    );
    const start = headers.indexOf('filename=') + 'filename='.length + 1;
    const end = headers.indexOf('"', start);
    const filename = headers.slice(start, end);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
  });
};

export const addAction = (id, action) => dispatch => {
  const fullAction = { ...action, _id: uuid.v4() };
  if (id) Axios.post(`/api/jobs/${id}/addAction`, fullAction);
  return {
    type: ADD_ACTION,
    payload: fullAction
  };
};

export const addHiringManager = (id, hiring_manager) => {
  const full_hiring_manager = { ...hiring_manager, _id: uuid.v4() };
  if (id) Axios.post(`/api/jobs/${id}/addHiringManager`, full_hiring_manager);
  return {
    type: ADD_HIRING_MANAGER,
    payload: full_hiring_manager
  };
};

export const editJob = job => dispatch => {
  dispatch({
    type: JOB_LOADING
  });
  const action = {
    _id: uuid.v4(),
    action: job.action_name,
    description: job.action_description,
    date: job.action_date ? job.action_date : Date.now()
  };
  const hiring_manager = {
    _id: uuid.v4(),
    action: job.hiring_manager_name,
    title: job.hiring_manager_title,
    contact_linkedin: job.hiring_manager_contact_linkedin,
    contact_email: job.hiring_manager_contact_email,
    contact_phone: job.hiring_manager_contact_phone
  };
  if (action.action) job.actions.unshift(action);
  if (action.action === 'Job Closed') job.still_open = false;
  if (hiring_manager.name) job.hiring_managers.unshift(hiring_manager);
  console.log(`Syncing edit job to database for ${job._id}`);
  console.log(job);
  Axios.post(`/api/jobs/${job._id}`, job).then(res =>
    dispatch({
      type: EDIT_JOB,
      payload: res.data
    })
  );
  dispatch({
    type: CLEAR_ACTION
  });
  dispatch({
    type: CLEAR_HIRING_MANAGER
  });
};

export const getTemplates = type => dispatch => {
  if (type)
    Axios.get(`/api/templates/${type}`)
      .then(res =>
        dispatch({
          type: GET_TEMPLATES,
          payload: res.data
        })
      )
      .catch(err => console.error(err));
  else
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

export const updateHiringManager = (_id, field, value) => {
  console.log(`Updating hiring manager ${_id} ${field} ${value}`);
  return {
    type: UPDATE_HIRING_MANAGER,
    payload: {
      _id,
      field,
      value
    }
  };
};
