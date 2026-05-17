const fs = require('fs');
const path = require('path');

// Read the gita-complete.ts file
const gitaCompletePath = path.join(__dirname, '../src/data/gita-complete.ts');
const lines = fs.readFileSync(gitaCompletePath, 'utf-8').split('\n');

// Create output directory
const outputDir = path.join(__dirname, '../assets/data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Extract chapters (lines 8-280)
console.log('Extracting chapters...');
const chaptersLines = lines.slice(7, 280); // 0-indexed, so line 8 is index 7
const chaptersContent = chaptersLines.join('\n');

// Try to parse as JSON by converting TypeScript to JSON
const chaptersJsonStr = chaptersContent
  .replace(/'/g, '"')
  .replace(/(\w+):/g, '"$1":')
  .replace(/,\s*([}\]])/g, '$1'); // Remove trailing commas

try {
  const chapters = JSON.parse(chaptersJsonStr);
  console.log(`Found ${chapters.length} chapters`);
  
  // Create chapter metadata
  const chapterMetadata = chapters.map(chapter => ({
    number: chapter.number,
    name: chapter.name,
    translation: chapter.translation,
    transliteration: chapter.transliteration,
    verses: chapter.verses,
    meaning: chapter.meaning,
    summary: {
      en: chapter.summary?.en?.substring(0, 200) + '...' || '',
      hi: chapter.summary?.hi?.substring(0, 200) + '...' || '',
    },
  }));
  
  fs.writeFileSync(
    path.join(outputDir, 'chapters.json'),
    JSON.stringify(chapterMetadata, null, 2)
  );
  console.log('✓ Created chapters.json');
  
  // Create stats
  const stats = {
    totalChapters: chapters.length,
    chapters: chapters.map(c => ({
      number: c.number,
      name: c.name,
      verses: c.verses,
    })),
  };
  
  fs.writeFileSync(
    path.join(outputDir, 'stats.json'),
    JSON.stringify(stats, null, 2)
  );
  console.log('✓ Created stats.json');
  
} catch (e) {
  console.error('Error parsing chapters:', e.message);
  console.log('First 500 chars:', chaptersContent.substring(0, 500));
}

// Now we need to split the shlokas - this is the heavy part
// The shlokas array starts at line 281 and goes to 165470
console.log('\nProcessing shlokas...');
console.log('This may take a moment due to the large file size...');

// Since parsing is complex, let's copy the data file as-is to assets
// and create a service that loads it dynamically
const sourcePath = path.join(__dirname, '../src/data/gita-complete.ts');
const destPath = path.join(outputDir, 'gita-complete.json');

// Read the file and extract just the slokas array as a JSON file
const allLines = fs.readFileSync(sourcePath, 'utf-8').split('\n');

// Find slokas array start and end
let slokasStart = -1;
let slokasEnd = -1;
for (let i = 0; i < allLines.length; i++) {
  if (allLines[i].includes('export const slokas: Shloka[] = [')) {
    slokasStart = i;
  }
  if (slokasStart !== -1 && allLines[i].trim() === '];' && slokasEnd === -1) {
    // Check if this is the slokas array end (before legacySlokas)
    const nextFewLines = allLines.slice(i, i + 5).join('');
    if (nextFewLines.includes('legacySlokas')) {
      slokasEnd = i;
      break;
    }
  }
}

console.log(`Slokas array: lines ${slokasStart}-${slokasEnd}`);

// For now, let's create individual chapter JSON files by processing the file
// This is a simplified approach - we'll extract shlokas by chapter

const slokasLines = allLines.slice(slokasStart, slokasEnd + 1);
console.log(`Processing ${slokasLines.length} lines of shlokas...`);

// Group shlokas by chapter number
const shlokasByChapter = {};
let currentShlokaText = [];
let currentChapter = null;
let braceDepth = 0;

for (let i = 1; i < slokasLines.length - 1; i++) { // Skip first and last lines
  const line = slokasLines[i];
  const trimmed = line.trim();
  
  // Track brace depth
  braceDepth += (line.match(/\{/g) || []).length;
  braceDepth -= (line.match(/\}/g) || []).length;
  
  // Detect chapter number
  if (trimmed.startsWith('chapter:')) {
    const match = trimmed.match(/chapter:\s*(\d+)/);
    if (match) {
      currentChapter = parseInt(match[1]);
      if (!shlokasByChapter[currentChapter]) {
        shlokasByChapter[currentChapter] = [];
      }
    }
  }
  
  currentShlokaText.push(line);
  
  // Check if this is the end of a shloka object
  if (trimmed === '},' && braceDepth === 1) {
    // Try to parse the shloka
    const shlokaText = currentShlokaText.join('\n');
    try {
      // Convert to valid JSON
      const jsonStr = shlokaText
        .replace(/,$/, '') // Remove trailing comma
        .replace(/'/g, '"')
        .replace(/(\w+):/g, '"$1":');
      
      const shloka = JSON.parse('{' + jsonStr + '}');
      if (currentChapter && shlokasByChapter[currentChapter]) {
        shlokasByChapter[currentChapter].push(shloka);
      }
    } catch (e) {
      // If parsing fails, store raw text for manual inspection
      // console.warn(`Failed to parse shloka in chapter ${currentChapter}: ${e.message}`);
    }
    currentShlokaText = [];
  }
}

console.log(`Found shlokas in ${Object.keys(shlokasByChapter).length} chapters`);

// Create individual chapter files
Object.entries(shlokasByChapter).forEach(([chapterNum, shlokas]) => {
  const chapterData = {
    chapter: parseInt(chapterNum),
    shlokas: shlokas,
    totalShlokas: shlokas.length,
  };
  
  fs.writeFileSync(
    path.join(outputDir, `chapter-${chapterNum}.json`),
    JSON.stringify(chapterData, null, 2)
  );
  console.log(`✓ Created chapter-${chapterNum}.json (${shlokas.length} shlokas)`);
});

// Create search index (lightweight)
const searchIndex = [];
Object.values(shlokasByChapter).forEach(shlokas => {
  shlokas.forEach(shloka => {
    searchIndex.push({
      id: shloka.id,
      chapter: shloka.chapter,
      verse: shloka.verse,
      sanskrit: shloka.sanskrit,
      transliteration: shloka.transliteration,
      english: shloka.translations?.english || '',
    });
  });
});

fs.writeFileSync(
  path.join(outputDir, 'search-index.json'),
  JSON.stringify(searchIndex, null, 2)
);
console.log(`✓ Created search-index.json (${searchIndex.length} entries)`);

// Calculate sizes
console.log('\nFile sizes:');
const getFileSize = (filename) => {
  try {
    const stats = fs.statSync(path.join(outputDir, filename));
    return (stats.size / 1024).toFixed(2);
  } catch {
    return '0';
  }
};

console.log(`chapters.json: ${getFileSize('chapters.json')} KB`);
console.log(`search-index.json: ${getFileSize('search-index.json')} KB`);
console.log(`stats.json: ${getFileSize('stats.json')} KB`);
Object.keys(shlokasByChapter).forEach(chapterNum => {
  console.log(`chapter-${chapterNum}.json: ${getFileSize(`chapter-${chapterNum}.json`)} KB`);
});

const totalSize = fs.readdirSync(outputDir)
  .filter(f => f.endsWith('.json'))
  .reduce((acc, f) => acc + fs.statSync(path.join(outputDir, f)).size, 0);
console.log(`\nTotal: ${(totalSize / 1024).toFixed(2)} KB`);
console.log(`\nOriginal gita-complete.ts: ${(fs.statSync(gitaCompletePath).size / 1024).toFixed(2)} KB`);
