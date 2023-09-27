import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, {Marker} from 'react-native-maps';

export default function App() {
  const [markers, setMarkers] = useState([])
  const [region, setRegion] = useState({
    latitude:55,
    longitude:12,
    latitudeDelta:20,
    longitudeDelta:20
  })

function addMarker(data){
  const {latitude, longitude} = data.nativeEvent.coordinate
  markers.push(
    <Marker 
        coordinate={{latitude, longitude}}
        key={data.timeStamp}
        onPress={onPressMarker}
    />
  )
  setRegion({
    ...region,
    latitude: region.latitude
  })
}

function onPressMarker(data){
  alert("you pressed " + data.timeStamp)
}


  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onLongPress={addMarker}
      >
        {markers}
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
