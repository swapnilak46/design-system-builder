# Design System Builder - Backend API

This is the backend API for the Design System Builder application, built with Express.js, PostgreSQL, and Prisma ORM.

## 🚀 Features

- **Authentication**: Google OAuth integration using Passport.js
- **Database**: PostgreSQL with Prisma ORM
- **RESTful API**: Full CRUD operations for design systems, components, tokens, and documentation
- **Security**: Session-based authentication with CORS support
- **Modular Architecture**: Organized routes and middleware

## 📦 Tech Stack

- **Framework**: Express.js
- **Database**: PostgreSQL (Prisma Postgres)
- **ORM**: Prisma
- **Authentication**: Passport.js (Google OAuth)
- **Session Management**: express-session
- **CORS**: cors middleware

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
The `.env` file is already configured with:
- Database connection (Prisma Postgres)
- Session secret
- Google OAuth credentials (placeholder)
- Server configuration

### 3. Database Setup
```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

### 4. Google OAuth Setup
To enable authentication, you need to:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/auth/google/callback` (development)
6. Update the `.env` file with your credentials:
   ```
   GOOGLE_CLIENT_ID=your_actual_client_id
   GOOGLE_CLIENT_SECRET=your_actual_client_secret
   ```

### 5. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on port 5000 by default.

## 📚 API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/me` - Get current user info
- `GET /auth/status` - Check authentication status
- `POST /auth/logout` - Logout user

### Design Systems
- `GET /api/systems` - Get all user's design systems
- `GET /api/systems/:id` - Get specific design system
- `POST /api/systems` - Create new design system
- `PUT /api/systems/:id` - Update design system
- `DELETE /api/systems/:id` - Delete design system

### Foundations (Colors, Typography, Spacing)
- `GET /api/foundations/system/:systemId` - Get foundations for a system
- `POST /api/foundations` - Create new foundation
- `PUT /api/foundations/:id` - Update foundation
- `DELETE /api/foundations/:id` - Delete foundation

### Components
- `GET /api/components/system/:systemId` - Get components for a system
- `POST /api/components` - Create new component
- `PUT /api/components/:id` - Update component
- `DELETE /api/components/:id` - Delete component

### Design Tokens
- `GET /api/tokens/system/:systemId` - Get tokens for a system
- `POST /api/tokens` - Create new token
- `PUT /api/tokens/:id` - Update token
- `DELETE /api/tokens/:id` - Delete token

### Documentation
- `GET /api/docs/system/:systemId` - Get documentation for a system
- `POST /api/docs` - Create new documentation block
- `PUT /api/docs/:id` - Update documentation block
- `DELETE /api/docs/:id` - Delete documentation block

### Health Check
- `GET /health` - Server health status

## 🗃️ Database Schema

The database includes the following models:

- **User**: User accounts with Google OAuth data
- **DesignSystem**: Main design system container
- **Foundation**: Color palettes, typography, spacing rules
- **Component**: UI components with props and styles
- **Token**: Design tokens (colors, spacing, typography values)
- **DocBlock**: Documentation blocks with markdown content

## 🔒 Security Features

- Session-based authentication
- CORS protection configured for frontend domain
- User ownership verification for all resources
- SQL injection protection via Prisma ORM
- Environment variable protection

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

### Project Structure
```
backend/
├── auth/
│   └── google.js          # Google OAuth strategy
├── generated/
│   └── prisma/            # Generated Prisma client
├── lib/
│   └── prisma.js          # Prisma client instance
├── middleware/
│   └── auth.js            # Authentication middleware
├── prisma/
│   └── schema.prisma      # Database schema
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── systems.js         # Design system routes
│   ├── foundations.js     # Foundation routes
│   ├── components.js      # Component routes
│   ├── tokens.js          # Token routes
│   └── docs.js            # Documentation routes
├── .env                   # Environment variables
├── server.js              # Main server file
└── package.json
```

## 🚀 Deployment

The backend is ready for deployment to platforms like:
- Railway
- Render
- Fly.io
- Heroku

Make sure to:
1. Set production environment variables
2. Update CORS origins for production frontend URL
3. Configure production database connection
4. Set up Google OAuth production credentials

## ✅ Current Status

**✅ Completed:**
- Express server setup with middleware
- Prisma ORM configuration and schema
- Google OAuth authentication
- Complete CRUD API endpoints
- Database models and relationships
- Security middleware
- Error handling
- Health check endpoint

**🔄 Next Steps:**
- Set up Google OAuth credentials
- Run database migrations when ready
- Connect with frontend application
- Test all API endpoints

The backend is fully functional and ready to serve the frontend application!
