#!/usr/bin/env node

/**
 * Bhagavad Gita Dataset Integration Script
 *
 * This script processes the JSON dataset and converts it into the format
 * expected by the React Native app.
 */

const fs = require('fs');
const path = require('path');

// Paths
const DATASET_PATH = '../bhagavad-gita-dataset';
const OUTPUT_PATH = './src/data';
const CHAPTER_PATH = path.join(DATASET_PATH, 'chapter');
const SLOK_PATH = path.join(DATASET_PATH, 'slok');

// Author mapping for cleaner display names
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

/**
 * Load and process chapter data
 */
function processChapters() {
  console.log('Processing chapters...');
  const chapters = [];

  for (let i = 1; i <= 18; i++) {
    const chapterFile = path.join(CHAPTER_PATH, `bhagavadgita_chapter_${i}.json`);

    if (fs.existsSync(chapterFile)) {
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
    }
  }

  console.log(`Processed ${chapters.length} chapters`);
  return chapters;
}

/**
 * Load and process sloka data
 */
function processSlokas() {
  console.log('Processing slokas...');
  const slokas = [];

  // Read all sloka files
  const slokFiles = fs
    .readdirSync(SLOK_PATH)
    .filter(file => file.endsWith('.json'))
    .sort((a, b) => {
      // Sort by chapter and verse number
      const aMatch = a.match(/chapter_(\d+)_slok_(\d+)/);
      const bMatch = b.match(/chapter_(\d+)_slok_(\d+)/);

      if (aMatch && bMatch) {
        const aChapter = parseInt(aMatch[1]);
        const bChapter = parseInt(bMatch[1]);
        const aVerse = parseInt(aMatch[2]);
        const bVerse = parseInt(bMatch[2]);

        if (aChapter !== bChapter) {
          return aChapter - bChapter;
        }
        return aVerse - bVerse;
      }
      return 0;
    });

  for (const file of slokFiles) {
    const slokPath = path.join(SLOK_PATH, file);
    const slokData = JSON.parse(fs.readFileSync(slokPath, 'utf8'));

    // Extract primary translations
    const primaryTranslations = extractPrimaryTranslations(slokData);

    // Extract all commentaries
    const commentaries = extractCommentaries(slokData);

    const shloka = {
      id: slokData._id,
      chapter: slokData.chapter,
      verse: slokData.verse,
      sanskrit: slokData.slok,
      transliteration: slokData.transliteration,
      translations: primaryTranslations,
      commentaries: commentaries,
    };

    slokas.push(shloka);
  }

  console.log(`Processed ${slokas.length} slokas`);
  return slokas;
}

/**
 * Extract primary translations for the main interface
 */
function extractPrimaryTranslations(slokData) {
  const translations = {
    english: '',
    wordByWord: '',
    commentary: '',
  };

  // Priority order for English translations
  const englishPriority = ['prabhu', 'siva', 'gambir', 'adi'];
  const hindiPriority = ['tej', 'rams'];

  // Get best English translation
  for (const author of englishPriority) {
    if (slokData[author]?.et) {
      translations.english = slokData[author].et;
      break;
    }
  }

  // Get word-by-word meaning (usually from Prabhupada or Sivananda)
  if (slokData.prabhu?.ec) {
    translations.wordByWord = slokData.prabhu.ec;
  } else if (slokData.siva?.ec) {
    translations.wordByWord = slokData.siva.ec;
  }

  // Get primary commentary
  if (slokData.prabhu?.ec) {
    translations.commentary = slokData.prabhu.ec;
  } else if (slokData.chinmay?.hc) {
    translations.commentary = slokData.chinmay.hc;
  } else if (slokData.siva?.ec) {
    translations.commentary = slokData.siva.ec;
  }

  return translations;
}

/**
 * Extract all available commentaries
 */
function extractCommentaries(slokData) {
  const commentaries = [];

  Object.keys(slokData).forEach(key => {
    if (
      key === '_id' ||
      key === 'chapter' ||
      key === 'verse' ||
      key === 'slok' ||
      key === 'transliteration'
    ) {
      return;
    }

    const authorData = slokData[key];
    if (typeof authorData === 'object' && authorData.author) {
      const commentary = {
        author: authorData.author,
        authorKey: key,
        displayName: AUTHOR_MAPPING[key] || authorData.author,
        translations: {},
      };

      // Add available translations
      if (authorData.et) commentary.translations.english = authorData.et;
      if (authorData.ht) commentary.translations.hindi = authorData.ht;
      if (authorData.ec) commentary.translations.englishCommentary = authorData.ec;
      if (authorData.hc) commentary.translations.hindiCommentary = authorData.hc;
      if (authorData.sc) commentary.translations.sanskritCommentary = authorData.sc;

      commentaries.push(commentary);
    }
  });

  return commentaries;
}

