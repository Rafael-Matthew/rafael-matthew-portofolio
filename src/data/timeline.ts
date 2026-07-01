export type TimelineEvent = {
  year: string;
  type: 'commit' | 'init' | 'deploy' | 'merge';
  message: string;
  details: string;
};

export const timelineEvents: TimelineEvent[] = [
  {
    year: '2026',
    type: 'deploy',
    message: 'feat: built AI-powered portfolio concept (CloudVerse OS)',
    details: 'Designed and engineered a highly interactive portfolio showcasing cloud engineering, AI integrations, and advanced frontend skills.',
  },
  {
    year: '2025',
    type: 'commit',
    message: 'feat: developed Omuda online shop & inventory system',
    details: 'Led the development of a full-stack e-commerce solution using Remix, TypeScript, and MongoDB, significantly reducing inventory sync errors.',
  },
  {
    year: '2024',
    type: 'merge',
    message: 'feat: built DawnBase Collaborative Strategy Platform',
    details: 'Created a real-time collaborative strategy tool for MLBB esports teams using SolidStart, Socket.io, and KonvaJS.',
  },
  {
    year: '2023',
    type: 'init',
    message: 'init: started informatics & software engineering journey',
    details: 'Began formal education and deep-dive into full-stack development, algorithms, and cloud technologies.',
  },
];
