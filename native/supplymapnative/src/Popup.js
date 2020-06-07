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
    let { Name, Date, Time, Address, Bathroom, Notes } = contents
    if (Bathroom == '') Bathroom = 'N/A'

    return (
      <View style={styles.container}>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.heading}>{Name}</Text>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Available for: </Text>
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
  container: {
    backgroundColor: 'white',
    borderRadius: 5,
    width: 250,
    height: 300,
    padding: 12,
    transform: [{ translateY: '-150'}]
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    maxWidth: 180
  },
  sectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 7,
    maxWidth: 200
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  sectionContent: {
    fontSize: 14,
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
