Build a high-performance, scalable, and secure Project Management System named 'ProjectPulse' using Next.js 14 (with the App Router) and modern web technologies. The app must support multi-role authentication (admin, team, client), robust API operations, dynamic dashboards, and real-time analytics—all wrapped in a sleek dark-themed UI (primary: #8B5CF6, background: #1F2937).

To streamline testing and debugging, implement the app iteratively in the following phases:

## Development Approach
Mock Data First Strategy:
- Initially implement the application using TypeScript interfaces and mock data
- Define comprehensive type definitions for all entities (Users, Projects, Tasks, etc.)
- Create utility functions to simulate CRUD operations on the mock data
- This approach allows for faster UI development and helps finalize data requirements before database implementation
- Once features are stabilized, migrate to an actual database implementation

## Phase 1: Minimal Viable Product (MVP) ✅
Homepage:
- Create a public landing page that acts as a product advertisement.
- Showcase key features, testimonials, and a prominent 'View Demo' button.
- Clicking 'View Demo' redirects users to the login page with pre-populated sample credentials.

## Phase 2: Authentication & Basic Dashboard ✅
Login Functionality:
- Integrate a login function using NextAuth.js with built-in email and password (with sample credentials).
- Implement JWT-based authentication, and once authenticated, redirect users to a basic dashboard.
Dashboard:
- Display a simple dashboard page confirming successful login.

## Phase 3: Role-Based Dashboard Expansion ✅
Multi-Role Access:
- Enhance the dashboard to support role-based redirection: admin, team, and client.
- Create dedicated pages (or folders/routes) for each role, ensuring each dashboard displays tailored content.
- Use a collapsible sidebar, a top header (with PMS logo, notifications, and user profile), and basic components that load dynamic content.

## Phase 4: Core Features & API Integration
Data Management:
- Define comprehensive TypeScript interfaces for all data models
- Create a mock data store with sample data for all entities
- Implement mock service functions for CRUD operations on projects, tasks, users, etc.
- Later: Set up Prisma with a database schema including Users, Projects, Tasks, Comments, and TimeEntries.

API Development:
- Create API endpoints under /api/auth/*, /api/projects/*, /api/tasks/*, /api/users/*, and /api/analytics/* to handle CRUD operations.
- First implement with mock data services, then connect to real database later

Data Fetching & Validation:
- Integrate React Query for data fetching and caching.
- Use Zod for request and response validation.

Basic UI Enhancements:
- Integrate Shadcn/ui components and TailwindCSS styling to refine the dashboard look and feel.

## Phase 5: Enhanced Functionality
Authentication Enhancements:
- Implement password reset functionality and secure session management.

Advanced Dashboard Features:
- Integrate real-time charts (using Chart.js) for data visualization.

- Add a rich text editor for comments.


Role-Specific Features:
- Admin: User and role management, project overview, audit logs, and system analytics.
- Client: Project progress tracking, budget monitoring, support ticket system, document sharing, and meeting scheduler.
- Team: Task management, time tracking, document management, and team collaboration.

## Phase 6: Additional Enhanced Capabilities & Optimizations
Extra Features:
- Implement a drag-and-drop Kanban board for task management.
- Enable customizable dashboard widgets (with drag-and-drop and collapsible panels).
- Implement integrated time tracking for tasks and generate productivity/billing reports.
- Set up automated in-app/email notifications for project updates, deadlines, or changes.
- Optimize for mobile-first design and add PWA support.
- Develop robust API endpoints for third-party integrations (CRM, ERP, etc.).


Database Migration:
- Migrate from mock data to a real database
- Implement proper database models, migrations, and relationships
- Ensure data integrity and performance optimizations
- Add database backup and recovery strategies

Performance & Deployment:
- Ensure page load times under 2 seconds and target 99.9% uptime.
- Achieve automated testing coverage over 80%.
- Configure a CI/CD pipeline (using GitHub Actions), deploy on Vercel, and set up environment-based configuration and database backups.

Security Measures:
- Enforce HTTPS, input sanitization, rate limiting, CSRF protection, and conduct regular security audits.

Documentation:
- Provide comprehensive API documentation with Swagger, user guides per role, a development setup guide, deployment instructions, and contributing guidelines.