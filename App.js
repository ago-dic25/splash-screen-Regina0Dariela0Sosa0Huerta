import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [foto, setFoto] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Se necesitan permisos para guardar fotos en la galería.');
      }
    })();
  }, []);


  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Cargando permisos...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>No se concedieron permisos para la camara.</Text>
        <Button title="Conceder permisos" onPress={requestPermission} />
      </View>
    );
  }

  const tomarFoto = async () => {
    if (cameraRef.current) {
      try {
        const fotoData = await cameraRef.current.takePictureAsync();
        setFoto(fotoData.uri);
        console.log('Foto tomada:', fotoData.uri);
        await MediaLibrary.saveToLibraryAsync(fotoData.uri);
        console.log('Foto guardada');
      } catch (error) {
        console.log('Error al tomar la foto:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} />
      <Button title="Tomar Foto" onPress={tomarFoto} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  camera: {
    width: '90%',
    height: 400,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
