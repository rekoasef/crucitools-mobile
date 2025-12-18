// src/modules/tools/screens/DensityScreen.tsx
import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../core/theme';
import { calculateDensity, DensityResult } from '../../../core/tools/planting';
import { HistoryRepository } from '../../../storage/sqlite';
import { Body, Button, Card, H1, Input, ScreenLayout, Select } from '../../../ui/components';

// Opciones estándar para el Select (igual que en la web)
const SPACING_OPTIONS = [
  { id: '0.35', name: '35 cm (0.35 m)' },
  { id: '0.38', name: '38 cm (0.38 m)' },
  { id: '0.42', name: '42 cm (0.42 m)' },
  { id: '0.52', name: '52 cm (0.52 m)' },
  { id: '0.70', name: '70 cm (0.70 m)' },
  { id: 'custom', name: 'Otro (Manual)' },
];

type Mode = 'toHa' | 'toMetro';

export const DensityScreen = () => {
  // --- ESTADOS ---
  const [mode, setMode] = useState<Mode>('toHa');
  const [spacingId, setSpacingId] = useState<string>('0.52'); // Default común
  const [customSpacing, setCustomSpacing] = useState('');
  const [inputValue, setInputValue] = useState('');
  
  const [result, setResult] = useState<DensityResult | null>(null);

  // --- LÓGICA ---
  const handleCalculate = async () => {
    Keyboard.dismiss();

    // 1. Determinar espaciamiento
    let spacingMeters = parseFloat(spacingId);
    if (spacingId === 'custom') {
      spacingMeters = parseFloat(customSpacing.replace(',', '.'));
    }

    // 2. Determinar valor de entrada
    const val = parseFloat(inputValue.replace(',', '.'));

    // Validar
    if (!spacingMeters || spacingMeters <= 0 || !val || val <= 0) {
      alert("Por favor ingresa valores válidos mayores a 0.");
      return;
    }

    // 3. Calcular (Usando la función pura)
    const res = calculateDensity(mode, val, spacingMeters);
    setResult(res);

    // 4. Guardar en Historial
    await HistoryRepository.save(
      'DENSIDAD_SIEMBRA',
      { mode, input: val, spacing: spacingMeters },
      res
    );
  };

  const changeMode = (newMode: Mode) => {
    setMode(newMode);
    setResult(null);
    setInputValue('');
  };

  return (
    <ScreenLayout scrollable>
      <View style={styles.container}>
        <H1>Calculadora de Densidad</H1>
        <Body style={styles.subtitle}>Convierte entre densidad lineal y poblacional.</Body>

        {/* --- TABS SELECTOR DE MODO --- */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, mode === 'toHa' && styles.activeTab]} 
            onPress={() => changeMode('toHa')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, mode === 'toHa' && styles.activeTabText]}>
              TENGO SEM/METRO
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, mode === 'toMetro' && styles.activeTab]} 
            onPress={() => changeMode('toMetro')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, mode === 'toMetro' && styles.activeTabText]}>
              TENGO SEM/HECTÁREA
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- FORMULARIO --- */}
        <Card variant="flat" style={styles.formCard}>
          {/* Selector de Distancia */}
          <Select 
            label="DISTANCIA ENTRE LÍNEAS"
            options={SPACING_OPTIONS}
            value={spacingId}
            onSelect={(item: any) => setSpacingId(item.id)}
          />

          {/* Input extra si elige Custom */}
          {spacingId === 'custom' && (
            <Input 
              label="INGRESE DISTANCIA MANUAL"
              placeholder="Ej: 0.21"
              suffix="metros"
              keyboardType="numeric"
              value={customSpacing}
              onChangeText={setCustomSpacing}
              style={{ backgroundColor: theme.colors.white }}
            />
          )}

          <View style={styles.divider} />

          {/* Input Principal (Variable según modo) */}
          <Input 
            label={mode === 'toHa' ? 'SEMILLAS POR METRO LINEAL' : 'POBLACIÓN DESEADA (SEM/HA)'}
            placeholder={mode === 'toHa' ? "Ej: 12.5" : "Ej: 70000"}
            suffix={mode === 'toHa' ? "sem/m" : "sem/ha"}
            keyboardType="numeric"
            value={inputValue}
            onChangeText={setInputValue}
          />
        </Card>

        <Button 
          title="CALCULAR" 
          onPress={handleCalculate}
          disabled={!inputValue}
        />

        {/* --- RESULTADO --- */}
        {result && (
          <Card style={styles.resultCard}>
            <View style={styles.resultHeader}>
                <Body style={{color: theme.colors.textInverse, opacity: 0.8}}>
                    {mode === 'toHa' ? 'POBLACIÓN ESTIMADA' : 'CALIBRACIÓN NECESARIA'}
                </Body>
            </View>
            
            <View style={styles.mainResultContainer}>
                <Text style={styles.mainResultValue}>
                    {result.mainValue.toLocaleString('es-AR')}
                </Text>
                <Text style={styles.mainResultUnit}>
                    {mode === 'toHa' ? 'semillas / ha' : 'semillas / metro'}
                </Text>
            </View>

            <View style={styles.resultDivider} />

            <View style={styles.secondaryResultContainer}>
                <Body style={{color: theme.colors.textInverse, opacity: 0.8, fontSize: 12}}>
                    DISTANCIA ENTRE SEMILLAS
                </Body>
                <Text style={styles.secondaryResultValue}>
                    {result.seedDistanceCm.toLocaleString('es-AR')} <Text style={{fontSize: 16}}>cm</Text>
                </Text>
            </View>
          </Card>
        )}

      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: { padding: theme.spacing.lg },
  subtitle: { marginBottom: theme.spacing.lg, color: theme.colors.textSecondary },
  
  // Tabs Styles
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.layout.borderRadius,
    padding: 4,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: theme.layout.borderRadius - 4,
  },
  activeTab: {
    backgroundColor: theme.colors.primary, // Rojo Crucianelli
  },
  tabText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: theme.colors.textInverse,
  },

  formCard: { marginBottom: theme.spacing.lg },
  divider: { height: 1, backgroundColor: theme.colors.border, marginVertical: theme.spacing.md },

  // Result Card Styles (Dark Industrial Theme)
  resultCard: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.darkGray, // Fondo oscuro para resultados
    borderLeftWidth: 6,
    borderLeftColor: theme.colors.primary,
    padding: 0, 
    overflow: 'hidden'
  },
  resultHeader: {
    padding: theme.spacing.md,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)'
  },
  mainResultContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  mainResultValue: {
    fontSize: 42,
    fontWeight: theme.typography.weights.heavy,
    color: theme.colors.textInverse,
  },
  mainResultUnit: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: -4
  },
  resultDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: theme.spacing.lg
  },
  secondaryResultContainer: {
    padding: theme.spacing.md,
    alignItems: 'center',
    paddingBottom: theme.spacing.lg
  },
  secondaryResultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.success, // Verde para resaltar la distancia
    marginTop: 4
  }
});