// src/core/tools/planting.ts
import { SpeedCheckResult, SpeedStatus } from '../models/tools';

// --- LÓGICA DE VELOCIDAD (Módulo 1) ---
export const checkSowingSpeedPure = (
  speedKmh: number, 
  min: number, 
  max: number
): SpeedCheckResult => {
  let status: SpeedStatus = 'APROBADA';
  let message = 'Velocidad Óptima';

  if (speedKmh < min) {
    status = 'BAJA_VELOCIDAD';
    message = 'Aumentar Velocidad';
  } else if (speedKmh > max) {
    status = 'ALTA_VELOCIDAD';
    message = 'Reducir Velocidad';
  }

  return {
    status,
    minSpeed: min,
    maxSpeed: max,
    currentSpeed: speedKmh,
    message
  };
};

// --- LÓGICA DE DENSIDAD (Módulo 2) ---
export interface DensityResult {
  mainValue: number; 
  seedDistanceCm: number; 
}

export const calculateDensity = (
  mode: 'toHa' | 'toMetro',
  value: number,
  rowSpacingMeters: number
): DensityResult => {
  if (rowSpacingMeters <= 0 || value <= 0) {
    return { mainValue: 0, seedDistanceCm: 0 };
  }

  let mainResult = 0;
  let distSemillas = 0;

  if (mode === 'toHa') {
    const semHa = (100 * value) * (100 / rowSpacingMeters);
    distSemillas = 100 / value; 
    mainResult = Math.round(semHa);
  } else {
    const semMetro = value / (100 / rowSpacingMeters) / 100;
    distSemillas = 100 / semMetro; 
    mainResult = parseFloat(semMetro.toFixed(2));
  }

  return {
    mainValue: mainResult,
    seedDistanceCm: parseFloat(distSemillas.toFixed(2))
  };
};

// --- LÓGICA DE CV (Módulo 3 - NUEVO) ---

export type CVCropType = 'maiz' | 'girasol' | 'soja';

export interface CVResult {
  cv: number;          // El porcentaje final
  mean: number;        // El promedio de las distancias
  status: 'GOOD' | 'WARNING';
  limit: number;       // El límite usado (20, 25 o 30)
}

const CV_LIMITS = {
  maiz: 20,
  girasol: 25,
  soja: 30
};

export const calculateCV = (crop: CVCropType, inputs: string[]): CVResult | null => {
  // 1. Limpiar datos (convertir a números y quitar vacíos/ceros)
  const data = inputs
    .map((val) => parseFloat(val.replace(',', '.')))
    .filter((val) => !isNaN(val) && val > 0);

  // Necesitamos al menos 2 datos para calcular desviación estándar
  if (data.length < 2) return null;

  // 2. Calcular Promedio (Media)
  const sum = data.reduce((a, b) => a + b, 0);
  const mean = sum / data.length;

  // 3. Calcular Desviación Estándar (Muestral: n-1)
  const squaredDiffs = data.map((val) => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / (data.length - 1);
  const stdDev = Math.sqrt(variance);

  // 4. Calcular CV
  const cvRaw = (stdDev / mean) * 100;
  const cv = parseFloat(cvRaw.toFixed(2));

  // 5. Determinar Estado
  const limit = CV_LIMITS[crop];
  const status = cv <= limit ? 'GOOD' : 'WARNING';

  return {
    cv,
    mean: parseFloat(mean.toFixed(2)),
    status,
    limit
  };
};