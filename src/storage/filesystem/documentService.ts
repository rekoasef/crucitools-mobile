import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';
import { DocumentMeta } from '../../core/constants/documentsData';
import { getDBConnection, TABLES } from '../sqlite';

export interface LocalDocument extends DocumentMeta {
  localPath: string | null;
  isDownloaded: boolean;
}

export const DocumentService = {
  
  _getRootDir: (): string | null => {
    // --- DIAGNÓSTICO FILESYSTEM ---
    console.log('--- DIAGNÓSTICO FILESYSTEM ---');
    console.log('Platform OS:', Platform.OS);
    
    if (!FileSystem) {
        console.error('CRÍTICO: El módulo FileSystem es UNDEFINED');
        return null;
    }

    // console.log('FileSystem Keys:', Object.keys(FileSystem)); // Descomentar si se necesita más detalle
    console.log('FileSystem.documentDirectory:', FileSystem.documentDirectory);
    console.log('FileSystem.cacheDirectory:', FileSystem.cacheDirectory);
    console.log('------------------------------');

    const docDir = FileSystem.documentDirectory;
    if (docDir && typeof docDir === 'string') {
      return docDir + 'crucitools_docs/';
    }

    const cacheDir = FileSystem.cacheDirectory;
    if (cacheDir && typeof cacheDir === 'string') {
      return cacheDir + 'crucitools_docs/';
    }

    console.error('CRÍTICO: FileSystem devolvió null. Apague Remote Debugging.');
    return null;
  },

  init: async () => {
    const root = DocumentService._getRootDir();
    if (!root) return; 

    try {
      const dirInfo = await FileSystem.getInfoAsync(root);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(root, { intermediates: true });
      }
    } catch (e) {
      console.log('Error init directorio:', e);
    }
  },

  getStatus: async (doc: DocumentMeta): Promise<LocalDocument> => {
    try {
      const db = await getDBConnection();
      const result: any[] = await db.getAllAsync(
        `SELECT * FROM ${TABLES.DOCUMENTS} WHERE id = ?`, 
        [doc.id]
      );

      if (result.length > 0) {
        const row = result[0];
        const info = await FileSystem.getInfoAsync(row.local_path);
        if (info.exists) {
          return { ...doc, localPath: row.local_path, isDownloaded: true };
        }
      }
    } catch (e) {
       console.log('Error getStatus:', e);
    }
    return { ...doc, localPath: null, isDownloaded: false };
  },

  download: async (doc: DocumentMeta): Promise<string> => {
    await DocumentService.init();

    const root = DocumentService._getRootDir();
    
    if (!root) {
      Alert.alert('Error de Sistema', 'No se puede acceder al almacenamiento.');
      throw new Error('Almacenamiento no disponible');
    }

    const fileUri = root + `${doc.id}_v${doc.version}.pdf`;

    try {
      console.log(`Descargando a: ${fileUri}`);
      const { uri } = await FileSystem.downloadAsync(doc.url, fileUri);
      
      const db = await getDBConnection();
      await db.runAsync(
        `INSERT OR REPLACE INTO ${TABLES.DOCUMENTS} (id, title, category, local_path, version, is_downloaded) VALUES (?, ?, ?, ?, ?, ?)`,
        [doc.id, doc.title, doc.category, uri, doc.version, 1]
      );
      
      return uri;
    } catch (error) {
      console.error(error);
      throw new Error('Falló la descarga del archivo.');
    }
  },

  open: async (localUri: string) => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(localUri);
    } else {
      Alert.alert('Error', 'No se puede abrir este archivo en este dispositivo.');
    }
  }
};