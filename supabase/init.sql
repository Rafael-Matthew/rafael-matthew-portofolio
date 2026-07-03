-- Drop existing tables to allow re-running this script cleanly
DROP TABLE IF EXISTS public.site_analytics CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.articles CASCADE;
DROP TABLE IF EXISTS public.certificates CASCADE;
DROP TABLE IF EXISTS public.education CASCADE;
DROP TABLE IF EXISTS public.experiences CASCADE;
DROP TABLE IF EXISTS public.skills CASCADE;
DROP TABLE IF EXISTS public.project_images CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.timeline_events CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. admin_users
CREATE TABLE public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. profiles
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    headline TEXT NOT NULL,
    roles JSONB DEFAULT '[]'::jsonb,
    focus TEXT,
    status TEXT,
    live_status TEXT,
    professional_summary TEXT,
    technical_side TEXT,
    personal_side TEXT,
    badges JSONB DEFAULT '[]'::jsonb,
    bio TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    cv_url TEXT,
    profile_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. projects
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL, -- e.g., 'College Project', 'Freelance'
    role TEXT NOT NULL,
    period TEXT NOT NULL,
    description TEXT NOT NULL,
    problem TEXT,
    impact TEXT,
    solution TEXT,
    focus JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    tech_stack JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'Completed' CHECK (status IN ('Active', 'Beta', 'Completed', 'Archived', 'published', 'draft')),
    github_url TEXT,
    live_demo_url TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. project_images
CREATE TABLE public.project_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. skills
CREATE TABLE public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    level TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. experiences
CREATE TABLE public.experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL, -- 'Work', 'College Project', 'Freelance', 'Organization', 'Activity'
    role TEXT NOT NULL,
    organization TEXT NOT NULL,
    period TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. education
CREATE TABLE public.education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution TEXT NOT NULL,
    major TEXT NOT NULL,
    period TEXT NOT NULL,
    gpa TEXT,
    relevant_courses JSONB DEFAULT '[]'::jsonb,
    achievements JSONB DEFAULT '[]'::jsonb,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. certificates
CREATE TABLE public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issued_date DATE,
    credential_url TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. articles
CREATE TABLE public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image_url TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. messages
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. site_analytics
CREATE TABLE public.site_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_viewed TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. timeline_events
CREATE TABLE public.timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('commit', 'init', 'deploy', 'merge')),
    message TEXT NOT NULL,
    details TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Row Level Security (RLS)

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

-- Admin can do anything on all tables
CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to projects" ON public.projects FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to project_images" ON public.project_images FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to skills" ON public.skills FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to experiences" ON public.experiences FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to education" ON public.education FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to certificates" ON public.certificates FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to articles" ON public.articles FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to messages" ON public.messages FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to timeline_events" ON public.timeline_events FOR ALL USING (public.is_admin());

-- Public Policies
CREATE POLICY "Public can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public can view non-draft projects" ON public.projects FOR SELECT USING (status != 'draft' OR public.is_admin());
CREATE POLICY "Public can view project images" ON public.project_images FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = public.project_images.project_id AND (status != 'draft' OR public.is_admin()))
);
CREATE POLICY "Public can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public can view experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Public can view education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Public can view certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Public can view published articles" ON public.articles FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "Public can insert messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert analytics" ON public.site_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view timeline_events" ON public.timeline_events FOR SELECT USING (true);


-- --------------------------------------------------------
-- SEED DATA
-- --------------------------------------------------------

