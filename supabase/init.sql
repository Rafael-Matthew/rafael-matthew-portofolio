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
    features JSONB DEFAULT '[]'::jsonb,
    tech_stack JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
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

-- Public Policies
CREATE POLICY "Public can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public can view published projects" ON public.projects FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "Public can view project images" ON public.project_images FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = public.project_images.project_id AND (status = 'published' OR public.is_admin()))
);
CREATE POLICY "Public can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public can view experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Public can view education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Public can view certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Public can view published articles" ON public.articles FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "Public can insert messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert analytics" ON public.site_analytics FOR INSERT WITH CHECK (true);


-- --------------------------------------------------------
-- SEED DATA
-- --------------------------------------------------------

-- Profile
INSERT INTO public.profiles (full_name, headline, bio, email, phone, location, linkedin_url)
VALUES (
    'Rafael Matthew Satrio',
    'Informatics Engineering Undergraduate | Full-Stack Web Developer',
    'Informatics Engineering undergraduate at ISTTS Surabaya with hands-on full-stack web development experience across freelance and project engagements. Proficient in JavaScript, TypeScript, React.js, Next.js, Express.js, and Laravel, with practical cloud exposure to GCP and AWS. Strong collaborator and fast learner eager to grow in a professional software development environment.',
    'rafaelmatthew2305@gmail.com',
    '089612378711',
    'Surabaya, Indonesia',
    'https://linkedin.com/in/r-matthew'
);

-- Projects
INSERT INTO public.projects (title, slug, category, role, period, description, features, tech_stack, status)
VALUES 
(
    'Autospector',
    'autospector',
    'Freelance',
    'Freelance Full-Stack Developer',
    'Dec 2025 - Mar 2026',
    'Developed a used car marketplace featuring standardized mechanic inspection workflows, increasing buyer confidence and transaction transparency.',
    '["Mechanic inspection workflows", "Real-time multi-party communication", "Intuitive user flows"]',
    '["React.js", "Next.js", "Express.js", "TypeScript", "GCP", "AWS"]',
    'published'
),
(
    'Yongki Komaladi',
    'yongki-komaladi',
    'Freelance',
    'Freelance Frontend Developer',
    'Apr 2025 - Dec 2025',
    'Built a product inventory management system and showcase catalog website using React.js, improving operational efficiency for the client.',
    '["Inventory management system", "Showcase catalog website", "Polished production-ready interface"]',
    '["React.js", "JavaScript", "TypeScript"]',
    'published'
),
(
    'PT Multi Lestari',
    'pt-multi-lestari',
    'College Project',
    'Full-Stack Developer (College Project)',
    'Sep 2024 - Jan 2025',
    'Contributed as one of four full-stack developers to design and build a complete inventory management system. Developed an invoice monitoring module and implemented a promotion management feature.',
    '["Inventory management system", "Invoice monitoring module", "Promotion management feature (dynamic pricing)"]',
    '["Laravel", "PHP", "React.js", "TypeScript", "MySQL"]',
    'published'
);

-- Skills (Hard Skills & Soft Skills)
INSERT INTO public.skills (name, category, sort_order) VALUES
('JavaScript', 'Languages', 1),
('TypeScript', 'Languages', 2),
('PHP', 'Languages', 3),
('Java', 'Languages', 4),
('Python', 'Languages', 5),
('Kotlin', 'Languages', 6),
('React.js', 'Frontend', 7),
('Next.js', 'Frontend', 8),
('SolidJS', 'Frontend', 9),
('SolidStart', 'Frontend', 10),
('Remix.js', 'Frontend', 11),
('Express.js', 'Backend', 12),
('Laravel', 'Backend', 13),
('MySQL', 'Databases', 14),
('PostgreSQL', 'Databases', 15),
('MongoDB', 'Databases', 16),
('Google Cloud Platform (GCP)', 'Cloud & DevOps', 17),
('Amazon Web Services (AWS)', 'Cloud & DevOps', 18),
('Git', 'Cloud & DevOps', 19),
('Leadership', 'Soft Skills', 20),
('Problem Solving', 'Soft Skills', 21),
('Critical Thinking', 'Soft Skills', 22),
('Adaptability', 'Soft Skills', 23),
('Public Speaking', 'Soft Skills', 24),
('Teamwork', 'Soft Skills', 25);

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
