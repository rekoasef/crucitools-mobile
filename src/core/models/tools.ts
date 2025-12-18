// src/core/models/tools.ts

export type CropType = 'MAIZ' | 'GIRASOL' | 'SOJA' | 'TRIGO' | 'SORGO';

// Resultado del semáforo de CV
export type CVStatus = 'OPTIMO' | 'ACEPTABLE' | 'CRITICO';

// Resultado de validación de velocidad
export type SpeedStatus = 'APROBADA' | 'BAJA_VELOCIDAD' | 'ALTA_VELOCIDAD';

export interface SpeedCheckResult {
  status: SpeedStatus;
  minSpeed: number;
  maxSpeed: number;
  currentSpeed: number;
  message: string;
}

export interface CVResult {
  cv: number; // Porcentaje
  status: CVStatus;
  color: string; // Hex color para la UI futura
}

export interface MachineModel {
  id: string;
  name: string;
  wheelPerimeter: number; // en metros
  transmissionRatio?: number;
}