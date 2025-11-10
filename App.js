import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [foto, setFoto] = useState(null);
  const cameraRef = useRef(null);
  const [mostrarSplash, setMostrarSplash] = useState(true); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setMostrarSplash(false);
    }, 5000); //milisegundos
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Se necesitan permisos para guardar fotos en la galeria.');
      }
    })();
  }, []);

  if (mostrarSplash) {
    return (
      <LinearGradient
        colors={['#fdf6ec', '#f0c987', '#dca47c']}
        style={styles.splashContainer}
      >
        <Image
          source={require('./assets/splash.png')}
          style={styles.splashImage}
          resizeMode="contain"
        />
      </LinearGradient>
    );
  }

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
        <Text>No se concedieron permisos para la camara</Text>
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

  splashContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  splashText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6b87d',
  },
  camera: {
    width: '90%',
    height: 400,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
