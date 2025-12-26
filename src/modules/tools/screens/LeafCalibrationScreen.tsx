// src/modules/tools/screens/LeafCalibrationScreen.tsx

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../core/theme';

// Importaciones directas para asegurar que ningún componente llegue como undefined
import { Button } from '../../../ui/components/Button';
import { Card } from '../../../ui/components/Card';
import { ScreenLayout } from '../../../ui/components/ScreenLayout';
import { Select } from '../../../ui/components/Select';
import { Body, H1 } from '../../../ui/components/Typography';

// Interfaces para los datos
interface PlateConfig {
  label: string;
  value: string;
  seeds: number;
}

interface ModeloConfig {
  modelo: string;
  relacionTransmision: number;
  vueltasPlaca: number;
  plates: PlateConfig[];
}

const CALIBRATION_DATA: ModeloConfig[] = [
  {
    modelo: "GRINGA",
    relacionTransmision: 0.234,
    vueltasPlaca: 2.34,
    plates: [
      { label: "12 Alveolos", value: "12", seeds: 28 },
      { label: "27 Alveolos", value: "27", seeds: 63 },
      { label: "32 Alveolos", value: "32", seeds: 75 },
      { label: "56 Alveolos", value: "56", seeds: 131 },
      { label: "80 Alveolos", value: "80", seeds: 187 }
    ]
  },
  {
    modelo: "PIONERA",
    relacionTransmision: 0.484,
    vueltasPlaca: 4.84,
    plates: [
      { label: "12 Alveolos", value: "12", seeds: 58 },
      { label: "27 Alveolos", value: "27", seeds: 131 },
      { label: "32 Alveolos", value: "32", seeds: 155 },
      { label: "56 Alveolos", value: "56", seeds: 271 },
      { label: "80 Alveolos", value: "80", seeds: 387 }
    ]
  },
  {
    modelo: "DRILOR NEUM.",
    relacionTransmision: 0.274,
    vueltasPlaca: 2.74,
    plates: [
      { label: "12 Alveolos", value: "12", seeds: 33 },
      { label: "27 Alveolos", value: "27", seeds: 74 },
      { label: "32 Alveolos", value: "32", seeds: 88 },
      { label: "56 Alveolos", value: "56", seeds: 153 },
      { label: "80 Alveolos", value: "80", seeds: 219 }
    ]
  },
  {
    modelo: "PLANTOR LEAF",
    relacionTransmision: 0.423,
    vueltasPlaca: 4.23,
    plates: [
      { label: "12 Alveolos", value: "12", seeds: 51 },
      { label: "27 Alveolos", value: "27", seeds: 114 },
      { label: "32 Alveolos", value: "32", seeds: 135 },
      { label: "56 Alveolos", value: "56", seeds: 237 },
      { label: "80 Alveolos", value: "80", seeds: 338 }
    ]
  },
  {
    modelo: "DRILOR MEC.",
    relacionTransmision: 0.076,
    vueltasPlaca: 0.76,
    plates: [
      { label: "62 Alveolos", value: "62", seeds: 47 },
      { label: "66 Alveolos", value: "66", seeds: 50 },
      { label: "120 Alveolos", value: "120", seeds: 91 },
      { label: "126 Alveolos", value: "126", seeds: 96 },
      { label: "174 Alveolos", value: "174", seeds: 132 }
    ]
  }
];

const CONSTANTS = { pulsos: 260, vueltasMotor: 10 };