-- Profile
INSERT INTO public.profiles (
    full_name, headline, roles, focus, status, live_status,
    professional_summary, technical_side, personal_side, badges, profile_image_url,
    email, phone, location, linkedin_url
)
VALUES (
    'Rafael Matthew Satrio',
    'Informatics Engineering Undergraduate | Full-Stack Web Developer',
    '["Full-Stack Developer", "Cloud & AI Engineer", "UI/UX Designer"]'::jsonb,
    'Full-Stack Web Development',
    'Undergraduate at ISTTS',
    'Building end-to-end web applications and expanding my expertise in professional software development.',
    'Informatics Engineering undergraduate at ISTTS Surabaya with hands-on full-stack web development experience across freelance and project engagements. Proficient in JavaScript, TypeScript, React.js, Next.js, Express.js, and Laravel, with practical cloud exposure to GCP and AWS. Delivered end-to-end web applications including a used car marketplace with real-time communication, inventory management systems, and product showcase platforms. Strong collaborator and fast learner eager to grow in a professional software development environment.',
    'I specialize in building robust web applications using modern web ecosystems like React (Next.js, Remix.js, SolidJS) for the frontend, combined with Express.js or Laravel for the backend. My experience extends to designing real-time communication systems and managing databases like MySQL, PostgreSQL, and MongoDB, deployed on GCP or AWS.',
    'As a top-performing student (graduated Top 3 in high school) and an active organizational member, I thrive in collaborative environments. I enjoy mentoring, public speaking, and continuously adapting to new challenges in tech.',
    '["Full-Stack Developer", "Fast Learner", "Strong Collaborator", "Problem Solver", "Adaptable"]'::jsonb,
    'https://res.cloudinary.com/dtdiwotv1/image/upload/v1783007726/Matthew_pbhxpl.jpg',
    'rafaelmatthew2305@gmail.com',
    '089612378711',
    'Surabaya, Indonesia',
    'https://linkedin.com/in/r-matthew'
);

