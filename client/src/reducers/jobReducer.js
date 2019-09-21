import { ADD_JOB, EDIT_JOB, GET_JOBS, GET_TEMPLATES } from '../actions/types';

const initialState = {
  jobs: [],
  job: {},
  cover_letters: []
};

export default (state = initialState, action) => {
  switch (action.type) {
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
    case GET_JOBS:
      return {
        ...state,
        jobs: action.payload
      };
    default:
      return state;
  }
};
