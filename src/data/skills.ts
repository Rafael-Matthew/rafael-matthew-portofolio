export type SkillCategory = 'Software Core' | 'Cloud Layer' | 'AI Layer' | 'Data Layer';

export type Skill = {
  name: string;
  category: SkillCategory;
  description: string;
  icon?: string;
};

export const skills: Skill[] = [
  // Software Core
  { name: 'TypeScript', category: 'Software Core', description: 'Strongly typed JavaScript for scalable applications.' },
  { name: 'JavaScript', category: 'Software Core', description: 'Core language for dynamic web functionality.' },
  { name: 'Astro', category: 'Software Core', description: 'Web framework for building fast, content-focused websites.' },
  { name: 'React', category: 'Software Core', description: 'UI library for interactive component-based interfaces.' },
  { name: 'SolidJS', category: 'Software Core', description: 'Declarative, efficient and flexible JavaScript library for building user interfaces.' },
  { name: 'Node.js', category: 'Software Core', description: 'JavaScript runtime for backend services.' },

  // Cloud Layer
  { name: 'Supabase', category: 'Cloud Layer', description: 'Open source Firebase alternative with Postgres.' },
  { name: 'Firebase', category: 'Cloud Layer', description: 'App development platform by Google.' },
  { name: 'Google Cloud', category: 'Cloud Layer', description: 'Suite of cloud computing services.' },
  { name: 'Vercel', category: 'Cloud Layer', description: 'Platform for frontend frameworks and static sites.' },
  { name: 'Serverless Deployment', category: 'Cloud Layer', description: 'Deploying applications without managing infrastructure.' },

  // AI Layer
  { name: 'Prompt Engineering', category: 'AI Layer', description: 'Designing effective prompts for LLMs.' },
  { name: 'LLM Integration', category: 'AI Layer', description: 'Connecting applications with Large Language Models.' },
  { name: 'AI Workflow', category: 'AI Layer', description: 'Automating processes with AI agents.' },
  { name: 'Computer Vision Basics', category: 'AI Layer', description: 'Image processing and analysis techniques.' },
  { name: 'Automation', category: 'AI Layer', description: 'Streamlining repetitive tasks via scripting.' },

  // Data Layer
  { name: 'PostgreSQL', category: 'Data Layer', description: 'Advanced open source relational database.' },
  { name: 'MongoDB', category: 'Data Layer', description: 'NoSQL document database for flexible data modeling.' },
  { name: 'API Design', category: 'Data Layer', description: 'Creating robust and scalable REST/GraphQL APIs.' },
  { name: 'Authentication', category: 'Data Layer', description: 'Secure user login and identity management.' },
  { name: 'Storage', category: 'Data Layer', description: 'Managing cloud storage (S3 buckets, etc).' },
];
