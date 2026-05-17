const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Setting up TypeScript conversion...\n');

const dataDir = path.join(__dirname, '../assets/data');
const srcDir = path.join(__dirname, '../src/data');

// Create a TypeScript script that imports and exports the data
const tsScript = `
import { chapters, slokas } from '../src/data/gita-complete';
import * as fs from 'fs';
import * as path from 'path';

const dataDir = path.join(__dirname, '../assets/data');

// Ensure directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Save chapters
fs.writeFileSync(
  path.join(dataDir, 'chapters.json'),
  JSON.stringify(chapters, null, 2)
);
console.log('✓ Created chapters.json');

// Group shlokas by chapter
const byChapter: { [key: number]: any[] } = {};
slokas.forEach(s => {
  if (!byChapter[s.chapter]) byChapter[s.chapter] = [];
  byChapter[s.chapter].push(s);
});

// Save each chapter
Object.entries(byChapter).forEach(([chapter, data]) => {
  fs.writeFileSync(
    path.join(dataDir, \`chapter-\${chapter}.json\`),
    JSON.stringify({
      chapter: parseInt(chapter),
      shlokas: data,
      totalShlokas: data.length
    }, null, 2)
  );
  console.log(\`✓ Created chapter-\${chapter}.json (\${data.length} shlokas)\`);
});

// Create search index
const searchIndex = slokas.map(s => ({
  id: s.id,
  chapter: s.chapter,
  verse: s.verse,
  sanskrit: s.sanskrit?.substring(0, 100) || '',
  transliteration: s.transliteration?.substring(0, 150) || '',
  english: s.translations?.english?.substring(0, 200) || ''
}));

fs.writeFileSync(
  path.join(dataDir, 'search-index.json'),
  JSON.stringify(searchIndex, null, 2)
);
console.log(\`✓ Created search-index.json (\${searchIndex.length} entries)\`);

// Create stats
const stats = {
  totalChapters: Object.keys(byChapter).length,
  totalSlokas: slokas.length,
  chapters: Object.entries(byChapter).map(([num, data]) => ({
    number: parseInt(num),
    shlokas: data.length
  }))
};

fs.writeFileSync(
  path.join(dataDir, 'stats.json'),
  JSON.stringify(stats, null, 2)
);
console.log('✓ stats.json');

console.log('\\n✅ Conversion complete!');
`;

fs.writeFileSync(path.join(__dirname, 'convert-ts.ts'), tsScript);

console.log('Running TypeScript conversion...');

try {
  // Use ts-node to run the script
  execSync('npx ts-node scripts/convert-ts.ts', {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
  });
  
  // Cleanup
  fs.unlinkSync(path.join(__dirname, 'convert-ts.ts'));
  
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
  
} catch (e) {
  console.error('Conversion failed:', e.message);
  console.log('\nTrying alternative method...');
  
  // Alternative: use node directly with tsx
  try {
    execSync('npx tsx scripts/convert-ts.ts', {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    fs.unlinkSync(path.join(__dirname, 'convert-ts.ts'));
  } catch (e2) {
    console.error('Alternative also failed:', e2.message);
    console.log('\n⚠️  Please manually convert the data or install ts-node/tsx:');
    console.log('   npm install --save-dev ts-node typescript');
    console.log('   OR');
    console.log('   npm install --save-dev tsx');
    process.exit(1);
  }
}