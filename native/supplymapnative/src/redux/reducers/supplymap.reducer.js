import { TEST_ACTION, FETCH_LOCATIONS_REQUEST, FETCH_LOCATIONS_COMPLETE } from '../actions/index.actions';

const initialState = {
  geoJson: null,
  lastUpdate: -1
}

const supplyMapReducer = (state = initialState, action) => {
  switch (action.type) {
    case TEST_ACTION: {
      return action.payload;
    }
    case FETCH_LOCATIONS_REQUEST: {
      return state
    }
    case FETCH_LOCATIONS_COMPLETE: {
      console.log('reducer fetchLocations', action.geoJson)
      return {
        ...state,
        geoJson: action.geoJson,
        lastUpdate: new Date().getTime()
      }
    }
    default:
      return state;
    }
};

export default supplyMapReducer;