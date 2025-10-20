#!/usr/bin/env node

/**
 * Bhagavad Gita Dataset Processing Script
 *
 * This script processes the complete JSON dataset and converts it into
 * optimized TypeScript files for the React Native app.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  DATASET_PATH: path.resolve(__dirname, '../../bhagavad-gita-dataset'),
  OUTPUT_PATH: path.resolve(__dirname, '../src/data'),
  CHAPTER_PATH: 'chapter',
  SLOK_PATH: 'slok',
};

// Author mapping for display names
const AUTHOR_MAPPING = {
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
  prabhu: 'A.C. Bhaktivedanta Swami Prabhupada',
};

// Translation priority for main interface
const TRANSLATION_PRIORITY = {
  english: ['prabhu', 'siva', 'gambir', 'adi', 'purohit'],
  hindi: ['tej', 'rams'],
  wordByWord: ['prabhu', 'siva'],
  commentary: ['prabhu', 'chinmay', 'siva', 'raman'],
};

/**
 * Validate dataset structure
 */
function validateDataset() {
  console.log('🔍 Validating dataset structure...');

  const chapterPath = path.join(CONFIG.DATASET_PATH, CONFIG.CHAPTER_PATH);
  const slokPath = path.join(CONFIG.DATASET_PATH, CONFIG.SLOK_PATH);

  if (!fs.existsSync(CONFIG.DATASET_PATH)) {
    throw new Error(`Dataset not found at: ${CONFIG.DATASET_PATH}`);
  }

  if (!fs.existsSync(chapterPath)) {
    throw new Error(`Chapter directory not found: ${chapterPath}`);
  }

  if (!fs.existsSync(slokPath)) {
    throw new Error(`Slok directory not found: ${slokPath}`);
  }

  console.log('✅ Dataset structure validated');
}

/**
 * Process chapter data
 */
function processChapters() {
  console.log('📚 Processing chapters...');

  const chapterPath = path.join(CONFIG.DATASET_PATH, CONFIG.CHAPTER_PATH);
  const chapters = [];

  for (let i = 1; i <= 18; i++) {
    const chapterFile = path.join(chapterPath, `bhagavadgita_chapter_${i}.json`);

    if (fs.existsSync(chapterFile)) {
      try {
        const chapterData = JSON.parse(fs.readFileSync(chapterFile, 'utf8'));

        chapters.push({
          number: chapterData.chapter_number,
          name: chapterData.name,
          translation: chapterData.translation,
          transliteration: chapterData.transliteration,
          meaning: chapterData.meaning,
          verses: chapterData.verses_count,
          summary: chapterData.summary,
        });

        console.log(`  ✓ Chapter ${i}: ${chapterData.name} (${chapterData.verses_count} verses)`);
      } catch (error) {
        console.error(`  ❌ Error processing chapter ${i}:`, error.message);
      }
    } else {
      console.warn(`  ⚠️  Chapter ${i} file not found`);
    }
  }

  console.log(`📚 Processed ${chapters.length} chapters`);
  return chapters;
}

/**
 * Get best translation for a given type and author data
 */
function getBestTranslation(slokData, type) {
  const priorities = TRANSLATION_PRIORITY[type] || [];

  for (const authorKey of priorities) {
    const authorData = slokData[authorKey];
    if (!authorData) continue;

    // Try different translation fields based on type
    if (type === 'english' && authorData.et) return authorData.et;
    if (type === 'hindi' && authorData.ht) return authorData.ht;
    if (type === 'wordByWord' && authorData.ec) return authorData.ec;
    if (type === 'commentary') {
      return authorData.ec || authorData.hc || authorData.et;
    }
  }

  // Fallback to any available translation
  for (const key of Object.keys(slokData)) {
    if (key.startsWith('_') || !slokData[key] || typeof slokData[key] !== 'object') continue;

    const authorData = slokData[key];
    if (type === 'english' && authorData.et) return authorData.et;
    if (type === 'hindi' && authorData.ht) return authorData.ht;
    if (type === 'wordByWord' && authorData.ec) return authorData.ec;
    if (type === 'commentary' && (authorData.ec || authorData.hc)) {
      return authorData.ec || authorData.hc;
    }
  }

  return '';
}

/**
 * Extract all commentaries from slok data
 */
