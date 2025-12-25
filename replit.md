# Priyanka K. Portfolio

## Overview

This is a personal portfolio website for Priyanka K., showcasing professional experience, skills, projects, and education. The application features an AI-powered chat assistant that can answer questions about Priyanka's background using RAG (Retrieval-Augmented Generation) with OpenAI integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state and data fetching
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for entrance animations and transitions
- **Smooth Scrolling**: react-scroll for navigation between sections

### Backend Architecture
- **Framework**: Express.js running on Node.js
- **API Design**: REST API with typed routes defined in `shared/routes.ts`
- **Build Process**: esbuild for server bundling, Vite for client bundling

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` defines all database tables
- **Tables**: personalInfo, skills, experience, projects, education, chatMessages, conversations, messages
- **Migrations**: Drizzle Kit handles schema migrations to `./migrations` folder

### AI Integration
- **Provider**: OpenAI via Replit AI Integrations
- **Implementation**: RAG-based chat that retrieves portfolio context (profile, skills, projects, experience, education) before generating responses
- **Utilities**: Batch processing with rate limiting, image generation capabilities

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components including shadcn/ui
    pages/        # Route pages (Home, not-found)
    hooks/        # Custom hooks for API calls
    lib/          # Utilities and query client
server/           # Express backend
  routes.ts       # API route definitions
  storage.ts      # Database access layer
  db.ts           # Database connection
  replit_integrations/  # AI utilities (batch, chat, image)
shared/           # Shared code between client/server
  schema.ts       # Drizzle database schema
  routes.ts       # API route type definitions
```

### Key Design Patterns
- **Typed API Contracts**: Zod schemas in `shared/routes.ts` ensure type safety between frontend and backend
- **Storage Interface**: `IStorage` interface in `server/storage.ts` abstracts database operations
- **Component Composition**: Reusable UI components (SectionHeader, SkillCard, ProjectCard) for consistent styling

## External Dependencies

### Database
- PostgreSQL (required, connection via `DATABASE_URL` environment variable)
- Drizzle ORM for query building and schema management

### AI Services
- OpenAI API via Replit AI Integrations
- Environment variables: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`

### Key NPM Packages
- `@tanstack/react-query`: Data fetching and caching
- `framer-motion`: Animation library
- `react-scroll`: Smooth scrolling navigation
- `drizzle-orm` / `drizzle-zod`: Database ORM with Zod integration
- `openai`: OpenAI SDK for chat and image generation
- Radix UI primitives: Accessible component primitives for shadcn/ui