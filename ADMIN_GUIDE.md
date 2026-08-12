# CWF Corporation — Admin Panel Operations Guide

Welcome to the **CWF Corporation Admin Portal**! This guide is written in clear, non-technical language to help you and your staff manage daily business operations, inspect client leads, publish portfolio case studies, and maintain your website content.

---

## 1. Accessing the Control Panel

* **Sign-In Link:** Open your browser and navigate to `http://localhost:5173/admin/login` (or the production URL provided upon launch).
* **Credentials:** Log in with your email address and password.
* **Security Note:** The portal automatically logs you out after inactivity to keep client data secure.

---

## 2. Dashboard Overview

The **Dashboard** is the first screen you see. It provides an operational summary of your active business metrics:
* **Inquiry Counters:** Displays the total inquiries received to date, new leads registered this week (with growth indicators), and pending leads requiring response.
* **Pipeline Chart:** A visual bar breakdown showing how many inquiries are *New*, *Contacted*, *Quoted*, *Converted*, or *Closed*.
* **Popular Services:** Tracks which waterproofing service pages are receiving the highest customer page views.
* **Recent Inquiries & Quick View:** Click the **Quick View** button beside any recent lead to inspect the property details and customer message instantly without leaving the dashboard.

---

## 3. Managing Leads & Inquiries

Waterproofing leads are critical assets. The **Leads Manager** is designed to track them through your business pipeline:
* **Search & Filters:** Search for client names, phone numbers, or emails. Filter records by status (e.g. "Quoted" or "Site Visit Scheduled") or date ranges.
* **Managing a Lead:** Click **Manage** to open the details card. Here, you can:
  * **Update Status:** Shift a lead's state (e.g. change status from `New` to `Site Visit Scheduled` after setting up an inspection date, or mark as `Converted` when the deal is signed).
  * **Assign Staff:** Select an active staff member to take responsibility for the lead.
  * **Internal Notes:** Type in updates (e.g. details of dampness scans, core drills, or price estimates) and click **Save Lead**. These notes are saved with a date and user stamp and are invisible to the public.

---

## 4. Managing Services

Here, you can add or modify the waterproofing services listed on your website:
* **Adding a Service:** Click **New Service** at the top right.
* **Category & Icon:** Select the appropriate service category (e.g., *Basement Seeping*, *Terrace Waterproofing*) and pick a visual icon representing it.
* **Ordering:** Set a display number (e.g. `1`, `2`) to control which services appear first on your home page list.
* **Cover Image:** Click **Upload cover** to select the main banner photo for the service card.
* **Gallery Images:** Select multiple files to upload to the service detail page photo gallery.
* **Rich Description:** Write a detailed description. Use the formatting toolbar at the top (Bold, Italic, Bullet Lists, Headings) to style your paragraphs. Click the **Preview** tab to check the styled output before saving.
* **Publish Status:** Check "Publish this service immediately" to make it visible to visitors, or leave it unchecked to save it as a draft.

---

## 5. Portfolio & Project Case Studies

Showcase your completed waterproofing works with before/after comparisons:
* **General Details:** Enter the title, location (e.g. *Kothrud, Pune*), square footage treated, and completion date.
* **Client & Service Tags:** Classify the project by client type (*Residential*, *Commercial*, *Industrial*) and service category (*Terrace*, *Basement*, etc.) to enable filtering on the public case studies grid.
* **Before / After Photos:**
  * Click **Upload** under the *Before Images* section to add photos showing the initial slab leaks, dampness scans, or concrete fractures.
  * Click **Upload** under the *After Images* section to add photos showing the completed polyurethane lining or grouting.
* **Featured Projects:** Check "Feature this case study" to show it on the public home page slider.

---

## 6. Blog Management

Share technical advice, diagnostic advice, and updates:
* **Writing Articles:** Enter the title, category tags, and cover image. Use the formatting toolbar to design the article body.
* **SEO Metadata:** Enter the **Meta Title** and **Meta Description**. These are the headlines and summaries shown on Google Search results. Keep the Meta Title under 60 characters and the Description under 160 characters for best display results.
* **Drafts:** Save articles as drafts (unchecked "Publish") while writing. Toggle to "Publish" only when ready to make it visible to the public.

---

## 7. Testimonials & Client Reviews

Manage client reviews shown on your home page carousel:
* **Review Details:** Add the client's name, type, and rating (1 to 5 stars).
* **Linked Projects:** Select a portfolio case study from the dropdown to link the review directly to a completed project on the public pages.
* **Photos:** Upload a profile picture of the customer representative (optional).

---

## 8. Team Profiles

Manage the listings of your engineering and inspection staff shown on the "About" page:
* **Staff Profiles:** Add the name, professional designation (e.g. *Senior Structural Auditor*), ordering sequence, and a short bio detailing their expertise and certifications.

---

## 9. Site Settings

Maintain global contact details and business parameters in a single form:
* **Modify Details:** Update your office phone, customer inquiry email, street address, and working hours.
* **Social Links:** Link your active Facebook, Instagram, or LinkedIn pages.
* **Certifications:** Enter your safety credentials (e.g. `ISO 9001:2015 Structural Safety`) as a list to update trust signals.
* **Role Check:** Only **Superadmin** roles can save modifications on this screen.

---

## 10. User Management (Superadmin Only)

If you are logged in as a Superadmin, this screen lets you manage your internal staff credentials:
* **Provision Accounts:** Enter a staff member's email, assign a password, choose their role (`superadmin` or `editor`), and click **Create**.
* **Role Differences:**
  * **Superadmin:** Full access to all screens, including User Management and editing Site Settings.
  * **Editor:** Full access to manage leads, services, projects, blogs, testimonials, and team profiles. Cannot create accounts or edit site settings.
* **Deactivating Staff:** Click **Deactivate** beside any staff member to suspend their access immediately. If they are currently logged in, their session token will expire and block further edits.
