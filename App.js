import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Dimensions, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';

import img1 from './assets/CW.jpg';
import img2 from './assets/HearthMemorial.jpg';
import img3 from './assets/GPalace.jpg';
import img4 from './assets/Amp.jpg';
import img5 from './assets/CrimDell.jpg';
import img6 from './assets/Sunken.jpeg';
import img7 from './assets/park.jpg';
import img8 from './assets/LawSchool.jpg';



const { width, height } = Dimensions.get('window');
export default function App() {
  const [markers, setMarkers] = useState([
    { key: '1', coords: { latitude: 37.274332, longitude: -76.703926 }, title: 'Colonial Williamsburg', description: 'Immersed in the historical charm of Colonial Williamsburg, visitors are transported back in time as they witness the meticulous emulation of colonial practices and traditions. This living museum serves as a cultural repository for Williamsburg and all of America, imparting valuable lessons about our shared history through engaging and immersive experiences.', image: img1 },
    { key: '2', coords: { latitude: 37.270304, longitude: -76.709370 }, title: 'Hearth Memorial', description: 'The Hearth Memorial is a prominent symbol, encompassing the entirety of colonial history and acknowledging the blemishes that have marked our past. It serves as a constant reminder of the injustices inflicted through slavery and racial discrimination. Each brick, named and unnamed, represents the countless slaves who were forced to serve in a community that purported to benefit all while enduring the hardships and discrimination of their time.', image: img2 },
     { key: '3', coords: { latitude: 37.273851, longitude: -76.702085 }, title: 'Governors Palace', description: 'Where the governor stayed surrounded by the luxury of a beautiful creek and glorious garden bricked in from the greater community.', image: img3 },
      { key: '4', coords: { latitude: 37.266356, longitude: -76.721838 }, title: 'Martha Wren Briggs Amphitheatre', description: 'Located by Lake, Matoaka, the amphitheatre is a stable of events and performances that are carried out by the students of William and Mary as well as a reformation of the forgotten amphitheater that laid only a couple meters away buried by trees and rubble', image: img4 },
      { key: '5', coords: { latitude:37.270624, longitude: -76.713411 }, title: 'Crim Dell Bridge', description: 'Shrouded by superstition, the William and Mary campus beckons the community and students, offering a picturesque path for an enchanting stroll.', image: img5 },
      { key: '6', coords: { latitude: 37.270460, longitude: -76.711159 }, title: 'Sunken Garden', description: 'Amidst the daily hustle and bustle, a remarkable William and Mary monument offers a tranquil respite for the community and students. This grand field invites all to take a moment of leisure and disconnect from the chaos, allowing them to rejuvenate and find solace.', image: img6 },
      { key: '7', coords: { latitude: 37.267229, longitude:  -76.704551 }, title: 'Bicentennial Park', description: 'Nestled in the heart of the Williamsburg community lies a quaint park adorned with statues. These sculptures serve as a captivating tribute to the enduring legacy of William and Mary, evoking college spirit and enhancing the overall scenery.', image: img7 },
      { key: '8', coords: { latitude: 37.264688, longitude:  -76.704638 }, title: 'William & Mary Law School', description: 'Renowned globally as an eminent institution of legal education, this prestigious law school has garnered a distinguished reputation throughout history. It is a revered place of study, fostering growth and upholding law and order, shaping the future leaders who will impact our world.', image: img8 },
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
      latitudeDelta: .005,
      longitudeDelta: .005,
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
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
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
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
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
    width: '100%',
    height: '40%',
    transform: [{ translateY: 170 }]

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
    padding: 10, 
    alignItems: 'center',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#115740',
    position: 'absolute',
    color: 'white',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10
  },
  imageContainer: { // CHANGED: CONTAINER FOR THE IMAGE AT THE BOTTOM
    position: 'absolute',
    bottom: 50, 
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    zIndex: 10,
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

  },
});