# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Growth Compass is a personal skill assessment and tracking application built with Next.js 16, React 19, TypeScript, MongoDB, and NextAuth. Users can create radar chart assessments across customizable categories, track progress over time, and visualize growth.

## Development Commands

```bash
# Development
npm run dev              # Start development server on localhost:3000

# Production
npm run build           # Build for production
npm start               # Start production server

# Linting
npm run lint            # Run ESLint
```

## Environment Setup

Required environment variables (see `.env.example`):

- `MONGODB_URI` - MongoDB connection string (format: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/growth-compass`)
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` - Base URL (e.g., `http://localhost:3000` for dev)

## Architecture

### App Router Structure

This project uses Next.js 16 App Router with the following structure:

- **`app/`** - Next.js app directory
  - `app/(auth)/` - Route group for authentication pages (login, register)
  - `app/api/` - API routes (assessments, categories, auth, register)
  - `app/page.tsx` - Main dashboard (authenticated only)
  - `app/layout.tsx` - Root layout with Providers (SessionProvider, Toaster)
  - `app/globals.css` - Global styles with Tailwind v4 theming

### Data Models

All models are defined in `lib/models/index.ts` using Mongoose:

1. **User** - Authentication and user data
   - Fields: email (unique), password (hashed with bcryptjs), name, createdAt

2. **Assessment** - Individual skill assessments
   - Fields: userId (ref), name, date, scores (Map of category:score)
   - Index: Compound index on `{userId: 1, date: -1}` for performance

3. **Category** - User's customizable category preferences
   - Fields: userId (unique), categories (array of strings)
   - Default categories: Coding, Design, Communication, Leadership, Problem Solving

### Database Connection

`lib/db.ts` implements a cached MongoDB connection pattern to prevent connection exhaustion in serverless environments. The connection is cached globally and reused across requests.

### Authentication

NextAuth v4 is configured in `app/api/auth/[...nextauth]/route.ts`:
- Uses Credentials provider with bcryptjs password hashing
- JWT session strategy
- Custom login page at `/login`
- Session includes user ID for database queries

All API routes use `getServerSession(authOptions)` for authentication.

### API Routes

RESTful API structure in `app/api/`:

- **`/api/assessments`** (GET, POST, DELETE)
  - GET: Fetches all assessments for logged-in user, sorted by date desc
  - POST: Creates new assessment with name, scores, optional date
  - DELETE: Deletes assessment by ID (query param `?id=`)

- **`/api/categories`** (GET, POST)
  - GET: Fetches user's category preferences
  - POST: Updates category list (creates if doesn't exist)

- **`/api/register`** (POST)
  - Creates new user with hashed password

- **`/api/auth/[...nextauth]`** (NextAuth handlers)

### Component Architecture

- **`components/forms/AssessmentForm.tsx`** - Controlled form for creating assessments
  - Real-time draft preview via `onScoresChange` callback
  - Keyboard shortcuts (Ctrl+Enter to save, Alt+R to reset)
  - Toast notifications (sonner)

- **`components/charts/RadarChart.tsx`** - Chart.js radar chart wrapper
  - Supports overlaying multiple assessments + draft
  - Draft shown with dashed white line

- **`components/history/HistoryList.tsx`** - Assessment history with selection
  - Multi-select (max 3) for comparison
  - Delete with confirmation dialog

- **`components/settings/SettingsModal.tsx`** - Category management modal

- **`components/ui/`** - Reusable UI components
  - `ConfirmDialog` - Replaces native confirm()
  - `EmptyState` - Empty state with illustrations
  - `LoadingSkeleton` - Loading states
  - `Slider` - Custom range slider for scores (1-10)
  - `KeyboardShortcutsHelp` - Keyboard shortcut help modal

### State Management

The dashboard (`app/page.tsx`) uses React state with the following key patterns:

- **Multi-selection** - `selectedIds` array (max 3) for comparing assessments
- **Draft preview** - `draftScores` state lifted from form to chart via callback
- **Chart data composition** - Combines historical assessments + draft in `getChartData()`
  - Draft renders on top (order: 0) with dashed border
  - Up to 3 historical datasets with distinct colors

### Styling

- **Tailwind CSS v4** with custom theming in `globals.css`
- **Design tokens** - CSS variables for colors (primary, success, danger, etc.)
- **Glass morphism** - `glass-panel` utility class for cards
- **Dark theme** - Default dark mode with gradient background
- **Custom utilities** - `input-field` for consistent form inputs

### Keyboard Shortcuts

Implemented via `lib/hooks/useKeyboardShortcut.ts`:
- Ctrl+Enter - Save assessment
- Alt+R - Reset form
- Ctrl+, - Open settings
- ? - Show keyboard shortcuts help

## Important Patterns

### Session Handling

Always check session status before rendering authenticated content:

```typescript
const { data: session, status } = useSession();

useEffect(() => {
  if (status === "unauthenticated") {
    router.push("/login");
  }
}, [status, router]);

if (status === "loading") {
  return <LoadingSkeleton />;
}
```

### API Error Handling

API routes follow consistent error response pattern:

```typescript
if (!session?.user?.email) {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}
```

### Toast Notifications

Use `toast` from `sonner` instead of `alert()`:

```typescript
import { toast } from "sonner";

toast.success("Success message");
toast.error("Error message");
```

### Confirmation Dialogs

Use `ConfirmDialog` component instead of native `confirm()`:

```typescript
<ConfirmDialog
  isOpen={isOpen}
  onClose={handleClose}
  onConfirm={handleConfirm}
  title="Delete Assessment"
  message="Are you sure?"
  variant="danger"
/>
```

## Current Development Phase

Phase 1 (UI/UX improvements) is complete. See `ROADMAP.md` for upcoming features. Key completed items:
- Toast notifications replacing alert()
- Custom confirmation dialogs
- Loading skeletons
- Keyboard shortcuts
- Empty states

## Testing

Currently no test suite. Refer to Phase 8 in ROADMAP.md for testing plans.

## Known Issues

- TypeScript strict mode is enabled but some type assertions may need refinement
- Missing skeleton components referenced in `page.tsx` (ChartSkeleton, HistoryListSkeleton, FormSkeleton)
- No error boundaries implemented yet
