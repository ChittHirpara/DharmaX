const fs = require('fs');
const path = require('path');

const replacements = {
  'bg-dharma-parchment-2': 'bg-dharma-ink-2',
  'bg-dharma-parchment': 'bg-dharma-ink',
  'text-dharma-parchment': 'text-dharma-ink',
  'text-dharma-earth-dim': 'text-dharma-ivory-dim',
  'text-dharma-earth': 'text-dharma-ivory',
  'bg-dharma-earth': 'bg-dharma-ivory',
  'border-dharma-earth': 'border-dharma-ivory',
  'border-dharma-line-light': 'border-dharma-line-dark',
  'from-dharma-parchment': 'from-dharma-ink',
  'to-dharma-parchment': 'to-dharma-ink',
  'via-dharma-parchment': 'via-dharma-ink',
  'fill-dharma-parchment': 'fill-dharma-ink',
  'fill-dharma-earth': 'fill-dharma-ivory',
  'stroke-dharma-earth': 'stroke-dharma-ivory'
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  
  // Sort keys by length descending to prevent partial matches replacing before full matches
  const keys = Object.keys(replacements).sort((a, b) => b.length - a.length);
  
  keys.forEach(key => {
    const regex = new RegExp(key, 'g');
    newContent = newContent.replace(regex, replacements[key]);
  });
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated', file);
  }
});
