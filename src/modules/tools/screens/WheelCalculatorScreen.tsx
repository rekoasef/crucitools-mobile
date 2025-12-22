import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../core/theme';
import { calculateWheelTurns, getDistancesForModel, getWheelModels } from '../../../core/tools/wheel';
import { Body, Card, H1, ScreenLayout, Select } from '../../../ui/components';

export const WheelCalculatorScreen = () => {
  const [modelId, setModelId] = useState<string>('');
  const [distId, setDistId] = useState<string>('');

  const modelOptions = useMemo(() => 
    getWheelModels().map(m => ({ label: m.name, value: m.id })), 
  []);
  
  const distanceOptions = useMemo(() => {
    if (!modelId) return [];
    return getDistancesForModel(modelId).map(d => ({ label: d.name, value: d.id }));
  }, [modelId]);

  const result = useMemo(() => {
    if (!modelId || !distId) return null;
    return calculateWheelTurns(modelId, distId);
  }, [modelId, distId]);

  const handleModelChange = (id: string) => {
    setModelId(id);
    setDistId('');
  };

  return (
    <ScreenLayout scrollable>
      <View style={styles.container}>
        <H1>Rueda de Mando</H1>
        <Body style={styles.subtitle}>Calcula las vueltas de la rueda (1/10 ha) según el modelo y separación.</Body>

        <Card variant="flat" style={styles.configCard}>
          <Select
            label="1. TIPO DE RUEDA / MÁQUINA"
            placeholder="Seleccione Modelo..."
            options={modelOptions}
            selectedValue={modelId}
            onValueChange={handleModelChange}
          />

          <Select
            label="2. DISTANCIA ENTRE LÍNEAS"
            placeholder={!modelId ? "Seleccione Modelo primero" : "Seleccione Distancia..."}
            options={distanceOptions}
            selectedValue={distId}
            onValueChange={setDistId}
            disabled={!modelId}
          />
        </Card>

        {result && (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultHeaderTitle}>VUELTAS REQUERIDAS (1/10 Ha)</Text>
            </View>

            <Card style={styles.resultCard}>
              <Text style={styles.tireLabel}>{result.headers[0]}</Text>
              <View style={styles.valueRow}>
                <Text style={styles.bigNumber}>{result.values.val1}</Text>
                <Text style={styles.unitText}>vueltas</Text>
              </View>
            </Card>

            {result.values.val2 !== undefined && (
              <Card style={styles.resultCard}>
                <Text style={styles.tireLabel}>{result.headers[1]}</Text>
                <View style={styles.valueRow}>
                  <Text style={styles.bigNumber}>{result.values.val2}</Text>
                  <Text style={styles.unitText}>vueltas</Text>
                </View>
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
  subtitle: { marginBottom: theme.spacing.lg, color: theme.colors.textSecondary },
  configCard: { marginBottom: theme.spacing.lg },
  resultContainer: { marginTop: theme.spacing.sm },
  resultHeader: { backgroundColor: theme.colors.primary, paddingVertical: 8, paddingHorizontal: 12, borderTopLeftRadius: theme.layout.borderRadius, borderTopRightRadius: theme.layout.borderRadius, marginBottom: -5, zIndex: 1, alignSelf: 'flex-start' },
  resultHeaderTitle: { color: theme.colors.textInverse, fontWeight: 'bold', fontSize: 12, letterSpacing: 0.5 },
  resultCard: { borderLeftWidth: 6, borderLeftColor: theme.colors.primary, marginBottom: theme.spacing.md, backgroundColor: theme.colors.cardBackground, padding: theme.spacing.lg },
  tireLabel: { fontSize: 12, fontWeight: 'bold', color: theme.colors.textSecondary, textTransform: 'uppercase', marginBottom: 4 },
  valueRow: { flexDirection: 'row', alignItems: 'baseline' },
  bigNumber: { fontSize: 48, fontWeight: 'bold', color: theme.colors.textPrimary, marginRight: 8 },
  unitText: { fontSize: 18, color: theme.colors.textSecondary, fontWeight: '500' }
});