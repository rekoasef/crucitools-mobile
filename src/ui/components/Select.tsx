import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../core/theme';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  options: Option[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const Select = ({ label, options, selectedValue, onValueChange, placeholder, disabled }: SelectProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedItem = options.find((opt) => opt.value === selectedValue);

  return (
    <View style={[styles.container, disabled && styles.containerDisabled]}>
      <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
      <TouchableOpacity 
        style={[styles.selector, disabled && styles.selectorDisabled]} 
        onPress={() => !disabled && setModalVisible(true)}
        activeOpacity={disabled ? 1 : 0.7}
      >
        <Text style={[
          selectedItem ? styles.selectedText : styles.placeholder,
          disabled && styles.textDisabled
        ]}>
          {selectedItem ? selectedItem.label : placeholder || 'Seleccionar...'}
        </Text>
        <MaterialCommunityIcons 
          name="chevron-down" 
          size={20} 
          color={disabled ? '#CCC' : theme.colors.textSecondary} 
        />
      </TouchableOpacity>

      {!disabled && (
        <Modal visible={modalVisible} transparent animationType="fade">
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <FlatList
                data={options}
                keyExtractor={(item, index) => (item.value ? item.value.toString() : index.toString())}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.optionItem} 
                    onPress={() => {
                      if (typeof onValueChange === 'function') {
                        onValueChange(item.value);
                      }
                      setModalVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.optionText, 
                      selectedValue === item.value && styles.optionSelected
                    ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  containerDisabled: { opacity: 0.6 },
  label: { fontSize: 14, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 8 },
  labelDisabled: { color: '#999' },
  selector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: 'white', borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border },
  selectorDisabled: { backgroundColor: '#F2F2F2', borderColor: '#DDD' },
  selectedText: { fontSize: 16, color: theme.colors.textPrimary },
  placeholder: { fontSize: 16, color: theme.colors.textSecondary },
  textDisabled: { color: '#AAA' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', maxHeight: '60%', backgroundColor: 'white', borderRadius: 15, padding: 10, overflow: 'hidden' },
  optionItem: { padding: 18, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  optionText: { fontSize: 16, color: theme.colors.textPrimary },
  optionSelected: { color: theme.colors.primary, fontWeight: 'bold' }
});