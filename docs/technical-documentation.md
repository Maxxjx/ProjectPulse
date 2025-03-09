# Technical Documentation

## Architecture Overview
ProjectPulse follows a modern full-stack architecture using Next.js 14 with the App Router.

### Tech Stack
- **Frontend**: Next.js 14, React, TailwindCSS, Shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: React Query
- **Database**: PostgreSQL
- **Testing**: Jest, React Testing Library, Cypress

### Project Structure
```
projectpulse/
├── app/               # Next.js 14 App Router
├── components/        # Reusable UI components
├── lib/              # Utility functions and helpers
├── prisma/           # Database schema and migrations
├── public/           # Static assets
└── types/            # TypeScript interfaces
```

## Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   ```
   DATABASE_URL=
   NEXTAUTH_SECRET=
   NEXTAUTH_URL=
   ```
4. Run database migrations: `npx prisma migrate dev`
5. Start development server: `npm run dev`

## API Documentation

### Authentication Endpoints

#### POST `/api/auth/login`
```typescript
Request Body:
{
  email: string;
  password: string;
}

Response:
{
  token: string;
  user: {
    id: string;
    name: string;
    role: 'ADMIN' | 'TEAM' | 'CLIENT';
  }
}
```

#### POST `/api/auth/register`
```typescript
Request Body:
{
  email: string;
  password: string;
  name: string;
  role: 'TEAM' | 'CLIENT';
}

Response:
{
  success: boolean;
  message: string;
  userId: string;
}
```

### Error Handling
```typescript
// Standard Error Response
{
  error: {
    code: string;
    message: string;
    details?: any;
  }
}

// Error Codes
AUTH_001: "Invalid credentials"
AUTH_002: "Token expired"
PROJ_001: "Project not found"
TASK_001: "Invalid task status"
```

### Rate Limiting
- Authentication endpoints: 5 requests per minute
- API endpoints: 100 requests per minute per user
- File uploads: 10 requests per minute

### Authentication
- POST `/api/auth/login`
- POST `/api/auth/register`
- POST `/api/auth/logout`

### Projects
- GET `/api/projects`
- POST `/api/projects`
- PUT `/api/projects/:id`
- DELETE `/api/projects/:id`

### Tasks
- GET `/api/tasks`
- POST `/api/tasks`
- PUT `/api/tasks/:id`
- DELETE `/api/tasks/:id`

## Security Implementation
- JWT-based authentication
- Input sanitization
- Rate limiting
- CSRF protection
- API route protection

## Testing Strategy
- Unit tests for utility functions
- Integration tests for API endpoints
- E2E tests for critical user flows
- Component testing using React Testing Library

## Performance Optimization
- Image optimization
- API route caching
- Static page generation where possible
- Code splitting and lazy loading

## Endpoint Implementation and Feature Rollout

### API Endpoints
- /api/auth – handles authentication (login, register, logout)
- /api/projects – supports project CRUD operations
- /api/tasks – for task management
- /api/analytics – provides real-time dashboard metrics
- /api/users – for user management

Endpoints start with mock data. Set the environment variable USE_PRISMA to 'true' to switch to a Prisma-backed database.

### Real-Time Features
Real-time dashboard updates are enabled via Socket.IO. Toggle the functionality using the ENABLE_REALTIME environment variable.

### Feature Flags and Rollout Strategy
- USE_PRISMA: Switch between mock data and a live database using Prisma.
- ENABLE_REALTIME: Enable WebSocket-based real-time updates.
- Rollout Strategy: New features are introduced incrementally during beta testing. User feedback and monitoring guide the gradual rollout of enhanced capabilities.
