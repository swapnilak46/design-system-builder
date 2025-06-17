## 🏗️ Full Implementation Plan – Design System Builder Web App (Copilot-Ready)

> This is a detailed, production-ready implementation plan meant for direct execution by Copilot, junior devs, or collaborators. It follows strict architectural guidelines, separating concerns and ensuring modularity.

---

### 🔧 Step 1: Backend Setup (Express + PostgreSQL + Auth)

#### 1.1 Initialize Backend
- `mkdir backend && cd backend`
- `npm init -y`
- Install dependencies:
```bash
npm install express cors dotenv pg prisma @prisma/client cookie-parser jsonwebtoken passport passport-google-oauth20 express-session
```

#### 1.2 Setup Prisma ORM
- `npx prisma init`
- Configure `DATABASE_URL` in `.env`
- Create Prisma models:
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  avatar    String?
  systems   DesignSystem[]
}

model DesignSystem {
  id          String     @id @default(uuid())
  name        String
  description String?
  userId      String
  user        User       @relation(fields: [userId], references: [id])
  foundations Foundation[]
  components  Component[]
  tokens      Token[]
  docs        DocBlock[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model Foundation {
  id        String   @id @default(uuid())
  type      String
  values    Json
  systemId  String
  system    DesignSystem @relation(fields: [systemId], references: [id])
}

// Create similar models for Component, Token, DocBlock...
```
- Run `npx prisma migrate dev --name init`

#### 1.3 Setup Express Server
- Create `server.js`
- Setup middleware:
```js
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('./auth/google');

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
```

#### 1.4 Google OAuth (Passport)
- In `auth/google.js`:
```js
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('../prisma');
const passport = require('passport');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  const user = await prisma.user.upsert({
    where: { email: profile.emails[0].value },
    update: {},
    create: {
      email: profile.emails[0].value,
      name: profile.displayName,
      avatar: profile.photos[0].value,
    }
  });
  return done(null, user);
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});
```

#### 1.5 Routes
- Create routes for:
  - `/auth/google`
  - `/auth/google/callback`
  - `/api/systems` (CRUD)
  - `/api/foundations`, `/api/components`, etc.

---

### 💅 Step 2: Frontend Setup (React + Tailwind + Redux Toolkit)

#### 2.1 Initialize Project
- `npx create-react-app frontend`
- `cd frontend`
- Install deps:
```bash
npm install @reduxjs/toolkit react-redux react-router-dom axios tailwindcss @shadcn/ui
```
- Init Tailwind: `npx tailwindcss init -p`
- Configure Tailwind paths + base styles

#### 2.2 Redux Setup
- Create `store.js`:
```js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import systemReducer from './features/systemSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    systems: systemReducer
  }
});
```

- Create folders:
  - `features/authSlice.js`
  - `features/systemSlice.js`
  - Include async thunks to fetch/create/update systems

#### 2.3 Router Setup
- Use `BrowserRouter`
- Routes:
  - `/` → Landing Page
  - `/dashboard` → List of systems
  - `/system/:id` → Editor with tabs (Foundations, Components, Tokens, Docs)
  - `/preview/:id` → Read-only view/export

---

### 🧱 Step 3: Dashboard Page
- Fetch all systems for the user (GET `/api/systems`)
- Display cards/list
- Add "New System" modal
- Use Redux slice for system CRUD

---

### 🧰 Step 4: Editor Workspace (`/system/:id`) ✅ COMPLETED
- ✅ Tab UI: Custom tabbed interface with 5 main tabs
- ✅ Foundation Tab: CRUD for colors, typography, spacing with live preview
  - ✅ Live preview panel for different foundation types
  - ✅ Redux `editorSlice` manages state with comprehensive async actions
- ✅ Component Tab: Component builder with categories and preview
  - ✅ Multiple component categories (form, navigation, layout, feedback, data, media)
  - ✅ Live preview for different component types
  - ✅ Props and styles management via JSON forms
- ✅ Patterns Tab: Pre-built design patterns and guidelines
  - ✅ Common UI patterns (modals, forms, tables, navigation, loading states)
  - ✅ Code examples and usage guidelines
  - ✅ Expandable pattern details with best practices
- ✅ Token Tab: Design tokens with export functionality
  - ✅ Categorized tokens (colors, spacing, typography, borders, shadows, motion)
  - ✅ Live preview for different token types
  - ✅ Export to CSS, SCSS, JSON, JavaScript formats
  - ✅ Visual token management with inline editing
- ✅ Docs Tab: Markdown editor with live preview
  - ✅ Split-pane markdown editor with real-time preview
  - ✅ Pre-built documentation templates
  - ✅ Rich markdown rendering with syntax highlighting
  
**Key Features Implemented:**
- 🔄 Real-time data synchronization with backend APIs
- 💾 Auto-save functionality with unsaved changes indicator  
- 🎨 Live preview for all design elements
- 📱 Responsive design for mobile and desktop
- ⚡ Performance optimized with proper state management
- 🎯 Comprehensive error handling and user feedback
- 🔒 Authentication-protected routes and API calls
- 🎨 Beautiful UI with consistent design system

---

### 📤 Step 5: Preview + Export Page
- Read-only view of design system (cards, colors, docs)
- Add export buttons:
  - JSON: Download structured token data
  - CSS/SCSS: Generate utility classes
  - JSX: Export button components as code blocks

---

### 🚀 Step 6: Deployment
- Frontend → Vercel
- Backend → Railway, Render, or Fly.io
- PostgreSQL → Supabase or Railway
- Configure CORS, session security, auth callback URLs

---

### 🔮 Step 7: Future Enhancements
- GPT Assistant for component generation
- GitHub sync for design tokens
- Contrast checker + WCAG Validator
- Team collaboration (invites + permissions)

---

This plan is modular, scalable, and built for long-term success. You can now safely hand this to Copilot, freelancers, or teammates — and it’ll work like clockwork. Let me know when you're ready for the first code module!

