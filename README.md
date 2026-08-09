# CWF Corporation - MERN Stack Project

This repository contains the production-grade MERN stack setup for **CWF Corporation**, a waterproofing consultation and inspection business based in Pune, India.

## Project Structure

The project is structured as follows:
- `/server` - Backend API built with Node.js, Express, and MongoDB (via Mongoose).
- `/client` - Frontend Single Page Application (SPA) built with React, Vite, and React Router.
  - **Admin Dashboard**: Located within `/client` under the `/admin/*` protected route group. Access is guarded via role-based authentication (`superadmin` and `editor`).

```text
cwf_coorporation/
├── .gitignore
├── package.json
├── README.md
├── server/
│   ├── .env.example
│   ├── .prettierrc
│   ├── eslint.config.js
│   ├── package.json
│   ├── server.js
│   ├── scripts/
│   │   └── verify_models.js
│   └── src/
│       ├── config/
│       │   └── db.js
│       └── models/
│           ├── User.js
│           ├── Service.js
│           ├── Project.js
│           ├── Testimonial.js
│           ├── BlogPost.js
│           ├── Inquiry.js
│           ├── TeamMember.js
│           └── SiteSettings.js
└── client/
    ├── .env.example
    ├── .prettierrc
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── components/
        ├── context/
        ├── hooks/
        ├── pages/
        │   ├── admin/
        │   └── client/
        ├── routes/
        └── utils/
```

---

## Setup and Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas cluster)

### Installation
1. Install all dependencies for the root, backend, and frontend directories:
   ```bash
   npm run install:all
   ```

2. Configure environment variables:
   - Copy `server/.env.example` to `server/.env` and fill in the required credentials (MongoDB URI, JWT secret, Cloudinary tokens, SMTP details).
   - Copy `client/.env.example` to `client/.env` and fill in the API base URL.

---

## Running the Application

### Development Mode
To start both the backend API and frontend Vite servers concurrently, run:
```bash
npm run dev
```
- Server API will start on: `http://localhost:5000` (or `PORT` specified in `.env`)
- React Client will start on: `http://localhost:5173` (Vite default)

### ESLint & Prettier
To check linting and formatting across both client and server projects:
```bash
# Run linting check
npm run lint

# Automatically format code files
npm run format
```

---

## Mongoose Model Verification
We include a dry-run validation script to confirm Mongoose models compile and reference each other correctly without requiring a live MongoDB connection:
```bash
npm run verify:models
```
This is useful for local syntax checking and CI/CD verification pipelines.