function extractCommentaries(slokData) {
  const commentaries = [];

  Object.keys(slokData).forEach(key => {
    if (key.startsWith('_') || ['chapter', 'verse', 'slok', 'transliteration'].includes(key)) {
      return;
    }

    const authorData = slokData[key];
    if (typeof authorData !== 'object' || !authorData.author) return;

    const commentary = {
      authorKey: key,
      author: authorData.author,
      displayName: AUTHOR_MAPPING[key] || authorData.author,
      translations: {},
    };

    // Add available translations
    if (authorData.et) commentary.translations.english = authorData.et;
    if (authorData.ht) commentary.translations.hindi = authorData.ht;
    if (authorData.ec) commentary.translations.englishCommentary = authorData.ec;
    if (authorData.hc) commentary.translations.hindiCommentary = authorData.hc;
    if (authorData.sc) commentary.translations.sanskritCommentary = authorData.sc;

    // Only add if has at least one translation
    if (Object.keys(commentary.translations).length > 0) {
      commentaries.push(commentary);
    }
  });

  return commentaries;
}

/**
 * Process sloka data
 */
function processSlokas() {
  console.log('📜 Processing slokas...');

  const slokPath = path.join(CONFIG.DATASET_PATH, CONFIG.SLOK_PATH);
  const slokas = [];
  let processedCount = 0;
  let errorCount = 0;

  // Get all slok files and sort them
  const slokFiles = fs
    .readdirSync(slokPath)
    .filter(file => file.endsWith('.json'))
    .sort((a, b) => {
      const aMatch = a.match(/chapter_(\d+)_slok_(\d+)/);
      const bMatch = b.match(/chapter_(\d+)_slok_(\d+)/);

      if (aMatch && bMatch) {
        const aChapter = parseInt(aMatch[1]);
        const bChapter = parseInt(bMatch[1]);
        const aVerse = parseInt(aMatch[2]);
        const bVerse = parseInt(bMatch[2]);

        if (aChapter !== bChapter) return aChapter - bChapter;
        return aVerse - bVerse;
      }
      return 0;
    });

  console.log(`  Found ${slokFiles.length} slok files`);

  for (const file of slokFiles) {
    try {
      const slokPath_full = path.join(slokPath, file);
      const slokData = JSON.parse(fs.readFileSync(slokPath_full, 'utf8'));

      // Extract primary translations
      const translations = {
        english: getBestTranslation(slokData, 'english'),
        hindi: getBestTranslation(slokData, 'hindi'),
        wordByWord: getBestTranslation(slokData, 'wordByWord'),
        commentary: getBestTranslation(slokData, 'commentary'),
      };

      // Extract all commentaries
      const commentaries = extractCommentaries(slokData);

      const shloka = {
        id: slokData._id,
        chapter: slokData.chapter,
        verse: slokData.verse,
        sanskrit: slokData.slok,
        transliteration: slokData.transliteration,
        translations,
        commentaries,
      };

      slokas.push(shloka);
      processedCount++;

      if (processedCount % 100 === 0) {
        console.log(`  ✓ Processed ${processedCount} slokas...`);
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${file}:`, error.message);
      errorCount++;
    }
  }

  console.log(`📜 Processed ${processedCount} slokas (${errorCount} errors)`);
  return slokas;
}

/**
 * Generate TypeScript types
 */
function generateTypes() {
  return `// Auto-generated types from Bhagavad Gita dataset
// Generated on: ${new Date().toISOString()}

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
`;
}

/**
 * Generate main data file
 */
function generateDataFile(chapters, slokas) {
  return `// Auto-generated Bhagavad Gita data
// Generated on: ${new Date().toISOString()}
// Total chapters: ${chapters.length}
// Total slokas: ${slokas.length}

import { Chapter, Shloka, LegacyShloka } from './types';

export const chapters: Chapter[] = ${JSON.stringify(chapters, null, 2)};

export const slokas: Shloka[] = ${JSON.stringify(slokas, null, 2)};

// Legacy format for backward compatibility
export const legacySlokas: LegacyShloka[] = slokas.map(shloka => ({
  id: shloka.id,
  chapter: shloka.chapter,
  verse: shloka.verse,
  sanskrit: shloka.sanskrit,
  transliteration: shloka.transliteration,
  translations: {
    english: shloka.translations.english,
    wordByWord: shloka.translations.wordByWord,
    commentary: shloka.translations.commentary
  }
}));

// Statistics
export const stats = {
  totalChapters: ${chapters.length},
  totalSlokas: ${slokas.length},
  totalCommentators: ${Object.keys(AUTHOR_MAPPING).length},
  generatedAt: '${new Date().toISOString()}'
};

// Helper functions
export function getChapter(chapterNumber: number): Chapter | undefined {
  return chapters.find(ch => ch.number === chapterNumber);
}

export function getSlokasByChapter(chapterNumber: number): Shloka[] {
  return slokas.filter(shloka => shloka.chapter === chapterNumber);
}

export function getShloka(chapterNumber: number, verseNumber: number): Shloka | undefined {
  return slokas.find(shloka => 
    shloka.chapter === chapterNumber && shloka.verse === verseNumber
  );
}

export function getShlokaById(id: string): Shloka | undefined {
  return slokas.find(shloka => shloka.id === id);
}

export function searchSlokas(query: string): Shloka[] {
  const searchTerm = query.toLowerCase();
  return slokas.filter(shloka => 
    shloka.sanskrit.toLowerCase().includes(searchTerm) ||
    shloka.transliteration.toLowerCase().includes(searchTerm) ||
    shloka.translations.english.toLowerCase().includes(searchTerm) ||
    shloka.translations.hindi.toLowerCase().includes(searchTerm) ||
    shloka.translations.commentary.toLowerCase().includes(searchTerm)
  );
}

export function getRandomShloka(): Shloka {
  const randomIndex = Math.floor(Math.random() * slokas.length);
  return slokas[randomIndex];
}

export function getDailyShloka(date?: Date): Shloka {
  const today = date || new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const index = dayOfYear % slokas.length;
  return slokas[index];
}
`;
}

/**
 * Generate summary report
 */
function generateSummary(chapters, slokas) {
  const commentators = new Set();
  const chapterStats = chapters.map(ch => ({
    chapter: ch.number,
    name: ch.name,
    verses: ch.verses,
    actualSlokas: slokas.filter(s => s.chapter === ch.number).length,
  }));

  slokas.forEach(shloka => {
    shloka.commentaries.forEach(commentary => {
      commentators.add(commentary.displayName);
    });
  });

  return {
    totalChapters: chapters.length,
    totalSlokas: slokas.length,
    totalCommentators: commentators.size,
    commentators: Array.from(commentators).sort(),
    chapterStats,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Main execution function
 */
async function main() {
  try {
    console.log('🚀 Starting Bhagavad Gita dataset processing...\n');

    // Validate dataset
    validateDataset();

    // Process data
    const chapters = processChapters();
    const slokas = processSlokas();

    console.log('\n📊 Processing complete:');
    console.log(`   Chapters: ${chapters.length}`);
    console.log(`   Slokas: ${slokas.length}`);

    // Ensure output directory exists
    if (!fs.existsSync(CONFIG.OUTPUT_PATH)) {
      fs.mkdirSync(CONFIG.OUTPUT_PATH, { recursive: true });
    }

    // Generate files
    console.log('\n📝 Generating output files...');

    // Types file
    const typesContent = generateTypes();
    fs.writeFileSync(path.join(CONFIG.OUTPUT_PATH, 'types.ts'), typesContent);
    console.log('   ✓ types.ts');

    // Main data file
    const dataContent = generateDataFile(chapters, slokas);
    fs.writeFileSync(path.join(CONFIG.OUTPUT_PATH, 'gita-complete.ts'), dataContent);
    console.log('   ✓ gita-complete.ts');

    // Summary report
    const summary = generateSummary(chapters, slokas);
    fs.writeFileSync(
      path.join(CONFIG.OUTPUT_PATH, 'summary.json'),
      JSON.stringify(summary, null, 2)
    );
    console.log('   ✓ summary.json');

    console.log('\n✅ Dataset processing completed successfully!');
    console.log(`\n📋 Summary:`);
    console.log(`   📚 ${summary.totalChapters} chapters processed`);
    console.log(`   📜 ${summary.totalSlokas} slokas processed`);
    console.log(`   👥 ${summary.totalCommentators} commentators included`);
    console.log(`   📁 Files generated in: ${CONFIG.OUTPUT_PATH}`);
  } catch (error) {
    console.error('\n❌ Processing failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };
