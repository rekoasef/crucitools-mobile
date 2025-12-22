import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, StyleSheet, Text, View } from 'react-native';
import { SpeedCheckResult, SpeedStatus } from '../../../core/models/tools';
import { theme } from '../../../core/theme';
import { HistoryRepository } from '../../../storage/sqlite';
import { ReferenceRepository } from '../../../storage/sqlite/referenceRepository';
import { Body, Button, Card, H1, H2, Input, ScreenLayout, Select } from '../../../ui/components';

export const SpeedCheckScreen = () => {
  const [crops, setCrops] = useState<any[]>([]);
  const [plates, setPlates] = useState<any[]>([]);
  const [spacings, setSpacings] = useState<any[]>([]);
  const [populations, setPopulations] = useState<any[]>([]);

  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [selectedPlate, setSelectedPlate] = useState<string>('');
  const [selectedSpacing, setSelectedSpacing] = useState<string>('');
  const [selectedPopulation, setSelectedPopulation] = useState<string>('');
  
  const [limitRange, setLimitRange] = useState<{ min: number, max: number } | null>(null);
  const [speed, setSpeed] = useState('');
  const [result, setResult] = useState<SpeedCheckResult | null>(null);
  
  useEffect(() => {
    ReferenceRepository.getCrops().then(data => {
      setCrops(data.map((c: any) => ({ label: c.name, value: c.id })));
    });
  }, []);

  useEffect(() => {
    setPlates([]); setSelectedPlate(''); setLimitRange(null); setResult(null);
    if (selectedCrop) {
      ReferenceRepository.getPlatesByCrop(selectedCrop).then(data => {
        setPlates(data.map((p: any) => ({ label: p.name, value: p.id })));
      });
    }
  }, [selectedCrop]);

  useEffect(() => {
    setSpacings([]); setSelectedSpacing(''); setLimitRange(null); setResult(null);
    if (selectedPlate) {
      ReferenceRepository.getSpacings(selectedPlate).then(data => {
        setSpacings(data.map((s: any) => ({ label: s.name, value: s.id })));
      });
    }
  }, [selectedPlate]);

  useEffect(() => {
    setPopulations([]); setSelectedPopulation(''); setLimitRange(null); setResult(null);
    if (selectedSpacing) {
      ReferenceRepository.getPopulations(selectedSpacing).then(data => {
        setPopulations(data.map((p: any) => ({ label: p.name, value: p.id })));
      });
    }
  }, [selectedSpacing]);

  useEffect(() => {
    const fetchLimit = async () => {
      if (selectedCrop && selectedPlate && selectedSpacing && selectedPopulation) {
        try {
          const limit = await ReferenceRepository.getSpeedLimit(selectedCrop, selectedPlate, selectedSpacing, selectedPopulation);
          setLimitRange(limit ? { min: limit.min, max: limit.max } : { min: 4.0, max: 9.0 });
        } catch (e) { console.error(e); }
      }
    };
    fetchLimit();
  }, [selectedPopulation]);

  const handleVerify = async () => {
    Keyboard.dismiss();
    const speedValue = parseFloat(speed.replace(',', '.'));
    if (!limitRange || isNaN(speedValue) || speedValue <= 0) {
      Alert.alert('Error', 'Ingrese una velocidad válida.');
      return;
    }

    let status: SpeedStatus = 'APROBADA';
    let message = 'Velocidad Óptima';
    if (speedValue < limitRange.min) { status = 'BAJA_VELOCIDAD'; message = '⚠️ Aumentar Velocidad'; }
    else if (speedValue > limitRange.max) { status = 'ALTA_VELOCIDAD'; message = '⚠️ Reducir Velocidad'; }

    const res: SpeedCheckResult = { status, minSpeed: limitRange.min, maxSpeed: limitRange.max, currentSpeed: speedValue, message };
    setResult(res);
    await HistoryRepository.save('VELOCIDAD_SIEMBRA', { cropId: selectedCrop, speed: speedValue }, res);
  };

  return (
    <ScreenLayout scrollable>
      <View style={styles.container}>
        <H1>Velocidad de Siembra</H1>
        <Body style={styles.subtitle}>Configure la máquina para ver el rango operativo.</Body>
        <Card variant="flat" style={styles.configCard}>
          <Select label="1. CULTIVO" options={crops} selectedValue={selectedCrop} onValueChange={setSelectedCrop} />
          <Select label="2. PLACA" options={plates} selectedValue={selectedPlate} onValueChange={setSelectedPlate} disabled={!selectedCrop} />
          <Select label="3. DISTANCIA" options={spacings} selectedValue={selectedSpacing} onValueChange={setSelectedSpacing} disabled={!selectedPlate} />
          <Select label="4. POBLACIÓN" options={populations} selectedValue={selectedPopulation} onValueChange={setSelectedPopulation} disabled={!selectedSpacing} />
        </Card>
        {limitRange && (
          <View style={styles.rangeContainer}>
             <View style={styles.rangeHeader}><Text style={styles.rangeTitle}>RANGO OPERATIVO SUGERIDO</Text></View>
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
        {limitRange && (
          <View style={styles.verifySection}>
            <Input label="Verificar velocidad actual" placeholder="Ej: 6.5" suffix="km/h" keyboardType="numeric" value={speed} onChangeText={setSpeed} style={{textAlign: 'center'}} />
            <Button title="VERIFICAR ESTADO" onPress={handleVerify} disabled={!speed} />
            {result && (
              <Card style={[styles.resultCard, { borderLeftColor: result.status === 'APROBADA' ? theme.colors.success : theme.colors.warning }]}>
                <H2 style={{ color: result.status === 'APROBADA' ? theme.colors.success : theme.colors.warning, textAlign: 'center' }}>{result.message}</H2>
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
  rangeContainer: { backgroundColor: theme.colors.cardBackground, borderRadius: theme.layout.borderRadius, overflow: 'hidden', elevation: 4, marginBottom: theme.spacing.lg, borderWidth: 1, borderColor: theme.colors.border },
  rangeHeader: { backgroundColor: theme.colors.darkGray, paddingVertical: theme.spacing.sm, alignItems: 'center' },
  rangeTitle: { color: theme.colors.textInverse, fontWeight: 'bold', fontSize: 14 },
  rangeValues: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: theme.spacing.lg },
  rangeItem: { alignItems: 'center' },
  rangeLabel: { fontSize: 12, color: theme.colors.textSecondary, fontWeight: 'bold' },
  rangeNumber: { fontSize: 32, fontWeight: 'bold', color: theme.colors.primary },
  unit: { fontSize: 16, color: theme.colors.textPrimary },
  verticalLine: { width: 1, height: 40, backgroundColor: theme.colors.border },
  verifySection: { marginTop: theme.spacing.sm },
  resultCard: { marginTop: theme.spacing.lg, borderLeftWidth: 6, alignItems: 'center' },
});