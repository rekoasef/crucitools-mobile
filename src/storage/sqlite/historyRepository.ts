// src/storage/sqlite/historyRepository.ts
import { getDBConnection } from './database';
import { TABLES } from './schema';

export interface HistoryItem {
  id: number;
  toolType: string;
  inputData: any;
  resultData: any;
  createdAt: string;
}

export const HistoryRepository = {
  /**
   * Guarda un nuevo cálculo en el historial
   */
  save: async (toolType: string, input: any, result: any) => {
    const db = await getDBConnection();
    const statement = await db.prepareAsync(
      `INSERT INTO ${TABLES.HISTORY} (tool_type, input_data, result_data, created_at) VALUES ($type, $input, $result, $date)`
    );

    try {
      await statement.executeAsync({
        $type: toolType,
        $input: JSON.stringify(input),
        $result: JSON.stringify(result),
        $date: new Date().toISOString()
      });
      console.log(`[History] Guardado cálculo: ${toolType}`);
    } finally {
      await statement.finalizeAsync();
    }
  },

  /**
   * Obtiene los últimos N registros
   */
  getRecent: async (limit: number = 20): Promise<HistoryItem[]> => {
    const db = await getDBConnection();
    const result = await db.getAllAsync(
      `SELECT * FROM ${TABLES.HISTORY} ORDER BY id DESC LIMIT ?`,
      [limit]
    );

    // Mapear de SQL raw a nuestro objeto tipado
    return result.map((row: any) => ({
      id: row.id,
      toolType: row.tool_type,
      inputData: JSON.parse(row.input_data),
      resultData: JSON.parse(row.result_data),
      createdAt: row.created_at
    }));
  },

  /**
   * Limpia todo el historial (útil para debug o limpiar caché)
   */
  clear: async () => {
    const db = await getDBConnection();
    await db.runAsync(`DELETE FROM ${TABLES.HISTORY}`);
  }
};