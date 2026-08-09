# CWF Corporation - API Documentation

The backend API is structured with separate public and private endpoints. Private endpoints are protected by role-based Access Control (RBAC) using JWT access tokens and HTTP-Only cookies.

## Base URL
- Local Development: `http://localhost:5000`
- API Route Prefix: `/api`

---

## Authentication Endpoints

### 1. Staff Login
Authenticates an administrator/editor and returns an access token in the JSON body, and sets a refresh token in an HTTP-Only cookie.
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Auth Required:** No
- **Rate Limit:** 5 requests / 15 minutes per IP
- **Request Body:**
  ```json
  {
    "email": "admin@cwfcorporation.com",
    "password": "your_secure_password"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "660c1b48b1a45b85a3...",
      "email": "admin@cwfcorporation.com",
      "role": "superadmin"
    }
  }
  ```

### 2. Refresh Token Session
Renews an expired access token using the refresh token stored in the HTTP-Only cookie.
- **URL:** `/api/auth/refresh`
- **Method:** `POST`
- **Auth Required:** Yes (via `refreshToken` cookie)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "660c1b48b1a45b85a3...",
      "email": "admin@cwfcorporation.com",
      "role": "superadmin"
    }
  }
  ```

### 3. Staff Logout
Clears the refresh token cookie, ending the session.
- **URL:** `/api/auth/logout`
- **Method:** `POST`
- **Auth Required:** No
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Successfully logged out."
  }
  ```

---

## Public Endpoints (No Auth Required)

### 1. Get All Services
- **URL:** `/api/services`
- **Method:** `GET`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "660c1b48b1a45b85a3...",
        "title": "Terrace Waterproofing",
        "slug": "terrace-waterproofing",
        "category": "terrace",
        "shortDescription": "Full terrace repair Solutions.",
        "coverImage": "https://res.cloudinary.com/...",
        "views": 42
      }
    ]
  }
  ```

### 2. Get Service by Slug
Fetches a service by its slug and increments its view count dynamically on the server.
- **URL:** `/api/services/:slug`
- **Method:** `GET`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "660c1b48b1a45b85a3...",
      "title": "Terrace Waterproofing",
      "slug": "terrace-waterproofing",
      "category": "terrace",
      "views": 43
    }
  }
  ```

### 3. Get Project Portfolio
Fetches completed projects.
- **URL:** `/api/projects`
- **Method:** `GET`
- **Query Parameters (Optional):**
  - `category`: Filter by service category (e.g. `terrace`, `basement`)
  - `featured`: Filter by featured projects (e.g. `true`, `false`)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "660c1b48b1a45b85a3...",
        "title": "IT Park Basement Grouting",
        "location": "Hinjawadi, Pune",
        "clientType": "commercial",
        "serviceCategory": "basement",
        "isFeatured": true
      }
    ]
  }
  ```

### 4. Get Published Testimonials
- **URL:** `/api/testimonials`
- **Method:** `GET`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "660c1b48b1a45b85a3...",
        "clientName": "Rajesh Kumar",
        "rating": 5,
        "text": "Highly professional and punctual team."
      }
    ]
  }
  ```

### 5. Get Published Blog Posts
- **URL:** `/api/blog`
- **Method:** `GET`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "660c1b48b1a45b85a3...",
        "title": "Why Basements Leak in Pune Monsoon",
        "slug": "pune-basement-leakages-monsoon",
        "tags": ["basement", "monsoon"]
      }
    ]
  }
  ```

### 6. Get Blog Post by Slug
- **URL:** `/api/blog/:slug`
- **Method:** `GET`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "660c1b48b1a45b85a3...",
      "title": "Why Basements Leak in Pune Monsoon",
      "slug": "pune-basement-leakages-monsoon",
      "content": "<p>Leakage triggers...</p>"
    }
  }
  ```

