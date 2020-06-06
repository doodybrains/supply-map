import React from 'react'
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'
import csv2geojson from 'csv2geojson';
import axios from 'axios';
import moment from 'moment';

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

    this.addToMap=this.addToMap.bind(this);
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;

    const map = new mapboxgl.Map({
      container: this.mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    let _this = this;
    map.on('load',function(){
      axios.get(`${process.env.REACT_APP_GOOGLE_SHEET}`)
      .then((response) => {
        _this.setState({locations: response.data, mb: map});
        _this.addToMap(_this.state.mb);
      });
      setInterval(_this.addToMap,5000);
    });
  }

  addToMap(m) {
    if (this.state.locations) {
      let todaysDate = moment().format('M/D/YY');
      // console.log('loaded', this.state.locations)
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
              'circle-radius': 7,
              'circle-color': "hotpink"
            },
            "filter": ["==", "Date", todaysDate]
          });

          m.on('click', 'csvData', function (e) {
            var coordinates = e.features[0].geometry.coordinates.slice();
            console.log(e.features[0].properties);
            var description = `<h3>${e.features[0].properties.Name}</h3><b>Date</b>:<h4>${e.features[0].properties.Date}</h4><b>Time</b>:<h4>${e.features[0].properties.Time}</h4><b>Address</b>:<p>${e.features[0].properties.Address}</p><b>Bathroom</b>:<p>${e.features[0].properties.Bathroom}</p><b>More Info</b>:<p>${e.features[0].properties.Notes}</p><br/>`;

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(description)
              .addTo(m);
          });
        }
      });
    }
  }
  render() {
    const { lng, lat, zoom } = this.state;

    return (
      <div>
        <div ref={this.mapRef} className="absolute top right left bottom" />
      </div>
    );
  }
}

ReactDOM.render(<Application />, document.getElementById('app'));
