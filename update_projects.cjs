const fs = require('fs');
const path = require('path');

const projectsData = JSON.parse(fs.readFileSync('extracted_projects.json', 'utf8'));

// Filter out duplicates
const toAdd = projectsData.filter(p => !['dawnbase', 'autospector', 'ecommerce-yk'].includes(p.id));

// 1. Update projects.ts
const tsFilePath = path.join(__dirname, 'src/data/projects.ts');
let tsContent = fs.readFileSync(tsFilePath, 'utf8');

let tsObjectsStr = toAdd.map(p => {
  return `  {
    id: '${p.id}',
    name: '${p.name}',
    status: '${p.status}',
    type: '${p.type}',
    techStack: ${JSON.stringify(p.techStack)},
    impact: '${p.impact}',
    problem: '${p.problem}',
    solution: '${p.solution}',
    role: '${p.role}',
    keyFeatures: ${JSON.stringify(p.keyFeatures)},
    demoUrl: '#',
    githubUrl: '${p.githubUrl}',
    focus: ${JSON.stringify(p.focus)},
  }`;
}).join(',\n');

// Insert right before the last ];
tsContent = tsContent.replace(/];\s*$/, ',\n' + tsObjectsStr + '\n];\n');
fs.writeFileSync(tsFilePath, tsContent);


// 2. Update init.sql
const sqlFilePath = path.join(__dirname, 'supabase/init.sql');
let sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

let sqlValuesStr = toAdd.map(p => {
  return `(
    '${p.name}',
    '${p.id}',
    '${p.type}',
    '${p.role}',
    '2024',
    '${p.problem} ${p.impact} ${p.solution}',
    '${JSON.stringify(p.keyFeatures)}',
    '${JSON.stringify(p.techStack)}',
    'published',
    '${p.githubUrl}'
)`;
}).join(',\n');

// Find the last insert in projects and append these
// The last insert currently ends with: 'https://github.com/Rafael-Matthew/ai-in-games'\n);
sqlContent = sqlContent.replace(
  /'https:\/\/github\.com\/Rafael-Matthew\/ai-in-games'\n\);/,
  `'https://github.com/Rafael-Matthew/ai-in-games'\n),\n${sqlValuesStr};`
);

fs.writeFileSync(sqlFilePath, sqlContent);

console.log('Successfully updated projects.ts and init.sql with ' + toAdd.length + ' projects.');
