import { createHttpClient } from './httpClient';
import { getApiBaseUrl } from '../utils/envValidation';
import type {
  ApiChapter,
  ApiChapterWithVerses,
  ApiPaginatedVerses,
  ApiVerse,
  ApiTranslator,
  ApiCollection,
  ApiCollectionDetail,
  ApiMilestone,
  ApiSearchResult,
  ApiDailyVerse,
} from '../types/api';

let client: ReturnType<typeof createHttpClient> | null = null;

function getClient() {
  if (!client) {
    client = createHttpClient({
      baseUrl: getApiBaseUrl(),
      timeout: 15000,
      retries: 2,
    });
  }
  return client;
}

export async function fetchChapters(): Promise<ApiChapter[]> {
  const res = await getClient().get<{ chapters: ApiChapter[] }>('/chapters');
  return res.chapters;
}

export async function fetchChapter(
  chapterNum: number,
  includeTranslations = false
): Promise<ApiChapterWithVerses> {
  const query = includeTranslations ? '' : '?include_translations=false';
  return getClient().get<ApiChapterWithVerses>(
    `/chapters/${chapterNum}${query}`
  );
}

export async function fetchChapterVerses(
  chapterNum: number,
  page = 1,
  limit = 50
): Promise<ApiPaginatedVerses> {
  return getClient().get<ApiPaginatedVerses>(
    `/chapters/${chapterNum}/verses?page=${page}&limit=${limit}`
  );
}

export async function fetchVerse(
  chapterNum: number,
  verseNum: number
): Promise<ApiVerse> {
  return getClient().get<ApiVerse>(
    `/chapters/${chapterNum}/verses/${verseNum}`
  );
}

export async function fetchRandomVerse(): Promise<ApiVerse> {
  return getClient().get<ApiVerse>('/verses/random');
}

export async function fetchDailyVerse(): Promise<ApiDailyVerse> {
  return getClient().get<ApiDailyVerse>('/daily-verse');
}

export async function fetchTranslators(): Promise<ApiTranslator[]> {
  const res = await getClient().get<{ translators: ApiTranslator[] }>(
    '/translators'
  );
  return res.translators;
}

export async function fetchCollections(): Promise<ApiCollection[]> {
  const res = await getClient().get<{ collections: ApiCollection[] }>(
    '/collections'
  );
  return res.collections;
}

export async function fetchCollection(key: string): Promise<ApiCollectionDetail> {
  return getClient().get<ApiCollectionDetail>(`/collections/${key}`);
}

export async function fetchMilestones(): Promise<ApiMilestone[]> {
  const res = await getClient().get<{ milestones: ApiMilestone[] }>(
    '/milestones'
  );
  return res.milestones;
}

export async function searchVerses(
  query: string,
  limit = 20,
  offset = 0
): Promise<{ results: ApiSearchResult[]; count: number; offset: number }> {
  const encoded = encodeURIComponent(query);
  return getClient().get(
    `/search?q=${encoded}&limit=${limit}&offset=${offset}`
  );
}
