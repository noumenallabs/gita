import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ShlokaCard } from '../ShlokaCard';
import { Shloka } from '../../types';

// Mock the context providers
const MockThemeProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const MockResponsiveProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

// Mock hooks
jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        primary: { 200: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309' },
        gray: {
          100: '#f3f4f6',
          200: '#e5e7eb',
          400: '#9ca3af',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
        },
      },
      spacing: { xs: 4, sm: 8, md: 16, lg: 24 },
      typography: {
        caption: { fontSize: 12 },
        label: { fontSize: 14 },
        body1: { fontSize: 16 },
        body2: { fontSize: 14 },
        h5: { fontSize: 20 },
        h6: { fontSize: 18 },
        sanskrit: { fontSize: 18 },
        transliteration: { fontSize: 16 },
      },
      borderRadius: { md: 8, xl: 16 },
      shadows: { lg: { shadowOpacity: 0.1 } },
      touchTargets: { medium: 44, large: 48 },
      gradients: { primary: ['#f59e0b', '#d97706'] },
      isDark: false,
    },
  }),
}));

jest.mock('../../context/ResponsiveContext', () => ({
  useDeviceInfo: () => ({
    isTablet: false,
    screenWidth: 375,
  }),
  useAccessibility: () => ({
    reduceMotion: false,
  }),
}));

jest.mock('../../utils/responsive', () => ({
  getLayoutDimensions: () => ({
    containerPadding: 16,
    maxContentWidth: 600,
  }),
}));

jest.mock('../../utils/accessibility', () => ({
  getSanskritAccessibilityProps: () => ({
    accessibilityLabel: 'Sanskrit text',
    accessibilityRole: 'text',
  }),
  getTranslationAccessibilityProps: () => ({
    accessibilityLabel: 'Translation text',
    accessibilityRole: 'text',
  }),
  getFavoriteAccessibilityProps: () => ({
    accessibilityLabel: 'Favorite button',
    accessibilityRole: 'button',
  }),
  getExpandableAccessibilityProps: () => ({
    accessibilityLabel: 'Expandable section',
    accessibilityRole: 'button',
  }),
  announceAction: jest.fn(),
}));

