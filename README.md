# All movies web app

A web application for streaming and downloading movies, built with Next.js, TypeScript, Tailwind CSS, Prisma, and Cloudflare R2 for storage.

## Features

- User authentication with multiple providers (Google, GitHub, Twitter, etc.) using NextAuth.js
- Admin panel for uploading and managing movies and TV shows
- Responsive design with Tailwind CSS
- Server-side rendering and static site generation with Next.js
- Cloudflare R2 for storing and serving media files
- React Query for efficient data fetching and caching
- Toast notifications for user feedback
- Form handling with React Hook Form
- Image optimization with Next.js Image component
- TypeScript for type safety and better developer experience
- ESLint and Prettier for code quality and formatting
- Deployment ready for platforms like Vercel or Cloudflare Pages

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/movie-blobed-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd movie-blobed-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```plaintext
   DATABASE_URL=your_database_url
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   R2_ACCOUNT_ID=your_cloudflare_r2_account_id
   R2_ACCESS_KEY_ID=your_cloudflare_r2_access_key_id
   R2_SECRET_ACCESS_KEY=your_cloudflare_r2_secret_access_key
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open your browser and navigate to `http://localhost:3000` to see the application in action.
