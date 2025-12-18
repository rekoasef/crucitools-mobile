import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { theme } from '../../core/theme';

// --- DATOS TÉCNICOS CRUCIANELLI ---
const FAQS = [
  {
    id: 'vel-siembra',
    question: "¿Cómo calculo la velocidad máxima?",
    answer: "En el menú Herramientas > Velocidad. Selecciona el cultivo y placa. El CruciTools validará automáticamente si tu velocidad actual está dentro del rango óptimo para no perder precisión."
  },
  {
    id: 'cv-alto',
    question: "¿CV con 'Alta Variabilidad'?",
    answer: "Si el Coeficiente de Variación supera el límite (ej. Maíz > 20%), revisa: 1) Desgaste de enrasadores. 2) Presión de vacío constante. 3) Limpieza de tubos de bajada."
  },
  {
    id: 'rueda-mando',
    question: "¿Para qué sirve la Rueda de Mando?",
    answer: "Sirve para realizar la prueba estática de dosificación. La herramienta te indica cuántas vueltas exactas de rueda debes dar para simular 1/10 de hectárea según tu modelo de máquina."
  },
  {
    id: 'offline-files',
    question: "¿Cómo accedo a los manuales?",
    answer: "Desde la 'Biblioteca'. Una vez que descargas un PDF, este se guarda en el almacenamiento local de tu teléfono y podrás abrirlo en medio del campo sin necesidad de internet."
  }
];

type ChatView = 'menu' | 'faq-list' | 'faq-detail';

export const CruciBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ChatView>('menu');
  const [selectedFaq, setSelectedFaq] = useState<typeof FAQS[0] | null>(null);

  const goToFaqList = () => setView('faq-list');
  const goToFaqDetail = (faq: typeof FAQS[0]) => {
    setSelectedFaq(faq);
    setView('faq-detail');
  };
  const goBack = () => {
    if (view === 'faq-detail') setView('faq-list');
    else if (view === 'faq-list') setView('menu');
  };

  return (
    <View style={styles.floatingContainer}>
      {/* --- MODAL DEL CHAT --- */}
      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.chatWindow}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTitleContainer}>
                {view !== 'menu' && (
                  <TouchableOpacity onPress={goBack} style={styles.iconButton}>
                    <MaterialCommunityIcons name="chevron-left" size={28} color="white" />
                  </TouchableOpacity>
                )}
                <MaterialCommunityIcons name="robot" size={24} color="white" style={{ marginLeft: 8 }} />
                <Text style={styles.headerText}>CruciBot</Text>
              </View>
              <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.iconButton}>
                <MaterialCommunityIcons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Body */}
            <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
              
              {/* VISTA 1: MENÚ */}
              {view === 'menu' && (
                <View>
                  <View style={styles.botMessageContainer}>
                    <View style={styles.botAvatar}>
                      <MaterialCommunityIcons name="robot" size={20} color="white" />
                    </View>
                    <View style={styles.botBubble}>
                      <Text style={styles.botName}>¡Hola! Soy CruciBot 🤖</Text>
                      <Text style={styles.messageText}>Soy tu asistente técnico offline. ¿En qué puedo ayudarte hoy?</Text>
                    </View>
                  </View>

                  <View style={styles.menuContainer}>
                    <Text style={styles.menuLabel}>OPCIONES DE AYUDA</Text>
                    <TouchableOpacity style={styles.menuItem} onPress={goToFaqList}>
                      <View style={styles.menuIconBox}>
                        <MaterialCommunityIcons name="help-circle-outline" size={24} color={theme.colors.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.menuItemTitle}>Preguntas Frecuentes</Text>
                        <Text style={styles.menuItemSub}>Soluciones técnicas comunes</Text>
                      </View>
                      <MaterialCommunityIcons name="chevron-right" size={20} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.menuItem, { opacity: 0.5 }]}>
                      <View style={[styles.menuIconBox, { backgroundColor: '#E8F5E9' }]}>
                        <MaterialCommunityIcons name="phone-outline" size={24} color="#4CAF50" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.menuItemTitle}>Soporte Directo</Text>
                        <Text style={styles.menuItemSub}>Requiere conexión</Text>
                      </View>
                      <Text style={styles.soonBadge}>PRONTO</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* VISTA 2: LISTA FAQ */}
              {view === 'faq-list' && (
                <View>
                  <Text style={styles.sectionTitle}>Preguntas Técnicas:</Text>
                  {FAQS.map((faq) => (
                    <TouchableOpacity key={faq.id} style={styles.faqItem} onPress={() => goToFaqDetail(faq)}>
                      <Text style={styles.faqQuestion}>{faq.question}</Text>
                      <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.primary} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* VISTA 3: DETALLE */}
              {view === 'faq-detail' && selectedFaq && (
                <View>
                  <View style={styles.userBubble}>
                    <Text style={styles.userText}>{selectedFaq.question}</Text>
                  </View>
                  
                  <View style={styles.botMessageContainer}>
                    <View style={styles.botAvatar}>
                      <MaterialCommunityIcons name="robot" size={20} color="white" />
                    </View>
                    <View style={styles.botBubble}>
                      <Text style={styles.responseHeader}>INSTRUCCIÓN TÉCNICA:</Text>
                      <Text style={styles.messageText}>{selectedFaq.answer}</Text>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* --- BOTÓN FLOTANTE --- */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setIsOpen(true);
          setView('menu');
        }}
      >
        <MaterialCommunityIcons name="robot" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 999,
  },
  fab: {
    backgroundColor: theme.colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  chatWindow: {
    height: '80%',
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  iconButton: {
    padding: 5,
  },
  body: {
    padding: 20,
    paddingBottom: 40,
  },
  botMessageContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  botBubble: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    borderTopLeftRadius: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
  },
  botName: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  messageText: {
    color: '#555',
    lineHeight: 20,
    fontSize: 14,
  },
  menuContainer: {
    marginTop: 20,
  },
  menuLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 10,
    marginLeft: 5,
  },
  menuItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 2,
  },
  menuIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FEEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
  },
  menuItemSub: {
    fontSize: 12,
    color: '#777',
  },
  soonBadge: {
    fontSize: 10,
    backgroundColor: '#EEE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    color: '#999',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  faqItem: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 20,
    borderTopRightRadius: 0,
    marginBottom: 20,
    maxWidth: '85%',
  },
  userText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  responseHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 5,
  }
});