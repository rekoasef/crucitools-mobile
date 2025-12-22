import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para persistencia offline
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { supabase } from '../../../core/lib/supabase';
import { theme } from '../../../core/theme';

const ToolCard = ({ title, description, iconName, onPress, isLocked }: any) => (
  <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.8}>
    <View style={[styles.iconContainer, { backgroundColor: isLocked ? '#f5f5f5' : theme.colors.primary + '15' }]}>
      <MaterialCommunityIcons 
        name={isLocked ? "lock" : iconName} 
        size={28} 
        color={isLocked ? "#999" : theme.colors.primary} 
      />
    </View>
    <View style={styles.cardTextContainer}>
      <Text style={[styles.cardTitle, isLocked && { color: '#999' }]}>{title}</Text>
      <Text style={styles.cardSubtitle}>{description}</Text>
    </View>
    <MaterialCommunityIcons name="chevron-right" size={20} color="#DDD" />
  </TouchableOpacity>
);

export const ToolsMenuScreen = () => {
  const navigation = useNavigation<any>();
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeMenu = async () => {
      // 1. Cargar sesión inicial de Supabase
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);

      if (currentSession) {
        // 2. Intentar cargar el rol desde el almacenamiento local (OFFLINE FIRST)
        const cachedRole = await AsyncStorage.getItem(`user_role_${currentSession.user.id}`);
        if (cachedRole) {
          setRole(cachedRole);
          setLoading(false); // Ya tenemos algo que mostrar, soltamos la carga
        }

        // 3. Intentar actualizar el rol desde la nube (en segundo plano si hay internet)
        fetchAndCacheRole(currentSession.user.id);
      } else {
        setLoading(false);
      }
    };

    initializeMenu();

    // Escuchar cambios de auth (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        fetchAndCacheRole(session.user.id);
      } else {
        setRole(null);
        // Limpiar caché al cerrar sesión
        const keys = await AsyncStorage.getAllKeys();
        const roleKeys = keys.filter(k => k.startsWith('user_role_'));
        await AsyncStorage.multiRemove(roleKeys);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchAndCacheRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (data?.role) {
        setRole(data.role);
        // Guardar en el teléfono para la próxima vez sin internet
        await AsyncStorage.setItem(`user_role_${userId}`, data.role);
      }
    } catch (e) {
      console.log("Modo Offline: Usando datos de sesión locales.");
    } finally {
      setLoading(false);
    }
  };

  const handleAuthAction = async () => {
    if (session) {
      await supabase.auth.signOut();
      Alert.alert("Sesión cerrada", "Has vuelto al modo Invitado.");
    } else {
      navigation.navigate('Login');
    }
  };

  const openTool = (screenName: string, restricted: boolean) => {
    const isStaff = role === 'fabrica' || role === 'mecanico';
    if (restricted && !isStaff) {
      Alert.alert(
        "Acceso Técnico",
        "Esta herramienta requiere validación de personal de Fábrica o Concesionario.",
        [{ text: "Entendido" }, { text: "Iniciar Sesión", onPress: () => navigation.navigate('Login') }]
      );
    } else {
      navigation.navigate(screenName);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}><ActivityIndicator size="large" color={theme.colors.primary} /></View>
    );
  }

  const isStaff = role === 'fabrica' || role === 'mecanico';

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      <View style={styles.headerBlock}>
        <SafeAreaView>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerLabel}>{session ? `PERFIL: ${role?.toUpperCase() || 'CARGANDO...'}` : 'MODO INVITADO'}</Text>
              <Text style={styles.headerTitle}>CRUCIANELLI</Text>
            </View>
            <TouchableOpacity onPress={handleAuthAction} style={styles.authBadge}>
              <MaterialCommunityIcons name={session ? "logout" : "login"} size={16} color="white" />
              <Text style={styles.authBadgeText}>{session ? "SALIR" : "INGRESAR"}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.body}>
        <Text style={styles.bodyTitle}>HERRAMIENTAS DISPONIBLES</Text>
        <ScrollView contentContainerStyle={styles.scroll}>
          <ToolCard title="Velocidad de Siembra" description="Cálculo operativo por placa." iconName="speedometer" onPress={() => openTool('SpeedCheck', false)} isLocked={false} />
          <ToolCard title="Calibración Leaf" description="Solo personal autorizado." iconName="cog-refresh" onPress={() => openTool('LeafCalibration', true)} isLocked={!isStaff} />
          <ToolCard title="Calculadora CV %" description="Uniformidad en lote." iconName="chart-bell-curve-cumulative" onPress={() => openTool('CvCalculator', false)} isLocked={false} />
          <ToolCard title="Calculadora Densidad" description="Semillas por metro y ha." iconName="calculator" onPress={() => openTool('DensityCalc', false)} isLocked={false} />
          <ToolCard title="Rueda de Mando" description="Vueltas para simulación." iconName="tire" onPress={() => openTool('WheelCalculator', true)} isLocked={!isStaff} />
          <ToolCard title="Control de Dosis" description="Descarga de insumos." iconName="scale" onPress={() => openTool('DoseControl', false)} isLocked={false} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: theme.colors.primary },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  headerBlock: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: Platform.OS === 'android' ? 20 : 0 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLabel: { color: 'white', opacity: 0.7, fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5 },
  headerTitle: { color: 'white', fontSize: 28, fontWeight: '900' },
  authBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  authBadgeText: { color: 'white', fontSize: 11, fontWeight: 'bold', marginLeft: 6 },
  body: { flex: 1, backgroundColor: '#F8F9FA', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingTop: 25, marginTop: -30 },
  bodyTitle: { fontSize: 12, fontWeight: 'bold', color: '#999', marginBottom: 20, letterSpacing: 1 },
  scroll: { paddingBottom: 30 },
  cardContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#EEE' },
  iconContainer: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardSubtitle: { fontSize: 12, color: '#888', marginTop: 2 }
});