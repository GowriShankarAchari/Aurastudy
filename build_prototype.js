const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\gowri\\.gemini\\antigravity-ide\\scratch\\aurastudy-app';
const htmlSrc = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const cssSrc = fs.readFileSync(path.join(dir, 'style.css'), 'utf8');
const jsSrc = fs.readFileSync(path.join(dir, 'app.js'), 'utf8');

// Replace link to stylesheet with inline <style>
let combined = htmlSrc.replace(
  '<link rel="stylesheet" href="style.css">',
  `<style>\n${cssSrc}\n</style>`
);

// Replace script src with inline <script>
combined = combined.replace(
  '<script src="app.js"></script>',
  `<script>\n${jsSrc}\n</script>`
);

fs.writeFileSync(path.join(dir, 'prototype.html'), combined, 'utf8');
console.log('Successfully created standalone prototype.html! Size:', combined.length, 'bytes');
