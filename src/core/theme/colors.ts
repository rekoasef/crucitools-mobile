// src/core/theme/colors.ts

export const PALETTE = {
  crucianelliRed: '#E30613', // Rojo oficial
  black: '#000000',
  darkGray: '#1A1A1A',
  mediumGray: '#4A4A4A',
  lightGray: '#E5E5E5',
  ghostWhite: '#F5F7FA', // <--- NUEVO: Gris azulado muy suave para fondo moderno
  white: '#FFFFFF',
  
  // Feedback
  success: '#28A745', 
  warning: '#FFC107', 
  error: '#DC3545',   
};

export const THEME_COLORS = {
  primary: PALETTE.crucianelliRed,
  background: PALETTE.ghostWhite, // <--- CAMBIO: Fondo general moderno
  cardBackground: PALETTE.white,
  
  // Textos Semánticos
  textPrimary: PALETTE.darkGray,
  textSecondary: PALETTE.mediumGray,
  textInverse: PALETTE.white,
  
  // Elementos de UI
  headerBackground: PALETTE.crucianelliRed, // Actualizado para coincidir con el bloque rojo
  headerText: PALETTE.white,
  
  border: '#E2E8F0', // <--- CAMBIO: Un gris más sutil específico para bordes finos
  
  // Estados
  activeIcon: PALETTE.crucianelliRed,
  inactiveIcon: PALETTE.mediumGray,
  disabled: PALETTE.lightGray,
  
  // Colores directos (para compatibilidad)
  darkGray: PALETTE.darkGray,
  mediumGray: PALETTE.mediumGray,
  lightGray: PALETTE.lightGray,
  white: PALETTE.white,
  black: PALETTE.black,

  // Feedback expuesto
  success: PALETTE.success,
  warning: PALETTE.warning,
  error: PALETTE.error,
};