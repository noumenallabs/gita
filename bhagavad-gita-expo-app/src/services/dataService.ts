import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { Chapter, Shloka } from '../types';

// Cache for loaded data
const dataCache: {
  chapters: Chapter[] | null;
  shlokas: Map<number, Shloka[]>;
  searchIndex: any[] | null;
} = {
  chapters: null,
  shlokas: new Map(),
  searchIndex: null,
};

/**
 * Load JSON data from assets
 */
async function loadJsonFromAsset(filename: string): Promise<any> {
  try {
    // Get the asset URI
    const asset = Asset.fromModule(require(`../../assets/data/${filename}`));
    await asset.downloadAsync();
    
    // Read the file
    const content = await FileSystem.readAsStringAsync(asset.localUri || asset.uri);
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    throw error;
  }
}

/**
 * Load chapter metadata (small file, loads on app start)
 */
export async function loadChapters(): Promise<Chapter[]> {
  if (dataCache.chapters) {
    return dataCache.chapters;
  }

  const data = await loadJsonFromAsset('chapters.json');
  dataCache.chapters = data;
  return data;
}

/**
 * Load shlokas for a specific chapter (loads on-demand)
 */
export async function loadShlokasByChapter(chapterNumber: number): Promise<Shloka[]> {
  // Check cache first
  if (dataCache.shlokas.has(chapterNumber)) {
    return dataCache.shlokas.get(chapterNumber)!;
  }

  const data = await loadJsonFromAsset(`chapter-${chapterNumber}.json`);
  const shlokas = data.shlokas || [];
  
  // Cache for future use
  dataCache.shlokas.set(chapterNumber, shlokas);
  
  return shlokas;
}

/**
 * Load all shlokas (use sparingly - only when needed)
 */
export async function loadAllShlokas(): Promise<Shloka[]> {
  const chapters = await loadChapters();
  const allShlokas: Shloka[] = [];
  
  for (const chapter of chapters) {
    const shlokas = await loadShlokasByChapter(chapter.number);
    allShlokas.push(...shlokas);
  }
  
  return allShlokas;
}

/**
 * Load search index
 */
export async function loadSearchIndex(): Promise<any[]> {
  if (dataCache.searchIndex) {
    return dataCache.searchIndex;
  }

  const data = await loadJsonFromAsset('search-index.json');
  dataCache.searchIndex = data;
  return data;
}

/**
 * Search shlokas using the search index
 */
export async function searchShlokas(query: string): Promise<Shloka[]> {
  if (!query.trim()) {
    return [];
  }

  const searchIndex = await loadSearchIndex();
  const lowerQuery = query.toLowerCase();
  
  // Search in the lightweight index
  const matchingEntries = searchIndex.filter((entry: any) => {
    return (
      entry.sanskrit?.toLowerCase().includes(lowerQuery) ||
      entry.transliteration?.toLowerCase().includes(lowerQuery) ||
      entry.english?.toLowerCase().includes(lowerQuery)
    );
  });

  // Load full shloka data for matches
  const results: Shloka[] = [];
  const chaptersToLoad = new Set(matchingEntries.map((e: any) => e.chapter));
  
  for (const chapterNum of chaptersToLoad) {
    const shlokas = await loadShlokasByChapter(chapterNum);
    const chapterMatches = matchingEntries
      .filter((e: any) => e.chapter === chapterNum)
      .map((e: any) => shlokas.find((s: Shloka) => s.id === e.id))
      .filter(Boolean);
    results.push(...chapterMatches);
  }
  
  return results;
}

/**
 * Get a specific shloka by ID
 */
export async function getShlokaById(id: string): Promise<Shloka | null> {
  const [chapterNum, verseNum] = id.split('.').map(Number);
  
  if (!chapterNum || !verseNum) {
    return null;
  }

  const shlokas = await loadShlokasByChapter(chapterNum);
  return shlokas.find((s: Shloka) => s.id === id) || null;
}

/**
 * Get daily shloka based on date
 */
export async function getDailyShloka(date: Date = new Date()): Promise<Shloka | null> {
  const chapters = await loadChapters();
  
  // Use day of year to determine which shloka to show
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  // Calculate total shlokas
  const totalShlokas = chapters.reduce((acc, c) => acc + c.verses, 0);
  const shlokaIndex = dayOfYear % totalShlokas;
  
  // Find which chapter this shloka belongs to
  let currentIndex = 0;
  for (const chapter of chapters) {
    if (currentIndex + chapter.verses > shlokaIndex) {
      const verseInChapter = shlokaIndex - currentIndex;
      const shlokas = await loadShlokasByChapter(chapter.number);
      return shlokas[verseInChapter] || null;
    }
    currentIndex += chapter.verses;
  }
  
  return null;
}

/**
 * Get a random shloka
 */
export async function getRandomShloka(): Promise<Shloka | null> {
  const chapters = await loadChapters();
  const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];
  const shlokas = await loadShlokasByChapter(randomChapter.number);
  return shlokas[Math.floor(Math.random() * shlokas.length)] || null;
}

/**
 * Clear the data cache (useful for memory management)
 */
export function clearDataCache(): void {
  dataCache.chapters = null;
  dataCache.shlokas.clear();
  dataCache.searchIndex = null;
}

/**
 * Preload chapters data (call on app startup)
 */
export async function preloadChapters(): Promise<void> {
  await loadChapters();
}
