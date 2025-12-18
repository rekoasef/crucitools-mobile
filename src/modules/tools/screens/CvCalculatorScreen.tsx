// src/modules/tools/screens/CvCalculatorScreen.tsx
import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../core/theme';
import { calculateCV, CVCropType, CVResult } from '../../../core/tools/planting';
import { HistoryRepository } from '../../../storage/sqlite';
import { Body, Button, Card, H1, Input, ScreenLayout } from '../../../ui/components';

// Definición de botones de cultivo
const CROPS: { key: CVCropType; label: string; limit: number }[] = [
  { key: 'maiz', label: 'MAÍZ', limit: 20 },
  { key: 'girasol', label: 'GIRASOL', limit: 25 },
  { key: 'soja', label: 'SOJA', limit: 30 },
];

export const CvCalculatorScreen = () => {
  // --- ESTADOS ---
  const [selectedCrop, setSelectedCrop] = useState<CVCropType>('maiz');
  // Iniciamos con 5 espacios vacíos para facilitar la carga rápida
  const [inputs, setInputs] = useState<string[]>(['', '', '', '', '']);
  const [result, setResult] = useState<CVResult | null>(null);

  // --- MANEJO DE INPUTS ---
  const handleInputChange = (text: string, index: number) => {
    const newInputs = [...inputs];
    newInputs[index] = text;
    setInputs(newInputs);
    setResult(null); // Limpiar resultado al editar
  };

  const addInput = () => {
    setInputs([...inputs, '']);
  };

  // --- CÁLCULO ---
  const handleCalculate = async () => {
    Keyboard.dismiss();
    const res = calculateCV(selectedCrop, inputs);

    if (!res) {
      alert('Por favor ingrese al menos 2 distancias válidas.');
      return;
    }

    setResult(res);

    // Guardar en Historial
    await HistoryRepository.save(
      'CV_CALCULATOR',
      { crop: selectedCrop, dataPoints: inputs.filter(i => i !== '').length },
      res
    );
  };

  const getStatusColor = () => {
    if (!result) return theme.colors.textPrimary;
    return result.status === 'GOOD' ? theme.colors.success : theme.colors.warning;
  };

  return (
    <ScreenLayout scrollable>
      <View style={styles.container}>
        <H1>Coeficiente de Variación</H1>
        <Body style={styles.subtitle}>Mida la distancia entre semillas para evaluar la calidad de siembra.</Body>

        {/* 1. SELECTOR DE CULTIVO */}
        <View style={styles.cropSelector}>
          {CROPS.map((crop) => (
            <TouchableOpacity
              key={crop.key}
              style={[
                styles.cropButton,
                selectedCrop === crop.key && styles.cropButtonActive
              ]}
              onPress={() => { setSelectedCrop(crop.key); setResult(null); }}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.cropText,
                selectedCrop === crop.key && styles.cropTextActive
              ]}>
                {crop.label}
              </Text>
              <Text style={[
                 styles.cropLimit,
                 selectedCrop === crop.key && styles.cropTextActive
              ]}>Max {crop.limit}%</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 2. GRID DE INPUTS */}
        <Card variant="flat" style={styles.inputCard}>
          <Body style={{ marginBottom: 10, fontWeight: 'bold', color: theme.colors.textSecondary }}>
            DISTANCIAS (cm)
          </Body>
          
          <View style={styles.grid}>
            {inputs.map((val, index) => (
              <View key={index} style={styles.inputWrapper}>
                <Text style={styles.indexLabel}>#{index + 1}</Text>
                <TouchableOpacity style={styles.inputBox}>
                    {/* Usamos un TextInput nativo dentro de Touchable para mejor control en grilla */}
                    <View pointerEvents="none"> 
                       {/* Truco: Input invisible real abajo o manejo directo. 
                           Para simplificar en este ejemplo usamos inputs normales. */}
                    </View>
                    <Input 
                        label="" 
                        value={val}
                        onChangeText={(t) => handleInputChange(t, index)}
                        keyboardType="numeric"
                        placeholder="-"
                        style={styles.smallInput}
                    />
                </TouchableOpacity>
              </View>
            ))}
            
            {/* Botón + */}
            <TouchableOpacity style={styles.addButton} onPress={addInput}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Button 
          title="CALCULAR CV %" 
          onPress={handleCalculate}
        />

        {/* 3. RESULTADO */}
        {result && (
          <Card style={[styles.resultCard, { borderColor: getStatusColor() }]}>
            <View style={[styles.resultHeader, { backgroundColor: getStatusColor() }]}>
               <Text style={styles.resultTitle}>
                 {result.status === 'GOOD' ? 'EXCELENTE UNIFORMIDAD' : 'ALTA VARIABILIDAD'}
               </Text>
            </View>

            <View style={styles.resultBody}>
                <View style={styles.mainValueContainer}>
                    <Text style={[styles.mainValue, { color: getStatusColor() }]}>
                        {result.cv}%
                    </Text>
                    <Text style={styles.labelCV}>COEF. VARIACIÓN</Text>
                </View>
                
                <View style={styles.statsRow}>
                    <Text style={styles.statText}>Promedio: {result.mean} cm</Text>
                    <Text style={styles.statText}>Límite: {result.limit}%</Text>
                </View>

                <View style={styles.messageBox}>
                    <Text style={styles.messageText}>
                        {result.status === 'GOOD' 
                            ? `El planteo es correcto. Está por debajo del ${result.limit}% tolerado.`
                            : `El desvío es alto (> ${result.limit}%). Revise el sistema de dosificación o velocidad.`
                        }
                    </Text>
                </View>
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
  
  // Cultivos
  cropSelector: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.cardBackground,
    padding: 4,
    borderRadius: theme.layout.borderRadius,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cropButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: theme.layout.borderRadius - 4,
  },
  cropButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  cropText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  cropLimit: {
    fontSize: 10,
    marginTop: 2,
    color: theme.colors.textSecondary,
    opacity: 0.7
  },
  cropTextActive: {
    color: theme.colors.textInverse,
  },

  // Inputs Grid
  inputCard: { marginBottom: theme.spacing.lg },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  inputWrapper: {
    width: '33.33%', // 3 columnas
    padding: 5,
    marginBottom: 10,
  },
  indexLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginBottom: 2,
    textAlign: 'center'
  },
  inputBox: {
      // Wrapper styles
  },
  smallInput: {
      textAlign: 'center',
      paddingVertical: 8,
      height: 45
  },
  addButton: {
    width: '33.33%',
    height: 70, // Ajustar altura visual para coincidir
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15
  },
  addButtonText: {
    fontSize: 30,
    color: theme.colors.primary,
    fontWeight: 'bold'
  },

  // Result Card
  resultCard: {
    marginTop: theme.spacing.lg,
    padding: 0,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: theme.colors.darkGray
  },
  resultHeader: {
    padding: 12,
    alignItems: 'center'
  },
  resultTitle: {
    color: theme.colors.textInverse,
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1
  },
  resultBody: {
    padding: theme.spacing.lg,
    alignItems: 'center'
  },
  mainValueContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md
  },
  mainValue: {
    fontSize: 56,
    fontWeight: theme.typography.weights.heavy,
    lineHeight: 60
  },
  labelCV: {
    color: theme.colors.textInverse,
    opacity: 0.6,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 10,
    marginBottom: 15
  },
  statText: {
    color: theme.colors.textInverse,
    fontSize: 14
  },
  messageBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 8,
    width: '100%'
  },
  messageText: {
    color: theme.colors.textInverse,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18
  }
});