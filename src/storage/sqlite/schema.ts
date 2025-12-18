// src/storage/sqlite/schema.ts

export const TABLES = {
  HISTORY: 'tools_history',
  DOCUMENTS: 'library_documents',
  // Nuevas tablas de referencia
  REF_CROPS: 'ref_crops',
  REF_PLATES: 'ref_plates',
  REF_SPACINGS: 'ref_spacings',
  REF_POPULATIONS: 'ref_populations',
  REF_SPEED_LIMITS: 'ref_speed_limits'
};

export const CREATE_TABLES_QUERIES = [
  // ... Historial y Documentos (Mantenemos igual)
  `CREATE TABLE IF NOT EXISTS ${TABLES.HISTORY} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tool_type TEXT NOT NULL,
    input_data TEXT NOT NULL,
    result_data TEXT NOT NULL,
    created_at TEXT NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS ${TABLES.DOCUMENTS} (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    local_path TEXT,
    version INTEGER DEFAULT 1,
    is_downloaded INTEGER DEFAULT 0
  );`,

  // --- TABLAS MAESTRAS (Espejo de tus CSVs) ---
  `CREATE TABLE IF NOT EXISTS ${TABLES.REF_CROPS} (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS ${TABLES.REF_PLATES} (
    id TEXT PRIMARY KEY,
    crop_id TEXT NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY(crop_id) REFERENCES ${TABLES.REF_CROPS}(id)
  );`,

  `CREATE TABLE IF NOT EXISTS ${TABLES.REF_SPACINGS} (
    id TEXT PRIMARY KEY,
    crop_id TEXT NOT NULL,
    plate_id TEXT NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY(plate_id) REFERENCES ${TABLES.REF_PLATES}(id)
  );`,

  `CREATE TABLE IF NOT EXISTS ${TABLES.REF_POPULATIONS} (
    id TEXT PRIMARY KEY,
    crop_id TEXT NOT NULL,
    plate_id TEXT NOT NULL,
    spacing_id TEXT NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY(spacing_id) REFERENCES ${TABLES.REF_SPACINGS}(id)
  );`,

  // Tabla de límites de velocidad (La "Matriz" de validación)
  `CREATE TABLE IF NOT EXISTS ${TABLES.REF_SPEED_LIMITS} (
    id TEXT PRIMARY KEY, -- cropId|plateId|spacingId|populationId
    min_speed REAL NOT NULL,
    max_speed REAL NOT NULL
  );`
];