-- Projects
INSERT INTO public.projects (title, slug, category, role, period, description, problem, impact, solution, focus, features, tech_stack, status, github_url)
VALUES 
(
    'DawnBase',
    'dawnbase',
    'Web App',
    'Full-Stack Developer',
    '2026',
    '',
    'Esports teams lacked a unified, real-time platform to discuss strategies and annotate over gameplay videos simultaneously.',
    'Improved MLBB esports team strategy coordination by 40% with real-time mapping.',
    'Built a real-time collaborative canvas integrated with synchronized YouTube video playback, allowing coaches to draw and plan strategies live.',
    '["Recruiter","Developer","Client"]',
    '["Real-time drawing and annotation (KonvaJS & Socket.io)","Synchronized video playback across multiple clients","Role-based access (Coach vs Player)"]',
    '["SolidStart","Socket.io","KonvaJS","YouTube IFrame API","Tailwind CSS"]',
    'Active',
    'https://github.com/Rafael-Matthew/TrySolid'
),
(
    'Omuda',
    'omuda',
    'Web App',
    'Lead Developer',
    '2025',
    '',
    'Manual inventory tracking led to overselling and poor customer experience.',
    'Streamlined online shop operations and reduced inventory sync errors by 100%.',
    'Developed a robust full-stack e-commerce solution with integrated, automated inventory management.',
    '["Recruiter","Client","Lecturer"]',
    '["Real-time inventory synchronization","Secure payment gateway integration","Admin dashboard with sales analytics"]',
    '["Remix","TypeScript","MongoDB","Tailwind CSS"]',
    'Completed',
    NULL
),
(
    'AI Billiard Coach',
    'ai-billiard',
    'Mobile App',
    'AI & Mobile Engineer',
    '2026',
    '',
    'Amateur billiard players struggle to identify micro-errors in their stance and cue delivery.',
    'Provides real-time feedback on player posture and cue alignment.',
    'An Android app that uses computer vision to track body joints and provide actionable feedback.',
    '["Developer","Lecturer","Recruiter"]',
    '["Real-time pose estimation via MediaPipe","Custom algorithm for posture correction","Video recording and playback analysis"]',
    '["MediaPipe","Kotlin","OpenCV","AI Analysis"]',
    'Beta',
    'https://github.com/Rafael-Matthew/CueSight'
),
(
    'CloudVerse Portfolio',
    'cloudverse',
    'Web App',
    'Frontend Engineer & Designer',
    '2026',
    '',
    'Standard portfolios fail to capture the interactive and systemic nature of cloud & AI engineering.',
    'Showcases technical skills through a highly interactive, memorable OS-like experience.',
    'A cloud-themed interactive portfolio with multiple user modes and a functional mini-terminal.',
    '["Developer","Recruiter"]',
    '["Interactive Mode Switcher (Recruiter/Dev/Fun)","Working mini CLI terminal","Dynamic project recommender (AI Lab)"]',
    '["Astro","React","TypeScript","Tailwind CSS","Framer Motion/GSAP"]',
    'Active',
    'https://github.com/Rafael-Matthew/rafael-matthew-portofolio'
),
(
    'Project AI in Games',
    'ai-in-games',
    'AI in Games',
    'Game Developer',
    '2025',
    '',
    'Exploring how artificial intelligence can be applied to create engaging game mechanics and non-player characters.',
    'Demonstrated various AI behaviors in a game environment.',
    'Developed a game project featuring implemented AI algorithms for pathfinding, decision making, and behaviors.',
    '["Developer","Lecturer"]',
    '["AI Pathfinding & Navigation","NPC Behavior Trees / State Machines","Interactive Game Environment"]',
    '["C#","Unity","Artificial Intelligence"]',
    'Completed',
    'https://github.com/Rafael-Matthew/ai-in-games'
),
(
    'AutoInspect Cell',
    'autoinspect-cell',
    'Web App',
    'Full-Stack Developer',
    '2026',
    '',
    'Required a solution for autoinspect cell.',
    'Successfully developed and deployed AutoInspect Cell.',
    'Developed a Software Engineering application to address the requirements.',
    '["Developer","Lecturer"]',
    '["Core business logic implementation","User-friendly interface design","Data persistence and state management"]',
    '["Software Engineering"]',
    'Completed',
    'https://github.com/Rafael-Matthew/AutoInspect-Cell'
),
(
    'Grafkom2',
    'grafkom2',
    'Games',
    'Full-Stack Developer',
    '2024',
    '',
    'Required a solution for grafkom2.',
    'Successfully developed and deployed Grafkom2.',
    'Developed a C#, Unity application to address the requirements.',
    '["Developer","Lecturer"]',
    '["Core business logic implementation","User-friendly interface design","Data persistence and state management"]',
    '["C#","Unity"]',
    'Completed',
    'https://github.com/Rafael-Matthew/Grafkom2'
),
(
    'GuidedByTheLight',
    'guidedbythelight',
    'Games',
    'Full-Stack Developer',
    '2023',
    '',
    'Required a solution for guidedbythelight.',
    'Successfully developed and deployed GuidedByTheLight.',
    'Developed a Software Engineering application to address the requirements.',
    '["Developer","Lecturer"]',
    '["Core business logic implementation","User-friendly interface design","Data persistence and state management"]',
    '["Software Engineering"]',
    'Completed',
    'https://github.com/Rafael-Matthew/GuidedByTheLight'
),
(
    'Inventary Be',
    'inventary-be',
    'Web App',
    'Full-Stack Developer',
    '2026',
    '',
    'Required a solution for inventary be.',
    'Successfully developed and deployed Inventary Be.',
    'Developed a Software Engineering application to address the requirements.',
    '["Developer","Lecturer"]',
    '["Core business logic implementation","User-friendly interface design","Data persistence and state management"]',
    '["Software Engineering"]',
    'Completed',
    'https://github.com/Rafael-Matthew/inventary-be'
),
(
    'Inventary Fe',
    'inventary-fe',
    'Web App',
    'Full-Stack Developer',
    '2025',
    '',
    'Required a solution for inventary fe.',
    'Successfully developed and deployed Inventary Fe.',
    'Developed a Software Engineering application to address the requirements.',
    '["Developer","Lecturer"]',
    '["Core business logic implementation","User-friendly interface design","Data persistence and state management"]',
    '["Software Engineering"]',
    'Completed',
    'https://github.com/Rafael-Matthew/inventary-fe'
),
(
    'MetalMayhem TankTitans',
    'metalmayhem-tanktitans',
    'Games',
    'Full-Stack Developer',
    '2023',
    '',
    'Required a solution for metalmayhem tanktitans.',
    'Successfully developed and deployed MetalMayhem TankTitans.',
    'Developed a Software Engineering application to address the requirements.',
    '["Developer","Lecturer"]',
    '["Core business logic implementation","User-friendly interface design","Data persistence and state management"]',
    '["Software Engineering"]',
    'Completed',
    'https://github.com/Rafael-Matthew/metalMayhem-TankTitans'
),
(
    'Microboost Android',
    'microboost-android',
    'Mobile App',
    'Full-Stack Developer',
    '2025',
    '',
    'Required a solution for microboost android.',
    'Successfully developed and deployed Microboost Android.',
    'Developed a Software Engineering application to address the requirements.',
    '["Developer","Lecturer"]',
    '["Core business logic implementation","User-friendly interface design","Data persistence and state management"]',
    '["Software Engineering"]',
    'Completed',
    'https://github.com/Rafael-Matthew/microboost-android'
),
(
    'Microboost Be',
    'microboost-be',
    'Web App',
    'Full-Stack Developer',
    '2025',
    '',
    'Required a solution for microboost be.',
    'Successfully developed and deployed Microboost Be.',
    'Developed a Express, TypeScript application to address the requirements.',
    '["Developer","Lecturer"]',
    '["Core business logic implementation","User-friendly interface design","Data persistence and state management"]',
    '["Express","TypeScript"]',
    'Completed',
    'https://github.com/Rafael-Matthew/microboost-be'
),
(
    'Proyek Ai Client',
    'proyek-ai-client',
    'Web App',
    'Full-Stack Developer',
    '2025',
    '',
    'Required a solution for proyek ai client.',
    'Successfully developed and deployed Proyek Ai Client.',
    'Developed a React, TypeScript application to address the requirements.',
    '["Developer","Lecturer"]',
    '["Core business logic implementation","User-friendly interface design","Data persistence and state management"]',
    '["React","TypeScript"]',
    'Completed',
    'https://github.com/Rafael-Matthew/proyek-ai-client'
),
(
    'Proyek Fpw',
    'proyek-fpw',
    'Web App',
    'Full-Stack Developer',
    '2025',
    '',
    'Required a solution for proyek fpw.',
    'Successfully developed and deployed Proyek Fpw.',
    'Developed a React, MongoDB, TypeScript application to address the requirements.',
    '["Developer","Lecturer"]',
    '["Core business logic implementation","User-friendly interface design","Data persistence and state management"]',
    '["React","MongoDB","TypeScript"]',
    'Completed',
    'https://github.com/Rafael-Matthew/proyek-fpw'
),
(
    'Proyek Softest',
    'proyek-softest',
    'Games',
    'Full-Stack Developer',
    '2025',
    '',
    'Required a solution for proyek softest.',
    'Successfully developed and deployed Proyek Softest.',
    'Developed a C#, Unity application to address the requirements.',
    '["Developer","Lecturer"]',
    '["Core business logic implementation","User-friendly interface design","Data persistence and state management"]',
    '["C#","Unity"]',
    'Completed',
    'https://github.com/Rafael-Matthew/proyek-softest'
),
(
    'Proyek Ws',
    'proyek-ws',
    'Games',
    'Full-Stack Developer',
    '2024',
    '',
    'Required a solution for proyek ws.',
    'Successfully developed and deployed Proyek Ws.',
    'Developed a Express, JavaScript, C#, Unity application to address the requirements.',
    '["Developer","Lecturer"]',
    '["Core business logic implementation","User-friendly interface design","Data persistence and state management"]',
    '["Express","JavaScript","C#","Unity"]',
    'Completed',
    'https://github.com/Rafael-Matthew/proyek-ws'
),
(
    'Proyekbwp',
    'proyekbwp',
    'Web App',
    'Full-Stack Developer',
    '2024',
    '',
    'Required a solution for proyekbwp.',
    'Successfully developed and deployed Proyekbwp.',
    'Developed a JavaScript, PHP, Laravel application to address the requirements.',
    '["Developer","Lecturer"]',
    '["Core business logic implementation","User-friendly interface design","Data persistence and state management"]',
    '["JavaScript","PHP","Laravel"]',
    'Completed',
    'https://github.com/Rafael-Matthew/proyekbwp'
),
(
    'ProyekCSA',
    'proyekcsa',
    'Web App',
    'Full-Stack Developer',
    '2025',
    '',
    'Required a solution for proyekcsa.',
    'Successfully developed and deployed ProyekCSA.',
    'Developed a React, JavaScript application to address the requirements.',
    '["Developer","Lecturer"]',
    '["Core business logic implementation","User-friendly interface design","Data persistence and state management"]',
    '["React","JavaScript"]',
    'Completed',
    'https://github.com/Rafael-Matthew/ProyekCSA'
),
(
    'ProyekCSA BE',
    'proyekcsa-be',
    'Web App',
    'Full-Stack Developer',
    '2025',
    '',
    'Required a solution for proyekcsa be.',
    'Successfully developed and deployed ProyekCSA BE.',
    'Developed a Express, JavaScript application to address the requirements.',
    '["Developer","Lecturer"]',
    '["Core business logic implementation","User-friendly interface design","Data persistence and state management"]',
    '["Express","JavaScript"]',
    'Completed',
    'https://github.com/Rafael-Matthew/ProyekCSA-BE'
),
(
    'Proyek Ai Backend',
    'proyek-ai-backend',
    'Web App',
    'Full-Stack Developer',
    '2025',
    '',
    'Required a solution for proyek ai backend.',
    'Successfully developed and deployed Proyek Ai Backend.',
    'Developed a Software Engineering application to address the requirements.',
    '["Developer","Lecturer"]',
    '["Core business logic implementation","User-friendly interface design","Data persistence and state management"]',
    '["Software Engineering"]',
    'Completed',
    'https://github.com/Rafael-Matthew/proyek_ai_backend'
),
(
    'Proyek Ai Macanan',
    'proyek-ai-macanan',
    'AI in Games',
    'Full-Stack Developer',
    '2025',
    '',
    'Required a solution for proyek ai macanan.',
    'Successfully developed and deployed Proyek Ai Macanan.',
    'Developed a Software Engineering application to address the requirements.',
    '["Developer","Lecturer"]',
    '["Core business logic implementation","User-friendly interface design","Data persistence and state management"]',
    '["Software Engineering"]',
    'Completed',
    'https://github.com/Rafael-Matthew/proyek_ai_macanan'
);

