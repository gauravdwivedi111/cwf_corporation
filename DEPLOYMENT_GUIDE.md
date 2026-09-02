# CWF Consulting Corporation — Complete Production Deployment Guide

A step-by-step master reference for deploying the full-stack MERN platform (Corporate Gateway + 3 Divisions + Content Management System) with **100% free hosting, offline static assets, and 24/7 zero-sleep keep-alive**.

---

## 🏗️ Production Architecture Overview

```
+-------------------------------------------------------------------------------+
|                                  USER / CLIENT                                |
+-------------------------------------------------------------------------------+
                                        |
                   +--------------------+--------------------+
                   |                                         |
                   v                                         v
   +-------------------------------+         +-------------------------------+
   |   VERCEL GLOBAL EDGE CDN      |         |     RENDER NODE.JS BACKEND    |
   |   (React 18 + Vite SPA)       |  REST   |     (Express REST API + CSP)  |
   |   Domain: *.vercel.app        |-------->|     Domain: *.onrender.com    |
   |   • 100% Offline WebP Images  |  HTTPS  |     • Keep-Alive Heartbeat    |
   |   • Native Compressed Video   |         |     • Helmet + DDoS Defense   |
   +-------------------------------+         +-------------------------------+
                                                             |
                                      +----------------------+----------------------+
                                      |                                             |
                                      v                                             v
                      +-------------------------------+             +-------------------------------+
                      |      MONGODB ATLAS (CLOUD)    |             |      CLOUDINARY MEDIA CDN     |
                      |      M0 512MB Free Cluster    |             |      Admin Image Uploads      |
                      +-------------------------------+             +-------------------------------+
                                      ^
                                      |
                      +-------------------------------+
                      |     UPTIMEROBOT 24/7 PING     |
                      |     Zero-Sleep Monitor        |
                      +-------------------------------+
```

---

## 📋 Table of Contents
1. [Pre-requisites & Accounts Needed](#1-pre-requisites--accounts-needed)
2. [Step 1: Push Codebase to GitHub](#step-1-push-codebase-to-github)
3. [Step 2: Create MongoDB Atlas Cloud Database](#step-2-create-mongodb-atlas-cloud-database)
4. [Step 3: Obtain Cloudinary API Credentials](#step-3-obtain-cloudinary-api-credentials)
5. [Step 4: Deploy the Backend API on Render.com](#step-4-deploy-the-backend-api-on-rendercom)
6. [Step 5: Seed the Production Cloud Database](#step-5-seed-the-production-cloud-database)
7. [Step 6: Deploy the Frontend on Vercel](#step-6-deploy-the-frontend-on-vercel)
8. [Step 7: Connect CORS & Finalize Network Security](#step-7-connect-cors--finalize-network-security)
9. [Step 8: Set Up 24/7 Zero-Sleep Keep-Alive](#step-8-set-up-247-zero-sleep-keep-alive)
10. [Step 9: Post-Deployment Admin Password Setup](#step-9-post-deployment-admin-password-setup)
11. [Troubleshooting & Verification Commands](#troubleshooting--verification-commands)

---

## 1. Pre-requisites & Accounts Needed

Create free accounts on the following platforms (no credit card required):
1. [GitHub](https://github.com/) — To store repository and trigger automatic cloud deployments.
2. [MongoDB Atlas](https://www.mongodb.com/atlas) — Free cloud MongoDB cluster (M0 tier).
3. [Render.com](https://render.com/) — Free cloud web service for Node.js Express backend.
4. [Vercel](https://vercel.com/) — High-performance Global Edge CDN for the Vite React frontend.
5. [Cloudinary](https://cloudinary.com/) — Free image storage CDN for admin media uploads.
6. [UptimeRobot](https://uptimerobot.com/) — Free 24/7 uptime monitor.

---

## Step 1: Push Codebase to GitHub

1. Open your terminal in the project root (`cwf-updated`):
   ```bash
   git add .
   git commit -m "feat: production deployment release"
   ```

2. Create a new repository on GitHub:
   - Go to [https://github.com/new](https://github.com/new)
   - Repository Name: `cwf-corporation`
   - Visibility: `Private` or `Public`
   - Click **Create repository**.

3. Link and push your branch:
   ```bash
   git remote add origin https://github.com/<your-username>/cwf-corporation.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Create MongoDB Atlas Cloud Database

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Click **Create a Deployment** $\rightarrow$ Choose **M0 Free Tier**.
3. Select a region close to your primary audience (e.g. `AWS - Mumbai (ap-south-1)`).
4. **Create Database Credentials**:
   - Username: `cwf_admin`
   - Password: `CreateAStrongPassword123!` *(Save this password)*
   - Click **Create User**.
5. **Configure Network Whitelist**:
   - Go to **Network Access** (left sidebar).
   - Click **Add IP Address** $\rightarrow$ Click **Allow Access From Anywhere (`0.0.0.0/0`)** $\rightarrow$ Click **Confirm**.
6. **Copy Connection String**:
   - Go to **Database** $\rightarrow$ Click **Connect** on your cluster.
   - Select **Drivers** (Node.js).
   - Copy the URI:
     ```text
     mongodb+srv://cwf_admin:<password>@cluster0.xxxx.mongodb.net/cwf_corporation?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual database user password.

---

## Step 3: Obtain Cloudinary API Credentials

1. Log in to [Cloudinary](https://cloudinary.com/console).
2. On your dashboard, locate the **Product Environment Credentials**:
   - `Cloud Name` (e.g. `dxyxxxxxx`)
   - `API Key` (e.g. `123456789012345`)
   - `API Secret` (e.g. `aBcDeFgHiJkLmNoPqRsTuVwXyZ`)

---

## Step 4: Deploy the Backend API on Render.com

1. Log in to [Render.com](https://dashboard.render.com/) using GitHub.
2. Click **New +** (top right) $\rightarrow$ Select **Web Service**.
3. Choose **Build and deploy from a Git repository** $\rightarrow$ Select `cwf-corporation`.
4. Configure the settings:
   - **Name**: `cwf-backend`
   - **Region**: `Singapore` or `Frankfurt`
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. Expand **Advanced** $\rightarrow$ Click **Add Environment Variable** and add the following keys:

| Environment Variable Key | Production Value / Description |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `5001` |
| `MONGO_URI` | `mongodb+srv://cwf_admin:<password>@cluster0.xxxx.mongodb.net/cwf_corporation?retryWrites=true&w=majority` |
| `JWT_SECRET` | `4b7e8892f23b61c56a81e97d4c0b62e49c7182a4d3e5f601b9a8c7e6d5c4b3a2` *(or any 64-char string)* |
| `JWT_EXPIRE` | `15m` |
| `JWT_REFRESH_SECRET` | `8c7e6d5c4b3a2109f23b61c56a81e97d4c0b62e49c7182a4d3e5f601b9a84b7e` |
| `JWT_REFRESH_EXPIRE` | `7d` |
| `SERVER_URL` | `https://cwf-backend.onrender.com` *(Replace with your Render assigned service URL)* |
| `KEEP_ALIVE_INTERVAL_MINUTES` | `14` |
| `CLOUDINARY_CLOUD_NAME` | *(Your Cloudinary Cloud Name)* |
| `CLOUDINARY_API_KEY` | *(Your Cloudinary API Key)* |
| `CLOUDINARY_API_SECRET` | *(Your Cloudinary API Secret)* |
| `CLIENT_URL` | `http://localhost:5173` *(We will update this in Step 7)* |

6. Click **Create Web Service**.
7. Once deployed (~2 minutes), test your live API health endpoint:
   `https://cwf-backend.onrender.com/api/health`
   - Output should be: `{"success":true,"message":"CWF Consulting Corporation API is active and secure"}`.

---

## Step 5: Seed the Production Cloud Database

To populate your empty production database with initial data (divisions, services, portfolio projects, blogs, testimonials, settings, and staff accounts):

1. In the **Render Dashboard** for `cwf-backend`, click the **Shell** tab on the left.
2. Run the command:
   ```bash
   npm run seed
   ```
3. Press **Enter**. You will see:
   ```text
   Database connected successfully.
   Clearing existing data collections...
   Seeding staff accounts...
   SiteSettings seeded successfully.
   Seeded SegmentInfo records successfully.
   Seeded services for all segments successfully.
   Seeded projects for all segments successfully.
   Seeded testimonials successfully.
   Seeded team members successfully.
   Seeded blog articles successfully.
   Seeded inquiries successfully.
   Seeding completed successfully! All Mongoose collections fully populated.
   ```

---

## Step 6: Deploy the Frontend on Vercel

1. Log in to [Vercel](https://vercel.com/) with GitHub.
2. Click **Add New...** $\rightarrow$ Select **Project**.
3. Import your `cwf-corporation` repository.
4. Configure the build parameters:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click `Edit` and select `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://cwf-backend.onrender.com/api` *(Your Render backend URL + `/api`)*
6. Click **Deploy**.
7. In ~45 seconds, your frontend will be live on a global URL (e.g. `https://cwf-corporation.vercel.app`).

---

## Step 7: Connect CORS & Finalize Network Security

Now that you have your live Vercel domain:
1. Return to the **Render Dashboard** $\rightarrow$ Select `cwf-backend`.
2. Go to **Environment Variables**.
3. Update `CLIENT_URL` to your exact Vercel frontend URL:
   ```env
   CLIENT_URL=https://cwf-corporation.vercel.app
   ```
4. Click **Save Changes**. Render will automatically redeploy with the updated CORS whitelist.

---

## Step 8: Set Up 24/7 Zero-Sleep Keep-Alive

To ensure that your free Render backend **never goes to sleep**:

1. Open [UptimeRobot.com](https://uptimerobot.com/) (Free account).
2. Click **+ Add New Monitor**.
3. Fill in:
   - **Monitor Type**: `HTTP(s)`
   - **Friendly Name**: `CWF Production Backend`
   - **URL (or IP)**: `https://cwf-backend.onrender.com/api/health`
   - **Monitoring Interval**: `Every 5 minutes`
4. Click **Create Monitor**.

> **How it works**: UptimeRobot will ping `/api/health` every 5 minutes from external global servers. Combined with the backend's internal `keepAlive.js` timer, your server will **never idle, never sleep, and never have cold starts**.

---

## Step 9: Post-Deployment Admin Password Setup

After deployment, update your default Superadmin password immediately:

### Option 1: Via Admin Web Portal UI
1. Navigate to: `https://cwf-corporation.vercel.app/admin/login`
2. Log in using default credentials:
   - **Email**: `admin@cwfcorporation.com`
   - **Password**: `Admin@123`
3. Go to **Admin Settings** $\rightarrow$ **Team / User Management**.
4. Click the **Pass** (🔑 Key icon) button next to your account.
5. Enter your new secret password $\rightarrow$ Click **Save New Password**.

### Option 2: Via Render Cloud Shell
1. In the **Render Dashboard** for `cwf-backend`, click **Shell**.
2. Run:
   ```bash
   node scripts/change_password.js admin@cwfcorporation.com MyNewSecretPassword123!
   ```

---

## 🔍 Troubleshooting & Verification Commands

### Test Backend Health:
```bash
curl https://cwf-backend.onrender.com/api/health
```

### Test Dynamic Sitemap:
```bash
curl https://cwf-backend.onrender.com/sitemap.xml
```

### Test Database Connection / Verify Models:
```bash
npm run verify:models
```

### Run Full Test Suite:
```bash
npm run test:all
```

---

*Document generated for CWF Consulting Corporation — Pune, India.*
