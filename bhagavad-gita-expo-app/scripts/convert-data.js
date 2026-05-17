const fs = require('fs');
const path = require('path');

console.log('Converting gita-complete.ts to JSON files...\n');

const dataDir = path.join(__dirname, '../assets/data');
const srcDir = path.join(__dirname, '../src/data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Read the TypeScript file
const content = fs.readFileSync(path.join(srcDir, 'gita-complete.ts'), 'utf-8');

// Extract chapters array (lines 8-280 approximately)
console.log('Processing chapters...');
const chaptersMatch = content.match(/export const chapters: Chapter\[\] = ([\s\S]*?);\s*\n\nexport const slokas/);

if (chaptersMatch) {
  try {
    // Convert TypeScript object syntax to JSON-compatible format
    let chaptersStr = chaptersMatch[1]
      .replace(/'/g, '"')
      .replace(/(\w+):/g, '"$1":')
      .replace(/,\s*([}\]])/g, '$1')
      .replace(/\n/g, ' ')
      .replace(/\r/g, '');
    
    const chapters = JSON.parse(chaptersStr);
    
    // Create chapters.json (metadata only - small file)
    const chapterMetadata = chapters.map(c => ({
      number: c.number,
      name: c.name,
      translation: c.translation,
      transliteration: c.transliteration,
      verses: c.verses,
      meaning: c.meaning,
      summary: c.summary
    }));
    
    fs.writeFileSync(
      path.join(dataDir, 'chapters.json'),
      JSON.stringify(chapterMetadata, null, 2)
    );
    console.log(`✓ Created chapters.json (${chapters.length} chapters)`);
    
  } catch (e) {
    console.error('Error parsing chapters:', e.message);
    console.log('Attempting alternative extraction...');
  }
}

// For shlokas, we need a different approach since the file is huge
// Let's extract them using line-by-line processing
console.log('\nProcessing shlokas... (this will take a moment)');

const lines = content.split('\n');
let inSlokas = false;
let braceDepth = 0;
let currentShloka = [];
let shlokas = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('export const slokas: Shloka[] = [')) {
    inSlokas = true;
    continue;
  }
  
  if (line.includes('export const legacySlokas:')) {
    break;
  }
  
  if (inSlokas) {
    // Track object depth
    braceDepth += (line.match(/\{/g) || []).length;
    braceDepth -= (line.match(/\}/g) || []).length;
    
    currentShloka.push(line);
    
    // When we close a shloka object (braceDepth returns to 1)
    if (line.trim() === '},' && braceDepth === 1) {
      // Parse this shloka
      try {
        const shlokaText = currentShloka.join('\n')
          .replace(/,$/, '')
          .replace(/'/g, '"')
          .replace(/(\w+):/g, '"$1":');
        
        const shloka = JSON.parse('{' + shlokaText + '}');
        shlokas.push(shloka);
      } catch (e) {
        // Skip malformed entries
      }
      currentShloka = [];
    }
  }
}

console.log(`✓ Parsed ${shlokas.length} shlokas`);

// Group by chapter
const shlokasByChapter = {};
shlokas.forEach(s => {
  if (!shlokasByChapter[s.chapter]) {
    shlokasByChapter[s.chapter] = [];
  }
  shlokasByChapter[s.chapter].push(s);
});

// Write chapter files
console.log('\nWriting chapter files:');
Object.entries(shlokasByChapter).forEach(([chapter, data]) => {
  const filename = path.join(dataDir, `chapter-${chapter}.json`);
  fs.writeFileSync(filename, JSON.stringify({
    chapter: parseInt(chapter),
    shlokas: data,
    totalShlokas: data.length
  }, null, 2));
  console.log(`  ✓ chapter-${chapter}.json (${data.length} shlokas)`);
});

// Create search index (lightweight)
console.log('\nCreating search index...');
const searchIndex = shlokas.map(s => ({
  id: s.id,
  chapter: s.chapter,
  verse: s.verse,
  sanskrit: s.sanskrit?.substring(0, 100) || '', // Truncate for size
  transliteration: s.transliteration?.substring(0, 150) || '',
  english: s.translations?.english?.substring(0, 200) || ''
}));

fs.writeFileSync(
  path.join(dataDir, 'search-index.json'),
  JSON.stringify(searchIndex, null, 2)
);
console.log(`✓ search-index.json (${searchIndex.length} entries)`);

// Create stats
const stats = {
  totalChapters: Object.keys(shlokasByChapter).length,
  totalSlokas: shlokas.length,
  chapters: Object.entries(shlokasByChapter).map(([num, data]) => ({
    number: parseInt(num),
    shlokas: data.length
  }))
};

fs.writeFileSync(
  path.join(dataDir, 'stats.json'),
  JSON.stringify(stats, null, 2)
);
console.log('✓ stats.json');

// Show file sizes
console.log('\n📁 File sizes:');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
let totalSize = 0;
files.forEach(file => {
  const size = fs.statSync(path.join(dataDir, file)).size;
  totalSize += size;
  console.log(`  ${file}: ${(size / 1024).toFixed(2)} KB`);
});

console.log(`\n📊 Total data size: ${(totalSize / 1024).toFixed(2)} KB`);
console.log(`📦 Original TS file: ${(fs.statSync(path.join(srcDir, 'gita-complete.ts')).size / 1024).toFixed(2)} KB`);
console.log(`💾 Reduction: ${((1 - totalSize / fs.statSync(path.join(srcDir, 'gita-complete.ts')).size) * 100).toFixed(1)}%`);
console.log('\n✅ Conversion complete!');
