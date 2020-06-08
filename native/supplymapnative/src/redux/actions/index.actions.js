import axios from 'axios'
import csv2geojson from 'csv2geojson'

export const TEST_ACTION = 'TEST_ACTION';
export const FETCH_LOCATIONS_REQUEST = 'FETCH_LOCATIONS_REQUEST'
export const FETCH_LOCATIONS_COMPLETE = 'FETCH_LOCATIONS_COMPLETE'

export const fetchLocations = () => async (dispatch) => {
  let response = await axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vRebqazrV2dHi16R6ITZMc2SF3xg6bJhOcDkG2kYpChJjrqE8ndftmrDJ92-TOpKUMWGSpUKOgPRJkX/pub?output=csv')
  if (!response.data || response.status >= 300) return
  let geoJson = await new Promise((res, rej) => {
    csv2geojson.csv2geojson(response.data, {
      latfield: 'Latitude',
      lonfield: 'Longitude',
      delimiter: ','
    }, (err, data) => { res(data) })
  })
  dispatch({
    type: FETCH_LOCATIONS_COMPLETE,
    geoJson: geoJson
  })  
}