// src/navigation/RootNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { theme } from '../core/theme';

// Importar pantallas
import { HomeScreen } from '../modules/home/screens/HomeScreen';
import { LibraryScreen } from '../modules/library/screens/LibraryScreen';
import { CvCalculatorScreen } from '../modules/tools/screens/CvCalculatorScreen';
import { DensityScreen } from '../modules/tools/screens/DensityScreen';
import { SpeedCheckScreen } from '../modules/tools/screens/SpeedCheckScreen';
import { ToolsMenuScreen } from '../modules/tools/screens/ToolsMenuScreen';
import { WheelCalculatorScreen } from '../modules/tools/screens/WheelCalculatorScreen'; // <--- NUEVO

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.headerBackground,
          },
          headerTintColor: theme.colors.textInverse,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }}
        />
        
        <Stack.Screen 
            name="ToolsMenu" 
            component={ToolsMenuScreen} 
            options={{ title: 'HERRAMIENTAS' }}
        />

        <Stack.Screen 
            name="SpeedCheck" 
            component={SpeedCheckScreen} 
            options={{ title: 'VELOCIDAD SIEMBRA' }}
        />

        <Stack.Screen 
            name="DensityCalc" 
            component={DensityScreen} 
            options={{ title: 'CALCULADORA DENSIDAD' }}
        />

        <Stack.Screen 
            name="CvCalculator" 
            component={CvCalculatorScreen} 
            options={{ title: 'CALCULADORA CV %' }}
        />

        {/* NUEVA RUTA */}
        <Stack.Screen 
            name="WheelCalculator" 
            component={WheelCalculatorScreen} 
            options={{ title: 'RUEDA DE MANDO' }}
        />

        <Stack.Screen 
        name="Library" 
        component={LibraryScreen} 
        options={{ title: 'BIBLIOTECA' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};