import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Dimensions, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import image1 from './assets/amp1.JPG';


const { width, height } = Dimensions.get('window');
export default function App() {
  const [markers, setMarkers] = useState([
    { key: '1', coords: { latitude: 37.274332, longitude: -76.703926 }, title: 'Colonial Williamsburg', description: 'Description for Colonial Williamsburg', image: image1 },
    { key: '2', coords: { latitude: 37.274332, longitude: -76.709370 }, title: 'Hearth Memorial', description: 'Description for Hearth Memorial', image: image1 },
    // ... add more markers with images as needed
  ]);

  const [selectedImage, setSelectedImage] = useState(markers[0].image);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [titleAndDescription, setTitleAndDescription] = useState({
    title: markers[0].title, 
    description: markers[0].description, 
  });
  const [currentMarker, setCurrentMarker] = useState(markers[0]);
  const mapRef = useRef(null);
  const markerRefs = useRef([]);

useEffect(() => {
    // CHANGED: SETTING THE SELECTED IMAGE AND TITLE/DESCRIPTION WHEN CURRENT INDEX CHANGES
    setSelectedImage(markers[currentIndex].image);
    setTitleAndDescription({
      title: markers[currentIndex].title,
      description: markers[currentIndex].description,
    });
  }, [currentIndex, markers]);

  useEffect(() => {
    if (markerRefs.current[currentIndex]) {
      markerRefs.current[currentIndex].showCallout();
    }
    setCurrentMarker(markers[currentIndex]);
  }, [currentIndex, markers]);

  const goToNextMarker = () => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= markers.length) {
      nextIndex = 0; // Wrap around to the first marker.
    }
    setCurrentIndex(nextIndex);
    mapRef.current.animateToRegion({
      ...markers[nextIndex].coords,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
    }, 1000); // Animate over 1000 ms
  };

  const goToPreviousMarker = () => {
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = markers.length - 1; // Wrap around to the last marker.
    }
    setCurrentIndex(prevIndex);
    mapRef.current.animateToRegion({
      ...markers[prevIndex].coords,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
    }, 1000); // Animate over 1000 ms
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{titleAndDescription.title}</Text>
        <Text style={styles.description}>{titleAndDescription.description}</Text>
      </View> 
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: markers[0].coords.latitude,
          longitude: markers[0].coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {markers.map((marker, index) => (
          <Marker 
            key={marker.key} 
            coordinate={marker.coords}
            title={marker.title}
            ref={ref => markerRefs.current[index] = ref}
          >
            <Callout tooltip>
              <View style={styles.calloutView}>
                <Text style={styles.calloutTitle}>{marker.title}</Text>
                <Text>{marker.description}</Text>
                {currentMarker && currentMarker.key === marker.key && !selectedImage && (
                  <Image
                    source={marker.image}
                    style={styles.calloutImage}
                    resizeMode="contain"
                  />
                )}
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {selectedImage && ( // CHANGED: ADDED CONDITIONAL RENDERING FOR SELECTED IMAGE
        <View style={styles.imageContainer}>
          <Image
            source={selectedImage}
            style={styles.bottomImage}
            resizeMode="contain"
          />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={goToPreviousMarker}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToNextMarker}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  calloutView: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
    fontSize: 22, // You can adjust the font size as needed
    textAlign: 'center',
  },
  button: {
    padding: 10, // Add padding for the touchable area
    alignItems: 'center', // Center the text within the button
    flex: 1, // Make the buttons take up equal space
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#115740',
    position: 'absolute',
    color: 'white',
    bottom: 10,
    left: 0,
    right: 0,
    padding: 10
  },
  imageContainer: { // CHANGED: CONTAINER FOR THE IMAGE AT THE BOTTOM
    position: 'absolute',
    bottom: 88, 
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  infoContainer: { // Style for the container of title and description
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    width: '100%',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    zIndex: 10,
  },
  bottomImage: {
    width: width,
    height: height/3,
    borderRadius: 10,
  }
});