/**
 * Generate TypeScript interfaces
 */
function generateTypeScript(chapters, slokas) {
  const tsContent = `// Auto-generated from Bhagavad Gita dataset
// Do not edit manually

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

export interface Translation {
  english: string;
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
  author: string;
  authorKey: string;
  displayName: string;
  translations: CommentaryTranslations;
}

export interface Shloka {
  id: string;
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  translations: Translation;
  commentaries: Commentary[];
}

// Chapter data
export const chapters: Chapter[] = ${JSON.stringify(chapters, null, 2)};

// Total slokas count: ${slokas.length}
export const totalSlokas = ${slokas.length};

// Slokas by chapter
export const slokasData: Shloka[] = ${JSON.stringify(slokas, null, 2)};

// Helper functions
export function getChapter(chapterNumber: number): Chapter | undefined {
  return chapters.find(ch => ch.number === chapterNumber);
}

export function getSlokasByChapter(chapterNumber: number): Shloka[] {
  return slokasData.filter(shloka => shloka.chapter === chapterNumber);
}

export function getShloka(chapterNumber: number, verseNumber: number): Shloka | undefined {
  return slokasData.find(shloka => 
    shloka.chapter === chapterNumber && shloka.verse === verseNumber
  );
}

export function getShlokaById(id: string): Shloka | undefined {
  return slokasData.find(shloka => shloka.id === id);
}

export function searchSlokas(query: string): Shloka[] {
  const searchTerm = query.toLowerCase();
  return slokasData.filter(shloka => 
    shloka.sanskrit.toLowerCase().includes(searchTerm) ||
    shloka.transliteration.toLowerCase().includes(searchTerm) ||
    shloka.translations.english.toLowerCase().includes(searchTerm) ||
    shloka.translations.commentary.toLowerCase().includes(searchTerm)
  );
}

export function getRandomShloka(): Shloka {
  const randomIndex = Math.floor(Math.random() * slokasData.length);
  return slokasData[randomIndex];
}
`;

  return tsContent;
}

/**
 * Main execution
 */
function main() {
  try {
    console.log('Starting Bhagavad Gita dataset integration...');

    // Check if dataset exists
    if (!fs.existsSync(DATASET_PATH)) {
      console.error(`Dataset not found at: ${DATASET_PATH}`);
      console.error('Please ensure the bhagavad-gita-dataset folder is in the correct location.');
      process.exit(1);
    }

    // Process data
    const chapters = processChapters();
    const slokas = processSlokas();

    // Generate TypeScript file
    const tsContent = generateTypeScript(chapters, slokas);

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_PATH)) {
      fs.mkdirSync(OUTPUT_PATH, { recursive: true });
    }

    // Write the generated file
    const outputFile = path.join(OUTPUT_PATH, 'gita-complete.ts');
    fs.writeFileSync(outputFile, tsContent);

    console.log(`\n✅ Integration complete!`);
    console.log(`📊 Statistics:`);
    console.log(`   - Chapters: ${chapters.length}`);
    console.log(`   - Slokas: ${slokas.length}`);
    console.log(`   - Output: ${outputFile}`);

    // Generate summary
    const summary = {
      totalChapters: chapters.length,
      totalSlokas: slokas.length,
      slokasPerChapter: chapters.map(ch => ({
        chapter: ch.number,
        name: ch.name,
        verses: ch.verses,
      })),
      availableCommentators: [
        ...new Set(slokas.flatMap(s => s.commentaries.map(c => c.displayName))),
      ].sort(),
      generatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(
      path.join(OUTPUT_PATH, 'integration-summary.json'),
      JSON.stringify(summary, null, 2)
    );

    console.log(`📋 Summary saved to: ${path.join(OUTPUT_PATH, 'integration-summary.json')}`);
  } catch (error) {
    console.error('❌ Integration failed:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main, processChapters, processSlokas };
