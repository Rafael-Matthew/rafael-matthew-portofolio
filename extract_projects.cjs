const fs = require('fs');
const path = require('path');

const githubDir = path.resolve(__dirname, '../');
const directories = fs.readdirSync(githubDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && dirent.name !== 'rafael-matthew-portofolio' && !dirent.name.startsWith('.'))
  .map(dirent => dirent.name);

// Let's create an array of project objects
let projects = [];

directories.forEach(dir => {
  if (['TrySolid', 'CueSight', 'ai-in-games', 'rafael-matthew-portofolio'].includes(dir)) return; // Already in DB / handled elsewhere
  
  const fullPath = path.join(githubDir, dir);
  let techStack = [];
  let type = 'College Project';
  if (dir.includes('garapan-joki') || dir.includes('ecommerce') || dir.includes('autospector')) {
    type = 'Freelance Project';
  } else if (dir.includes('metalMayhem') || dir.includes('GuidedByTheLight')) {
    type = 'Game Development';
  }

  // Detect tech stack
  if (fs.existsSync(path.join(fullPath, 'package.json'))) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(fullPath, 'package.json'), 'utf8'));
      if (pkg.dependencies) {
        if (pkg.dependencies.react) techStack.push('React');
        if (pkg.dependencies.next) techStack.push('Next.js');
        if (pkg.dependencies.express) techStack.push('Express');
        if (pkg.dependencies.mongoose) techStack.push('MongoDB');
        if (pkg.dependencies['react-dom']) techStack.push('React');
      }
      if (pkg.devDependencies && pkg.devDependencies.typescript) techStack.push('TypeScript');
      else techStack.push('JavaScript');
    } catch (e) {
      techStack.push('JavaScript');
    }
  }
  
  if (fs.existsSync(path.join(fullPath, 'pom.xml'))) techStack.push('Java', 'Spring Boot');
  if (fs.existsSync(path.join(fullPath, 'composer.json'))) techStack.push('PHP', 'Laravel');
  if (fs.existsSync(path.join(fullPath, 'build.gradle'))) techStack.push('Java/Kotlin', 'Android');
  if (fs.existsSync(path.join(fullPath, 'Assets'))) techStack.push('C#', 'Unity');
  
  if (techStack.length === 0) techStack = ['Software Engineering']; // fallback
  
  // Deduplicate techstack
  techStack = [...new Set(techStack)];

  // Clean name
  let name = dir.replace(/-/g, ' ').replace(/_/g, ' ');
  name = name.replace(/\b\w/g, l => l.toUpperCase()); // Title Case

  projects.push({
    id: dir.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name: name,
    status: 'Completed',
    type: type,
    techStack: techStack,
    impact: `Successfully developed and deployed ${name}.`,
    problem: `Required a solution for ${name.toLowerCase()}.`,
    solution: `Developed a ${techStack.join(', ')} application to address the requirements.`,
    role: 'Full-Stack Developer',
    keyFeatures: [
      'Core business logic implementation',
      'User-friendly interface design',
      'Data persistence and state management'
    ],
    demoUrl: '#',
    githubUrl: `https://github.com/Rafael-Matthew/${dir}`,
    focus: ['Developer', 'Lecturer']
  });
});

fs.writeFileSync('extracted_projects.json', JSON.stringify(projects, null, 2));
console.log('Extracted ' + projects.length + ' new projects.');
