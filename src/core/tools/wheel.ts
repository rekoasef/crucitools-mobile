// src/core/tools/wheel.ts

export interface WheelDataPoint {
  dist: number;
  val1: number;
  val2?: number; // Opcional, porque algunas máquinas tienen solo 1 cubierta
}

export interface WheelModel {
  headers: string[]; // Nombres de las cubiertas
  data: WheelDataPoint[];
}

// Base de datos estática (Copiada de tu web)
export const WHEEL_DATA: Record<string, WheelModel> = {
  'PSIII Y PIV': {
    headers: ['Cubierta 7.5x16 (Siembra/Fert)', 'Cubierta 5.00x15 (2º Fert)'],
    data: [
      { dist: 17.5, val1: 22.5, val2: 28 },
      { dist: 20,   val1: 19.7, val2: 24.5 },
      { dist: 23.3, val1: 16.9, val2: 21 },
      { dist: 35,   val1: 11.3, val2: 14 },
      { dist: 40,   val1: 9.8,  val2: 12.3 },
      { dist: 46.6, val1: 8.4,  val2: 10.5 },
      { dist: 52.5, val1: 7.5,  val2: 9.3 },
      { dist: 70,   val1: 5.6,  val2: 7 },
    ]
  },
  'GRINGA V': {
    headers: ['Cubierta 6.50x16 (Siembra/Fert)'],
    data: [
      { dist: 42,   val1: 10.0 },
      { dist: 52.5, val1: 8.0 },
      { dist: 70,   val1: 6.0 },
      { dist: 100,  val1: 4.2 },
    ]
  },
  'GRINGA 70/35': {
    headers: ['Cubierta 7.5x16 (Siembra/Fert)'],
    data: [
      { dist: 35,   val1: 11.3 },
      { dist: 38.1, val1: 10.4 },
      { dist: 42,   val1: 9.4 },
      { dist: 52.5, val1: 7.5 },
      { dist: 70,   val1: 5.6 },
    ]
  }
};

/**
 * Obtiene la lista de modelos para el selector
 */
export const getWheelModels = () => {
  return Object.keys(WHEEL_DATA).map(key => ({ id: key, name: key }));
};

/**
 * Obtiene las distancias disponibles para un modelo
 */
export const getDistancesForModel = (modelId: string) => {
  const model = WHEEL_DATA[modelId];
  if (!model) return [];
  
  return model.data.map(d => ({
    id: d.dist.toString(),
    name: `${d.dist} cm`
  }));
};

/**
 * Busca el resultado final
 */
export const calculateWheelTurns = (modelId: string, distId: string) => {
  const model = WHEEL_DATA[modelId];
  if (!model) return null;

  const row = model.data.find(d => d.dist.toString() === distId);
  if (!row) return null;

  return {
    headers: model.headers,
    values: row
  };
};