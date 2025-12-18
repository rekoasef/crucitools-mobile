import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../core/theme';

// --- Tarjeta de Herramienta (Mismo diseño que en Home para consistencia) ---
const ToolCard = ({ title, description, iconName, onPress, accentColor = theme.colors.primary }: any) => (
  <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.9}>
    <View style={[styles.iconContainer, { backgroundColor: accentColor + '15' }]}>
      <MaterialCommunityIcons name={iconName} size={32} color={accentColor} />
    </View>
    <View style={styles.cardTextContainer}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{description}</Text>
    </View>
    <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.border} />
  </TouchableOpacity>
);

export const ToolsMenuScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      {/* 1. CABECERA ROJA (Con botón volver) */}
      <View style={styles.brandHeaderBlock}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            
            {/* Botón Volver */}
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons name="arrow-left" size={28} color={theme.colors.textInverse} />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
                <MaterialCommunityIcons name="tools" size={30} color="white" style={{ opacity: 0.8, marginBottom: 8 }} />
                <Text style={styles.headerSubtitle}>PANEL DE CONTROL</Text>
                <Text style={styles.headerTitle}>HERRAMIENTAS</Text>
            </View>

          </View>
        </SafeAreaView>
        
        {/* Decoración de fondo sutil */}
        <View style={styles.headerDecorativeCircle} />
      </View>

      {/* 2. CUERPO SUPERPUESTO (Overlay) */}
      <View style={styles.contentBodyOverlay}>
        
        <Text style={styles.sectionTitle}>Seleccione una utilidad</Text>

        <View style={styles.toolsContainer}>
          
          <ToolCard 
            title="Calculadora de Siembra"
            description="Dosificación, densidad y ajustes de sembradora."
            iconName="barley" // Icono de cultivo/grano
            onPress={() => navigation.navigate('PlantingCalculator')} // Ajusta según tus rutas reales
          />

          <View style={styles.spacer} />

          <ToolCard 
            title="Tabla de Torque"
            description="Valores de apriete para bulonería métrica/SAE."
            iconName="screw-machine-flat-top" // Icono de tornillo/tuerca
            onPress={() => navigation.navigate('TorqueCalculator')} 
          />

          <View style={styles.spacer} />

          <ToolCard 
            title="Conversor de Unidades"
            description="Presión, longitud, área y caudal."
            iconName="calculator-variant" 
            accentColor="#2B6CB0" // Azul para diferenciar utilidad general
            onPress={() => navigation.navigate('UnitConverter')} 
          />

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  // --- Cabecera Roja ---
  brandHeaderBlock: {
    backgroundColor: theme.colors.primary,
    height: 260, // Un poco más corto que el Home
    paddingHorizontal: theme.spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    marginTop: Platform.OS === 'android' ? 20 : 10,
  },
  backButton: {
    marginBottom: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    // backgroundColor: 'rgba(255,255,255,0.1)', // Opcional: círculo sutil
    // borderRadius: 20,
  },
  titleContainer: {
      justifyContent: 'center',
  },
  headerSubtitle: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: 2,
    opacity: 0.8,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  headerTitle: {
    color: theme.colors.textInverse,
    fontSize: 34,
    fontWeight: theme.typography.weights.heavy,
    letterSpacing: -1,
  },
  headerDecorativeCircle: {
    position: 'absolute',
    top: -60,
    right: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.colors.white,
    opacity: 0.05,
  },

  // --- Cuerpo Overlay ---
  contentBodyOverlay: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -40, // Superposición
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    fontWeight: theme.typography.weights.bold,
  },
  toolsContainer: {
    flex: 1,
  },
  spacer: {
    height: theme.spacing.md,
  },

  // --- Estilos de Tarjeta (ToolCard) ---
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.darkGray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  cardTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.md, // Un poco más grande para legibilidad
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13, // Ligeramente más pequeño para la descripción
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});