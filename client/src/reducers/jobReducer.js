import {
  JOBS_LOADING,
  ADD_JOB,
  ADD_ACTION,
  EDIT_JOB,
  GET_JOBS,
  GET_JOB,
  GET_TEMPLATES,
  SET_FIELD
} from '../actions/types';

const initialState = {
  jobs: [],
  job: {
    _id: '',
    title: '',
    company_name: '',
    where_listed: '',
    follow_up: '',
    history: [],
    toggle_show_cover_letter: false,
    cover_letter_template_select: 0,
    cover_letter: ''
  },
  jobLoading: true,
  jobsLoading: true,
  cover_letters: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case JOBS_LOADING:
      return {
        ...state,
        jobsLoading: true
      };
    case GET_TEMPLATES:
      return {
        ...state,
        cover_letters: [...action.payload]
      };
    case ADD_JOB:
      return {
        ...state,
        jobs: [...state.jobs, action.payload]
      };
    case ADD_ACTION:
      console.log(action.payload);
      return {
        ...state,
        job: {
          ...state.job,
          history: [action.payload, ...state.job.history]
        }
      };
    case EDIT_JOB:
      return {
        ...state,
        jobs: [
          ...state.jobs.map(job => {
            if (job._id !== action.payload._id) return job;
            else return { ...job, ...action.payload };
          })
        ],
        jobsLoading: false
      };
    case GET_JOBS:
      return {
        ...state,
        jobs: action.payload,
        jobsLoading: false
      };
    case GET_JOB:
      return {
        ...state,
        jobLoading: false,
        job: {
          ...state.job,
          ...action.payload,
          company_name: action.payload.company.name,
          follow_up: action.payload.follow_up.slice(0, 10)
        }
      };
    case SET_FIELD:
      return {
        ...state,
        job: { ...state.job, [action.payload.field]: action.payload.value }
      };
    default:
      return state;
  }
};
