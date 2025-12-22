import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../core/theme';
import { DocumentService } from '../../../storage/filesystem/documentService';

export const LibraryScreen = () => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [localFiles, setLocalFiles] = useState<Record<string, boolean>>({});

  const documents = [
    { id: 'manual_gringa', title: 'Manual Gringa v2.0', category: 'Manuales', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: 'ficha_pionera', title: 'Ficha Técnica Pionera', category: 'Fichas', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  ];

  // Verificar qué archivos ya están descargados al entrar
  useEffect(() => {
    const checkFiles = async () => {
      const status: Record<string, boolean> = {};
      for (const doc of documents) {
        status[doc.id] = await DocumentService.checkExists(doc.id);
      }
      setLocalFiles(status);
    };
    checkFiles();
  }, []);

  const handleAction = async (doc: any) => {
    if (!DocumentService.isReady()) {
      Alert.alert("Error", "Sistema de archivos no disponible. Desactiva el Debugger.");
      return;
    }

    if (localFiles[doc.id]) {
      // Si existe, lo abrimos
      await DocumentService.openDocument(doc.id);
    } else {
      // Si no existe, lo descargamos
      setDownloadingId(doc.id);
      const uri = await DocumentService.downloadDocument(doc.id, doc.url);
      setDownloadingId(null);

      if (uri) {
        setLocalFiles(prev => ({ ...prev, [doc.id]: true }));
        Alert.alert("Éxito", "Manual guardado para uso offline.", [
          { text: "Abrir ahora", onPress: () => DocumentService.openDocument(doc.id) },
          { text: "OK" }
        ]);
      } else {
        Alert.alert("Error", "No se pudo descargar el archivo.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <FlatList
        data={documents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleAction(item)}>
            <View style={styles.iconBox}>
              <MaterialCommunityIcons name="file-document-multiple-outline" size={28} color={theme.colors.primary} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.category}>{item.category}</Text>
            </View>
            
            {downloadingId === item.id ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : (
              <MaterialCommunityIcons 
                name={localFiles[item.id] ? "eye-check" : "download"} 
                size={22} 
                color={localFiles[item.id] ? "#27AE60" : theme.colors.primary} 
              />
            )}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  card: { flexDirection: 'row', padding: 18, backgroundColor: 'white', marginHorizontal: 16, marginTop: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border, elevation: 3 },
  iconBox: { backgroundColor: theme.colors.primary + '10', padding: 8, borderRadius: 8 },
  textContainer: { flex: 1, marginLeft: 16 },
  title: { fontSize: 16, fontWeight: 'bold', color: theme.colors.textPrimary },
  category: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }
});