export const LeafCalibrationScreen = () => {
  const [step, setStep] = useState(0);
  const [mandoType, setMandoType] = useState<'cardan' | 'elliot' | null>(null);
  const [selectedModelo, setSelectedModelo] = useState('');
  const [selectedPlateValue, setSelectedPlateValue] = useState('');

  const modelInfo = useMemo(() => 
    CALIBRATION_DATA.find(m => m.modelo === selectedModelo), 
  [selectedModelo]);

  const seedResult = useMemo(() => {
    if (!modelInfo || !selectedPlateValue) return null;
    return modelInfo.plates.find(p => p.value === selectedPlateValue);
  }, [modelInfo, selectedPlateValue]);

  const reset = () => {
    setStep(0);
    setMandoType(null);
    setSelectedModelo('');
    setSelectedPlateValue('');
  };

  return (
    <ScreenLayout scrollable>
      <View style={styles.container}>
        <View style={styles.headerRow}>
            <H1>Calibración Leaf</H1>
            {step > 0 && (
                <TouchableOpacity onPress={reset} style={styles.resetBadge}>
                    <MaterialCommunityIcons name="refresh" size={14} color="white" />
                    <Text style={styles.resetText}>REINICIAR</Text>
                </TouchableOpacity>
            )}
        </View>

        {/* PASO 0: SELECCIÓN DE TIPO DE MANDO */}
        {step === 0 && (
          <View style={styles.mandoSelection}>
            <Body style={styles.instruction}>Seleccione el tipo de mando de su máquina:</Body>
            <TouchableOpacity 
              style={styles.mandoOption} 
              onPress={() => { setMandoType('cardan'); setStep(1); }}
            >
              <MaterialCommunityIcons name="vector-polyline" size={32} color={theme.colors.primary} />
              <Text style={styles.mandoTitle}>Mando Cardánico</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.mandoOption, styles.mandoOptionElliot]} 
              onPress={() => { setMandoType('elliot'); setStep(1); }}
            >
              <MaterialCommunityIcons name="transition" size={32} color="#666" />
              <View>
                <Text style={styles.mandoTitle}>Mando Elliot</Text>
                <Text style={styles.devTag}>EN DESARROLLO</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* FLUJO MANDO CARDÁNICO */}
        {mandoType === 'cardan' && (
          <View>
            <View style={styles.stepsIndicator}>
                {[1, 2, 3, 4].map(s => (
                    <View key={s} style={[styles.stepDot, step >= s && styles.stepDotActive]} />
                ))}
            </View>

            {step === 1 && (
              <View>
                <Body style={styles.instruction}>1. Seleccione el modelo:</Body>
                <Card style={{ padding: 10 }}>
                  <Select 
                    label="MÁQUINA"
                    options={CALIBRATION_DATA.map(m => ({ label: m.modelo, value: m.modelo }))}
                    selectedValue={selectedModelo}
                    onValueChange={(val) => setSelectedModelo(val)}
                    placeholder="Elija el modelo..."
                  />
                </Card>
                <Button title="SIGUIENTE" disabled={!selectedModelo} onPress={() => setStep(2)} style={{marginTop: 20}} />
              </View>
            )}

            {step === 2 && (
              <View>
                <Card style={styles.instructionCard}>
                  <MaterialCommunityIcons name="cog-play" size={60} color={theme.colors.primary} />
                  <Text style={styles.stepText}>Vaya al monitor y realice{"\n"}<Text style={styles.bold}>{CONSTANTS.vueltasMotor} VUELTAS DE MOTOR</Text></Text>
                </Card>
                <Button title="HECHO, YA LAS DI" onPress={() => setStep(3)} />
              </View>
            )}

            {step === 3 && (
              <View>
                <Body style={styles.instruction}>3. Datos de configuración en monitor:</Body>
                <Card style={styles.checkCard}>
                  <View style={styles.checkRow}>
                    <Text style={styles.checkLabel}>PULSOS:</Text>
                    <Text style={styles.checkValue}>{CONSTANTS.pulsos}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.checkRow}>
                    <Text style={styles.checkLabel}>RELACIÓN DE TRANSMISIÓN:</Text>
                    <Text style={styles.checkValue}>{modelInfo?.relacionTransmision}</Text>
                  </View>
                </Card>
                
                {/* TEXTO INFORMATIVO SEPARADO PARA VUELTAS DE PLACA */}
                <View style={styles.infoBox}>
                  <MaterialCommunityIcons name="information-outline" size={20} color="#546E7A" />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoTitle}>Información del sistema:</Text>
                    <Text style={styles.infoBody}>
                      Para este modelo, la placa del dosificador realiza <Text style={styles.infoBold}>{modelInfo?.vueltasPlaca} vueltas</Text> de manera automática.
                    </Text>
                  </View>
                </View>

                <Button title="CONTINUAR" onPress={() => setStep(4)} style={{marginTop: 10}} />
              </View>
            )}

            {step === 4 && (
              <View>
                <Body style={styles.instruction}>4. Seleccione la placa para el conteo:</Body>
                <Card style={{ padding: 10, marginBottom: 20 }}>
                   <Select 
                    label="TIPO DE PLACA" 
                    options={modelInfo?.plates || []} 
                    selectedValue={selectedPlateValue}
                    onValueChange={(val) => setSelectedPlateValue(val)} 
                    placeholder="Alvéolos..." 
                  />
                </Card>
                {seedResult && (
                  <Card style={styles.resultCard}>
                    <Text style={styles.resultLabel}>DEBEMOS RECOGER LAS SEMILLAS QUE TIRA EL DOSIFICADOR Y CONTAR:</Text>
                    <View style={styles.resultRow}><Text style={styles.resultValue}>{seedResult.seeds}</Text><Text style={styles.resultUnit}>semillas</Text></View>
                    <Text style={styles.resultFooter}>Totales por cada cuerpo</Text>
                  </Card>
                )}
              </View>
            )}
          </View>
        )}

        {mandoType === 'elliot' && (
          <View style={styles.devContainer}>
              <MaterialCommunityIcons name="crane" size={80} color="#CCC" />
              <H1>MANDO ELLIOT</H1>
              <Body style={{textAlign: 'center', color: '#AAA', marginTop: 10}}>
                Esta funcionalidad se habilitará próximamente.
              </Body>
              <Button title="VOLVER" style={{marginTop: 30, width: '100%'}} onPress={reset} />
          </View>
        )}
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: { padding: theme.spacing.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  resetBadge: { backgroundColor: theme.colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  resetText: { color: 'white', fontWeight: 'bold', fontSize: 10, marginLeft: 4 },
  mandoSelection: { marginTop: 10 },
  mandoOption: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    padding: 25, 
    borderRadius: 16, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: theme.colors.border,
    elevation: 2 
  },
  mandoOptionElliot: { backgroundColor: '#F5F5F5', borderColor: '#DDD' },
  mandoTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15, color: theme.colors.textPrimary },
  devTag: { fontSize: 10, color: theme.colors.primary, fontWeight: 'bold', marginLeft: 15, marginTop: 2 },
  stepsIndicator: { flexDirection: 'row', justifyContent: 'center', marginBottom: 30 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E0E0E0', marginHorizontal: 4 },
  stepDotActive: { backgroundColor: theme.colors.primary, width: 20 },
  instruction: { marginBottom: 15, color: theme.colors.textPrimary, fontWeight: 'bold', fontSize: 15 },
  instructionCard: { padding: 35, alignItems: 'center', marginBottom: 20, backgroundColor: 'white', borderRadius: 12 },
  stepText: { textAlign: 'center', marginTop: 20, fontSize: 18, color: '#333', lineHeight: 28 },
  bold: { fontWeight: '900', color: theme.colors.primary },
  checkCard: { padding: 20, marginBottom: 15 },
  checkRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  checkLabel: { fontWeight: 'bold', color: '#777', fontSize: 13 },
  checkValue: { fontSize: 22, fontWeight: 'bold', color: theme.colors.primary },
  divider: { height: 1, backgroundColor: '#F0F0F0' },
  
  // Estilos del bloque informativo
  infoBox: { 
    backgroundColor: '#ECEFF1', 
    padding: 15, 
    borderRadius: 10, 
    flexDirection: 'row', 
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#90A4AE',
    marginBottom: 20
  },
  infoTextContainer: { marginLeft: 10, flex: 1 },
  infoTitle: { fontWeight: 'bold', color: '#455A64', fontSize: 13, marginBottom: 2 },
  infoBody: { color: '#546E7A', fontSize: 14, lineHeight: 20 },
  infoBold: { fontWeight: 'bold', color: '#000' },

  resultCard: { backgroundColor: theme.colors.darkGray, padding: 30, alignItems: 'center', borderLeftWidth: 6, borderLeftColor: theme.colors.primary, borderRadius: 12 },
  resultLabel: { color: 'white', opacity: 0.8, fontSize: 11, fontWeight: 'bold', textAlign: 'center' },
  resultRow: { flexDirection: 'row', alignItems: 'baseline', marginVertical: 15 },
  resultValue: { fontSize: 75, fontWeight: 'bold', color: 'white' },
  resultUnit: { color: theme.colors.primary, fontSize: 22, marginLeft: 10, fontWeight: 'bold' },
  resultFooter: { color: 'white', opacity: 0.5, fontSize: 13 },
  devContainer: { marginTop: 80, alignItems: 'center', padding: 20 }
});