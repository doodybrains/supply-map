import {TEST_ACTION} from '../actions/index.actions';

const supplyMapReducer = (state = {}, action) => {
  switch (action.type) {
    case TEST_ACTION: {
      return action.payload;
    }
    default:
      return state;
    }
};

export default supplyMapReducer;