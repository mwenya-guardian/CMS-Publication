# Frontend Requirements

This document lists the requirements fulfilled by the frontend, grouped into Functional, Non-Functional, Software, and Hardware categories. All items are grounded in the implementation and configuration under `Frontend/`.

## Functional Requirements

- **Authentication & Routing**
  - Login and registration pages; persistent session via `AuthContext`.
  - Role-based route protection (`ProtectedRoute`, `ProtectedAdminRoutes`) and redirects after login.
  - Client-side routing with public (`/`, `/publications`, `/events`, `/quotes`, `/bulletins`, `/about`), user (`/user/...`), and admin (`/admin/...`) areas.
- **Public Area**
  - Browse publications, events, quotes, and bulletins; home and about pages.
  - Pagination and filtering components for large lists (e.g., `Pagination`, `DateFilterBar`).
- **User Area (Protected)**
  - User home, posts, bulletins, liked posts, and settings pages.
  - Reactions and commenting UI components (e.g., `ReactionButton`, `CommentSection`).
- **Admin Area (Protected)**
  - Dashboard and modules for Publications, Events, Quotes, Posts, Bulletins, Church Details, Members, Giving, Users, Schedules, and Analysis.
  - CRUD UIs integrated with backend services (`services/*.ts`).
  - Media management via `ImageUploader` and video/audio playback.
  - Bulletin editor/view with schedule and modal components.
  - Analysis dashboards with trend charts and comment details modal.
- **API Integration**
  - `axios`-based client in `services/*` consuming backend REST (`/api`).
  - Auth token storage/refresh and `me` lookup via `authService`.
- **Export/Share**
  - Client-side PDF/image generation where applicable (`jspdf`, `html2canvas`).

## Non-Functional Requirements

- **Security**
  - Route-level guards; hides protected pages for unauthenticated users; admin-only gating.
  - Uses JWT from backend; avoids access without token.
- **UX & Accessibility**
  - Responsive design via Tailwind; accessible primitives via `@headlessui/react`.
  - Global loading states and spinners during auth/navigation.
- **Performance**
  - Pagination for large datasets; Vite dev server and optimized build for production.
- **Maintainability**
  - Modular file structure: components, pages, services, types, contexts, utils.
  - Strong typing with TypeScript across components and services.
- **Interoperability**
  - CORS-compatible with backend; configurable Vite dev server (`vite.config.ts`).

## Software Requirements

- **Runtime & Tooling**
  - Node.js 18+ (Vite 5 requirement); npm.
  - TypeScript 5; React 18; Vite 5 build system.
- **Dependencies**
  - UI: Tailwind CSS; Icons: `lucide-react`; Headless UI.
  - Data/HTTP: `axios`, `date-fns`.
  - Media/Export: `react-video-audio-player`, `jspdf`, `html2canvas`.
  - Dev: ESLint, @vitejs/plugin-react, PostCSS/Autoprefixer.
- **Configuration**
  - `vite.config.ts` with allowed hosts for tunneling; Tailwind config; TypeScript configs.

## Hardware Requirements

- **Client**
  - Modern browser capable of running React 18 apps; stable internet.
- **Developer Machine**
  - Node.js 18+ environment; typical resources for Vite dev server and build (e.g., 4 GB RAM).
