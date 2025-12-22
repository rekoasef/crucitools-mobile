// src/navigation/RootNavigator.tsx

import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { THEME_COLORS } from '../core/theme/colors';

// Pantallas
import { LoginScreen } from '../modules/auth/screens/LoginScreen';
import { CvCalculatorScreen } from '../modules/tools/screens/CvCalculatorScreen';
import { DensityScreen } from '../modules/tools/screens/DensityScreen';
import { DoseControlScreen } from '../modules/tools/screens/DoseControlScreen';
import { LeafCalibrationScreen } from '../modules/tools/screens/LeafCalibrationScreen';
import { SpeedCheckScreen } from '../modules/tools/screens/SpeedCheckScreen';
import { ToolsMenuScreen } from '../modules/tools/screens/ToolsMenuScreen';
import { WheelCalculatorScreen } from '../modules/tools/screens/WheelCalculatorScreen';
import { AnimatedSplashScreen } from '../modules/ui/AnimatedSplashScreen';

const Stack = createStackNavigator();

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: { backgroundColor: THEME_COLORS.headerBackground },
        headerTintColor: THEME_COLORS.textInverse,
        headerTitleStyle: { fontWeight: 'bold' },
        cardStyle: { backgroundColor: THEME_COLORS.background }
      }}
    >
      {/* 1. Pantalla de Animación Inicial */}
      <Stack.Screen 
        name="Splash" 
        component={AnimatedSplashScreen} 
        options={{ headerShown: false }} 
      />

      {/* 2. Menú Principal (Importante: nombre ToolsMenu) */}
      <Stack.Screen 
        name="ToolsMenu" 
        component={ToolsMenuScreen} 
        options={{ headerShown: false }} 
      />
      
      {/* 3. Resto de Pantallas */}
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ title: 'INGRESO TÉCNICO' }} 
      />

      <Stack.Screen name="SpeedCheck" component={SpeedCheckScreen} options={{ title: 'VELOCIDAD' }} />
      <Stack.Screen name="DensityCalc" component={DensityScreen} options={{ title: 'DENSIDAD' }} />
      <Stack.Screen name="CvCalculator" component={CvCalculatorScreen} options={{ title: 'CV %' }} />
      <Stack.Screen name="WheelCalculator" component={WheelCalculatorScreen} options={{ title: 'RUEDA MANDO' }} />
      <Stack.Screen name="DoseControl" component={DoseControlScreen} options={{ title: 'DOSIS' }} />
      <Stack.Screen name="LeafCalibration" component={LeafCalibrationScreen} options={{ title: 'CALIBRACIÓN LEAF' }} />
    </Stack.Navigator>
  );
};