const fs = require('fs');
const path = require('path');

const { projects } = require('./temp_out/projects.cjs');

const sqlFilePath = path.join(__dirname, 'supabase/init.sql');
let sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

// Replace the projects insert
// Look for `INSERT INTO public.projects (...) VALUES \n(` up to `);` before `-- Skills`

const escapeSql = (str) => str ? str.replace(/'/g, "''") : '';

let sqlValuesStr = projects.map(p => {
  return `(
    '${escapeSql(p.name)}',
    '${escapeSql(p.id)}',
    '${escapeSql(p.type)}',
    '${escapeSql(p.role)}',
    '2024',
    '${escapeSql(p.description || '')}',
    '${escapeSql(p.problem || '')}',
    '${escapeSql(p.impact || '')}',
    '${escapeSql(p.solution || '')}',
    '${escapeSql(JSON.stringify(p.focus || []))}',
    '${escapeSql(JSON.stringify(p.keyFeatures || []))}',
    '${escapeSql(JSON.stringify(p.techStack || []))}',
    '${escapeSql(p.status || 'published')}',
    ${p.githubUrl && p.githubUrl !== '#' ? `'${escapeSql(p.githubUrl)}'` : 'NULL'}
)`;
}).join(',\n');

const insertStmt = `INSERT INTO public.projects (title, slug, category, role, period, description, problem, impact, solution, focus, features, tech_stack, status, github_url)
VALUES 
${sqlValuesStr};`;

// Regex to replace the whole projects insert block
const blockRegex = /INSERT INTO public\.projects \([^)]+\)\s*VALUES\s*[\s\S]*?(?=;\s*-- Skills);/i;
sqlContent = sqlContent.replace(blockRegex, insertStmt);

fs.writeFileSync(sqlFilePath, sqlContent);
console.log('Successfully updated init.sql from projects.js');
