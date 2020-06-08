import React, { Component, useCallback } from 'react'
import * as timeago from 'timeago.js'
import moment from 'moment'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Linking
} from 'react-native'

import { Colors } from 'react-native/Libraries/NewAppScreen'

import gridPattern from '../assets/grid_pattern.png'
import MapboxGL from "@react-native-mapbox-gl/maps"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Popup from './Popup'
import ResourceView from './ResourceView'
import { fetchLocations } from './redux/actions/index.actions'
import { REACT_APP_GOOGLE_SHEET, REACT_APP_MAPBOX } from 'react-native-dotenv'

const DEFAULT_START_COORDINATE = [-73.9430786608703, 40.77609485];
MapboxGL.setAccessToken(REACT_APP_MAPBOX)
// MapboxGL.setConnected(true)

class Map extends Component {
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
  componentDidMount() {
    MapboxGL.setTelemetryEnabled(false)
    const { fetchLocations } = this.props
    fetchLocations()
    this._fetchTimer = setInterval(() => {
      fetchLocations()
    }, 30000)    
  }
  componentWillUnmount() {
    clearInterval(this._fetchTimer)
  }
  componentDidUpdate() {
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
  openLink = (link) => {
    Linking.openURL(link)
  }
  render() {
    const { geoJson, lastUpdate } = this.props
    let todaysDate = moment().format('M/D/YY');
    const timeAgo = timeago.format(lastUpdate)
    const { annotationCoordinates, annotationOpen, annotationContents, cameraAnimationDuration, zoom } = this.state
    return (
      <>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.safeAreaView}>
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
                      filter={['all', ['==', 'SuppliesNeeded', 'Yes'], ['==', 'Date', todaysDate]] }
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
                      filter={['all', ['!=', 'SuppliesNeeded', 'Yes'], ['==', 'Bathroom', 'Yes'], ['==', 'Date', todaysDate]]}
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
                      filter={['all', ['!=', 'SuppliesNeeded', 'Yes'], ['!=', 'Bathroom', 'Yes'], ['==', 'Date', todaysDate]]}
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
          {/* <View style={styles.lastUpdated}>
            <Text style={styles.lastUpdatedText}>Last updated: {timeAgo}</Text>
          </View> */}
          <View style={styles.header}>
            <Text style={styles.headerText}>
              SUPPLIES LOCATIONS 4 BLM PROTESTORS ~ INFO REFLECTS WHAT'S AVAILABLE TODAY ~ CLICK DOTS FOR MORE INFO
            </Text>
          </View>
          <View style={styles.footer}>
            <View >
              <TouchableOpacity onPress={() => this.openLink('https://m4bl.org/')}>
                <Text style={styles.linkText}>#DEFUNDPOLICE #DEFENDBLACKLIFE</Text>
              </TouchableOpacity> 
              <Text>
                <Text style={styles.headerText}> - the code for this map can be found </Text>
                <Text style={styles.linkText} onPress={() => this.openLink('https://github.com/doodybrains/supply-map')}>
                  here 
                </Text>
                <Text style={styles.headerText}>
                  - submit requests and issues as they come up!
                </Text>
              </Text>
            </View>
            <Text style={styles.lastUpdatedText}>Last updated: {timeAgo}</Text>
          </View>
          { annotationOpen &&
            <ResourceView
              contents={annotationContents}
              onClose={this.onPopupClose}
            />
          }
        </SafeAreaView>
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
  safeAreaView: {
    flex: 1,
    position: 'relative'
  },
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
    backgroundColor: "black"
  },
  map: {
    flex: 1
  },
  lastUpdated: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    padding: 5,
    paddingTop: 10,
    backgroundColor: 'black'
  },
  lastUpdatedText: {
    fontSize: 9,
    color: 'white',
    paddingTop: 5,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    paddingTop: 25,
    paddingBottom: 5
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    paddingTop: 5,
    paddingBottom: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    color: 'white',
    textAlign: 'center'
  },
  linkText: {
    color: 'white',
    textAlign: 'center',
    textDecorationLine: 'underline'
  }
});

const mapStateToProps = (state) => ({
  geoJson: state.SupplyMapReducer.geoJson,
  lastUpdate: state.SupplyMapReducer.lastUpdate
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    fetchLocations,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Map);
