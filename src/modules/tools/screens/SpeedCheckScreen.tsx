// src/modules/tools/screens/SpeedCheckScreen.tsx
import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, StyleSheet, Text, View } from 'react-native';
import { SpeedCheckResult, SpeedStatus } from '../../../core/models/tools'; // Asegurate de tener SpeedLimit en models, si no, definilo local o en speedTables
import { theme } from '../../../core/theme';
import { HistoryRepository } from '../../../storage/sqlite';
import { ReferenceRepository } from '../../../storage/sqlite/referenceRepository';
import { Body, Button, Card, H1, H2, Input, ScreenLayout, Select } from '../../../ui/components';

export const SpeedCheckScreen = () => {
  // --- ESTADOS DE DATOS ---
  const [crops, setCrops] = useState<any[]>([]);
  const [plates, setPlates] = useState<any[]>([]);
  const [spacings, setSpacings] = useState<any[]>([]);
  const [populations, setPopulations] = useState<any[]>([]);

  // --- ESTADOS DE SELECCIÓN ---
  const [selectedCrop, setSelectedCrop] = useState<string | undefined>();
  const [selectedPlate, setSelectedPlate] = useState<string | undefined>();
  const [selectedSpacing, setSelectedSpacing] = useState<string | undefined>();
  const [selectedPopulation, setSelectedPopulation] = useState<string | undefined>();
  
  // --- ESTADO DEL RANGO AUTOMÁTICO ---
  const [limitRange, setLimitRange] = useState<{ min: number, max: number } | null>(null);

  // --- INPUTS Y RESULTADOS ---
  const [speed, setSpeed] = useState('');
  const [result, setResult] = useState<SpeedCheckResult | null>(null);
  
  // 1. Cargar Cultivos
  useEffect(() => {
    ReferenceRepository.getCrops().then(setCrops);
  }, []);

  // 2. Cadenas de selección (Cascada)
  useEffect(() => {
    setPlates([]); setSelectedPlate(undefined);
    setLimitRange(null); setResult(null); // Resetear todo al cambiar padre
    if (selectedCrop) ReferenceRepository.getPlatesByCrop(selectedCrop).then(setPlates);
  }, [selectedCrop]);

  useEffect(() => {
    setSpacings([]); setSelectedSpacing(undefined);
    setLimitRange(null); setResult(null);
    if (selectedPlate) ReferenceRepository.getSpacings(selectedPlate).then(setSpacings);
  }, [selectedPlate]);

  useEffect(() => {
    setPopulations([]); setSelectedPopulation(undefined);
    setLimitRange(null); setResult(null);
    if (selectedSpacing) ReferenceRepository.getPopulations(selectedSpacing).then(setPopulations);
  }, [selectedSpacing]);

  // 3. ✨ MAGIA: Obtener Rango AUTOMÁTICAMENTE al tener todos los datos
  useEffect(() => {
    const fetchLimit = async () => {
      setLimitRange(null);
      setResult(null); // Limpiar resultado anterior

      if (selectedCrop && selectedPlate && selectedSpacing && selectedPopulation) {
        try {
          const limit = await ReferenceRepository.getSpeedLimit(
            selectedCrop, selectedPlate, selectedSpacing, selectedPopulation
          );
          
          if (limit) {
            setLimitRange({ min: limit.min, max: limit.max });
          } else {
            // Fallback por si no hay dato exacto (raro)
            setLimitRange({ min: 4.0, max: 9.0 }); 
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchLimit();
  }, [selectedPopulation]); // Se dispara apenas elegís población

  // 4. Lógica de Verificación Manual (Opcional ahora)
  const handleVerify = async () => {
    Keyboard.dismiss();
    const speedValue = parseFloat(speed.replace(',', '.'));

    if (!limitRange) return; // No debería pasar si el botón está habilitado
    
    if (isNaN(speedValue) || speedValue <= 0) {
      Alert.alert('Error', 'Ingrese una velocidad válida.');
      return;
    }

    let status: SpeedStatus = 'APROBADA';
    let message = 'Velocidad Óptima';

    if (speedValue < limitRange.min) {
      status = 'BAJA_VELOCIDAD';
      message = '⚠️ Aumentar Velocidad';
    } else if (speedValue > limitRange.max) {
      status = 'ALTA_VELOCIDAD';
      message = '⚠️ Reducir Velocidad';
    }

    const calculationResult: SpeedCheckResult = {
      status,
      minSpeed: limitRange.min,
      maxSpeed: limitRange.max,
      currentSpeed: speedValue,
      message
    };

    setResult(calculationResult);

    // Guardar en Historial
    await HistoryRepository.save(
      'VELOCIDAD_SIEMBRA',
      { cropId: selectedCrop, speed: speedValue },
      calculationResult
    );
  };

  const getResultColor = () => {
    if (!result) return theme.colors.textPrimary;
    if (result.status === 'APROBADA') return theme.colors.success;
    return theme.colors.warning;
  };

  return (
    <ScreenLayout scrollable>
      <View style={styles.container}>
        <H1>Velocidad de Siembra</H1>
        <Body style={styles.subtitle}>Configure la máquina para ver el rango operativo.</Body>

        {/* --- CONFIGURACIÓN --- */}
        <Card variant="flat" style={styles.configCard}>
          <Select label="1. CULTIVO" options={crops} value={selectedCrop} onSelect={(i: any) => setSelectedCrop(i.id)} />
          <Select label="2. PLACA" options={plates} value={selectedPlate} onSelect={(i: any) => setSelectedPlate(i.id)} disabled={!selectedCrop} />
          <Select label="3. DISTANCIA" options={spacings} value={selectedSpacing} onSelect={(i: any) => setSelectedSpacing(i.id)} disabled={!selectedPlate} />
          <Select label="4. POBLACIÓN" options={populations} value={selectedPopulation} onSelect={(i: any) => setSelectedPopulation(i.id)} disabled={!selectedSpacing} />
        </Card>

        {/* --- ✨ CARTEL DE RANGO AUTOMÁTICO ✨ --- */}
        {limitRange && (
          <View style={styles.rangeContainer}>
             <View style={styles.rangeHeader}>
                <Text style={styles.rangeTitle}>RANGO OPERATIVO SUGERIDO</Text>
             </View>
             <View style={styles.rangeValues}>
                <View style={styles.rangeItem}>
                    <Text style={styles.rangeLabel}>MÍNIMA</Text>
                    <Text style={styles.rangeNumber}>{limitRange.min} <Text style={styles.unit}>km/h</Text></Text>
                </View>
                <View style={styles.verticalLine} />
                <View style={styles.rangeItem}>
                    <Text style={styles.rangeLabel}>MÁXIMA</Text>
                    <Text style={styles.rangeNumber}>{limitRange.max} <Text style={styles.unit}>km/h</Text></Text>
                </View>
             </View>
          </View>
        )}

        {/* --- VERIFICACIÓN MANUAL (Solo si ya tenemos rango) --- */}
        {limitRange && (
          <View style={styles.verifySection}>
            <View style={styles.divider} />
            <Body style={{marginBottom: 10, textAlign: 'center'}}>¿Desea verificar su velocidad actual?</Body>
            
            <Input 
              label=""
              placeholder="Ingrese velocidad actual..."
              suffix="km/h"
              keyboardType="numeric"
              value={speed}
              onChangeText={setSpeed}
              style={{textAlign: 'center'}}
            />

            <Button 
              title="VERIFICAR ESTADO"
              onPress={handleVerify}
              disabled={!speed}
            />

            {/* Resultado de la verificación manual */}
            {result && (
              <Card style={[styles.resultCard, { borderLeftColor: getResultColor() }]}>
                <H2 style={{ color: getResultColor(), textAlign: 'center' }}>{result.message}</H2>
                <Text style={{ textAlign: 'center', color: theme.colors.textSecondary }}>
                    Estado: {result.status.replace('_', ' ')}
                </Text>
              </Card>
            )}
          </View>
        )}

      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: { padding: theme.spacing.lg },
  subtitle: { marginBottom: theme.spacing.md, color: theme.colors.textSecondary },
  configCard: { marginBottom: theme.spacing.md },
  
  // Estilos del Cartel Grande
  rangeContainer: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.layout.borderRadius,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  rangeHeader: {
    backgroundColor: theme.colors.darkGray,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  rangeTitle: {
    color: theme.colors.textInverse,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontSize: 14,
  },
  rangeValues: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  rangeItem: {
    alignItems: 'center',
  },
  rangeLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rangeNumber: {
    fontSize: 32,
    fontWeight: theme.typography.weights.heavy,
    color: theme.colors.primary,
  },
  unit: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontWeight: 'normal',
  },
  verticalLine: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border,
  },

  // Sección Verificación
  verifySection: {
    marginTop: theme.spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  resultCard: {
    marginTop: theme.spacing.lg,
    borderLeftWidth: 6,
    alignItems: 'center',
  },
});