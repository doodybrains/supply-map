import axios from 'axios'
import csv2geojson from 'csv2geojson'
import { REACT_APP_GOOGLE_SHEET, REACT_APP_MAPBOX } from 'react-native-dotenv'

export const TEST_ACTION = 'TEST_ACTION';
export const FETCH_LOCATIONS_REQUEST = 'FETCH_LOCATIONS_REQUEST'
export const FETCH_LOCATIONS_COMPLETE = 'FETCH_LOCATIONS_COMPLETE'

export const fetchLocations = () => async (dispatch) => {
  let geoJson
  try {
    let response = await axios.get(REACT_APP_GOOGLE_SHEET)
    if (!response.data || parseInt(response.status) >= 300) return
    geoJson = await new Promise((res, rej) => {
      csv2geojson.csv2geojson(response.data, {
        latfield: 'Latitude',
        lonfield: 'Longitude',
        delimiter: ','
      }, (err, data) => { 
        if (data) res(data)
        else rej('Failed')
      })
    })  
  } catch (e) {
    if (e) {
      console.log('Promise fail')
      return
    }
  }
  dispatch({
    type: FETCH_LOCATIONS_COMPLETE,
    geoJson: geoJson
  })  
}