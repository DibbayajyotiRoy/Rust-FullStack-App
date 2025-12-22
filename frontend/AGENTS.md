# Frontend Agent Guide

This is a React + TypeScript + Vite frontend application using modern tooling and component architecture.

## Project Overview

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS with custom design system
- **UI Library**: Shadcn/ui (New York style) with Radix UI primitives
- **State Management**: Custom React hooks (no external state library)
- **HTTP Client**: Custom fetch wrapper
- **Toast Notifications**: Sonner
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Theme**: Next-themes for dark/light mode

## Essential Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:5173)

# Build & Quality
npm run build        # TypeScript compilation + Vite build
npm run lint         # ESLint check
npm run preview      # Preview production build
```

## Architecture Patterns

### Directory Structure
```
src/
├── api/          # API layer (endpoints, http client)
├── components/   # UI components organized by atomic design
│   ├── atoms/    # Smallest reusable components
│   ├── molecules/ # Small component combinations
│   ├── organisms/ # Complex component sections
│   ├── templates/ # Page templates
│   └── ui/        # Shadcn/ui base components
├── hooks/        # Custom React hooks
├── layouts/      # Page layout components
├── pages/        # Route-level components
├── services/     # Business logic/API service functions
├── state/        # Custom state management hooks
├── styles/       # Global styles (if any)
├── types/        # TypeScript type definitions
└── lib/          # Utility functions
```

### Component Architecture
- **Atomic Design**: Components organized by complexity (atoms → molecules → organisms)
- **Shadcn/ui**: Base UI components in `/components/ui/`
- **Path Aliases**: Use `@/` prefix for imports from `src/`
- **Props**: Components accept `className` prop for styling extensions

### API Layer Pattern
```typescript
// Endpoints: /src/api/endpoints.ts
export const ENDPOINTS = {
  resource: {
    list: () => `${API_BASE}/resource`,
    create: () => `${API_BASE}/resource`,
    byId: (id: string) => `${API_BASE}/resource/${id}`,
  },
} as const;

// Service: /src/services/resource.service.ts
export const resourceService = {
  list(): Promise<Resource[]> {
    return http<Resource[]>(ENDPOINTS.resource.list());
  },
  create(payload: ResourcePayload): Promise<Resource> {
    return http<Resource>(ENDPOINTS.resource.create(), {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  // ...
};
```

### State Management Pattern
```typescript
// Custom hook pattern in /src/state/
export function useResource() {
  const [data, setData] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchResource() {
    try {
      setLoading(true);
      setData(await resourceService.list());
    } catch {
      toast.error("Failed to load resource");
    } finally {
      setLoading(false);
    }
  }

  // CRUD operations with toast notifications
  // ...

  useEffect(() => {
    fetchResource();
  }, []);

  return { data, loading, create, update, delete };
}
```

## Code Conventions

### Imports
- React imports first
- External libraries next
- Internal imports with `@/` alias
- Relative imports last

```typescript
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { userService } from '@/services/user.service';
import './styles.css';
```

### TypeScript
- Strict mode enabled
- Interfaces for data structures
- Type-only imports when appropriate: `import type { User }`
- No `any` types - use proper typing

### Styling
- Use TailwindCSS classes
- Custom CSS variables defined in `index.css`
- Components accept `className` prop for extending styles
- Use `cn()` utility from `@/lib/utils` for conditional classes

### Error Handling
- HTTP errors handled in custom `http()` function
- User-facing errors use toast notifications
- Service functions throw errors, hooks handle them

## Key Configuration

### Path Aliases (tsconfig.json)
```json
{
  "baseUrl": ".",
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

### Shadcn/ui Configuration (components.json)
- Style: "new-york"
- TailwindCSS enabled with CSS variables
- Component aliases configured
- Icon library: Lucide React

### Theme System
- CSS custom properties for colors/spaces
- Dark mode support via `.dark` class
- Custom scrollbar styling
- Inter font family

## Gotchas & Important Notes

### HTTP Client
- Uses custom `http<T>()` wrapper around fetch
- Automatically includes JSON headers
- Handles 204 responses (DELETE operations)
- Throws error for non-2xx responses

### Toast Notifications
- Use `toast.success()`, `toast.error()` for user feedback
- Configured globally in `App.tsx` with custom styling
- Position: bottom-right

### Sidebars
- Uses Shadcn/ui sidebar system
- Width controlled via CSS variable: `--sidebar-width: "18rem"`
- Layout structure: `SidebarProvider > AppSidebar + SidebarInset`

### No Testing Framework
- Currently no test setup in project
- When adding tests, check with team for preferred framework

### No External State Management
- No Redux, Zustand, etc.
- State managed through custom hooks
- Consider complexity before adding external state libraries

## Development Workflow

1. **Adding New Features**:
   - Create types in `/src/types/`
   - Add endpoints to `/src/api/endpoints.ts`
   - Create service functions in `/src/services/`
   - Build custom hook in `/src/state/`
   - Create components following atomic design
   - Add routes to appropriate pages

2. **Component Creation**:
   - Check if Shadcn/ui component exists first
   - Follow atomic design for placement
   - Use `className` prop for style extensions
   - Export as named exports

3. **API Integration**:
   - All HTTP calls go through service layer
   - Handle errors in hooks, not components
   - Use TypeScript generics with `http<T>()`
   - Follow RESTful patterns in endpoints