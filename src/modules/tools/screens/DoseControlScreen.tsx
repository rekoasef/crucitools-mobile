import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../core/theme';
import { Body, Card, H1, ScreenLayout, Select } from '../../../ui/components';

const DATA_TABLE = [
  { label: "17,5 cm", value: "17,5", meters: 57.10 },
  { label: "19 cm",   value: "19",   meters: 52.60 },
  { label: "21 cm",   value: "21",   meters: 47.60 },
  { label: "26,25 cm", value: "26,25", meters: 38.10 },
  { label: "35 cm",   value: "35",   meters: 28.57 },
  { label: "38 cm",   value: "38",   meters: 26.30 },
  { label: "42 cm",   value: "42",   meters: 23.80 },
  { label: "52,5 cm", value: "52,5", meters: 19.05 },
];

export const DoseControlScreen = () => {
  const [selectedSpacing, setSelectedSpacing] = useState('');
  const [metersToRun, setMetersToRun] = useState<number | null>(null);

  const handleSelection = (spacing: string) => {
    setSelectedSpacing(spacing);
    const found = DATA_TABLE.find((item) => item.value === spacing);
    setMetersToRun(found ? found.meters : null);
  };

  return (
    <ScreenLayout scrollable>
      <View style={styles.container}>
        <H1>Control de Dosis (Kg/Ha)</H1>
        <Body style={styles.subtitle}>
          Referencia oficial para control de siembra y calibración de motores.
        </Body>

        {/* SELECCIÓN */}
        <Card style={styles.inputCard}>
          <Select
            label="Distancia entre líneas"
            options={DATA_TABLE}
            selectedValue={selectedSpacing}
            onValueChange={handleSelection}
            placeholder="Seleccionar distancia..."
          />

          {/* RESULTADO */}
          <View style={[styles.resultBox, metersToRun ? styles.resultActive : null]}>
            <Text style={styles.resultLabel}>DEBE RECORRER</Text>
            <Text style={styles.resultValue}>
              {metersToRun ? metersToRun.toFixed(2).replace('.', ',') : '---'}
            </Text>
            <Text style={styles.resultUnit}>metros lineales</Text>
          </View>
        </Card>

        {/* INSTRUCCIONES TÉCNICAS */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <MaterialCommunityIcons name="alert-circle" size={24} color="#E67E22" />
            <Text style={styles.infoTitle}>INSTRUCCIONES DE CALIBRACIÓN</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>1. Motores:</Text> Calibrar del lado izquierdo (motores 1) para semilla, fertilizante y alfalfero.
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>2. Procedimiento:</Text> Usar las salidas necesarias para controlar los kg/ha deseados.
            </Text>
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>⚠️ IMPORTANTE: DEMORA DE ARRANQUE</Text>
            <Text style={styles.warningText}>
              Existe una demora hasta llegar a 1,5 km/h. Debe sumar <Text style={styles.boldText}>0,80 m (80 cm)</Text> extra a la medición en grilla.
            </Text>
          </View>
        </View>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: { padding: theme.spacing.lg },
  subtitle: { marginBottom: theme.spacing.xl, color: theme.colors.textSecondary },
  inputCard: { padding: theme.spacing.lg, marginBottom: theme.spacing.lg },
  resultBox: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.xl,
    backgroundColor: '#F8F9F9',
    borderRadius: theme.layout.borderRadius,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  resultActive: {
    backgroundColor: '#E8F6F3',
    borderColor: '#A2D9CE',
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#16A085',
    letterSpacing: 1,
  },
  resultValue: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#1B4F72',
    marginVertical: 10,
  },
  resultUnit: {
    fontSize: 16,
    color: '#16A085',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#FFF5EB',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#E67E22',
  },
  infoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoTitle: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#874A16',
  },
  infoItem: { marginBottom: 10 },
  infoText: { fontSize: 14, color: '#874A16', lineHeight: 20 },
  bold: { fontWeight: 'bold' },
  warningBox: {
    marginTop: 10,
    backgroundColor: '#FDEBD0',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FAD7A0',
  },
  warningTitle: { fontSize: 12, fontWeight: 'bold', color: '#7E5109', marginBottom: 4 },
  warningText: { fontSize: 13, color: '#7E5109', lineHeight: 18 },
  boldText: { fontWeight: 'bold', textDecorationLine: 'underline' }
});