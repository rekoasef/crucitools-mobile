// src/core/theme/index.ts

import { THEME_COLORS, PALETTE } from './colors';
import { FONT_SIZES, FONT_WEIGHTS } from './typography';
import { SPACING, LAYOUT } from './spacing';

export const theme = {
  colors: THEME_COLORS,
  palette: PALETTE,
  typography: {
    sizes: FONT_SIZES,
    weights: FONT_WEIGHTS,
  },
  spacing: SPACING,
  layout: LAYOUT,
};

export type Theme = typeof theme;