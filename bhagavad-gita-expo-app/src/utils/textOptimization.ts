/**
 * Text rendering optimization utilities for Sanskrit and multilingual content
 */

/**
 * Get optimized text rendering props for Sanskrit text
 */
export const getSanskritTextProps = () => ({
  includeFontPadding: false, // Reduces extra padding on Android
  textAlignVertical: 'center',
  allowFontScaling: true,
  maxFontSizeMultiplier: 1.3, // Limit scaling for readability
  adjustsFontSizeToFit: process.env.EXPO_OS === 'ios',
  minimumFontScale: 0.8,
});

/**
 * Get optimized text rendering props for transliteration text
 */
export const getTransliterationTextProps = () => ({
  includeFontPadding: false,
  textAlignVertical: 'center',
  allowFontScaling: true,
  maxFontSizeMultiplier: 1.2,
  adjustsFontSizeToFit: process.env.EXPO_OS === 'ios',
  minimumFontScale: 0.9,
});

/**
 * Get optimized text rendering props for translation text
 */
export const getTranslationTextProps = () => ({
  includeFontPadding: false,
  allowFontScaling: true,
  maxFontSizeMultiplier: 1.5, // Allow more scaling for accessibility
  adjustsFontSizeToFit: false, // Keep false for long translations
});

/**
 * Optimize text for search highlighting
 */
export const optimizeTextForSearch = (text: string): string => {
  // Remove extra whitespace and normalize
  return text.trim().replace(/\s+/g, ' ');
};

/**
 * Check if text contains Sanskrit characters
 */
export const containsSanskrit = (text: string): boolean => {
  // Devanagari Unicode range: U+0900–U+097F
  const devanagariRegex = /[\u0900-\u097F]/;
  return devanagariRegex.test(text);
};

/**
 * Get font family for Sanskrit text based on platform
 */
export const getSanskritFontFamily = (): string => {
  if (process.env.EXPO_OS === 'ios') {
    return 'Kohinoor Devanagari'; // iOS system font for Devanagari
  } else {
    return 'Noto Sans Devanagari'; // Android system font for Devanagari
  }
};

/**
 * Calculate optimal line height for multilingual text
 */
export const getOptimalLineHeight = (fontSize: number, hasDevanagari: boolean): number => {
  // Sanskrit text needs more line height due to diacritics
  const multiplier = hasDevanagari ? 1.6 : 1.4;
  return Math.round(fontSize * multiplier);
};

/**
 * Memoized text measurement for performance
 */
const textMeasurementCache = new Map<string, { width: number; height: number }>();

export const measureText = (
  text: string,
  fontSize: number,
  fontFamily?: string
): { width: number; height: number } => {
  const cacheKey = `${text}-${fontSize}-${fontFamily || 'default'}`;

  if (textMeasurementCache.has(cacheKey)) {
    return textMeasurementCache.get(cacheKey)!;
  }

  // Approximate text measurement (for layout optimization)
  const avgCharWidth = fontSize * 0.6;
  const lineHeight = getOptimalLineHeight(fontSize, containsSanskrit(text));

  const width = text.length * avgCharWidth;
  const lines = Math.ceil(width / 300); // Assume 300px container width
  const height = lines * lineHeight;

  const result = { width, height };
  textMeasurementCache.set(cacheKey, result);

  return result;
};

/**
 * Clear text measurement cache (call when theme changes)
 */
export const clearTextMeasurementCache = (): void => {
  textMeasurementCache.clear();
};

/**
 * Optimize text for screen readers
 */
export const optimizeForScreenReader = (
  sanskrit: string,
  transliteration: string,
  translation: string
): string => {
  // Create a screen reader friendly version
  const parts = [];

  if (sanskrit) {
    parts.push(`Sanskrit: ${sanskrit}`);
  }

  if (transliteration) {
    parts.push(`Pronunciation: ${transliteration}`);
  }

  if (translation) {
    parts.push(`Translation: ${translation}`);
  }

  return parts.join('. ');
};

/**
 * Text truncation with proper word boundaries
 */
export const truncateText = (
  text: string,
  maxLength: number,
  preserveWords: boolean = true
): string => {
  if (text.length <= maxLength) {
    return text;
  }

  if (!preserveWords) {
    return text.substring(0, maxLength - 3) + '...';
  }

  // Find the last space before maxLength
  const truncated = text.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
};
