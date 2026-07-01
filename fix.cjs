const fs = require('fs');
let data = fs.readFileSync('src/data/projects.ts', 'utf8');
data = data.replace(/category: '([^']+)',\r?\n\s+type: '[^']+',/g, "type: '$1',");
fs.writeFileSync('src/data/projects.ts', data);
console.log('Fixed projects.ts');
