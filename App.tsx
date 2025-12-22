import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AnimatedSplashScreen } from './src/modules/ui/AnimatedSplashScreen'; // Importa el nuevo componente
import { RootNavigator } from './src/navigation/RootNavigator';
import { initDatabase } from './src/storage/sqlite';
import { CruciBot } from './src/ui/components/CruciBot';

// Mantenemos el Splash nativo visible hasta que la lógica inicial termine
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isDbReady, setIsDbReady] = useState(false);
  const [isSplashFinished, setIsSplashFinished] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // 1. Inicializar Base de Datos
        await initDatabase();
      } catch (e) {
        console.warn('Error iniciando la base de datos:', e);
      } finally {
        // 2. Cuando la DB está lista, ocultamos el splash nativo de Android
        setIsDbReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  // Paso 1: Mientras la DB carga, mostramos nada (el splash nativo se encarga)
  if (!isDbReady) {
    return null;
  }

  // Paso 2: Si la DB ya cargó pero la animación no terminó, mostramos la animación personalizada
  if (!isSplashFinished) {
    return (
      <AnimatedSplashScreen 
        onAnimationFinish={() => setIsSplashFinished(true)} 
      />
    );
  }

  // Paso 3: Render final de la App
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" /> 
      <RootNavigator />
      <CruciBot />
    </SafeAreaProvider>
  );
}