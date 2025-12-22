import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { theme } from '../core/theme';

// Pantallas
import { LoginScreen } from '../modules/auth/screens/LoginScreen';
import { CvCalculatorScreen } from '../modules/tools/screens/CvCalculatorScreen';
import { DensityScreen } from '../modules/tools/screens/DensityScreen';
import { DoseControlScreen } from '../modules/tools/screens/DoseControlScreen';
import { LeafCalibrationScreen } from '../modules/tools/screens/LeafCalibrationScreen';
import { SpeedCheckScreen } from '../modules/tools/screens/SpeedCheckScreen';
import { ToolsMenuScreen } from '../modules/tools/screens/ToolsMenuScreen';
import { WheelCalculatorScreen } from '../modules/tools/screens/WheelCalculatorScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ToolsMenu"
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.headerBackground },
          headerTintColor: theme.colors.textInverse,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {/* La pantalla inicial ahora es siempre el Menú */}
        <Stack.Screen 
          name="ToolsMenu" 
          component={ToolsMenuScreen} 
          options={{ headerShown: false }} 
        />
        
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
    </NavigationContainer>
  );
};