import type {
  ApiChapter,
  ApiVerse,
  ApiTranslator,
  ApiVerseListItem,
} from '../types/api';
import type { Chapter, Shloka, Commentary } from '../types';
import { shlokas as localShlokas } from '../data/gita-data';

const TRANSLATOR_NAMES: Record<string, string> = {
  tej: 'Swami Tejomayananda',
  siva: 'Swami Sivananda',
  purohit: 'Shri Purohit Swami',
  chinmay: 'Swami Chinmayananda',
  san: 'Dr. S. Sankaranarayan',
  adi: 'Swami Adidevananda',
  gambir: 'Swami Gambirananda',
  madhav: 'Sri Madhavacharya',
  anand: 'Sri Anandgiri',
  rams: 'Swami Ramsukhdas',
  raman: 'Sri Ramanuja',
  prabhu: 'A.C. Bhaktivedanta Swami Prabhupada',
  abhinav: 'Sri Abhinav Gupta',
  sankar: 'Sri Shankaracharya',
  jaya: 'Sri Jayatritha',
  vallabh: 'Sri Vallabhacharya',
  ms: 'Sri Madhusudan Saraswati',
  srid: 'Sri Sridhara Swami',
  dhan: 'Sri Dhanpati',
  venkat: 'Vedantadeshikacharya Venkatanatha',
  puru: 'Sri Purushottamji',
  neel: 'Sri Neelkanth',
};

const TRANSLATOR_DISPLAY_NAMES: Record<string, string> = {
  tej: 'Tejomayananda',
  siva: 'Sivananda',
  purohit: 'Purohit Swami',
  chinmay: 'Chinmayananda',
  san: 'Sankaranarayan',
  adi: 'Adidevananda',
  gambir: 'Gambirananda',
  madhav: 'Madhavacharya',
  anand: 'Anandgiri',
  rams: 'Ramsukhdas',
  raman: 'Ramanuja',
  prabhu: 'Prabhupada',
  abhinav: 'Abhinav Gupta',
  sankar: 'Shankaracharya',
  jaya: 'Jayatritha',
  vallabh: 'Vallabhacharya',
  ms: 'Madhusudan Saraswati',
  srid: 'Sridhara Swami',
  dhan: 'Dhanpati',
  venkat: 'Venkatanatha',
  puru: 'Purushottamji',
  neel: 'Neelkanth',
};

function parseTranslationKey(key: string): {
  authorKey: string;
  language: string;
  contentType: string;
} {
  const parts = key.split('_');
  const authorKey = parts[0] ?? '';
  const langCode = parts[1] ?? 'en';

  let language = 'english';
  let contentType = 'translation';

  if (langCode === 'hi') {
    language = 'hindi';
  } else if (langCode === 'sa') {
    language = 'sanskrit';
  }

  if (key.includes('Commentary') || key.includes('commentary')) {
    contentType = 'commentary';
  }

  return { authorKey, language, contentType };
}

export function apiVerseToShloka(apiVerse: ApiVerse): Shloka {
  const localVerse = localShlokas.find(s => s.chapter === apiVerse.chapter_number && s.verse === apiVerse.verse_number);
  const commentaries: Commentary[] = [];
  let fallbackWordByWord = apiVerse.word_meanings ?? localVerse?.translations.wordByWord ?? '';
  let fallbackCommentary = localVerse?.translations.commentary ?? '';

  for (const [key, body] of Object.entries(apiVerse.translations ?? {})) {
    if (!body) continue;

    const lowerKey = key.toLowerCase();
    
    // Extract word-by-word if found in translations
    if (lowerKey.endsWith('_wbw') || lowerKey.endsWith('_wb') || lowerKey.includes('word')) {
      if (!fallbackWordByWord) fallbackWordByWord = body;
      continue; // typically don't add wbw to commentaries list
    }

    const isCommentary = lowerKey.endsWith('_co') || lowerKey.includes('commentary');
    if (isCommentary && !fallbackCommentary) {
      fallbackCommentary = body;
    }

    const { authorKey } = parseTranslationKey(key);
    let existing = commentaries.find((c) => c.authorKey === authorKey);

    if (!existing) {
      existing = {
        authorKey,
        author: TRANSLATOR_NAMES[authorKey] ?? authorKey,
        displayName: TRANSLATOR_DISPLAY_NAMES[authorKey] ?? authorKey,
        translations: {},
      };
      commentaries.push(existing);
    }

    if (isCommentary) {
      if (lowerKey.includes('_hi') || lowerKey.includes('hindi')) {
        existing.translations.hindiCommentary = body;
      } else if (lowerKey.includes('_sa') || lowerKey.includes('sanskrit')) {
        existing.translations.sanskritCommentary = body;
      } else {
        existing.translations.englishCommentary = body;
      }
    } else {
      if (lowerKey.includes('_hi') || lowerKey.includes('hindi')) {
        existing.translations.hindi = body;
      } else if (lowerKey.includes('_sa') || lowerKey.includes('sanskrit')) {
        // Sanskrit translation
      } else {
        existing.translations.english = body;
      }
    }
  }

  const findTranslation = (keys: string[]): string => {
    for (const k of keys) {
      if (apiVerse.translations?.[k]) return apiVerse.translations[k];
    }
    return '';
  };

  return {
    id: `${apiVerse.chapter_number}.${apiVerse.verse_number}`,
    chapter: apiVerse.chapter_number,
    verse: apiVerse.verse_number,
    sanskrit: apiVerse.slok ?? '',
    transliteration: apiVerse.transliteration ?? '',
    translations: {
      english: findTranslation(['prabhu_en', 'siva_en', 'tej_en', 'purohit_en', 'gambir_en', 'adi_en']),
      hindi: findTranslation(['rams_hi', 'tej_hi']),
      wordByWord: fallbackWordByWord || 'Word-by-word meaning is not available for this verse.',
      commentary: fallbackCommentary || 'Commentary is not available for this verse.',
    },
    commentaries: commentaries.length > 0 ? commentaries : undefined,
  };
}

export function apiVerseListItemToShloka(item: ApiVerseListItem): Shloka {
  return {
    id: `${item.chapter_number}.${item.verse_number}`,
    chapter: item.chapter_number,
    verse: item.verse_number,
    sanskrit: item.slok ?? '',
    transliteration: item.transliteration ?? '',
    translations: {
      english: '',
      hindi: '',
      wordByWord: '',
      commentary: '',
    },
  };
}

export function apiChapterToChapter(apiChapter: ApiChapter): Chapter {
  return {
    number: apiChapter.chapter_number,
    name: apiChapter.name_sanskrit ?? '',
    translation: apiChapter.name_en ?? '',
    verses: apiChapter.verses_count ?? 0,
    summary: apiChapter.summary_en ?? '',
  };
}

export function apiTranslatorToTranslator(api: ApiTranslator): {
  key: string;
  name: string;
  language: string;
  tradition: string | null;
} {
  return {
    key: api.key,
    name: api.name_en,
    language: api.language,
    tradition: api.tradition,
  };
}

export function getTranslationKey(
  authorKey: string,
  language: 'english' | 'hindi' | 'sanskrit'
): string {
  const langMap: Record<string, string> = {
    english: 'en',
    hindi: 'hi',
    sanskrit: 'sa',
  };
  return `${authorKey}_${langMap[language] ?? 'en'}`;
}
