/**
 * Comprehensive app testing suite for final validation
 * This test suite validates all critical functionality before release
 */

import { gitaData } from '../data/gita-data';
import { searchShlokas } from '../utils/search';
import { getDailyShloka } from '../utils/dailyShloka';
import { runComprehensiveAccessibilityAudit } from '../utils/accessibilityTesting';
import { runPerformanceTests, validatePerformance } from '../utils/performanceTesting';

describe('Comprehensive App Validation', () => {
  describe('Data Integrity', () => {
    it('should have complete Gita data structure', () => {
      expect(gitaData).toBeDefined();
      expect(gitaData.chapters).toBeDefined();
      expect(gitaData.shlokas).toBeDefined();
      expect(gitaData.chapters.length).toBe(6);
      expect(gitaData.shlokas.length).toBeGreaterThan(0);
    });

    it('should have valid chapter data', () => {
      gitaData.chapters.forEach((chapter, index) => {
        expect(chapter.number).toBe(index + 1);
        expect(chapter.name).toBeDefined();
        expect(chapter.translation).toBeDefined();
        expect(chapter.verses).toBeGreaterThan(0);
        expect(chapter.summary).toBeDefined();
      });
    });

    it('should have valid shloka data', () => {
      gitaData.shlokas.forEach(shloka => {
        expect(shloka.id).toBeDefined();
        expect(shloka.chapter).toBeGreaterThan(0);
        expect(shloka.chapter).toBeLessThanOrEqual(18);
        expect(shloka.verse).toBeGreaterThan(0);
        expect(shloka.sanskrit).toBeDefined();
        expect(shloka.transliteration).toBeDefined();
        expect(shloka.translations).toBeDefined();
        expect(shloka.translations.english).toBeDefined();
        expect(shloka.translations.wordByWord).toBeDefined();
        expect(shloka.translations.commentary).toBeDefined();
      });
    });
  });

  describe('Core Functionality', () => {
    it('should provide daily shloka functionality', () => {
      const dailyShloka = getDailyShloka();
      expect(dailyShloka).toBeDefined();
      expect(dailyShloka.id).toBeDefined();
      expect(dailyShloka.sanskrit).toBeDefined();
    });

    it('should handle search functionality', () => {
      const searchResults = searchShlokas(gitaData.shlokas, 'dharma');
      expect(Array.isArray(searchResults)).toBe(true);

      if (searchResults.length > 0) {
        searchResults.forEach(result => {
          expect(result.shloka).toBeDefined();
          expect(result.matches).toBeDefined();
          expect(Array.isArray(result.matches)).toBe(true);
        });
      }
    });

    it('should handle empty search queries', () => {
      const emptyResults = searchShlokas(gitaData.shlokas, '');
      expect(Array.isArray(emptyResults)).toBe(true);
      expect(emptyResults.length).toBe(0);
    });

    it('should handle special characters in search', () => {
      const specialCharResults = searchShlokas(gitaData.shlokas, 'कर्म');
      expect(Array.isArray(specialCharResults)).toBe(true);
    });
  });

  describe('Performance Validation', () => {
    it('should meet performance benchmarks', async () => {
      const metrics = await runPerformanceTests(gitaData.shlokas);
      const isPerformant = validatePerformance(metrics);

      expect(isPerformant).toBe(true);
      expect(metrics.renderTime).toBeLessThan(100);
      expect(metrics.searchTime).toBeLessThan(50);
      expect(metrics.storageTime).toBeLessThan(100);
    });

    it('should handle large datasets efficiently', () => {
      const startTime = Date.now();

      // Simulate processing all shlokas
      const processedShlokas = gitaData.shlokas.map(shloka => ({
        ...shloka,
        processed: true,
      }));

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      expect(processedShlokas.length).toBe(gitaData.shlokas.length);
      expect(processingTime).toBeLessThan(100); // Should process quickly
    });
  });

  describe('Accessibility Validation', () => {
    it('should meet accessibility standards', async () => {
      const auditResults = await runComprehensiveAccessibilityAudit();

      expect(auditResults.overallScore).toBeGreaterThanOrEqual(80);
      expect(auditResults.categories.screenReader).toBeGreaterThanOrEqual(80);
      expect(auditResults.categories.touchTargets).toBeGreaterThanOrEqual(80);
      expect(auditResults.categories.colorContrast).toBeGreaterThanOrEqual(80);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing data gracefully', () => {
      // Test with empty data
      const emptySearchResults = searchShlokas([], 'test');
      expect(emptySearchResults).toEqual([]);
    });

    it('should handle invalid chapter numbers', () => {
      const invalidChapter = gitaData.chapters.find(c => c.number === 19);
      expect(invalidChapter).toBeUndefined();
    });

    it('should handle malformed search queries', () => {
      const malformedResults = searchShlokas(gitaData.shlokas, null as any);
      expect(Array.isArray(malformedResults)).toBe(true);
    });
  });

  describe('Data Consistency', () => {
    it('should have consistent chapter-shloka relationships', () => {
      gitaData.chapters.forEach(chapter => {
        const chapterShlokas = gitaData.shlokas.filter(s => s.chapter === chapter.number);

        if (chapterShlokas.length > 0) {
          // Verify verse numbering is sequential
          const verseNumbers = chapterShlokas.map(s => s.verse).sort((a, b) => a - b);
          for (let i = 1; i < verseNumbers.length; i++) {
            expect(verseNumbers[i]).toBeGreaterThan(verseNumbers[i - 1]);
          }
        }
      });
    });

    it('should have unique shloka IDs', () => {
      const ids = gitaData.shlokas.map(s => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have consistent text formatting', () => {
      gitaData.shlokas.forEach(shloka => {
        // Sanskrit text should not be empty
        expect(shloka.sanskrit.trim().length).toBeGreaterThan(0);

        // Transliteration should not be empty
        expect(shloka.transliteration.trim().length).toBeGreaterThan(0);

        // All translations should exist
        expect(shloka.translations.english.trim().length).toBeGreaterThan(0);
        expect(shloka.translations.wordByWord.trim().length).toBeGreaterThan(0);
        expect(shloka.translations.commentary.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe('Offline Functionality', () => {
    it('should work without network connectivity', () => {
      // All data should be bundled and accessible
      expect(gitaData.chapters).toBeDefined();
      expect(gitaData.shlokas).toBeDefined();

      // Core functions should work without network
      const dailyShloka = getDailyShloka();
      expect(dailyShloka).toBeDefined();

      const searchResults = searchShlokas(gitaData.shlokas, 'yoga');
      expect(Array.isArray(searchResults)).toBe(true);
    });
  });

  describe('Cross-Platform Compatibility', () => {
    it('should handle different text encodings', () => {
      // Test Sanskrit text encoding
      gitaData.shlokas.forEach(shloka => {
        expect(typeof shloka.sanskrit).toBe('string');
        expect(shloka.sanskrit.length).toBeGreaterThan(0);
      });
    });

    it('should handle different date formats', () => {
      // Test daily shloka with different dates
      const today = new Date();
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

      const todaysShloka = getDailyShloka(today);
      const tomorrowsShloka = getDailyShloka(tomorrow);

      expect(todaysShloka).toBeDefined();
      expect(tomorrowsShloka).toBeDefined();

      // Should be different shlokas for different dates
      if (gitaData.shlokas.length > 1) {
        expect(todaysShloka.id).not.toBe(tomorrowsShloka.id);
      }
    });
  });
});

// Integration test helper functions
export const runFullAppValidation = async (): Promise<{
  dataIntegrity: boolean;
  functionality: boolean;
  performance: boolean;
  accessibility: boolean;
  errorHandling: boolean;
}> => {
  console.log('🚀 Running full app validation...');

  try {
    // Test data integrity
    const dataIntegrity = gitaData.chapters.length === 18 && gitaData.shlokas.length > 0;

    // Test core functionality
    const dailyShloka = getDailyShloka();
    const searchResults = searchShlokas(gitaData.shlokas, 'test');
    const functionality = dailyShloka && Array.isArray(searchResults);

    // Test performance
    const performanceMetrics = await runPerformanceTests(gitaData.shlokas);
    const performance = validatePerformance(performanceMetrics);

    // Test accessibility
    const accessibilityAudit = await runComprehensiveAccessibilityAudit();
    const accessibility = accessibilityAudit.overallScore >= 80;

    // Test error handling
    const emptySearch = searchShlokas([], 'test');
    const errorHandling = Array.isArray(emptySearch);

    const results = {
      dataIntegrity,
      functionality,
      performance,
      accessibility,
      errorHandling,
    };

    console.log('📊 Validation Results:', results);

    const allPassed = Object.values(results).every(result => result === true);
    console.log(allPassed ? '✅ All validations passed!' : '❌ Some validations failed');

    return results;
  } catch (error) {
    console.error('❌ Validation failed with error:', error);
    return {
      dataIntegrity: false,
      functionality: false,
      performance: false,
      accessibility: false,
      errorHandling: false,
    };
  }
};
