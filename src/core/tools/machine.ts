// src/core/tools/machine.ts
import { METERS_PER_HECTARE } from '../constants/agronomy';
import { MachineModel } from '../models/tools';

/**
 * MÓDULO 1.4: Rueda de Mando
 * Calcula vueltas para simular 1/10 de hectárea.
 * Fórmula: Distancia para 1/10 ha = 1000 m² / ancho de labor
 * Vueltas = Distancia / Perímetro rueda
 */
export const calculateWheelTurns = (
  machine: MachineModel,
  rowDistanceMeters: number,
  rowCount: number
): number => {
  const workWidth = rowDistanceMeters * rowCount; // Ancho de labor
  if (workWidth <= 0 || machine.wheelPerimeter <= 0) return 0;

  const targetAreaM2 = METERS_PER_HECTARE / 10; // 1/10 de hectárea (1000 m²)
  const linearDistanceToTravel = targetAreaM2 / workWidth;
  
  const turns = linearDistanceToTravel / machine.wheelPerimeter;
  
  return Number(turns.toFixed(1)); // Devuelve con 1 decimal
};

/**
 * MÓDULO 1.5: Control de Dosis (Kg/Ha)
 * Calcula metros lineales a recorrer para control de dosis.
 * Generalmente se usa 1/100 de hectárea o una distancia fija para colectar muestra.
 * Aquí calculamos los metros para representar 1/100 de Ha por cuerpo.
 */
export const calculateCalibrationDistance = (rowDistanceMeters: number): number => {
  if (rowDistanceMeters <= 0) return 0;
  
  // Para 1 Hectárea (10.000 m²)
  // Metros lineales = 10.000 / Distancia entre hileras
  // Para calibración (ej: muestra representativa pequeña), definimos factor
  // Si buscamos recolectar lo equivalente a 100m²:
  const SAMPLE_AREA = 100; 
  
  return Number((SAMPLE_AREA / rowDistanceMeters).toFixed(1));
};