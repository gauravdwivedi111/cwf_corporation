# CWF Corporation - Production Readiness Checklist

This document details the security auditing, performance tuning, and technical compliance modifications completed for the **CWF Corporation MERN Application**. It serves as a proof of quality check for client handover.

---

## 1. Security Hardening

| Check Item | Status | Action Taken & Implementation Details |
| :--- | :---: | :--- |
| **No Hardcoded Secrets** | **PASS** | Audited all source codes. API keys, secrets, email passwords, and JWT encryption tokens are strictly loaded from environment variables (`process.env`). |
| **Git-Ignored Environment** | **PASS** | Verified that `.env` is ignored by the Git configuration (`.gitignore`). The `.env.example` file contains safe developer dummy placeholder parameters only. |
| **Multi-Tier Rate Limiting** | **PASS** | Configured a multi-layered shield using `express-rate-limit`:<br>• **Global API Shield:** Max 200 requests/15 mins.<br>• **Auth Paths Shield:** Max 30 requests/15 mins on `/api/auth/*` routes.<br>• **Login Protection:** Max 5 failed attempts/15 mins on `POST /api/auth/login`.<br>• **Lead Spam Protection:** Max 5 inquiry submissions/hour on `POST /api/inquiries`. |
| **File Upload Validation** | **PASS** | Multer configuration validates MIME type (JPEG/PNG/WEBP) and restricts file sizes to under 5MB on the server-side. Added offline uploader bypass for dummy configurations. |
| **CORS Access Protection** | **PASS** | Restricts CORS access to trusted domains parsed from `process.env.CLIENT_URL` (dynamic validation). Wildcard `*` origins are rejected in production. |
| **Helmet & Content Policy** | **PASS** | Integrated `helmet` to inject secure headers, configuring a strict Content Security Policy (CSP) whitelisting `self` and Cloudinary image CDNs. |
| **Admin Route Protection** | **PASS** | Verified all admin API routes are wrapped in JWT `protect` and role-based `authorize` middlewares. Unauthorized accesses return HTTP 401/403. |
| **Cookie Configurations** | **PASS** | Refresh session cookie settings enforced with `httpOnly: true`, `secure: true` (only served over SSL/HTTPS), and `sameSite: 'strict'` to completely neutralize CSRF vulnerabilities. |

---

## 2. Error Handling & Logging Telemetry

| Check Item | Status | Action Taken & Implementation Details |
| :--- | :---: | :--- |
| **Centralized Error Format** | **PASS** | The global Express handler catches database casting faults, duplicates, and validation errors, returning structured `{ success: false, message: ... }` payloads. Stack traces are masked in production. |
| **Telemetry Logging** | **PASS** | Configured `winston` for file-based logs:<br>• **Combined Logs:** Access requests recorded in `logs/combined.log`.<br>• **Error Logs:** HTTP 500 error objects and stack traces isolated in `logs/errors.log`. |
| **Frontend Error Boundary** | **PASS** | Wrapped the root React application in a custom class `ErrorBoundary`. Unhandled rendering crashes show a dark glassmorphic layout prompting users to Reload or Return to Home. |
| **Graceful API Downtime** | **PASS** | Frontend requests are routed through the `useApi` hook. If the backend server fails, the client UI remains functional, displaying localized "Unable to load..." warning messages rather than crashing. |

---

## 3. Performance & Optimization

| Check Item | Status | Action Taken & Implementation Details |
| :--- | :---: | :--- |
| **Gzip Compression** | **PASS** | Integrated Express `compression` middleware, shrinking server JSON payloads and text assets before network delivery. |
| **Database Indexing** | **PASS** | Confirmed indexing is active on frequently queried fields in MongoDB:<br>• **Unique Index:** `User.email`, `Service.slug`, `BlogPost.slug`.<br>• **Compound/Order Index:** `Inquiry.status / Inquiry.createdAt`, `Service.isPublished / Service.order`, `BlogPost.isPublished / BlogPost.publishedAt`. |
| **Route Code-Splitting** | **PASS** | Converted static page imports in `App.jsx` to dynamic, lazy-loaded components (`React.lazy`). Chunks are loaded on demand under a `<Suspense>` spinner. |
| **Optimized Bundle Sizes** | **PASS** | Verified that client build compiles into split chunks (Main vendor chunk is only **67.51 kB** after gzip), dramatically decreasing initial load times. |

---

## 4. SEO & Content

| Check Item | Status | Action Taken & Implementation Details |
| :--- | :---: | :--- |
| **Dynamic Sitemap XML** | **PASS** | Programmed `GET /sitemap.xml` on the Express API. It fetches published services and blogs from the database, generating a dynamic XML map. Removed the static placeholder. |
| **Robots Policy** | **PASS** | Created `robots.txt` allowing public indexing of landing areas while explicitly blocking crawlers from `/admin` and `/login` sub-routes. |
| **Social Open Graph Tags** | **PASS** | Added `og:title`, `og:description`, `og:image`, and `og:url` tags to `Home`, `ServiceDetail`, and `BlogPostDetail` pages via React Helmet. |

---

## 5. Rich Test Seeding

| Check Item | Status | Action Taken & Implementation Details |
| :--- | :---: | :--- |
| **Realistic Pipeline Seeds** | **PASS** | Seeder script seeds 3 staff accounts, 6 services, 6 projects, 5 reviews, 4 engineering profiles, and 12 inquiries spanning all pipeline stages with historical notes and assignees. |

---

## 6. Pre-Launch Guidelines

### 6.1. Third-Party Scripts & Content Security Policy (CSP)
The Content Security Policy (CSP) is strictly configured to permit assets from `self` and `https://res.cloudinary.com` to prevent script injections.
> [!WARNING]
> If Google Analytics (GA), Google Tag Manager (GTM), or Meta Pixel tracking snippets are uncommented in `main.jsx` and `index.html` at launch, **their domains must be whitelisted in the CSP directives** inside `/server/server.js` (under `scriptSrc` and `connectSrc`). Failing to do so will result in browsers blocking the analytics scripts.

### 6.2. MongoDB Backup Policy Recommendation
To ensure high data integrity and recovery capabilities, we recommend the following backup guidelines:
1. **If using MongoDB Atlas (Recommended):**
   - Enable **Continuous Cloud Backups**.
   - Configure a retention policy of 7 days with hourly snapshot increments.
   - Turn on Point-in-Time Recovery (PITR) to restore database records to the exact second.
2. **If Self-Hosting (On Premise / VPS):**
   - Create a cron-scheduled script (`backup_db.sh`) that triggers a daily dump:
     ```bash
     mongodump --uri="mongodb://YOUR_DB_URI" --out="/var/backups/mongodb/$(date +%F)"
     ```
   - Tar/compress the output:
     ```bash
     tar -czf /var/backups/mongodb/db-$(date +%F).tar.gz /var/backups/mongodb/$(date +%F)
     ```
   - Configure the script to sync the compressed tarball to an offsite secure storage bucket (e.g. AWS S3 or Google Cloud Storage) and clean up local files older than 7 days.
