import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../core/theme';

export const Select = ({ label, options, selectedValue, onValueChange, placeholder }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedItem = options.find((opt: any) => opt.value === selectedValue);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.selector} onPress={() => setModalVisible(true)}>
        <Text style={selectedItem ? styles.selectedText : styles.placeholder}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item, index) => item.value?.toString() || index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.optionItem} 
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.optionText, selectedValue === item.value && styles.optionSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 8 },
  selector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: 'white', borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border },
  selectedText: { fontSize: 16, color: theme.colors.textPrimary },
  placeholder: { fontSize: 16, color: theme.colors.textSecondary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', maxHeight: '60%', backgroundColor: 'white', borderRadius: 15, padding: 10 },
  optionItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  optionText: { fontSize: 16, color: theme.colors.textPrimary },
  optionSelected: { color: theme.colors.primary, fontWeight: 'bold' }
});