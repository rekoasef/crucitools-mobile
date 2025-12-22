// App.tsx

import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { initDatabase } from './src/storage/sqlite';

// Mantenemos el Splash nativo visible hasta que la lógica inicial termine
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Inicializar Base de Datos SQLite
        await initDatabase();
      } catch (e) {
        console.warn('Error iniciando la base de datos:', e);
      } finally {
        // Cuando la DB está lista, permitimos el renderizado
        setIsDbReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isDbReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" /> 
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}