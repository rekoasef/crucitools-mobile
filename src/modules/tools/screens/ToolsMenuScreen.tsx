import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { theme } from '../../../core/theme';

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
      <View style={styles.brandHeaderBlock}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <MaterialCommunityIcons name="tools" size={30} color="white" style={styles.headerIcon} />
              <Text style={styles.headerSubtitle}>PANEL DE CONTROL</Text>
              <Text style={styles.headerTitle}>HERRAMIENTAS</Text>
            </View>
          </View>
        </SafeAreaView>
        <View style={styles.headerDecorativeCircle} />
      </View>
      <View style={styles.contentBodyOverlay}>
        <Text style={styles.sectionTitle}>Seleccione una utilidad técnica</Text>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <ToolCard title="Velocidad de Siembra" description="Rango operativo según placa y cultivo." iconName="speedometer" onPress={() => navigation.navigate('SpeedCheck')} />
          <View style={styles.spacer} />
          <ToolCard title="Calculadora de Densidad" description="Conversión de Semillas/Metro a Semillas/Ha." iconName="calculator" onPress={() => navigation.navigate('DensityCalc')} />
          <View style={styles.spacer} />
          <ToolCard title="Calculadora CV %" description="Mide la uniformidad de la siembra en campo." iconName="chart-bell-curve-cumulative" onPress={() => navigation.navigate('CvCalculator')} />
          <View style={styles.spacer} />
          <ToolCard title="Rueda de Mando" description="Vueltas para simulación de 1/10 Ha." iconName="tire" onPress={() => navigation.navigate('WheelCalculator')} />
          <View style={styles.spacer} />
          <ToolCard title="Control de Dosis" description="Metros lineales a recorrer para Kg/Ha." iconName="scale" onPress={() => navigation.navigate('DoseControl')} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: theme.colors.primary },
  brandHeaderBlock: { backgroundColor: theme.colors.primary, height: 200, paddingHorizontal: theme.spacing.lg, position: 'relative', overflow: 'hidden' },
  headerContent: { marginTop: Platform.OS === 'android' ? 20 : 10 },
  titleContainer: { justifyContent: 'center', marginTop: 10 },
  headerIcon: { opacity: 0.8, marginBottom: 8 },
  headerSubtitle: { color: theme.colors.textInverse, fontSize: theme.typography.sizes.xs, fontWeight: theme.typography.weights.bold, letterSpacing: 2, opacity: 0.8, marginBottom: 4, textTransform: 'uppercase' },
  headerTitle: { color: theme.colors.textInverse, fontSize: 34, fontWeight: theme.typography.weights.heavy, letterSpacing: -1 },
  headerDecorativeCircle: { position: 'absolute', top: -60, right: -80, width: 200, height: 200, borderRadius: 100, backgroundColor: theme.colors.white, opacity: 0.05 },
  contentBodyOverlay: { flex: 1, backgroundColor: theme.colors.background, borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -40, paddingHorizontal: theme.spacing.lg, paddingTop: 32 },
  sectionTitle: { fontSize: theme.typography.sizes.md, color: theme.colors.textSecondary, marginBottom: theme.spacing.lg, fontWeight: theme.typography.weights.bold },
  scrollContent: { paddingBottom: 40 },
  spacer: { height: theme.spacing.md },
  cardContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.cardBackground, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: theme.colors.border, elevation: 3 },
  iconContainer: { width: 56, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md },
  cardTextContainer: { flex: 1, paddingRight: 8 },
  cardTitle: { fontSize: theme.typography.sizes.md, fontWeight: theme.typography.weights.bold, color: theme.colors.textPrimary, marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: theme.colors.textSecondary, lineHeight: 18 },
});