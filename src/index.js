import React from 'react'
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'
import csv2geojson from 'csv2geojson';
import axios from 'axios';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX;

class Application extends React.Component {
  mapRef = React.createRef();

  constructor(props: Props) {
    super(props);
    this.state = {
      lng: -73.9430786608703,
      lat: 40.77609485,
      zoom: 12,
      locations: null,
      mb: null
    };
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;

    const map = new mapboxgl.Map({
      container: this.mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [lng, lat],
      zoom: zoom
    });

    axios.get(process.env.REACT_APP_GOOGLE_SHEET)
    .then((response) => {
      this.setState({locations: response.data, mb: map});
      this.addToMap(this.state.mb);
    });
  }

  addToMap(m) {
    if (this.state.locations) {
      console.log('loaded', this.state.locations)
      csv2geojson.csv2geojson(this.state.locations, {
        latfield: 'Latitude',
        lonfield: 'Longitude',
        delimiter: ','
      }, function (err, data) {
        if (m) {
          m.addLayer({
            'id': 'csvData',
            'type': 'circle',
            'source': {
              'type': 'geojson',
              'data': data
            },
            'paint': {
              'circle-radius': 10,
              'circle-color': "hotpink"
            }
          });
        }

      });
    }

  }
  render() {
    const { lng, lat, zoom } = this.state;

    return (
      <div>
        <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
          <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
        </div>
        <div ref={this.mapRef} className="absolute top right left bottom" />
      </div>
    );
  }
}

ReactDOM.render(<Application />, document.getElementById('app'));
