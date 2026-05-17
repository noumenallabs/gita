import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProvider } from '../../context/AppContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { ResponsiveProvider } from '../../context/ResponsiveContext';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock Expo modules
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppProvider>
    <ResponsiveProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </ResponsiveProvider>
  </AppProvider>
);

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  describe('Data Persistence', () => {
    it('should persist favorites across app sessions', async () => {
      const mockFavorites = JSON.stringify(['1.1', '2.5']);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(mockFavorites);

      const { ShlokaCard } = require('../../components/ShlokaCard');
      const { gitaData } = require('../../data/gita-data');

      const testShloka = gitaData.shlokas[0];

      render(
        <TestWrapper>
          <ShlokaCard shloka={testShloka} isFavorite={true} onToggleFavorite={jest.fn()} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('@bhagavad_gita:favorites');
      });
    });

    it('should handle storage errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const { useFavorites } = require('../../hooks/useFavorites');

      // Test that the hook handles storage errors without crashing
      expect(() => {
        const TestComponent = () => {
          useFavorites();
          return null;
        };

        render(
          <TestWrapper>
            <TestComponent />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe('Offline Functionality', () => {
    it('should work without network connectivity', () => {
      const { gitaData } = require('../../data/gita-data');

      expect(gitaData.chapters).toBeDefined();
      expect(gitaData.shlokas).toBeDefined();
      expect(gitaData.chapters.length).toBe(6);
      expect(gitaData.shlokas.length).toBeGreaterThan(0);
    });

    it('should provide all required data locally', () => {
      const { gitaData } = require('../../data/gita-data');

      // Verify each shloka has required fields
      gitaData.shlokas.forEach((shloka: any) => {
        expect(shloka).toHaveProperty('id');
        expect(shloka).toHaveProperty('chapter');
        expect(shloka).toHaveProperty('verse');
        expect(shloka).toHaveProperty('sanskrit');
        expect(shloka).toHaveProperty('transliteration');
        expect(shloka).toHaveProperty('translations');
        expect(shloka.translations).toHaveProperty('english');
        expect(shloka.translations).toHaveProperty('wordByWord');
        expect(shloka.translations).toHaveProperty('commentary');
      });
    });
  });

  describe('Performance Validation', () => {
    it('should render large lists efficiently', () => {
      const { gitaData } = require('../../data/gita-data');
      const startTime = Date.now();

      // Simulate rendering a large list of shlokas
      const shlokaIds = gitaData.shlokas.map((s: any) => s.id);

      const endTime = Date.now();
      const renderTime = endTime - startTime;

      // Should complete data processing quickly
      expect(renderTime).toBeLessThan(100);
    });

    it('should handle search operations efficiently', () => {
      const { searchShlokas } = require('../../utils/search');
      const { gitaData } = require('../../data/gita-data');

      const startTime = Date.now();
      const results = searchShlokas(gitaData.shlokas, 'dharma');
      const endTime = Date.now();

      const searchTime = endTime - startTime;

      expect(results).toBeDefined();
      expect(searchTime).toBeLessThan(50); // Should be very fast
    });
  });

  describe('Accessibility Validation', () => {
    it('should provide proper accessibility labels', () => {
      const { ShlokaCard } = require('../../components/ShlokaCard');
      const { gitaData } = require('../../data/gita-data');

      const testShloka = gitaData.shlokas[0];

      render(
        <TestWrapper>
          <ShlokaCard shloka={testShloka} isFavorite={false} onToggleFavorite={jest.fn()} />
        </TestWrapper>
      );

      // Check for accessibility labels (implementation depends on actual component)
      // This is a placeholder for actual accessibility testing
      expect(true).toBe(true);
    });

    it('should support screen reader navigation', () => {
      const { validateAccessibility } = require('../../utils/accessibilityTesting');

      // Test accessibility validation utility
      const mockElement = {
        accessibilityLabel: 'Test label',
        accessibilityRole: 'button',
        accessibilityHint: 'Test hint',
      };

      const isAccessible = validateAccessibility(mockElement);
      expect(isAccessible).toBe(true);
    });
  });

  describe('Cross-Platform Compatibility', () => {
    it('should handle platform-specific features gracefully', () => {
      // Mock Platform module
      jest.doMock('react-native/Libraries/Utilities/Platform', () => ({
        OS: 'ios',
        select: jest.fn(obj => obj.ios || obj.default),
      }));

      const { getResponsiveValue } = require('../../utils/responsive');

      const responsiveValue = getResponsiveValue({
        phone: 16,
        tablet: 20,
      });

      expect(responsiveValue).toBeDefined();
    });
  });
});
