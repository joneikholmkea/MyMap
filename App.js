import { StatusBar } from 'expo-status-bar';
import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location'


export default function App() {
  const [markers, setMarkers]= useState([])
  const [region, setRegion] = useState({
    latitude:55,
    longitude:12,
    latitudeDelta:20,
    longitudeDelta:20
  })

  const mapView = useRef(null) // ref. til map view objektet.
  const locationSubscription = useRef(null) // når vi lukker appen, skal den ikke lytte mere

  useEffect(() =>{
    async function startListening(){
      let { status } = await Location.requestForegroundPermissionsAsync()
      if(status !== 'granted'){
        alert("ingen adgang til lokation")
        return
      }
      locationSubscription.current = await Location.watchPositionAsync({
        distanceInterval: 100,
        accuracy: Location.Accuracy.High
      }, (lokation) =>{
        const newRegion = {
          latitude: lokation.coords.latitude,
          longitude: lokation.coords.longitude,
          latitudeDelta:20,
          longitudeDelta:20
        }
        setRegion(newRegion) // flytter kortet til den nye lokation
        if(mapView.current){
          mapView.current.animateToRegion(newRegion)
        }
      })
    }
    startListening()
    return ()=>{ // for at slukke når appen lukker
      if(locationSubscription.current){
        locationSubscription.current.remove()
      }
    }
  },[]) 

  function addMarker(data){
      const {latitude, longitude} = data.nativeEvent.coordinate
      const newMarker = {
        coordinate: {latitude, longitude},
        key: data.timeStamp,
        title:"Great place"
      }
      setMarkers([...markers, newMarker])
  }

function onMarkerPressed(text){
  alert("you pressed " + text)
}


  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onLongPress={addMarker}
      >
        {markers.map(marker =>(
          <Marker
              coordinate={marker.coordinate}
              key={marker.key}
              title={marker.title}
              onPress={() => onMarkerPressed(marker.title)}
          />
        ))

        }
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width:'100%',
    height:'100%'
  },
});
