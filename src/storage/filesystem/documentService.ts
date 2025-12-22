// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';

// // const BASE_DIR = FileSystem.documentDirectory || FileSystem.cacheDirectory || '';
// // const DOCS_DIRECTORY = BASE_DIR ? `${BASE_DIR}manuales_crucianelli/` : '';

// export const DocumentService = {
//   isReady: () => !!DOCS_DIRECTORY,

//   ensureDirExists: async () => {
//     if (!DocumentService.isReady()) return false;
//     try {
//       const dirInfo = await FileSystem.getInfoAsync(DOCS_DIRECTORY);
//       if (!dirInfo.exists) {
//         await FileSystem.makeDirectoryAsync(DOCS_DIRECTORY, { intermediates: true });
//       }
//       return true;
//     } catch (e) { return false; }
//   },

//   downloadDocument: async (id: string, remoteUrl: string) => {
//     if (!DocumentService.isReady()) return null;
//     try {
//       await DocumentService.ensureDirExists();
//       const localUri = `${DOCS_DIRECTORY}${id}.pdf`;
//       const downloadRes = await FileSystem.downloadAsync(remoteUrl, localUri);
//       return downloadRes.status === 200 ? downloadRes.uri : null;
//     } catch (error) {
//       console.error('Error en descarga:', error);
//       return null;
//     }
//   },

//   openDocument: async (id: string) => {
//     const localUri = `${DOCS_DIRECTORY}${id}.pdf`;
//     const info = await FileSystem.getInfoAsync(localUri);
//     if (info.exists) {
//       await Sharing.shareAsync(localUri, { UTI: 'com.adobe.pdf', mimeType: 'application/pdf' });
//       return true;
//     }
//     return false;
//   },

//   checkExists: async (id: string) => {
//     if (!DocumentService.isReady()) return false;
//     const localUri = `${DOCS_DIRECTORY}${id}.pdf`;
//     const info = await FileSystem.getInfoAsync(localUri);
//     return info.exists;
//   }
// };