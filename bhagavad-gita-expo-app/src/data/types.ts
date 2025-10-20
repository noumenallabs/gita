// Auto-generated types from Bhagavad Gita dataset
// Generated on: 2025-10-18T13:25:02.481Z

export interface ChapterMeaning {
  en: string;
  hi: string;
}

export interface ChapterSummary {
  en: string;
  hi: string;
}

export interface Chapter {
  number: number;
  name: string;
  translation: string;
  transliteration: string;
  meaning: ChapterMeaning;
  verses: number;
  summary: ChapterSummary;
}

export interface Translations {
  english: string;
  hindi: string;
  wordByWord: string;
  commentary: string;
}

export interface CommentaryTranslations {
  english?: string;
  hindi?: string;
  englishCommentary?: string;
  hindiCommentary?: string;
  sanskritCommentary?: string;
}

export interface Commentary {
  authorKey: string;
  author: string;
  displayName: string;
  translations: CommentaryTranslations;
}

export interface Shloka {
  id: string;
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  translations: Translations;
  commentaries: Commentary[];
}

// Legacy interface for backward compatibility
export interface LegacyShloka {
  id: string;
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  translations: {
    english: string;
    wordByWord: string;
    commentary: string;
  };
}
