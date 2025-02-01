# Info CHIR Web Application Documentation

## Overview
Info CHIR is a comprehensive medical platform designed to serve the healthcare community in Haiti. The application provides access to medical publications, research articles, and professional resources through multiple specialized sections including RHCA (Revue Haïtienne de Chirurgie et d'Anesthésiologie), IGM (Info CHIR Gazette Médicale), and ADC (Atlas de Chirurgie).

## Technical Stack

### Frontend
- React 18.3.1 with TypeScript
- Vite 5.4.1 for build tooling
- Tailwind CSS for styling
- Shadcn/UI for component library
- Framer Motion for animations
- React Router DOM for routing
- React Query for data management
- React Hook Form for form handling
- Sonner for toast notifications

### Backend (Supabase)
- PostgreSQL database
- Row Level Security (RLS) policies
- Storage buckets for file management
- Edge Functions capability

## Database Schema

### Tables

1. **articles**
   - Primary content storage
   - Stores academic articles, research papers
   - Includes metadata like views, citations, downloads
   - Supports multiple authors and tags

2. **article_authors**
   - Junction table linking articles to members
   - Manages author relationships

3. **article_submissions**
   - Handles new article submissions
   - Includes submission metadata and status tracking
   - Stores file URLs for submissions

4. **members**
   - Stores member information
   - Includes contact details and roles
   - Supports profile pictures

5. **newsletter_subscriptions**
   - Manages newsletter subscriptions
   - Tracks subscription status

## Storage Buckets

- `Annuaire_Pics`: Public bucket for directory pictures
- `annuaire_profile_pics`: Public bucket for profile pictures
- `article_annexes`: Private bucket for article attachments
- `article_files`: Private bucket for article files
- `article_pdfs`: Private bucket for PDF documents
- `article_submissions`: Private bucket for submission files
- `avatars`: Public bucket for user avatars

## Key Features

### Home Page
- Hero section with dynamic content rotation
- Products showcase
- Latest articles carousel
- Founders section
- Sponsors section
- Statistics display
- Newsletter subscription

### Article Management
- Article submission system
- PDF file uploads
- Article viewing and downloading
- Citation generation
- View tracking
- Search functionality

### User Features
- Newsletter subscription
- Article submissions
- Profile management
- Directory access

## Components Structure

### Layout Components
- MainLayout
- FooterSection
- Navbar

### Feature Components
1. Home
   - HeroSection
   - ProductsSection
   - CarouselSection
   - FoundersSection
   - SponsorsSection
   - StatsSection
   - NewsletterSection

2. Articles
   - ArticleGrid
   - ArticleCard
   - SearchBar
   - FilterAccordion

3. Submissions
   - SubmissionForm
   - FileUploader
   - FormValidation

## Current State

### Implemented Features
- ✅ Complete home page with all sections
- ✅ Article viewing system
- ✅ Newsletter subscription
- ✅ Basic search functionality
- ✅ File upload system
- ✅ Responsive design
- ✅ Article submission system

### Pending Features
- 🔄 Advanced search filters
- 🔄 User authentication
- 🔄 Admin dashboard
- 🔄 Article analytics
- 🔄 Comment system

## Development Guidelines

### Code Style
- Use TypeScript for all new components
- Follow React functional component patterns
- Implement responsive design using Tailwind CSS
- Use Shadcn/UI components when possible
- Implement proper error handling
- Use React Query for data fetching
- Implement proper loading states

### Database Access
- Always use RLS policies for security
- Implement proper error handling for database operations
- Use appropriate indexes for performance
- Follow the established schema for new features

### File Structure
```
src/
├── components/
│   ├── home/
│   ├── articles/
│   ├── submissions/
│   └── shared/
├── pages/
├── hooks/
├── utils/
├── types/
└── integrations/
    └── supabase/
```

### Performance Considerations
- Implement lazy loading for images
- Use code splitting with React.lazy
- Optimize database queries
- Implement proper caching strategies
- Use proper indexing for database tables

## Security Measures

### Database Security
- RLS policies implemented for all tables
- Public read access for articles and members
- Restricted write access based on authentication
- Protected file storage for sensitive documents

### File Upload Security
- Restricted file types
- Size limitations
- Secure URL generation
- Private bucket access control

## Deployment

The application is designed to be deployed on:
- Frontend: Netlify/Vercel
- Backend: Supabase Platform

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`

### Required Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Follow the established code style
2. Write meaningful commit messages
3. Test thoroughly before submitting PRs
4. Document new features and changes

## Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Refer to the documentation

## License

This project is proprietary and confidential. All rights reserved.

---

Last Updated: [Current Date]
Version: 1.0.0