export type Project = {
  id: string;
  name: string;
  status: 'Active' | 'Beta' | 'Completed' | 'Archived';
  type: string;
  techStack: string[];
  impact: string;
  problem: string;
  solution: string;
  role: string;
  keyFeatures: string[];
  demoUrl?: string;
  githubUrl?: string;
  focus: ('Recruiter' | 'Developer' | 'Client' | 'Lecturer')[];
  period?: string;
};
