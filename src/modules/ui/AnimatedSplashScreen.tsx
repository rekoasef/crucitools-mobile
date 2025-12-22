import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming
} from 'react-native-reanimated';

export const AnimatedSplashScreen = ({ onAnimationFinish }: { onAnimationFinish: () => void }) => {
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateX = useSharedValue(-30); // Empieza "escondido" detrás o cerca del logo

  useEffect(() => {
    // 1. El Logo aparece suavemente y crece un poquito
    logoOpacity.value = withTiming(1, { duration: 600 });
    logoScale.value = withSpring(1, { damping: 15 });

    // 2. El Texto se desliza hacia la derecha (Estilo el video de Personal)
    textOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));
    textTranslateX.value = withDelay(500, withSpring(0, { damping: 15 }));

    // 3. Tiempo total de espera antes de entrar a la App (2.5 segundos aprox)
    const timeout = setTimeout(() => {
      onAnimationFinish();
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateX: textTranslateX.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.Image 
          source={require('../../../assets/images/icon.png')} 
          style={[styles.logo, logoStyle]} 
        />
        <Animated.View style={[styles.textContainer, textStyle]}>
          <Text style={styles.brandText}>CRUCIANELLI</Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0070B8', // Usé un azul similar al del video, pero podés usar el blanco o azul Crucianelli
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    zIndex: 2, // Para que esté por encima del texto al principio
  },
  textContainer: {
    marginLeft: 15,
  },
  brandText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF', // Blanco para que resalte
    letterSpacing: 1.5,
  },
});