-- Skills
INSERT INTO public.skills (name, category, description, sort_order) VALUES
('JavaScript', 'Languages', 'Core language for dynamic web functionality.', 1),
('TypeScript', 'Languages', 'Strongly typed JavaScript for scalable applications.', 2),
('PHP', 'Languages', 'Server-side scripting language.', 3),
('Java', 'Languages', 'Object-oriented programming language.', 4),
('Python', 'Languages', 'Versatile language for backend and scripting.', 5),
('Kotlin', 'Languages', 'Modern language for Android and backend.', 6),
('GoLang', 'Languages', 'Statically typed, compiled programming language designed at Google.', 7),

('React.js', 'Frontend', 'UI library for interactive component-based interfaces.', 8),
('Next.js', 'Frontend', 'React framework for production.', 9),
('SolidJS', 'Frontend', 'Declarative, efficient UI library.', 10),
('SolidStart', 'Frontend', 'Meta-framework for SolidJS.', 11),
('Remix.js', 'Frontend', 'Full stack web framework.', 12),
('Astro', 'Frontend', 'Web framework for building fast, content-focused websites.', 13),

('Express.js', 'Backend', 'Fast, unopinionated, minimalist web framework for Node.js.', 14),
('Laravel', 'Backend', 'PHP framework for web artisans.', 15),
('FastAPI', 'Backend', 'Modern, fast web framework for building APIs with Python.', 16),

