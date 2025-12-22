// src/modules/ui/AnimatedSplashScreen.tsx

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
  onAnimationFinish?: () => void;
}

export const AnimatedSplashScreen = ({ onAnimationFinish }: AnimatedSplashScreenProps) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  
  const fadeText = useRef(new Animated.Value(0)).current;
  const loadingProgress = useRef(new Animated.Value(0)).current;
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    Animated.timing(fadeText, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    Animated.timing(loadingProgress, {
      toValue: 1,
      duration: 3500,
      useNativeDriver: false,
    }).start();

    loadingProgress.addListener(({ value }) => {
      setPercent(Math.floor(value * 100));
    });

    const timer = setTimeout(() => {
      if (onAnimationFinish) {
        onAnimationFinish();
      }
      // Redirige a ToolsMenu (nombre unificado)
      navigation.replace('ToolsMenu'); 
    }, 4500);

    return () => {
      loadingProgress.removeAllListeners();
      clearTimeout(timer);
    };
  }, [navigation, onAnimationFinish]);

  const loaderWidth = loadingProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#D32F2F" />
      <View style={styles.content}>
        <Animated.View style={{ opacity: fadeText }}>
          <Text style={styles.brandText}>CRUCIANELLI</Text>
          <Text style={styles.subtitleText}>TECNOLOGÍA EN SIEMBRA</Text>
        </Animated.View>

        <View style={styles.loaderContainer}>
          <View style={styles.track}>
            <Animated.View style={[styles.fill, { width: loaderWidth }]} />
          </View>
          <Text style={styles.percentText}>{percent}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  brandText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
    textAlign: 'center',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-condensed' : 'AvenirNext-Heavy',
  },
  subtitleText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: -5,
    letterSpacing: 2,
    fontWeight: '600',
  },
  loaderContainer: {
    marginTop: 60,
    width: width * 0.6,
    alignItems: 'center',
  },
  track: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  percentText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 10,
    fontWeight: 'bold',
    opacity: 0.8,
  },
});