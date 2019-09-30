import {
  JOBS_LOADING,
  ADD_JOB,
  CLEAR_JOB,
  ADD_ACTION,
  EDIT_JOB,
  GET_JOBS,
  GET_JOB,
  GET_TEMPLATES,
  SET_FIELD,
  CLEAR_ACTION,
  CLEAR_HIRING_MANAGER,
  UPDATE_HIRING_MANAGER
} from '../actions/types';

const initialState = {
  jobs: [],
  job: {
    _id: '',
    finished_applying: false,
    title: '',
    company_name: '',
    where_listed: '',
    follow_up: '',
    hiring_manager_name: '',
    hiring_manager_title: '',
    hiring_manager_contact_linkedin: '',
    hiring_manager_contact_email: '',
    hiring_manager_contact_phone: '',
    hiring_managers: [],
    action_name: '',
    action_description: '',
    action_date: '',
    actions: [],
    still_open: true,
    toggle_show_cover_letter: false,
    cover_letter_template_select: 0,
    cover_letter: ''
  },
  jobLoading: true,
  jobsLoading: true,
  templates: []
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
        templates: [...action.payload]
      };
    case ADD_JOB:
      return {
        ...state,
        jobs: [...state.jobs, action.payload],
        job: { ...state.job, ...action.payload }
      };
    case CLEAR_JOB:
      return {
        ...state,
        job: {
          _id: '',
          finished_applying: false,
          title: '',
          company_name: '',
          where_listed: '',
          follow_up: '',
          hiring_manager_name: '',
          hiring_manager_title: '',
          hiring_manager_contact_linkedin: '',
          hiring_manager_contact_email: '',
          hiring_manager_contact_phone: '',
          hiring_managers: [],
          action_name: '',
          action_description: '',
          action_date: '',
          actions: [],
          still_open: true,
          toggle_show_cover_letter: false,
          cover_letter_template_select: 0,
          cover_letter: ''
        }
      };
    case CLEAR_HIRING_MANAGER:
      return {
        ...state,
        job: {
          ...state.job,
          hiring_manager_name: '',
          hiring_manager_title: '',
          hiring_manager_contact_linkedin: '',
          hiring_manager_contact_email: '',
          hiring_manager_contact_phone: ''
        }
      };
    case CLEAR_ACTION:
      return {
        ...state,
        job: {
          ...state.job,
          action_name: '',
          action_description: '',
          action_date: ''
        }
      };
    case ADD_ACTION:
      return {
        ...state,
        job: {
          ...state.job,
          actions: [action.payload, ...state.job.actions]
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
          follow_up:
            action.payload.follow_up && action.payload.follow_up.slice(0, 10)
        }
      };
    case SET_FIELD:
      return {
        ...state,
        job: { ...state.job, [action.payload.field]: action.payload.value }
      };
    case UPDATE_HIRING_MANAGER:
      if (action.payload._id)
        return {
          ...state,
          job: {
            ...state.job,
            hiring_managers: state.job.hiring_managers.map(manager =>
              manager._id === action.payload._id
                ? { ...manager, [action.payload.field.slice(15)]: action.value } //text input name is hiring_manager_* but field name is just *
                : manager
            )
          }
        };
      else
        return {
          ...state,
          job: {
            ...state.job,
            [action.payload.field]: action.payload.value
          }
        };
    default:
      return state;
  }
};
