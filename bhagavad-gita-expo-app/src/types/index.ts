export interface Commentary {
  authorKey: string;
  author: string;
  displayName: string;
  translations: {
    english?: string;
    hindi?: string;
    englishCommentary?: string;
    hindiCommentary?: string;
    sanskritCommentary?: string;
  };
}

export interface Shloka {
  id: string;
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  translations: {
    english: string;
    hindi?: string;
    wordByWord: string;
    commentary: string;
  };
  commentaries?: Commentary[];
}

export interface Chapter {
  number: number;
  name: string;
  translation: string;
  verses: number;
  summary: string;
}

export interface UserPreferences {
  favoriteShlokas: string[];
  defaultTranslationView: TranslationView;
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  showSanskrit: boolean;
  highContrast?: boolean;
}

export type TranslationView = 'english' | 'wordByWord' | 'commentary';

export type TabName = 'home' | 'browse' | 'search' | 'favorites';

// App State Management Types
export interface AppState {
  favorites: Set<string>;
  currentTab: TabName;
  searchQuery: string;
  selectedChapter: number | null;
  theme: 'light' | 'dark' | 'system';
  userPreferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
}

export interface AppActions {
  toggleFavorite: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedChapter: (id: number | null) => void;
  setCurrentTab: (tab: TabName) => void;
  toggleTheme: () => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export interface AppContext {
  state: AppState;
  actions: AppActions;
}

// Search and Data Types
export interface SearchResult {
  shloka: Shloka;
  matchType: 'sanskrit' | 'transliteration' | 'english' | 'wordByWord' | 'commentary';
  matchText: string;
  score: number;
  matches?: string[];
}

export interface SearchIndex {
  id: string;
  chapter: number;
  verse: number;
  searchableText: string;
  keywords: string[];
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface DataValidationOptions {
  checkSanskrit?: boolean;
  checkTransliteration?: boolean;
  checkTranslations?: boolean;
  strict?: boolean;
}
