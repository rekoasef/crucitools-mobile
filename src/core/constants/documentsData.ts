// src/core/constants/documentsData.ts

export interface DocumentMeta {
  id: string;
  title: string;
  category: 'MANUALES' | 'GUÍAS' | 'BOLETINES';
  url: string; // URL remota (en tu servidor)
  version: number;
}

export const DOCUMENTS_CATALOG: DocumentMeta[] = [
  {
    id: 'man-gringa',
    title: 'Manual de Usuario - Gringa V',
    category: 'MANUALES',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // PDF de prueba
    version: 1
  },
  {
    id: 'man-pionera',
    title: 'Manual de Despiece - Pionera',
    category: 'MANUALES',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    version: 1
  },
  {
    id: 'guia-siembra',
    title: 'Guía Rápida de Regulación',
    category: 'GUÍAS',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    version: 1
  },
  {
    id: 'bol-2024',
    title: 'Boletín Técnico: Mantenimiento',
    category: 'BOLETINES',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    version: 1
  }
];