### 7. Get Global Settings
Fetches the singleton settings. Automatically bootstraps defaults if empty.
- **URL:** `/api/settings`
- **Method:** `GET`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "companyPhone": "+91 20 1234 5678",
      "companyEmail": "info@cwfcorporation.com",
      "address": {
        "street": "101, Apex Commercial Hub, MG Road",
        "city": "Pune",
        "pincode": "411001",
        "country": "India"
      }
    }
  }
  ```

### 8. Submit Public Inquiry (Lead Form)
Captures website inquiries and schedules background email alerts to the admin and customer.
- **URL:** `/api/inquiries`
- **Method:** `POST`
- **Rate Limit:** 5 submissions / 1 hour per IP
- **Request Body:**
  ```json
  {
    "name": "Ashok Dwivedi",
    "phone": "+91 9876543210",
    "email": "ashok@example.com",
    "propertyType": "residential",
    "serviceInterested": "terrace",
    "message": "Water logging on terrace during heavy rains.",
    "source": "website-form"
  }
  ```
- **Response (211 Created):**
  ```json
  {
    "success": true,
    "message": "Inquiry submitted successfully.",
    "data": {
      "_id": "660c1b48b1a45b85a3...",
      "name": "Ashok Dwivedi",
      "status": "new"
    }
  }
  ```

---

## Admin Endpoints (Auth & Gated RBAC)

All admin requests require the header: `Authorization: Bearer <access_token>`

### 1. Service CRUD Operations
- **POST `/api/services`**: Create a service (Admin/Editor). Request body matches public service structure.
- **PUT `/api/services/:id`**: Update a service (Admin/Editor).
- **DELETE `/api/services/:id`**: Delete a service (Admin/Editor).

### 2. Project CRUD Operations
- **POST `/api/projects`**: Create a project (Admin/Editor).
- **PUT `/api/projects/:id`**: Update a project (Admin/Editor).
- **DELETE `/api/projects/:id`**: Delete a project (Admin/Editor).

### 3. Testimonial CRUD Operations
- **POST `/api/testimonials`**: Create a testimonial (Admin/Editor).
- **PUT `/api/testimonials/:id`**: Update a testimonial (Admin/Editor).
- **DELETE `/api/testimonials/:id`**: Delete a testimonial (Admin/Editor).

### 4. Blog CRUD Operations
- **POST `/api/blog`**: Create a blog post (Admin/Editor).
- **PUT `/api/blog/:id`**: Update a blog post (Admin/Editor).
- **DELETE `/api/blog/:id`**: Delete a blog post (Admin/Editor).

### 5. Team Member CRUD Operations
- **POST `/api/team`**: Create a team member profile (Admin/Editor).
- **PUT `/api/team/:id`**: Update a team member profile (Admin/Editor).
- **DELETE `/api/team/:id`**: Delete a team member profile (Admin/Editor).

### 6. Update Site Settings (Singleton)
Updates global contacts and business details.
- **URL:** `/api/settings`
- **Method:** `PUT`
- **Auth Required:** Yes (Superadmin only)
- **Request Body:** Similar to settings fetch object.

### 7. Get Inquiries (Lead List)
Allows searching, paging, status filters, and date range filters on leads.
- **URL:** `/api/admin/inquiries`
- **Method:** `GET`
- **Auth Required:** Yes (Admin/Editor)
- **Query Parameters (Optional):**
  - `status`: e.g. `new`, `contacted`, `quoted`
  - `startDate`, `endDate`: ISO8601 strings (e.g. `2026-08-01`)
  - `search`: Search string matching name, email, phone, or message
  - `page`: Page index (default: `1`)
  - `limit`: Leads per page (default: `10`)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 1,
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 10,
      "pages": 5
    },
    "data": [ ... ]
  }
  ```

### 8. Update Lead Status / Add Internal Notes
Updates lead progression and appends comment history.
- **URL:** `/api/admin/inquiries/:id/status`
- **Method:** `PATCH`
- **Auth Required:** Yes (Admin/Editor)
- **Request Body:**
  ```json
  {
    "status": "site-visit-scheduled",
    "note": "Scheduled inspection for Tuesday 3 PM.",
    "assignedTo": "660c1b48b1a45b85a3..."
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Inquiry details updated successfully.",
    "data": {
      "_id": "660c1b48b1a45ba3...",
      "status": "site-visit-scheduled",
      "internalNotes": [
        {
          "note": "Scheduled inspection for Tuesday 3 PM.",
          "addedBy": {
            "email": "admin@cwfcorporation.com"
          },
          "createdAt": "2026-08-09T14:10:00Z"
        }
      ]
    }
  }
  ```

### 9. Get Dashboard Performance Stats
- **URL:** `/api/admin/dashboard/stats`
- **Method:** `GET`
- **Auth Required:** Yes (Admin/Editor)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "leadsByStatus": {
        "new": 10,
        "contacted": 8,
        "site-visit-scheduled": 12,
        "quoted": 5,
        "converted": 6,
        "closed": 4
      },
      "leadVolumeComparison": {
        "thisWeek": 15,
        "lastWeek": 10,
        "growthRate": 50.00
      },
      "topServices": [
        { "title": "Terrace Waterproofing", "views": 104 },
        { "title": "Basement Grouting", "views": 89 }
      ]
    }
  }
  ```

### 10. Image Upload Utility
Uploads an image asset to Cloudinary. Returns the secure public URL.
- **URL:** `/api/admin/upload`
- **Method:** `POST`
- **Auth Required:** Yes (Admin/Editor)
- **Request Format:** `multipart/form-data`
- **Payload:**
  - `image`: File binary (allowed: `.jpeg`, `.png`, `.webp`, Max Size: 5MB)
  - `folder` (Optional): Cloudinary folder path
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Image uploaded successfully.",
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234/cwf_corporation/filename.png"
  }
  ```

### 11. Create Staff Credentials
- **URL:** `/api/admin/users`
- **Method:** `POST`
- **Auth Required:** Yes (Superadmin only)
- **Request Body:**
  ```json
  {
    "email": "editor_name@cwfcorporation.com",
    "password": "secret_password_here",
    "role": "editor"
  }
  ```
- **Response (211 Created):**
  ```json
  {
    "success": true,
    "message": "Staff user created successfully.",
    "data": {
      "id": "660c1b48b1a45b85a3...",
      "email": "editor_name@cwfcorporation.com",
      "role": "editor",
      "isActive": true
    }
  }
  ```

### 12. Deactivate Staff Account
- **URL:** `/api/admin/users/:id/status`
- **Method:** `PATCH`
- **Auth Required:** Yes (Superadmin only)
- **Request Body:**
  ```json
  {
    "isActive": false
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Staff account status updated to inactive.",
    "data": {
      "id": "660c1b48b1a45b85a3...",
      "email": "editor_name@cwfcorporation.com",
      "isActive": false
    }
  }
  ```
