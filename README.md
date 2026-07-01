# Rafael Matthew Satrio - Portfolio Website

This is a modern, interactive, and responsive portfolio website built with Astro, React, Tailwind CSS v4, Motion (Framer Motion), and Supabase.

## Tech Stack
- **Framework:** [Astro](https://astro.build/) (Server Output Mode with Node Adapter)
- **UI Library:** [React](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Motion for React](https://motion.dev/)
- **Database & Auth:** [Supabase](https://supabase.com/)

## Features
- **Public Pages:** Landing Page, About, Projects (with dynamic routing), Skills, Experience, Education, Certificates, Blog, and Contact.
- **Admin Dashboard:** Secure login using Supabase Auth to manage profile details and messages.
- **Modern UI:** Glassmorphism, animated scrolling, custom scrollbars, and tech constellation.
- **Contact Form:** Working contact form that saves directly to Supabase via an Astro API endpoint.

## Setup Instructions

### 1. Supabase Setup
1. Create a new project in [Supabase](https://database.new).
2. Go to the SQL Editor and copy-paste the contents of `supabase/init.sql` to create the tables, RLS policies, and seed data based on the CV.
3. In Authentication > Users, create a user for yourself to act as the Admin.
4. Go to the Table Editor, open `admin_users`, and add a new row linking your user's UUID from the auth table.

### 2. Environment Variables
Create a `.env` file in the root of the project:
```env
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```
*(You can find these in your Supabase project settings under API).*

### 3. Local Development
Install dependencies and run the project:
```bash
npm install
npm run dev
```
Your site will be running at `http://localhost:4321`.

### 4. Deployment
To deploy on Vercel or Netlify, you might need to install their respective Astro adapters (`@astrojs/vercel` or `@astrojs/netlify`) and update `astro.config.mjs` accordingly. Currently, it uses `@astrojs/node` for universal server-side rendering support.

## Project Structure
- `src/components`: React components separated by domain (home, about, projects, etc.)
- `src/pages`: Astro routing pages for both public and `/admin` routes.
- `src/layouts`: Layout wrappers (`MainLayout` and `AdminLayout`).
- `src/lib`: Supabase clients for client-side and server-side.
- `supabase/init.sql`: Database schema and seed script.
