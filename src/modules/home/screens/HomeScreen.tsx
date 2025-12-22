import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../core/theme';

// --- Componente de Tarjeta Moderna (Igual que antes, funciona bien) ---
const MenuCard = ({ title, subtitle, iconName, onPress, accentColor }: any) => (
  <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.9}>
    <View style={[styles.iconContainer, { backgroundColor: accentColor + '15' }]}>
      <MaterialCommunityIcons name={iconName} size={28} color={accentColor} />
    </View>
    <View style={styles.cardTextContainer}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
    <View style={styles.chevronContainer}>
      <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.border} />
    </View>
  </TouchableOpacity>
);

export const HomeScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.mainContainer}>
      {/* StatusBar blanca para que se vea sobre el fondo rojo */}
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      {/* 1. BLOQUE DE MARCA SUPERIOR (Rojo Crucianelli) */}
      <View style={styles.brandHeaderBlock}>
        <SafeAreaView>
          <View style={styles.headerContent}>
             {/* Icono de marca sutil */}
            <MaterialCommunityIcons name="axis-arrow" size={40} color="white" style={{ opacity: 0.8, marginBottom: 8 }} />
            <Text style={styles.brandSubtitle}>SISTEMA DE PRECISIÓN</Text>
            <Text style={styles.brandTitle}>CRUCITOOLS</Text>
          </View>
        </SafeAreaView>
        {/* Elemento decorativo de fondo (opcional: un círculo sutil para dar textura) */}
        <View style={styles.headerDecorativeCircle} />
      </View>

      {/* 2. CUERPO PRINCIPAL SUPERPUESTO (Overlay) */}
      <View style={styles.contentBodyOverlay}>
        
        {/* Sección de Bienvenida */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Hola, Operador</Text>
          <Text style={styles.welcomeBody}>
            Acceda a las herramientas técnicas y documentación oficial sin conexión.
          </Text>
        </View>

        {/* Menú de Tarjetas */}
        <View style={styles.menuContainer}>
          <MenuCard 
            title="Herramientas y Calculadoras"
            subtitle="Ajustes de siembra, torque y conversión."
            iconName="wrench-cog" // Icono más industrial
            accentColor={theme.colors.primary} 
            onPress={() => navigation.navigate('ToolsMenu')} 
          />

          <View style={styles.spacer} />

          {/* <MenuCard 
            title="Biblioteca Técnica"
            subtitle="Manuales y catálogos oficiales."
            iconName="file-document-box-multiple-outline" // Icono de documentación
            accentColor="#2B6CB0" // Azul técnico profesional
            onPress={() => navigation.navigate('Library')} 
          /> */}
        </View>
         <Text style={styles.versionText}>v1.1.0 - Modo Offline Activo</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.primary, // Fondo base rojo para evitar flashes blancos
  },
  // --- 1. Estilos del Bloque Rojo Superior ---
  brandHeaderBlock: {
    backgroundColor: theme.colors.primary,
    height: 280, // Altura fija para el bloque rojo
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 40, // Espacio extra abajo para el solapamiento
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    marginTop: Platform.OS === 'android' ? 20 : 0, // Ajuste para Android
  },
  brandSubtitle: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: 2,
    opacity: 0.9,
    marginBottom: 4,
  },
  brandTitle: {
    color: theme.colors.textInverse,
    fontSize: 42, // Tamaño gigante para impacto
    fontWeight: theme.typography.weights.heavy, // El peso más grueso
    letterSpacing: -1,
    textTransform: 'uppercase',
  },
  headerDecorativeCircle: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: theme.colors.white,
    opacity: 0.05, // Muy sutil
    transform: [{ scaleX: 1.5 }],
  },

  // --- 2. Estilos del Cuerpo Superpuesto (Overlay) ---
  contentBodyOverlay: {
    flex: 1,
    backgroundColor: theme.colors.background, // El gris claro moderno
    borderTopLeftRadius: 32, // Bordes redondeados superiores
    borderTopRightRadius: 32,
    marginTop: -50, // <--- LA CLAVE: Esto hace que se superponga al rojo
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  welcomeSection: {
    marginBottom: theme.spacing.xl,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  welcomeBody: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  menuContainer: {
    flex: 1,
  },
  spacer: {
    height: theme.spacing.md,
  },
  versionText: {
      textAlign: 'center',
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sizes.xs,
      marginBottom: theme.spacing.lg,
      opacity: 0.6
  },

  // --- Estilos de Tarjeta Refinados ---
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    padding: 20, // Un poco más de relleno
    borderRadius: 20, // Más redondeado
    borderWidth: 1,
    borderColor: theme.colors.border,
    // Sombra más sofisticada
    shadowColor: theme.colors.darkGray,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  chevronContainer: {
      paddingLeft: theme.spacing.sm,
      opacity: 0.5
  }
});