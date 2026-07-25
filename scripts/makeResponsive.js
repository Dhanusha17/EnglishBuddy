/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../src');

function findAndReplaceInFiles(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      findAndReplaceInFiles(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // 1. Fix grid-cols-2 to 6
      const gridRegex = /(?<![a-z0-9:-])grid-cols-([2-6])(?![a-z0-9-])/g;
      
      content = content.replace(gridRegex, (match, p1) => {
        changed = true;
        const cols = parseInt(p1, 10);
        if (cols === 2) return 'grid-cols-1 md:grid-cols-2';
        if (cols === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
        if (cols === 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
        if (cols === 5) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';
        if (cols === 6) return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6';
        return match;
      });
      
      // 2. Fix w-1/2 or w-1/3 that might not be responsive in flex layouts
      // This is risky, skipping for now to avoid breaking desktop layouts that use flex.
      
      // 3. Ensure ResponsiveContainer for Recharts (if any imported but not used)
      // If file contains 'recharts' but no 'ResponsiveContainer', we might have an issue.
      // But typically it's already used or we need manual fixing.

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated grids in: ${fullPath}`);
      }
    }
  }
}

console.log('Starting automated responsive refactoring...');
findAndReplaceInFiles(directoryPath);
console.log('Done.');
