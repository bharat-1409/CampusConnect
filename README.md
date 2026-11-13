# CampusConnect – Smart Campus Issue Management System

A modern, full-stack web application that helps students report campus-related issues and enables administrators to manage, track, and resolve them efficiently.

**Making campus life better, together.**

---

## About the Project

CampusConnect is a Smart Campus Issue Management System designed to improve communication between students and campus administration.

Students can submit issues related to their campus experience, track their reported issues, and stay updated on their status. Administrators can manage submitted reports, monitor issue statistics, and update their progress.

The platform provides a centralized and transparent approach to campus issue management.

## Key Features

### Student Features
- Secure user authentication.
- Report campus-related issues.
- Track submitted issues.
- View issue status and updates.
- Search and filter reported issues.
- Responsive and user-friendly dashboard.

### Admin Features
- Admin role-based access.
- View and manage reported issues.
- Update issue statuses.
- Monitor campus issue statistics.
- Manage issue resolution through a centralized dashboard.

### UI & Experience
- Modern SaaS-style dashboard.
- Responsive user interface.
- Dark mode support.
- Interactive components and animations.
- Clean navigation and dashboard layout.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend library |
| TypeScript | Type-safe development |
| Vite | Development and build tool |
| Supabase | Backend services |
| PostgreSQL | Relational database |
| Supabase Auth | User authentication |
| Row Level Security (RLS) | Database access control |
| CSS | Styling and responsive design |
| Vercel | Frontend deployment |

## Project Structure

```text
CampusConnect/
│
├── public/
│
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── style.css
│   ├── supabase.ts
│   └── vite-env.d.ts
│
├── supabase/
│   └── schema.sql
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## Getting Started

Follow these steps to run CampusConnect locally.

### 1. Clone the Repository

```bash
git clone https://github.com/bharat-1409/CampusConnect.git
```

### 2. Open the Project

```bash
cd CampusConnect
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Supabase

Create a project on [Supabase](https://supabase.com/).

Copy your project URL and public anon/publishable key.

Create a `.env` file in the project root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_public_key
```

**Important:** Never expose your Supabase service-role or secret key in frontend code or commit your `.env` file to GitHub.

### 5. Set Up the Database

1. Open your Supabase project.
2. Navigate to the SQL Editor.
3. Open the `supabase/schema.sql` file from this repository.
4. Copy its SQL commands into the Supabase SQL Editor.
5. Execute the script to configure the database.

Ensure that the required Row Level Security (RLS) policies are configured.

### 6. Run the Application

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

### 7. Build for Production

```bash
npm run build
```

The production build is generated inside the `dist/` directory.

---

## Security

CampusConnect uses Supabase authentication and PostgreSQL Row Level Security to help protect application data.

Security considerations include:

- Authenticated access to application features.
- Role-based authorization for student and admin functionality.
- Database-level access policies through RLS.
- Public frontend credentials stored in environment variables.
- Sensitive service-role credentials are never included in the frontend.

## Deployment

The frontend can be deployed using **Vercel**.

1. Import the GitHub repository into Vercel.
2. Select Vite as the framework.
3. Configure the environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Set the build command to `npm run build`.
5. Set the output directory to `dist`.
6. Deploy the application.

Configure the deployed URL in Supabase Authentication URL settings so authentication redirects work correctly.

## Future Enhancements

- Email and in-app notifications.
- Issue priority and category management.
- Image attachments for issue reports.
- Advanced analytics and reporting.
- Issue discussion and feedback system.
- Improved admin management tools.

## Project Information

**Project Name:** CampusConnect – Smart Campus Issue Management System

**Project Type:** Full-Stack Web Development

**Repository:** [GitHub – CampusConnect](https://github.com/bharat-1409/CampusConnect)

**Live Demo:** Coming soon.

---

## Author

**Bharat Dutta**

BE – Computer Science and Engineering (AI & ML)

GitHub: [@bharat-1409](https://github.com/bharat-1409)

---

⭐ If you find this project useful, consider giving the repository a star.

**CampusConnect – Making campus life better, together.**