('MySQL', 'Databases', 'Open-source relational database management system.', 17),
('PostgreSQL', 'Databases', 'Advanced open source relational database.', 18),
('MongoDB', 'Databases', 'NoSQL document database for flexible data modeling.', 19),
('Supabase', 'Databases', 'Open source Firebase alternative.', 20),

('Google Cloud Platform (GCP)', 'Cloud & DevOps', 'Suite of cloud computing services.', 21),
('Amazon Web Services (AWS)', 'Cloud & DevOps', 'Comprehensive cloud platform.', 22),
('Git', 'Cloud & DevOps', 'Distributed version control system.', 23),
('Redhat', 'Cloud & DevOps', 'Enterprise open source solutions and Linux OS.', 24),
('Blynk IoT', 'Cloud & DevOps', 'IoT platform for connecting devices to the cloud.', 25),

('Cisco', 'Cyber Security', 'Network security, firewall configuration, and infrastructure defense.', 26),
('Web Auth & Authorization', 'Cyber Security', 'Implementing secure stateless authentication using JWT, OAuth 2.0, and Role-Based Access Control.', 27),
('Identity Access Mgmt (IAM)', 'Cyber Security', 'Securing application endpoints with JWT, token rotation, and secure cookie strategies.', 28),

('Leadership', 'Soft Skills', 'Guiding and motivating teams to achieve goals.', 29),
('Problem Solving', 'Soft Skills', 'Analyzing issues and finding effective solutions.', 30),
('Critical Thinking', 'Soft Skills', 'Objective analysis and evaluation of an issue.', 31),
('Adaptability', 'Soft Skills', 'Adjusting to new conditions and technologies.', 32),
('Public Speaking', 'Soft Skills', 'Communicating ideas clearly to an audience.', 33),
('Teamwork', 'Soft Skills', 'Collaborating effectively with others.', 34),

