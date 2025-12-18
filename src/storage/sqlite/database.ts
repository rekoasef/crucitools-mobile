// src/storage/sqlite/database.ts
import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES_QUERIES, TABLES } from './schema';

// Importamos el JSON generado (asegurate de haberlo creado o puesto uno vacío por ahora)
// Si TypeScript se queja del .json, crea un archivo d.ts o usa require
const SEED_DATA = require('../../core/constants/seedData.json'); 

const DB_NAME = 'crucitools.db';

export const getDBConnection = async () => {
  return await SQLite.openDatabaseAsync(DB_NAME);
};

export const initDatabase = async (): Promise<void> => {
  try {
    const db = await getDBConnection();
    await db.execAsync('PRAGMA journal_mode = WAL');
    
    // 1. Crear Tablas
    for (const query of CREATE_TABLES_QUERIES) {
      await db.execAsync(query);
    }

    // 2. Verificar si necesitamos inyectar datos (Seed)
    const result = await db.getAllAsync(`SELECT count(*) as count FROM ${TABLES.REF_CROPS}`);
    const count = (result[0] as any).count;

    if (count === 0) {
      console.log('[SQLite] DB vacía. Iniciando inyección de datos...');
      await seedDatabase(db);
    } else {
      console.log('[SQLite] Datos maestros ya existen. Omitiendo seed.');
    }
    
    console.log('[SQLite] Inicialización completa.');
  } catch (error) {
    console.error('[SQLite] Error crítico:', error);
    throw error;
  }
};

// Función masiva de inserción
const seedDatabase = async (db: SQLite.SQLiteDatabase) => {
  // Usamos transacciones para que sea ultra rápido
  await db.withTransactionAsync(async () => {
    
    // Inserción de Cultivos
    for (const item of SEED_DATA.crops) {
      await db.runAsync(`INSERT INTO ${TABLES.REF_CROPS} (id, name) VALUES (?, ?)`, [item.id, item.name]);
    }

    // Inserción de Placas
    for (const item of SEED_DATA.plates) {
      await db.runAsync(`INSERT INTO ${TABLES.REF_PLATES} (id, crop_id, name) VALUES (?, ?, ?)`, [item.id, item.crop_id, item.name]);
    }

    // Inserción de Distancias
    for (const item of SEED_DATA.spacings) {
      await db.runAsync(`INSERT INTO ${TABLES.REF_SPACINGS} (id, crop_id, plate_id, name) VALUES (?, ?, ?, ?)`, [item.id, item.crop_id, item.plate_id, item.name]);
    }

    // Inserción de Poblaciones (Esto puede tardar unos segundos, son muchos)
    for (const item of SEED_DATA.populations) {
      await db.runAsync(`INSERT INTO ${TABLES.REF_POPULATIONS} (id, crop_id, plate_id, spacing_id, name) VALUES (?, ?, ?, ?, ?)`, [item.id, item.crop_id, item.plate_id, item.spacing_id, item.name]);
    }

    // Inserción de Límites
    for (const item of SEED_DATA.limits) {
      await db.runAsync(`INSERT INTO ${TABLES.REF_SPEED_LIMITS} (id, min_speed, max_speed) VALUES (?, ?, ?)`, [item.id, item.min_speed, item.max_speed]);
    }
  });
  console.log('[SQLite] Inyección finalizada con éxito.');
};