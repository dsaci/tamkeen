
// استيراد آمن للمكتبة لتجنب الشاشة البيضاء
import * as jspdfModule from 'jspdf';
const jsPDF = (jspdfModule as any).jsPDF || (jspdfModule as any).default || jspdfModule;

import { CAIRO_BASE64 } from '../fonts/cairo.base64';

const FONT_URLS = [
  'https://cdn.jsdelivr.net/gh/google/fonts/ofl/amiri/Amiri-Regular.ttf',
  'https://raw.githubusercontent.com/google/fonts/main/ofl/amiri/Amiri-Regular.ttf'
];

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function registerArabicFont(pdf: any): Promise<boolean> {
  const fontName = 'Amiri';
  const fileName = 'Amiri-Regular.ttf';

  if (pdf.existsFileInVFS(fileName)) {
    pdf.setFont(fontName);
    return true;
  }

  // محاولة التحميل من Base64 المحلي
  if (CAIRO_BASE64 && CAIRO_BASE64.length > 5000) {
    try {
      const cleanBase64 = CAIRO_BASE64.replace(/[\n\r\s]/g, '');
      pdf.addFileToVFS(fileName, cleanBase64);
      pdf.addFont(fileName, fontName, 'normal');
      pdf.setFont(fontName);
      return true;
    } catch (e) {
      console.warn('Local Base64 failed');
    }
  }

  // محاولة التحميل من الإنترنت
  for (const url of FONT_URLS) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const buffer = await response.arrayBuffer();
      const base64String = arrayBufferToBase64(buffer);
      if (base64String.length < 1000) throw new Error("Font file too small");

      pdf.addFileToVFS(fileName, base64String);
      pdf.addFont(fileName, fontName, 'normal');
      pdf.setFont(fontName);
      return true;
    } catch (error) {
      continue;
    }
  }

  return false;
}

export const initFont = async () => {
  return true;
};
