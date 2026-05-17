export interface ApiChapter {
  chapter_number: number;
  name_sanskrit: string;
  name_en: string;
  name_hi: string | null;
  transliteration: string | null;
  meaning_en: string | null;
  meaning_hi: string | null;
  summary_en: string | null;
  summary_hi: string | null;
  verses_count: number;
}

export interface ApiVerse {
  chapter_number: number;
  verse_number: number;
  slok: string;
  transliteration: string | null;
  word_meanings?: string;
  translations: Record<string, string>;
}

export interface ApiVerseListItem {
  id: number;
  chapter_number: number;
  verse_number: number;
  slok: string;
  transliteration: string | null;
}

export interface ApiChapterWithVerses extends ApiChapter {
  verses: ApiVerse[];
}

export interface ApiPaginatedVerses {
  chapter_number: number;
  page: number;
  limit: number;
  total: number;
  verses: ApiVerseListItem[];
}

export interface ApiTranslator {
  id: number;
  key: string;
  name_en: string;
  name_hi: string | null;
  description_en: string | null;
  description_hi: string | null;
  language: string;
  tradition: string | null;
  era: string | null;
  sort_order: number;
  is_active: number;
}

export interface ApiCollection {
  id: number;
  key: string;
  title_en: string;
  title_hi: string | null;
  description_en: string | null;
  description_hi: string | null;
  icon_emoji: string | null;
  sort_order: number;
}

export interface ApiCollectionVerse {
  chapter_number: number;
  verse_number: number;
  slok: string;
  transliteration: string | null;
  sort_order: number;
  note: string | null;
}

export interface ApiCollectionDetail extends ApiCollection {
  verses: ApiCollectionVerse[];
}

export interface ApiMilestone {
  id: number;
  key: string;
  title_en: string;
  title_hi: string | null;
  icon_emoji: string | null;
  description_en: string | null;
  description_hi: string | null;
  xp_reward: number;
  unlock_condition: string;
  sort_order: number;
}

export interface ApiSearchResult {
  chapter_number: number;
  verse_number: number;
  slok: string;
  text: string | null;
}

export interface ApiDailyVerse {
  date: string;
  verse: ApiVerse;
}

export type ApiRandomVerse = ApiVerse;

export interface ApiBookmark {
  id: number;
  verse_id: number;
  note: string | null;
  collection: string;
  created_at: string;
  chapter_number: number;
  verse_number: number;
  slok: string;
}

export interface ApiVerseProgress {
  id: number;
  verse_id: number;
  chapter_number: number;
  verse_number: number;
  status: 'read' | 'in_progress' | 'completed' | 'mastered';
  read_count: number;
  time_spent_secs: number;
  first_read_at: string;
  last_read_at: string;
}

export interface ApiChapterProgress {
  id: number;
  user_id: string;
  chapter_number: number;
  verses_read: number;
  verses_total: number;
  status: 'not_started' | 'in_progress' | 'completed';
  started_at: string | null;
  completed_at: string | null;
  name_sanskrit: string;
  name_en: string;
}

export interface ApiStreak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  total_xp: number;
  total_verses_read: number;
  total_time_secs: number;
  last_active_date: string | null;
}

export interface ApiActivity {
  id: number;
  user_id: string;
  activity_date: string;
  verses_read: number;
  time_spent_secs: number;
  xp_earned: number;
}

export interface ApiUserMilestone {
  id: number;
  unlocked_at: string;
  key: string;
  title_en: string;
  title_hi: string | null;
  icon_emoji: string | null;
  description_en: string | null;
  xp_reward: number;
}

export interface ApiReflection {
  id: number;
  verse_id: number;
  body: string;
  mood: string | null;
  is_private: number;
  created_at: string;
  updated_at: string;
  chapter_number: number;
  verse_number: number;
}

export interface ApiQuizResult {
  id: number;
  user_id: string;
  chapter_number: number | null;
  verse_id: number | null;
  quiz_type: 'chapter_review' | 'daily' | 'verse_recall' | 'custom';
  score: number;
  total: number;
  xp_earned: number;
  completed_at: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    status: number;
  };
}
