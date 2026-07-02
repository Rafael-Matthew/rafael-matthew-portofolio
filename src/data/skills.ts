export type SkillCategory = 'Languages' | 'Frontend' | 'Backend' | 'Databases' | 'Cloud & DevOps' | 'Soft Skills' | 'AI';

export type Skill = {
  name: string;
  category: SkillCategory;
  description: string;
  icon?: string;
};

export const skills: Skill[] = [
  // Languages
  { name: 'JavaScript', category: 'Languages', description: 'Core language for dynamic web functionality.' },
  { name: 'TypeScript', category: 'Languages', description: 'Strongly typed JavaScript for scalable applications.' },
  { name: 'PHP', category: 'Languages', description: 'Server-side scripting language.' },
  { name: 'Java', category: 'Languages', description: 'Object-oriented programming language.' },
  { name: 'Python', category: 'Languages', description: 'Versatile language for backend and scripting.' },
  { name: 'Kotlin', category: 'Languages', description: 'Modern language for Android and backend.' },
  { name: 'GoLang', category: 'Languages', description: 'Statically typed, compiled programming language designed at Google.' },

  // Frontend
  { name: 'React.js', category: 'Frontend', description: 'UI library for interactive component-based interfaces.' },
  { name: 'Next.js', category: 'Frontend', description: 'React framework for production.' },
  { name: 'SolidJS', category: 'Frontend', description: 'Declarative, efficient UI library.' },
  { name: 'SolidStart', category: 'Frontend', description: 'Meta-framework for SolidJS.' },
  { name: 'Remix.js', category: 'Frontend', description: 'Full stack web framework.' },
  { name: 'Astro', category: 'Frontend', description: 'Web framework for building fast, content-focused websites.' },

  // Backend
  { name: 'Express.js', category: 'Backend', description: 'Fast, unopinionated, minimalist web framework for Node.js.' },
  { name: 'Laravel', category: 'Backend', description: 'PHP framework for web artisans.' },
  { name: 'FastAPI', category: 'Backend', description: 'Modern, fast web framework for building APIs with Python.' },

  // Databases
  { name: 'MySQL', category: 'Databases', description: 'Open-source relational database management system.' },
  { name: 'PostgreSQL', category: 'Databases', description: 'Advanced open source relational database.' },
  { name: 'MongoDB', category: 'Databases', description: 'NoSQL document database for flexible data modeling.' },
  { name: 'Supabase', category: 'Databases', description: 'Open source Firebase alternative.' },

  // Cloud & DevOps
  { name: 'Google Cloud Platform (GCP)', category: 'Cloud & DevOps', description: 'Suite of cloud computing services.' },
  { name: 'Amazon Web Services (AWS)', category: 'Cloud & DevOps', description: 'Comprehensive cloud platform.' },
  { name: 'Git', category: 'Cloud & DevOps', description: 'Distributed version control system.' },
  { name: 'Cisco', category: 'Cloud & DevOps', description: 'Networking and IT infrastructure.' },
  { name: 'Redhat', category: 'Cloud & DevOps', description: 'Enterprise open source solutions and Linux OS.' },
  { name: 'Blynk IoT', category: 'Cloud & DevOps', description: 'IoT platform for connecting devices to the cloud.' },

  // Soft Skills
  { name: 'Leadership', category: 'Soft Skills', description: 'Guiding and motivating teams to achieve goals.' },
  { name: 'Problem Solving', category: 'Soft Skills', description: 'Analyzing issues and finding effective solutions.' },
  { name: 'Critical Thinking', category: 'Soft Skills', description: 'Objective analysis and evaluation of an issue.' },
  { name: 'Adaptability', category: 'Soft Skills', description: 'Adjusting to new conditions and technologies.' },
  { name: 'Public Speaking', category: 'Soft Skills', description: 'Communicating ideas clearly to an audience.' },
  { name: 'Teamwork', category: 'Soft Skills', description: 'Collaborating effectively with others.' },

  // AI
  { name: 'Prompt Engineering', category: 'AI', description: 'Designing and optimizing prompts for LLMs.' },
  { name: 'LLMs', category: 'AI', description: 'Working with Large Language Models like GPT-4 and Gemini.' },
  { name: 'AI Integration', category: 'AI', description: 'Integrating AI capabilities into web and mobile applications.' },
  { name: 'scikit-learn', category: 'AI', description: 'Machine learning library for Python.' },
  { name: 'OpenCV', category: 'AI', description: 'Computer vision and image processing.' },
  { name: 'YOLO', category: 'AI', description: 'Real-time object detection.' },
  { name: 'MediaPipe', category: 'AI', description: 'Cross-platform ML solutions for live media.' },
];
