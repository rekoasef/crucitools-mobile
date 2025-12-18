// src/core/constants/agronomy.ts
import { CropType, CVStatus } from '../models/tools';
import { PALETTE } from '../theme/colors';

// Límites de Coeficiente de Variación (CV)
export const CV_THRESHOLDS: Record<CropType, number> = {
  MAIZ: 20,
  GIRASOL: 25,
  SOJA: 30,
  TRIGO: 35, // Valor por defecto estándar
  SORGO: 30,
};

// Colores asociados al estado del CV
export const CV_COLORS: Record<CVStatus, string> = {
  OPTIMO: PALETTE.success,   // Verde
  ACEPTABLE: PALETTE.warning, // Amarillo/Naranja (si agregamos rango medio)
  CRITICO: PALETTE.warning,   // Naranja/Rojo según prompt (Naranja para > limite)
};

// Velocidades de referencia (km/h) para validación simple
// Esto se podría refinar con tablas más complejas a futuro
export const SPEED_RANGES: Record<CropType, { min: number; max: number }> = {
  MAIZ: { min: 4.5, max: 7.5 },
  GIRASOL: { min: 5.0, max: 8.0 },
  SOJA: { min: 6.0, max: 9.0 },
  TRIGO: { min: 6.0, max: 10.0 },
  SORGO: { min: 5.0, max: 8.0 },
};

// Factores de conversión
export const METERS_PER_HECTARE = 10000;