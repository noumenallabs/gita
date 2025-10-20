import { Shloka, Chapter, ValidationResult, DataValidationOptions } from '../types';

/**
 * Validates Sanskrit text for proper Devanagari characters
 */
export function validateSanskritText(text: string): ValidationResult {
  const errors: string[] = [];

  if (!text || text.trim().length === 0) {
    errors.push('Sanskrit text cannot be empty');
    return { isValid: false, errors };
  }

  // Check for Devanagari Unicode range (U+0900-U+097F)
  const devanagariRegex = /[\u0900-\u097F]/;
  const hasDevanagari = devanagariRegex.test(text);

  if (!hasDevanagari) {
    errors.push('Sanskrit text should contain Devanagari characters');
  }

  // Check for common Sanskrit punctuation
  const validSanskritChars = /^[\u0900-\u097F\s।॥|.\-\s]+$/;
  if (!validSanskritChars.test(text)) {
    errors.push('Sanskrit text contains invalid characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates transliteration text for proper IAST format
 */
export function validateTransliteration(text: string): ValidationResult {
  const errors: string[] = [];

  if (!text || text.trim().length === 0) {
    errors.push('Transliteration cannot be empty');
    return { isValid: false, errors };
  }

  // Check for IAST characters (basic Latin + diacritics)
  const iastRegex = /^[a-zA-Zāīūṛṝḷḹēōṃḥṅñṭḍṇśṣ\s\-']+$/;
  if (!iastRegex.test(text)) {
    errors.push('Transliteration should use IAST format');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates translation text for completeness and format
 */
export function validateTranslation(
  text: string,
  type: 'english' | 'wordByWord' | 'commentary'
): ValidationResult {
  const errors: string[] = [];

  if (!text || text.trim().length === 0) {
    errors.push(`${type} translation cannot be empty`);
    return { isValid: false, errors };
  }

  // Minimum length requirements
  const minLengths = {
    english: 10,
    wordByWord: 20,
    commentary: 30,
  };

  if (text.length < minLengths[type]) {
    errors.push(`${type} translation is too short (minimum ${minLengths[type]} characters)`);
  }

  // Check for word-by-word format
  if (type === 'wordByWord') {
    const hasWordBreakdown = text.includes('—') || text.includes(':');
    if (!hasWordBreakdown) {
      errors.push('Word-by-word translation should include word breakdowns (— or :)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a complete Shloka object
 */
export function validateShloka(
  shloka: Shloka,
  options: DataValidationOptions = {}
): ValidationResult {
  const errors: string[] = [];
  const {
    checkSanskrit = true,
    checkTransliteration = true,
    checkTranslations = true,
    strict = false,
  } = options;

  // Validate ID format
  const idRegex = /^\d+\.\d+$/;
  if (!idRegex.test(shloka.id)) {
    errors.push('Shloka ID should be in format "chapter.verse"');
  }

  // Validate chapter and verse numbers
  if (shloka.chapter < 1 || shloka.chapter > 18) {
    errors.push('Chapter number should be between 1 and 18');
  }

  if (shloka.verse < 1) {
    errors.push('Verse number should be positive');
  }

  // Validate ID consistency
  const expectedId = `${shloka.chapter}.${shloka.verse}`;
  if (shloka.id !== expectedId) {
    errors.push(`Shloka ID "${shloka.id}" doesn't match chapter.verse "${expectedId}"`);
  }

  // Validate Sanskrit text
  if (checkSanskrit) {
    const sanskritValidation = validateSanskritText(shloka.sanskrit);
    if (!sanskritValidation.isValid) {
      errors.push(...sanskritValidation.errors);
    }
  }

  // Validate transliteration
  if (checkTransliteration) {
    const transliterationValidation = validateTransliteration(shloka.transliteration);
    if (!transliterationValidation.isValid && strict) {
      errors.push(...transliterationValidation.errors);
    }
  }

  // Validate translations
  if (checkTranslations) {
    const englishValidation = validateTranslation(shloka.translations.english, 'english');
    const wordByWordValidation = validateTranslation(shloka.translations.wordByWord, 'wordByWord');
    const commentaryValidation = validateTranslation(shloka.translations.commentary, 'commentary');

    if (!englishValidation.isValid) {
      errors.push(...englishValidation.errors);
    }
    if (!wordByWordValidation.isValid && strict) {
      errors.push(...wordByWordValidation.errors);
    }
    if (!commentaryValidation.isValid && strict) {
      errors.push(...commentaryValidation.errors);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a Chapter object
 */
export function validateChapter(chapter: Chapter): ValidationResult {
  const errors: string[] = [];

  if (chapter.number < 1 || chapter.number > 18) {
    errors.push('Chapter number should be between 1 and 18');
  }

  if (!chapter.name || chapter.name.trim().length === 0) {
    errors.push('Chapter name cannot be empty');
  }

  if (!chapter.translation || chapter.translation.trim().length === 0) {
    errors.push('Chapter translation cannot be empty');
  }

  if (chapter.verses < 1) {
    errors.push('Chapter should have at least 1 verse');
  }

  if (!chapter.summary || chapter.summary.trim().length < 10) {
    errors.push('Chapter summary should be at least 10 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitizes Sanskrit text by removing invalid characters
 */
export function sanitizeSanskritText(text: string): string {
  // Remove non-Devanagari characters except spaces and common punctuation
  return text.replace(/[^\u0900-\u097F\s।॥|.\-]/g, '').trim();
}

/**
 * Sanitizes transliteration text
 */
export function sanitizeTransliteration(text: string): string {
  // Keep only IAST characters and basic punctuation
  return text.replace(/[^a-zA-Zāīūṛṝḷḹēōṃḥṅñṭḍṇśṣ\s\-']/g, '').trim();
}

/**
 * Validates user input for search queries
 */
export function validateSearchQuery(query: string): ValidationResult {
  const errors: string[] = [];

  if (query.length > 100) {
    errors.push('Search query is too long (maximum 100 characters)');
  }

  // Check for potentially harmful characters
  const dangerousChars = /[<>{}[\]\\]/;
  if (dangerousChars.test(query)) {
    errors.push('Search query contains invalid characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
