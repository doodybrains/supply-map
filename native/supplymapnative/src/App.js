import React, { Component } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity
} from 'react-native'

import { Colors } from 'react-native/Libraries/NewAppScreen'

import gridPattern from '../assets/grid_pattern.png'
import smileyFaceGeoJSON from '../assets/smiley_face.json'
import MapboxGL from "@react-native-mapbox-gl/maps"
import axios from 'axios'
import csv2geojson from 'csv2geojson'
import Popup from './Popup'
import ResourceView from './ResourceView'

const DEFAULT_START_COORDINATE = [-73.9430786608703, 40.77609485];
MapboxGL.setAccessToken("pk.eyJ1IjoiZG9vZHlicmFpbnMiLCJhIjoiY2tiMTgzbG9hMGk3YzJ0cHBpajhxa3BhZSJ9.-jakz9_3ComMK-QCxnQQIQ")
// MapboxGL.setConnected(true)

class App extends Component {
  state = {
    annotationOpen: false,
    annotationCoordinates: DEFAULT_START_COORDINATE,
    cameraAnimationDuration: 2000,
    zoom: 12
  }
  _zoom = 12
  constructor(props) {
    super(props)
  }
  fetchData = async () => {
    let res = await axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vRebqazrV2dHi16R6ITZMc2SF3xg6bJhOcDkG2kYpChJjrqE8ndftmrDJ92-TOpKUMWGSpUKOgPRJkX/pub?output=csv')
    // console.log('res is: ', res.data)
    const that = this

    csv2geojson.csv2geojson(res.data, {
      latfield: 'Latitude',
      lonfield: 'Longitude',
      delimiter: ','
    }, function (err, data) {
      that.setState({ geoJson: data })
      // console.log('data: ', data)
    })

    // let json = await res.json()
    // console.log('json is: ', json)
  }
  componentDidMount() {
    MapboxGL.setTelemetryEnabled(false)
    this.fetchData()
  }
  onCircleLayerPress = (e) => {
    this.setState({ 
      annotationOpen: true, 
      annotationCoordinates: e.features[0].geometry.coordinates,
      annotationContents: e.features[0].properties,
      cameraAnimationDuration: 350
    })
  }
  onMapPress = (e) => {
    this.setState({ annotationOpen: false })
  }
  onPopupClose = (e) => {
    this.setState({ annotationOpen: false })
  }
  onRegionDidChange = async () => {
    const zoom = await this._map.getZoom();
    this._zoom = zoom
  }
  render() {
    const { geoJson, annotationCoordinates, annotationOpen, annotationContents, cameraAnimationDuration, zoom } = this.state
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <View style={styles.page}>
          <View style={styles.container}>
            <MapboxGL.MapView 
              style={styles.map} 
              onPress={this.onMapPress}
              ref={(c) => (this._map = c)}
              onRegionDidChange={this.onRegionDidChange}
              logoEnabled={false}
            >
              <MapboxGL.Camera
                zoomLevel={this._zoom}
                centerCoordinate={annotationCoordinates}
                animationDuration={cameraAnimationDuration}
              />

              { geoJson && // Supplies needed layer
                <MapboxGL.ShapeSource id="suppliesNeededSource" 
                  shape={geoJson} 
                  onPress={this.onCircleLayerPress}
                >
                  <MapboxGL.CircleLayer
                    id="suppliesNeeded"
                    style={layerStyles.suppliesNeeded}
                    filter={['==', 'SuppliesNeeded', 'Yes']}
                  />
                </MapboxGL.ShapeSource>              
              }

              { geoJson && // Has Bathroom layer
                <MapboxGL.ShapeSource id="hasBathroomSource" 
                  shape={geoJson} 
                  onPress={this.onCircleLayerPress}
                >
                  <MapboxGL.CircleLayer
                    id="hasBathroom"
                    style={layerStyles.withBathroom}
                    filter={['all', ['!=', 'SuppliesNeeded', 'Yes'], ['==', 'Bathroom', 'Yes']]}
                  />
                </MapboxGL.ShapeSource>              
              }

              { geoJson && // No bathroom layer
                <MapboxGL.ShapeSource id="noBathroomSource" 
                  shape={geoJson} 
                  onPress={this.onCircleLayerPress}
                >
                  <MapboxGL.CircleLayer
                    id="noBathroom"
                    style={layerStyles.noBathroom}
                    filter={['all', ['!=', 'SuppliesNeeded', 'Yes'], ['!=', 'Bathroom', 'Yes']]}
                  />
                </MapboxGL.ShapeSource>              
              }

              { false && annotationOpen && 
                <MapboxGL.PointAnnotation
                  coordinate={annotationCoordinates}
                  id="pt-ann">
                  <Popup 
                    contents={annotationContents}
                    onClose={this.onPopupClose}
                  />
                </MapboxGL.PointAnnotation>
              }

              {/* <MapboxGL.MarkerView coordinate={DEFAULT_START_COORDINATE}>
                <AnnotationContent title={'this is a marker view'} />
              </MapboxGL.MarkerView> */}
            </MapboxGL.MapView>
          </View>
        </View>
        { annotationOpen &&
          <ResourceView
            contents={annotationContents}
            onClose={this.onPopupClose}
          />
        }
      </>
    );
  }
};

const layerStyles = {
  background: {
    backgroundPattern: gridPattern,
  },
  suppliesNeeded: {
    fillAntialias: true,
    circleRadius: 8,
    circleColor: 'red',
    circleStrokeWidth: 0,
  },
  withBathroom: {
    fillAntialias: true,
    fillColor: 'white',
    fillOutlineColor: 'rgba(255, 255, 255, 0.84)',
    circleRadius: 8,
    circleColor: '#5D00FF',
    circleStrokeWidth: 4,
    circleStrokeColor: 'cyan'
  },
  noBathroom: {
    fillAntialias: true,
    fillColor: 'white',
    fillOutlineColor: 'rgba(255, 255, 255, 0.84)',
    circleRadius: 10,
    circleColor: '#5D00FF',
    circleStrokeWidth: 0,
    circleStrokeColor: 'cyan'
  },
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "tomato"
  },
  map: {
    flex: 1
  }
});

/*
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Step One</Text>
                <Text style={styles.sectionDescription}>
                  Edit <Text style={styles.highlight}>App.js</Text> to change this
                  screen and then come back to see your edits.
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>See Your Changes</Text>
                <Text style={styles.sectionDescription}>
                  <ReloadInstructions />
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Debug</Text>
                <Text style={styles.sectionDescription}>
                  <DebugInstructions />
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Learn More</Text>
                <Text style={styles.sectionDescription}>
                  Read the docs to discover what to do next:
                </Text>
              </View>
              <LearnMoreLinks />
            </View>
          </ScrollView>

*/

export default App;
