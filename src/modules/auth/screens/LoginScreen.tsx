import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { supabase } from '../../../core/lib/supabase';
import { theme } from '../../../core/theme';
import { Body, Button, Card, H1, Input, ScreenLayout } from '../../../ui/components';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  async function signInWithEmail() {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    console.log("Intentando iniciar sesión para:", email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Error de Supabase:", error.message);
        Alert.alert('Error de Autenticación', error.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        console.log("Sesión iniciada con éxito");
        // Forzamos el regreso al menú. 
        // El RootNavigator debería hacerlo solo, pero esto asegura el cambio.
        navigation.reset({
          index: 0,
          routes: [{ name: 'ToolsMenu' }],
        });
      }

    } catch (err: any) {
      console.error("Error inesperado:", err);
      Alert.alert('Error Inesperado', err.message || 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenLayout scrollable>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <H1 style={styles.brandText}>CRUCIANELLI</H1>
          <Body style={styles.appTag}>ACCESO TÉCNICO</Body>
        </View>

        <Card style={styles.loginCard}>
          <Input
            label="Email"
            onChangeText={(text) => setEmail(text.trim())}
            value={email}
            placeholder="email@crucianelli.com"
            autoCapitalize={'none'}
            keyboardType="email-address"
          />
          <View style={{ height: 15 }} />
          <Input
            label="Contraseña"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="••••••••"
            autoCapitalize={'none'}
          />
          <Button
            title={loading ? "" : "INICIAR SESIÓN"}
            disabled={loading}
            onPress={signInWithEmail}
            style={{ marginTop: 30 }}
            icon={loading ? <ActivityIndicator color="white" /> : undefined}
          />
          
          <Button
            title="VOLVER COMO INVITADO"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 15 }}
          />
        </Card>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, marginTop: 40 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  brandText: { fontSize: 32, color: theme.colors.primary, fontWeight: 'bold' },
  appTag: { letterSpacing: 3, opacity: 0.6, fontSize: 12 },
  loginCard: { padding: 25 }
});