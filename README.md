# BudgetWise - Personal Finance Management Application

## Overview

BudgetWise is a full-stack personal finance management application built with a modern TypeScript stack. It allows users to track income and expenses, categorize transactions, and visualize financial data through interactive charts and statistics.

## System Architecture

The application follows a clean monorepo structure with separated client and server code:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom design tokens
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with structured error handling
- **Validation**: Zod schemas shared between client and server

## Key Components

### Database Schema
The application uses two main tables:
1. **Transactions**: Stores financial transaction records with fields for description, amount, type (income/expense), category, and date
2. **Categories**: Manages transaction categories with associated colors and types

### API Endpoints
- `GET /api/transactions` - Retrieve transactions with pagination and filtering
- `POST /api/transactions` - Create new transactions
- `PUT/DELETE /api/transactions/:id` - Update/delete specific transactions
- `GET /api/categories` - Retrieve categories
- `GET /api/dashboard/*` - Dashboard statistics and chart data

### UI Components
- **Dashboard**: Main overview with statistics cards, charts, and recent transactions
- **Transaction Management**: CRUD operations for financial transactions
- **Charts**: Interactive visualizations using Chart.js for income/expense trends and category breakdowns
- **Responsive Design**: Mobile-first approach with collapsible sidebar navigation

## Data Flow

1. **Client Requests**: React components use TanStack Query hooks to fetch data
2. **API Layer**: Express routes handle HTTP requests and validate input using Zod schemas
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions with type safety
4. **Response Handling**: Structured JSON responses with consistent error handling
5. **State Management**: React Query handles caching, background updates, and optimistic updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **zod**: Schema validation
- **chart.js**: Data visualization

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundling for production
- **tailwindcss**: Utility-first CSS framework
- **@/vite-plugin-***: specific development enhancements

### Build Process
- Client: Vite builds React application to `dist/public`
- Server: esbuild bundles Express server to `dist/index.js`

### Environment Configuration
- Development: `npm run dev` starts both client and server with hot reload
- Production: `npm run build && npm run start` for optimized deployment
- Database: PostgreSQL connection via `DATABASE_URL` environment variable

### Deployment Features
- **Autoscaling**: Automatic scaling based on traffic
- **Port Configuration**: External port 80 maps to internal port 5000
- **Static Assets**: Client builds served from Express server in production

## Changelog
- June 16, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.