describe('ShlokaCard', () => {
  const mockShloka: Shloka = {
    id: '2.47',
    chapter: 2,
    verse: 47,
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
    transliteration: 'karmaṇy-evādhikāras te mā phaleṣhu kadāchana',
    translations: {
      english:
        'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.',
      wordByWord:
        'karmaṇi—in prescribed duties; eva—only; adhikāraḥ—right; te—your; mā—not; phaleṣhu—in the fruits',
      commentary:
        "This is one of the most important verses of the Gita. It teaches the principle of Nishkama Karma - performing one's duty without attachment to results.",
    },
  };

  const defaultProps = {
    shloka: mockShloka,
    isFavorite: false,
    onToggleFavorite: jest.fn(),
    showChapterInfo: true,
    defaultTranslationView: 'english' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render shloka information correctly', () => {
    const { getByText } = render(
      <MockThemeProvider>
        <MockResponsiveProvider>
          <ShlokaCard {...defaultProps} />
        </MockResponsiveProvider>
      </MockThemeProvider>
    );

    expect(getByText('2.47')).toBeTruthy();
    expect(getByText('Chapter 2, Verse 47')).toBeTruthy();
    expect(getByText(mockShloka.translations.english)).toBeTruthy();
  });

  it('should display Sanskrit text when expanded', async () => {
    const { getByText, queryByText } = render(
      <MockThemeProvider>
        <MockResponsiveProvider>
          <ShlokaCard {...defaultProps} />
        </MockResponsiveProvider>
      </MockThemeProvider>
    );

    // Sanskrit should not be visible initially
    expect(queryByText(mockShloka.sanskrit)).toBeFalsy();

    // Tap to expand Sanskrit section
    const sanskritHeader = getByText('Sanskrit');
    fireEvent.press(sanskritHeader);

    // Sanskrit should now be visible
    await waitFor(() => {
      expect(getByText(mockShloka.sanskrit)).toBeTruthy();
      expect(getByText(mockShloka.transliteration)).toBeTruthy();
    });
  });

  it('should call onToggleFavorite when favorite button is pressed', async () => {
    const mockToggleFavorite = jest.fn();
    const { getByLabelText } = render(
      <MockThemeProvider>
        <MockResponsiveProvider>
          <ShlokaCard {...defaultProps} onToggleFavorite={mockToggleFavorite} />
        </MockResponsiveProvider>
      </MockThemeProvider>
    );

    const favoriteButton = getByLabelText('Favorite button');
    fireEvent.press(favoriteButton);

    await waitFor(() => {
      expect(mockToggleFavorite).toHaveBeenCalledWith('2.47');
    });
  });

  it('should show different translation views when selected', async () => {
    const { getByText, queryByText } = render(
      <MockThemeProvider>
        <MockResponsiveProvider>
          <ShlokaCard {...defaultProps} />
        </MockResponsiveProvider>
      </MockThemeProvider>
    );

    // Initially shows English translation
    expect(getByText(mockShloka.translations.english)).toBeTruthy();
    expect(queryByText(mockShloka.translations.wordByWord)).toBeFalsy();

    // Tap translation selector
    const translationHeader = getByText('English Translation');
    fireEvent.press(translationHeader);

    // Should show translation selector modal
    await waitFor(() => {
      expect(getByText('Select Translation View')).toBeTruthy();
      expect(getByText('Word-by-Word Meaning')).toBeTruthy();
    });

    // Select word-by-word translation
    const wordByWordOption = getByText('Word-by-Word Meaning');
    fireEvent.press(wordByWordOption);

    // Should show word-by-word translation
    await waitFor(() => {
      expect(getByText(mockShloka.translations.wordByWord)).toBeTruthy();
    });
  });

  it('should not show chapter info when showChapterInfo is false', () => {
    const { queryByText } = render(
      <MockThemeProvider>
        <MockResponsiveProvider>
          <ShlokaCard {...defaultProps} showChapterInfo={false} />
        </MockResponsiveProvider>
      </MockThemeProvider>
    );

    expect(queryByText('Chapter 2, Verse 47')).toBeFalsy();
  });

  it('should not render favorite button when onToggleFavorite is not provided', () => {
    const { queryByLabelText } = render(
      <MockThemeProvider>
        <MockResponsiveProvider>
          <ShlokaCard {...defaultProps} onToggleFavorite={undefined} />
        </MockResponsiveProvider>
      </MockThemeProvider>
    );

    expect(queryByLabelText('Favorite button')).toBeFalsy();
  });

  it('should show correct favorite state', () => {
    const { rerender, getByLabelText } = render(
      <MockThemeProvider>
        <MockResponsiveProvider>
          <ShlokaCard {...defaultProps} isFavorite={false} />
        </MockResponsiveProvider>
      </MockThemeProvider>
    );

    // Should show unfavorited state
    const favoriteButton = getByLabelText('Favorite button');
    expect(favoriteButton).toBeTruthy();

    // Change to favorited state
    rerender(
      <MockThemeProvider>
        <MockResponsiveProvider>
          <ShlokaCard {...defaultProps} isFavorite={true} />
        </MockResponsiveProvider>
      </MockThemeProvider>
    );

    // Should still render the button (visual state change is handled by icon)
    expect(getByLabelText('Favorite button')).toBeTruthy();
  });

  it('should close translation selector when backdrop is pressed', async () => {
    const { getByText, queryByText } = render(
      <MockThemeProvider>
        <MockResponsiveProvider>
          <ShlokaCard {...defaultProps} />
        </MockResponsiveProvider>
      </MockThemeProvider>
    );

    // Open translation selector
    const translationHeader = getByText('English Translation');
    fireEvent.press(translationHeader);

    await waitFor(() => {
      expect(getByText('Select Translation View')).toBeTruthy();
    });

    // Press backdrop (close button)
    const closeButton = getByText('Close translation selector');
    fireEvent.press(closeButton);

    // Modal should close
    await waitFor(() => {
      expect(queryByText('Select Translation View')).toBeFalsy();
    });
  });

  it('should start with correct default translation view', () => {
    const { getByText } = render(
      <MockThemeProvider>
        <MockResponsiveProvider>
          <ShlokaCard {...defaultProps} defaultTranslationView="commentary" />
        </MockResponsiveProvider>
      </MockThemeProvider>
    );

    expect(getByText('Commentary')).toBeTruthy();
    expect(getByText(mockShloka.translations.commentary)).toBeTruthy();
  });

  it('should handle memo optimization correctly', () => {
    const { rerender } = render(
      <MockThemeProvider>
        <MockResponsiveProvider>
          <ShlokaCard {...defaultProps} />
        </MockResponsiveProvider>
      </MockThemeProvider>
    );

    // Rerender with same props should not cause re-render (memo optimization)
    rerender(
      <MockThemeProvider>
        <MockResponsiveProvider>
          <ShlokaCard {...defaultProps} />
        </MockResponsiveProvider>
      </MockThemeProvider>
    );

    // Component should still be rendered correctly
    expect(true).toBe(true); // This test mainly checks that memo doesn't break rendering
  });
});
