// src/ui/components/Select.tsx
import React, { useState } from 'react';
import { FlatList, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../core/theme';
import { Button } from './Button';
import { Body, H2, Label } from './Typography';

interface Option {
  id: string;
  name: string;
  // Permitimos propiedades extra por si la DB devuelve más columnas
  [key: string]: any; 
}

interface SelectProps {
  label: string;
  value?: string; // ID seleccionado
  options: Option[];
  onSelect: (option: Option) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const Select = ({ label, value, options, onSelect, placeholder = 'Seleccionar...', disabled }: SelectProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Buscamos el nombre de la opción seleccionada para mostrarlo en el input
  const selectedOption = options.find(o => o.id === value);

  return (
    <View style={styles.container}>
      <Label style={styles.label}>{label}</Label>
      
      <TouchableOpacity
        style={[styles.input, disabled && styles.disabledInput]}
        onPress={() => !disabled && setModalVisible(true)}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <Text style={[styles.text, !selectedOption && styles.placeholder]}>
          {selectedOption ? selectedOption.name : placeholder}
        </Text>
        <Text style={styles.chevron}>▼</Text>
      </TouchableOpacity>

      {/* MODAL DE SELECCIÓN */}
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <H2>{label}</H2>
            <Button 
                title="Cerrar" 
                variant="outline" 
                onPress={() => setModalVisible(false)} 
                style={{ height: 40, paddingHorizontal: 20 }} 
            />
          </View>
          
          <FlatList
            data={options}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.optionItem,
                  item.id === value && styles.optionSelected
                ]}
                onPress={() => {
                  onSelect(item);
                  setModalVisible(false);
                }}
              >
                <Body style={item.id === value ? styles.textSelected : undefined}>
                  {item.name}
                </Body>
              </TouchableOpacity>
            )}
            // Mensaje si no hay opciones
            ListEmptyComponent={
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Body>No hay opciones disponibles</Body>
              </View>
            }
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: theme.spacing.md },
  label: { marginBottom: theme.spacing.xs, color: theme.colors.darkGray },
  input: {
    height: theme.layout.inputHeight,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.layout.borderRadius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabledInput: { backgroundColor: theme.colors.lightGray },
  text: { fontSize: theme.typography.sizes.md, color: theme.colors.textPrimary },
  placeholder: { color: theme.colors.textSecondary },
  chevron: { color: theme.colors.textSecondary, fontSize: 12 },
  modalContainer: { flex: 1, backgroundColor: theme.colors.background },
  modalHeader: {
    padding: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.cardBackground
  },
  listContent: { padding: theme.spacing.md },
  optionItem: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  optionSelected: { backgroundColor: theme.colors.lightGray },
  textSelected: { fontWeight: 'bold', color: theme.colors.primary },
});