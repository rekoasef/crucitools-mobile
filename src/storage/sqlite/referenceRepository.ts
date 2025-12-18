import { getDBConnection } from './database';
import { TABLES } from './schema';

export const ReferenceRepository = {
  getCrops: async () => {
    const db = await getDBConnection();
    return await db.getAllAsync(`SELECT * FROM ${TABLES.REF_CROPS}`);
  },

  getPlatesByCrop: async (cropId: string) => {
    const db = await getDBConnection();
    return await db.getAllAsync(`SELECT * FROM ${TABLES.REF_PLATES} WHERE crop_id = ?`, [cropId]);
  },

  getSpacings: async (plateId: string) => {
    const db = await getDBConnection();
    return await db.getAllAsync(`SELECT * FROM ${TABLES.REF_SPACINGS} WHERE plate_id = ?`, [plateId]);
  },

  getPopulations: async (spacingId: string) => {
    const db = await getDBConnection();
    return await db.getAllAsync(`SELECT * FROM ${TABLES.REF_POPULATIONS} WHERE spacing_id = ?`, [spacingId]);
  },

  getSpeedLimit: async (cropId: string, plateId: string, spacingId: string, populationId: string) => {
    const db = await getDBConnection();
    const key = `${cropId}|${plateId}|${spacingId}|${populationId}`;
    const result = await db.getAllAsync(`SELECT * FROM ${TABLES.REF_SPEED_LIMITS} WHERE id = ?`, [key]);
    
    if (result.length > 0) {
      return { min: (result[0] as any).min_speed, max: (result[0] as any).max_speed };
    }
    return null;
  }
};