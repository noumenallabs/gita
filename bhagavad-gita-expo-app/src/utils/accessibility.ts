import { AccessibilityInfo } from 'react-native';

// Font size preferences
export const FontSizePreference = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  EXTRA_LARGE: 'extra_large',
} as const;

export type FontSizePreferenceValue = (typeof FontSizePreference)[keyof typeof FontSizePreference];

// Font size multipliers
export const FontSizeMultipliers = {
  [FontSizePreference.SMALL]: 0.85,
  [FontSizePreference.MEDIUM]: 1.0,
  [FontSizePreference.LARGE]: 1.15,
  [FontSizePreference.EXTRA_LARGE]: 1.3,
} as const;

// High contrast mode colors
export const HighContrastColors = {
  background: '#000000',
  surface: '#1a1a1a',
  text: '#ffffff',
  textSecondary: '#e0e0e0',
  primary: '#ffff00',
  secondary: '#00ffff',
  accent: '#ff00ff',
  border: '#ffffff',
  divider: '#666666',
  error: '#ff0000',
  success: '#00ff00',
  warning: '#ffaa00',
} as const;

// Accessibility labels for Sanskrit text
export const getSanskritAccessibilityLabel = (
  sanskrit: string,
  transliteration: string
): string => {
  return `Sanskrit verse: ${transliteration}. Original text: ${sanskrit}`;
};

// Screen reader announcements
export const announceForScreenReader = (message: string, priority: 'low' | 'high' = 'low') => {
  // Use the same method for both platforms - React Native handles the differences internally
  AccessibilityInfo.announceForAccessibility(message);
};

// Check if screen reader is enabled
export const isScreenReaderEnabled = async (): Promise<boolean> => {
  try {
    return await AccessibilityInfo.isScreenReaderEnabled();
  } catch (error) {
    console.warn('Failed to check screen reader status:', error);
    return false;
  }
};

// Check if reduce motion is enabled
export const isReduceMotionEnabled = async (): Promise<boolean> => {
  try {
    return await AccessibilityInfo.isReduceMotionEnabled();
  } catch (error) {
    console.warn('Failed to check reduce motion status:', error);
    return false;
  }
};

// Get accessible font size based on user preference
export const getAccessibleFontSize = (
  baseSize: number,
  userPreference: FontSizePreferenceValue = FontSizePreference.MEDIUM
): number => {
  const multiplier = FontSizeMultipliers[userPreference];
  return Math.round(baseSize * multiplier);
};

// Accessibility props for interactive elements
export const getAccessibilityProps = (
  label: string,
  hint?: string,
  role?: string,
  state?: { selected?: boolean; disabled?: boolean; expanded?: boolean }
) => {
  const props: any = {
    accessible: true,
    accessibilityLabel: label,
  };

  if (hint) {
    props.accessibilityHint = hint;
  }

  if (role) {
    props.accessibilityRole = role as any;
  }

  if (state) {
    if (process.env.EXPO_OS === 'ios') {
      const traits = [];
      if (state.selected) traits.push('selected');
      if (state.disabled) traits.push('disabled');
      if (state.expanded !== undefined) {
        traits.push(state.expanded ? 'expanded' : 'collapsed');
      }
      if (traits.length > 0) {
        props.accessibilityTraits = traits;
      }
    } else {
      // Android
      if (state.selected !== undefined) {
        props.accessibilityState = { ...props.accessibilityState, selected: state.selected };
      }
      if (state.disabled !== undefined) {
        props.accessibilityState = { ...props.accessibilityState, disabled: state.disabled };
      }
      if (state.expanded !== undefined) {
        props.accessibilityState = { ...props.accessibilityState, expanded: state.expanded };
      }
    }
  }

  return props;
};

// Accessibility props for Sanskrit text
export const getSanskritAccessibilityProps = (sanskrit: string, transliteration: string) => {
  return {
    accessible: true,
    accessibilityLabel: getSanskritAccessibilityLabel(sanskrit, transliteration),
    accessibilityHint: 'Sanskrit verse with pronunciation guide',
    accessibilityRole: 'text',
  };
};

// Accessibility props for translation text
export const getTranslationAccessibilityProps = (
  translation: string,
  translationType: 'english' | 'wordByWord' | 'commentary'
) => {
  const typeLabels = {
    english: 'English translation',
    wordByWord: 'Word by word meaning',
    commentary: 'Detailed commentary',
  };

  return {
    accessible: true,
    accessibilityLabel: `${typeLabels[translationType]}: ${translation}`,
    accessibilityRole: 'text',
  };
};

// Accessibility props for navigation elements
export const getNavigationAccessibilityProps = (
  title: string,
  isActive: boolean = false,
  index?: number,
  total?: number
) => {
  let label = title;

  if (index !== undefined && total !== undefined) {
    label += `, ${index + 1} of ${total}`;
  }

  if (isActive) {
    label += ', currently selected';
  }

  return getAccessibilityProps(
    label,
    isActive ? undefined : `Tap to navigate to ${title}`,
    'button',
    { selected: isActive }
  );
};

// Accessibility props for favorite button
export const getFavoriteAccessibilityProps = (isFavorite: boolean, shlokaId: string) => {
  return getAccessibilityProps(
    isFavorite ? `Remove verse ${shlokaId} from favorites` : `Add verse ${shlokaId} to favorites`,
    isFavorite ? 'Double tap to remove from favorites' : 'Double tap to add to favorites',
    'button',
    { selected: isFavorite }
  );
};

// Accessibility props for expandable sections
export const getExpandableAccessibilityProps = (
  title: string,
  isExpanded: boolean,
  contentDescription?: string
) => {
  return getAccessibilityProps(
    `${title} section`,
    isExpanded
      ? `Expanded. ${contentDescription || ''} Double tap to collapse.`
      : `Collapsed. Double tap to expand and view ${contentDescription || 'content'}.`,
    'button',
    { expanded: isExpanded }
  );
};

// Accessibility props for search
export const getSearchAccessibilityProps = (query: string, resultCount?: number) => {
  let hint = 'Enter text to search verses';

  if (query && resultCount !== undefined) {
    hint = `${resultCount} results found for "${query}"`;
  }

  return {
    accessible: true,
    accessibilityLabel: 'Search verses',
    accessibilityHint: hint,
    accessibilityRole: 'search',
  };
};

// Accessibility announcement for actions
export const announceAction = (action: string, result?: string) => {
  let message = action;
  if (result) {
    message += `. ${result}`;
  }
  announceForScreenReader(message, 'high');
};

// Accessibility props for cards
export const getCardAccessibilityProps = (
  title: string,
  description?: string,
  isInteractive: boolean = false
) => {
  return {
    accessible: true,
    accessibilityLabel: title,
    accessibilityHint: description,
    accessibilityRole: isInteractive ? 'button' : 'text',
  };
};
