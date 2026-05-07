const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Re-soften borders and bring back rounded corners for premium aesthetic
  // Note: we had previously done `border-2 border-themeBlack dark:border-themeWhite p-4 shadow-brutal`
  content = content.replace(/border-2 border-themeBlack dark:border-themeWhite/g, 'border border-gray-200 dark:border-gray-800 rounded-2xl');
  content = content.replace(/border-2 border-themeBlack/g, 'border border-gray-200 dark:border-gray-800 rounded-2xl');
  content = content.replace(/border-themeBlack dark:border-themeWhite/g, 'border-gray-200 dark:border-gray-800');

  // We have double rounded-2xl now if some files already had it, or we have none.
  content = content.replace(/rounded-2xl rounded-2xl/g, 'rounded-2xl');

  // Replace brutal shadows with premium soft shadows
  content = content.replace(/shadow-brutal dark:shadow-brutal-sm/g, 'shadow-premium dark:shadow-none');
  content = content.replace(/shadow-brutal/g, 'shadow-premium');

  // Text tracking/uppercase softening
  content = content.replace(/font-black/g, 'font-bold');
  content = content.replace(/uppercase tracking-tight/g, 'tracking-tight');
  content = content.replace(/tracking-widest uppercase/g, 'uppercase tracking-wider text-xs');
  content = content.replace(/text-4xl font-bold text-themeBlack/g, 'text-4xl font-extrabold text-themeBlack'); // Let's keep metrics popping

  // Colors inside specific elements like MetricCard or IconButton
  // Hover effects from `hover:bg-themeBlack hover:text-themeWhite` -> `hover:bg-gray-50`
  content = content.replace(/hover:bg-themeBlack hover:text-themeWhite dark:hover:bg-themeWhite dark:hover:text-themeBlack/g, 'hover:bg-themeBg dark:hover:bg-gray-800');

  // Table header background
  content = content.replace(/bg-themeBlack dark:bg-themeWhite text-themeWhite dark:text-themeBlack/g, 'bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated:', file);
  }
});
