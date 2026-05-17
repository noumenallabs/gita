import { createHttpClient } from './httpClient';
import { getApiBaseUrl } from '../utils/envValidation';
import { getUserId } from '../utils/userId';
import type {
  ApiBookmark,
  ApiVerseProgress,
  ApiChapterProgress,
  ApiStreak,
  ApiActivity,
  ApiUserMilestone,
  ApiReflection,
  ApiQuizResult,
} from '../types/api';

let client: ReturnType<typeof createHttpClient> | null = null;

function getClient() {
  if (!client) {
    client = createHttpClient({
      baseUrl: getApiBaseUrl(),
      timeout: 15000,
      retries: 0,
      getHeaders: async () => {
        const userId = await getUserId();
        return { 'X-User-Id': userId };
      },
    });
  }
  return client;
}

export async function recordVerseProgress(
  chapterNumber: number,
  verseNumber: number,
  status: 'read' | 'in_progress' | 'completed' | 'mastered',
  timeSpentSecs = 0
): Promise<{
  message: string;
  verse_id: number;
  chapter_number: number;
  verse_number: number;
  status: string;
  xp_earned: number;
  new_milestones?: number[];
}> {
  return getClient().post('/users/me/progress/verse', {
    chapter_number: chapterNumber,
    verse_number: verseNumber,
    status,
    time_spent_secs: timeSpentSecs,
  });
}

export async function getVerseProgress(
  chapter?: number
): Promise<{ progress: ApiVerseProgress[] }> {
  const query = chapter ? `?chapter=${chapter}` : '';
  return getClient().get(`/users/me/progress/verse${query}`);
}

export async function getChapterProgress(): Promise<{
  progress: ApiChapterProgress[];
}> {
  return getClient().get('/users/me/progress/chapter');
}

export async function createBookmark(
  chapterNumber: number,
  verseNumber: number,
  collection = 'default',
  note?: string
): Promise<{ message: string; verse_id: number; collection: string }> {
  return getClient().post('/users/me/bookmarks', {
    chapter_number: chapterNumber,
    verse_number: verseNumber,
    collection,
    note,
  });
}

export async function getBookmarks(
  collection?: string
): Promise<{ bookmarks: ApiBookmark[] }> {
  const query = collection ? `?collection=${collection}` : '';
  return getClient().get(`/users/me/bookmarks${query}`);
}

export async function updateBookmark(
  bookmarkId: number,
  updates: { note?: string; collection?: string }
): Promise<{ message: string }> {
  return getClient().put(`/users/me/bookmarks/${bookmarkId}`, updates);
}

export async function deleteBookmark(
  bookmarkId: number
): Promise<{ message: string }> {
  return getClient().delete(`/users/me/bookmarks/${bookmarkId}`);
}

export async function getStreak(): Promise<{ streak: ApiStreak }> {
  return getClient().get('/users/me/streak');
}

export async function getActivity(
  days = 30
): Promise<{ activity: ApiActivity[]; days: number }> {
  return getClient().get(`/users/me/activity?days=${days}`);
}

export async function getUserMilestones(): Promise<{
  milestones: ApiUserMilestone[];
}> {
  return getClient().get('/users/me/milestones');
}

export async function createReflection(
  chapterNumber: number,
  verseNumber: number,
  body: string,
  mood?: string,
  isPrivate = true
): Promise<{ message: string }> {
  return getClient().post('/users/me/reflections', {
    chapter_number: chapterNumber,
    verse_number: verseNumber,
    body,
    mood,
    is_private: isPrivate,
  });
}

export async function getReflections(
  chapter?: number
): Promise<{ reflections: ApiReflection[] }> {
  const query = chapter ? `?chapter=${chapter}` : '';
  return getClient().get(`/users/me/reflections${query}`);
}

export async function updateReflection(
  reflectionId: number,
  updates: { body?: string; mood?: string; is_private?: boolean }
): Promise<{ message: string }> {
  return getClient().put(`/users/me/reflections/${reflectionId}`, updates);
}

export async function deleteReflection(
  reflectionId: number
): Promise<{ message: string }> {
  return getClient().delete(`/users/me/reflections/${reflectionId}`);
}

export async function recordQuizResult(
  quizType: 'chapter_review' | 'daily' | 'verse_recall' | 'custom',
  score: number,
  total: number,
  chapterNumber?: number,
  verseId?: number
): Promise<{ message: string; xp_earned: number }> {
  return getClient().post('/users/me/quiz-results', {
    quiz_type: quizType,
    score,
    total,
    chapter_number: chapterNumber,
    verse_id: verseId,
  });
}

export async function getQuizResults(
  chapter?: number
): Promise<{ quiz_results: ApiQuizResult[] }> {
  const query = chapter ? `?chapter=${chapter}` : '';
  return getClient().get(`/users/me/quiz-results${query}`);
}
