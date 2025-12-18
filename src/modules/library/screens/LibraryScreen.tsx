import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DOCUMENTS_CATALOG } from '../../../core/constants/documentsData';
import { theme } from '../../../core/theme';
import { DocumentService, LocalDocument } from '../../../storage/filesystem/documentService';
import { Body, Card, H1, ScreenLayout } from '../../../ui/components';

export const LibraryScreen = () => {
  const [documents, setDocuments] = useState<LocalDocument[]>([]);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const loadStatus = async () => {
    const list: LocalDocument[] = [];
    for (const doc of DOCUMENTS_CATALOG) {
      try {
        const status = await DocumentService.getStatus(doc);
        list.push(status);
      } catch (e) {
        console.log("Error cargando status:", e);
      }
    }
    setDocuments(list);
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handlePress = async (doc: LocalDocument) => {
    if (doc.isDownloaded && doc.localPath) {
      await DocumentService.open(doc.localPath);
    } else {
      try {
        setLoadingMap(prev => ({ ...prev, [doc.id]: true }));
        await DocumentService.download(doc);
        await loadStatus(); 
      } catch (error: any) {
        Alert.alert('Error', error.message);
      } finally {
        setLoadingMap(prev => ({ ...prev, [doc.id]: false }));
      }
    }
  };

  const renderItem = ({ item }: { item: LocalDocument }) => {
    const isLoading = loadingMap[item.id];

    return (
      <TouchableOpacity onPress={() => handlePress(item)} disabled={isLoading}>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <View style={[styles.iconBox, item.isDownloaded ? styles.iconDownloaded : styles.iconPending]}>
               <Text style={styles.iconText}>PDF</Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.status}>
                {item.isDownloaded ? '✅ Disponible Offline' : '📥 Toca para descargar'}
              </Text>
            </View>

            <View style={styles.actionBox}>
              {isLoading ? (
                <ActivityIndicator color={theme.colors.primary} />
              ) : (
                <Text style={styles.arrow}>{item.isDownloaded ? '👁️' : '⬇️'}</Text>
              )}
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <H1>Biblioteca Técnica</H1>
        <Body style={styles.subtitle}>Documentación oficial disponible offline.</Body>
        
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: { padding: theme.spacing.lg, flex: 1 },
  subtitle: { marginBottom: theme.spacing.lg },
  card: { padding: theme.spacing.md, marginBottom: theme.spacing.md },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 50, height: 50, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
    marginRight: theme.spacing.md
  },
  iconPending: { backgroundColor: theme.colors.lightGray },
  iconDownloaded: { backgroundColor: theme.colors.primary },
  iconText: { fontWeight: 'bold', color: theme.colors.textInverse, fontSize: 12 },
  textContainer: { flex: 1 },
  category: { fontSize: 10, color: theme.colors.textSecondary, fontWeight: 'bold' },
  title: { fontSize: 16, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 2 },
  status: { fontSize: 12, color: theme.colors.textSecondary },
  actionBox: { marginLeft: theme.spacing.sm },
  arrow: { fontSize: 20 },
});