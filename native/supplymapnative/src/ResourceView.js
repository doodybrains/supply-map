import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'

export default class Popup extends Component {
  state = {}
  onClose = (e) => {
    const { onClose } = this.props
    if (onClose) onClose(e)
  }
  render() {
    const { contents } = this.props
    let { Name, Date, Time, Address, Bathroom, Notes, SuppliesNeeded } = contents
    if (Bathroom == '') Bathroom = 'N/A'
    const hasBathroom = Bathroom.toUpperCase() == 'YES'
    const suppliesNeeded = SuppliesNeeded.toUpperCase() == 'YES'

    return (
      <View style={styles.container}>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.tags}>
            { !suppliesNeeded && <View style={styles.supplies}><Text style={styles.tagText}>Supplies Available</Text></View> }
            { !suppliesNeeded && hasBathroom && <View style={styles.bathroom}><Text style={styles.tagTextBlack}>Bathroom Available</Text></View> }
            { suppliesNeeded && <View style={styles.suppliesNeeded}><Text style={styles.tagText}>Supplies Needed</Text></View>}
          </View>
          <Text style={styles.heading}>{Name}</Text>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Date: </Text>
            <Text style={styles.sectionContents}>{Date}</Text>          
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Time: </Text>
            <Text style={styles.sectionContents}>{Time}</Text>          
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Address: </Text>
            <Text style={styles.sectionContents}>{Address}</Text>          
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Bathroom: </Text>
            <Text style={styles.sectionContents}>{Bathroom}</Text>          
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>More Info: </Text>
            <Text style={styles.sectionContents}>{Notes}</Text>          
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.closeButton} onPress={this.onClose}>
          <Text style={{ color: 'black', fontWeight: 'bold' }}>✕</Text>
        </TouchableOpacity>

      </View>  
    )
  }
}

const styles = StyleSheet.create({
  tags: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 2
  },
  supplies: {
    backgroundColor: '#5D00FF',
    borderRadius: 10,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 3,
    paddingBottom: 3,
    marginRight: 5
  },
  bathroom: {
    backgroundColor: 'cyan',
    borderRadius: 10,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 3,
    paddingBottom: 3,
    marginRight: 5
  },
  suppliesNeeded: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 3,
    paddingBottom: 3,
    marginRight: 5
  },
  tagText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 11
  },
  tagTextBlack: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 11
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 10,
    height: 200,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    maxWidth: 220
  },
  sectionContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 7,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  sectionContents: {
    fontSize: 14,
    maxWidth: '75%'
  },
  closeButton: {
    borderWidth: 0,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 8,
    right: 5,
    zIndex: 10
  }
})
