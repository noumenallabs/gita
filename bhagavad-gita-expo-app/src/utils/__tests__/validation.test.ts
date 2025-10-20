import {
  validateSanskritText,
  validateTransliteration,
  validateTranslation,
  validateShloka,
  validateChapter,
  validateSearchQuery,
  sanitizeSanskritText,
  sanitizeTransliteration,
} from '../validation';
import { Shloka, Chapter } from '../../types';

describe('Validation Utils', () => {
  describe('validateSanskritText', () => {
    it('should validate correct Sanskrit text', () => {
      const sanskritText = 'धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः।';
      const result = validateSanskritText(sanskritText);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty Sanskrit text', () => {
      const result = validateSanskritText('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Sanskrit text cannot be empty');
    });

    it('should reject text without Devanagari characters', () => {
      const result = validateSanskritText('This is English text');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Sanskrit text should contain Devanagari characters');
    });
  });

  describe('validateTransliteration', () => {
    it('should validate correct IAST transliteration', () => {
      const transliteration = 'dharma-kṣhetre kuru-kṣhetre samavetā yuyutsavaḥ';
      const result = validateTransliteration(transliteration);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty transliteration', () => {
      const result = validateTransliteration('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Transliteration cannot be empty');
    });

    it('should reject invalid characters in transliteration', () => {
      const result = validateTransliteration('dharma@#$%');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Transliteration should use IAST format');
    });
  });

  describe('validateTranslation', () => {
    it('should validate English translation', () => {
      const translation = 'This is a valid English translation of the verse.';
      const result = validateTranslation(translation, 'english');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate word-by-word translation with proper format', () => {
      const translation = 'dharma—righteousness; kṣhetre—field; kuru—Kuru';
      const result = validateTranslation(translation, 'wordByWord');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject short translations', () => {
      const result = validateTranslation('Short', 'english');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('english translation is too short (minimum 10 characters)');
    });

    it('should reject word-by-word without proper format', () => {
      const translation = 'This is just regular text without word breakdown format';
      const result = validateTranslation(translation, 'wordByWord');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Word-by-word translation should include word breakdowns (— or :)'
      );
    });
  });

  describe('validateShloka', () => {
    const validShloka: Shloka = {
      id: '2.47',
      chapter: 2,
      verse: 47,
      sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।',
      transliteration: 'karmaṇy-evādhikāras te mā phaleṣhu kadāchana',
      translations: {
        english:
          'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.',
        wordByWord: 'karmaṇi—in prescribed duties; eva—only; adhikāraḥ—right; te—your',
        commentary:
          'This is one of the most important verses of the Gita. It teaches the principle of Nishkama Karma.',
      },
    };

    it('should validate a correct shloka', () => {
      const result = validateShloka(validShloka);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid ID format', () => {
      const invalidShloka = { ...validShloka, id: 'invalid-id' };
      const result = validateShloka(invalidShloka);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Shloka ID should be in format "chapter.verse"');
    });

    it('should reject invalid chapter number', () => {
      const invalidShloka = { ...validShloka, chapter: 19 };
      const result = validateShloka(invalidShloka);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Chapter number should be between 1 and 18');
    });

    it('should reject inconsistent ID and chapter/verse', () => {
      const invalidShloka = { ...validShloka, id: '3.47' };
      const result = validateShloka(invalidShloka);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Shloka ID "3.47" doesn\'t match chapter.verse "2.47"');
    });
  });

  describe('validateChapter', () => {
    const validChapter: Chapter = {
      number: 2,
      name: 'Sankhya Yoga',
      translation: 'The Yoga of Knowledge',
      verses: 72,
      summary: 'Krishna begins his teachings on the immortal soul and dharma',
    };

    it('should validate a correct chapter', () => {
      const result = validateChapter(validChapter);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid chapter number', () => {
      const invalidChapter = { ...validChapter, number: 0 };
      const result = validateChapter(invalidChapter);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Chapter number should be between 1 and 18');
    });

    it('should reject empty chapter name', () => {
      const invalidChapter = { ...validChapter, name: '' };
      const result = validateChapter(invalidChapter);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Chapter name cannot be empty');
    });

    it('should reject short summary', () => {
      const invalidChapter = { ...validChapter, summary: 'Short' };
      const result = validateChapter(invalidChapter);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Chapter summary should be at least 10 characters');
    });
  });

  describe('validateSearchQuery', () => {
    it('should validate normal search queries', () => {
      const result = validateSearchQuery('karma dharma');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject very long queries', () => {
      const longQuery = 'a'.repeat(101);
      const result = validateSearchQuery(longQuery);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Search query is too long (maximum 100 characters)');
    });

    it('should reject queries with dangerous characters', () => {
      const result = validateSearchQuery('karma<script>');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Search query contains invalid characters');
    });
  });

  describe('sanitizeSanskritText', () => {
    it('should remove invalid characters from Sanskrit text', () => {
      const input = 'धर्म123क्षेत्रे@#$';
      const result = sanitizeSanskritText(input);
      expect(result).toBe('धर्मक्षेत्रे');
    });

    it('should preserve valid Sanskrit characters and punctuation', () => {
      const input = 'धर्मक्षेत्रे कुरुक्षेत्रे। ||';
      const result = sanitizeSanskritText(input);
      expect(result).toBe('धर्मक्षेत्रे कुरुक्षेत्रे। ||');
    });
  });

  describe('sanitizeTransliteration', () => {
    it('should remove invalid characters from transliteration', () => {
      const input = 'dharma123@#$kṣhetre';
      const result = sanitizeTransliteration(input);
      expect(result).toBe('dharmakṣhetre');
    });

    it('should preserve valid IAST characters', () => {
      const input = 'dharma-kṣhetre āīūṛṝḷḹēōṃḥṅñṭḍṇśṣ';
      const result = sanitizeTransliteration(input);
      expect(result).toBe('dharma-kṣhetre āīūṛṝḷḹēōṃḥṅñṭḍṇśṣ');
    });
  });
});
