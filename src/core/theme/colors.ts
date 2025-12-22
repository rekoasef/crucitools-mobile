// src/core/theme/colors.ts

export const PALETTE = {
  crucianelliRed: '#E30613', // Rojo oficial Crucianelli
  crucianelliRedDark: '#B3050F', // Rojo más oscuro para patrones técnicos y sombras
  black: '#000000',
  darkGray: '#1A1A1A',
  mediumGray: '#4A4A4A',
  lightGray: '#E5E5E5',
  ghostWhite: '#F5F7FA', // Gris azulado muy suave para fondo moderno
  white: '#FFFFFF',
  
  // Feedback
  success: '#28A745', 
  warning: '#FFC107', 
  error: '#DC3545',   
  
  // UI Helpers
  overlay: 'rgba(0, 0, 0, 0.1)',
};

export const THEME_COLORS = {
  primary: PALETTE.crucianelliRed,
  primaryDark: PALETTE.crucianelliRedDark,
  background: PALETTE.ghostWhite, 
  cardBackground: PALETTE.white,
  
  // Textos Semánticos
  textPrimary: PALETTE.darkGray,
  textSecondary: PALETTE.mediumGray,
  textInverse: PALETTE.white,
  
  // Elementos de UI
  headerBackground: PALETTE.crucianelliRed,
  headerText: PALETTE.white,
  
  border: '#E2E8F0', 
  
  // Estados
  activeIcon: PALETTE.crucianelliRed,
  inactiveIcon: PALETTE.mediumGray,
  disabled: PALETTE.lightGray,
  
  // Colores directos
  darkGray: PALETTE.darkGray,
  mediumGray: PALETTE.mediumGray,
  lightGray: PALETTE.lightGray,
  white: PALETTE.white,
  black: PALETTE.black,

  // Feedback expuesto
  success: PALETTE.success,
  warning: PALETTE.warning,
  error: PALETTE.error,
  overlay: PALETTE.overlay,
};