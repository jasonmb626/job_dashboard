import {
  CLEAR_POSSIBLE_COMPANIES,
  ADD_POSSIBLE_COMPANIES
} from '../actions/types';

const initialState = {
  possible_matches: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_POSSIBLE_COMPANIES:
      return { possible_matches: [] };
    case ADD_POSSIBLE_COMPANIES:
      const newValues = [];
      action.payload.forEach(company => {
        if (
          !state.possible_matches.some(possible => possible._id === company._id)
        )
          newValues.push(company);
      });
      return {
        possible_matches: [...state.possible_matches, ...newValues]
      };
    default:
      return state;
  }
};
