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

  // Background and borders for main boxes
  content = content.replace(/bg-white dark:bg-gray-900/g, 'bg-themeWhite dark:bg-themeBlack');
  content = content.replace(/border-gray-200 dark:border-gray-800/g, 'border-themeBlack dark:border-themeWhite');
  
  // Specific container replacements to ensure 2px borders and brutalist shadows
  content = content.replace(/rounded-xl shadow-sm border border-themeBlack/g, 'border-2 border-themeBlack shadow-brutal dark:shadow-brutal-sm');
  content = content.replace(/border border-themeBlack/g, 'border-2 border-themeBlack');
  content = content.replace(/rounded-lg border-2 border-themeBlack/g, 'border-2 border-themeBlack shadow-brutal dark:shadow-brutal-sm');
  content = content.replace(/rounded-2xl shadow-sm border-2 border-themeBlack/g, 'border-2 border-themeBlack shadow-brutal dark:shadow-brutal-sm');
  
  // Remove rounded from components with shadow-brutal
  content = content.replace(/rounded-xl /g, '');
  content = content.replace(/rounded-lg /g, '');
  content = content.replace(/rounded-2xl /g, '');

  // Text colors
  content = content.replace(/text-gray-900 dark:text-gray-100/g, 'text-themeBlack dark:text-themeWhite');
  content = content.replace(/text-gray-800 dark:text-gray-100/g, 'text-themeBlack dark:text-themeWhite');
  content = content.replace(/text-gray-700 dark:text-gray-300/g, 'text-themeBlack dark:text-themeWhite');
  content = content.replace(/text-gray-600 dark:text-gray-300/g, 'text-themeBlack\/70 dark:text-themeWhite\/70');
  content = content.replace(/text-gray-500 dark:text-gray-400/g, 'text-themeBlack\/60 dark:text-themeWhite\/60');
  
  // Accent colors
  content = content.replace(/text-blue-600 dark:text-blue-400/g, 'text-accentBlue');
  content = content.replace(/bg-blue-600 hover:bg-blue-700/g, 'bg-accentBlue border-2 border-transparent hover:border-themeBlack dark:hover:border-themeWhite transition-all');
  content = content.replace(/bg-blue-600/g, 'bg-accentBlue');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated:', file);
  }
});