('Prompt Engineering', 'AI', 'Designing and optimizing prompts for LLMs.', 35),
('LLMs', 'AI', 'Working with Large Language Models like GPT-4 and Gemini.', 36),
('AI Integration', 'AI', 'Integrating AI capabilities into web and mobile applications.', 37),
('scikit-learn', 'AI', 'Machine learning library for Python.', 38),
('OpenCV', 'AI', 'Computer vision and image processing.', 39),
('YOLO', 'AI', 'Real-time object detection.', 40),
('MediaPipe', 'AI', 'Cross-platform ML solutions for live media.', 41);

-- Experiences (Work & College)
INSERT INTO public.experiences (type, role, organization, period, description, sort_order) VALUES
('Freelance', 'Freelance Full-Stack Developer', 'Autospector', 'Dec 2025 - Mar 2026', '- Developed a used car marketplace featuring standardized mechanic inspection workflows, increasing buyer confidence and transaction transparency.\n- Architected a real-time, multi-party communication system to coordinate interactions between sellers, buyers, and mechanics throughout each transaction.\n- Designed intuitive end-to-end user flows with a focus on usability and transparency, resulting in a seamless customer experience.', 1),
('Freelance', 'Freelance Frontend Developer', 'Yongki Komaladi', 'Apr 2025 - Dec 2025', '- Built a product inventory management system and showcase catalog website using React.js, improving operational efficiency for the client.\n- Collaborated with the client to translate business requirements into a polished, production-ready frontend interface.', 2),
('College Project', 'Full-Stack Developer', 'PT Multi Lestari', 'Sep 2024 - Jan 2025', '- Contributed as one of four full-stack developers to design and build a complete inventory management system.\n- Developed an invoice monitoring module enabling real-time visibility into outstanding and completed transactions.\n- Implemented a promotion management feature supporting discount campaigns and dynamic pricing rules.', 3);

-- Experiences (Organization)
INSERT INTO public.experiences (type, role, organization, period, description, sort_order) VALUES
('Organization', 'Event Committee Member', 'Eagle Cup', 'Sep 2023 - Oct 2023', '- Developed the competition schedule and coordinated event logistics to ensure a successful and well-organized competition.', 4),
('Organization', 'Event Committee Member', 'End Academic Camp', 'Mar 2023 - Jul 2023', '- Created and managed the event activity schedule, ensuring all sessions ran smoothly and on time.', 5),
('Organization', 'Facilitator', 'Catholic Student Spirituality', 'Feb 2023 - Oct 2023', '- Mentored student member groups, facilitating personal development and spiritual growth programs.', 6);

-- Education
INSERT INTO public.education (institution, major, period, gpa, relevant_courses, achievements, sort_order) VALUES
('Institut Sains dan Teknologi Terpadu Surabaya (ISTTS)', 'Bachelor of Informatics Engineering', '2022 - Present', '3.43', '["Web Programming Frameworks", "Mobile App Programming", "Software Testing", "Cloud Engineering"]', '[]', 1),
('Stella Maris Senior High School', 'Science Track', '2019 - 2022', NULL, '[]', '["Ranked 1st in class at Grade 12", "Ranked 2nd in class at Grade 10", "Graduated as Top 3 Best Student of the cohort"]', 2);

-- Timeline Events
INSERT INTO public.timeline_events (year, type, message, details, sort_order) VALUES
('2026', 'deploy', 'feat: built AI-powered portfolio concept (CloudVerse OS)', 'Designed and engineered a highly interactive portfolio showcasing cloud engineering, AI integrations, and advanced frontend skills.', 1),
('2025', 'commit', 'feat: developed Omuda online shop & inventory system', 'Led the development of a full-stack e-commerce solution using Remix, TypeScript, and MongoDB, significantly reducing inventory sync errors.', 2),
('2024', 'merge', 'feat: built DawnBase Collaborative Strategy Platform', 'Created a real-time collaborative strategy tool for MLBB esports teams using SolidStart, Socket.io, and KonvaJS.', 3),
('2023', 'init', 'init: started informatics & software engineering journey', 'Began formal education and deep-dive into full-stack development, algorithms, and cloud technologies.', 4);

