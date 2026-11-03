# 🤝 SocialCare — Social Development & Community Service Platform

**SocialCare** is a community-driven event management platform where individuals, volunteers, and organizations can create, join, track, and manage social development and service events in their local areas (e.g., Winter Clothes Distribution, Plantation Drives, Clean-up Campaigns, Blood Donation, Emergency Relief, etc.).


## ✨ Key Features

Here are five key highlights of the **SocialCare** platform:

1. 🗓️ **Upcoming & Past-Filtered Event Directory:** View real-time community events in clean card layouts. The platform automatically filters out expired events and displays upcoming initiatives sorted chronologically.
2. 🔐 **Robust Authentication & Protected APIs:** Full email/password and social login support using **BetterAuth / JWT validation**, complete with custom middleware guarding private routes and server endpoints.
3. 🛠️ **Organizer Dashboard (Manage Events):** Event creators have strict authorization rights to update or delete their own created events, ensuring zero unauthorized mutations by other users.
4. 🤝 **One-Click Event Joining & Tracking:** Volunteers can seamlessly join or leave public events. Dynamic database updates keep track of current participant rosters and list all joined events on a personalized user dashboard.
5. 🌗 **Interactive Theme Customization (Dark/Light Mode):** Seamless full-system theme toggling (Light & Dark) designed with custom UI components, responsive layout systems, and zero hydration mismatches.

---

## 🛠️ Tech Stack & Technologies Used

### **Frontend (Client)**
* **Framework:** Next.js (App Router)
* **Language:** TypeScript / JavaScript
* **Styling & UI:** Tailwind CSS, Shadcn UI
* **Icons:** Lucide React
* **State & Auth:** Better Auth / NextAuth, React Context API

### **Backend (Server)**
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB Atlas (MongoClient, Replica Sets, Native Indexing)
* **Security & Auth:** JSON Web Tokens (JWT), CORS, Environment Configuration (`dotenv`)

### **Hosting & Deployment**
* **Client Hosting:** Vercel
* **Server Hosting:** Render / Vercel

---

## ⚡ Additional Highlights & Challenges Implemented

* **Strict Form & Data Validation:** Complete validation logic on both client and server sides preventing past-date inputs, invalid image URLs, or weak passwords.
* **Database Unique Constraints:** Implemented MongoDB compound unique indexes on `{ eventId: 1, "user.email": 1 }` to prevent duplicate event registrations.
* **Responsive Grid System:** Fully optimized UI tailored for Desktop, Tablet, and Mobile devices with uniform cards, consistent visual hierarchy, and dynamic images.
* **No Default Browser Alerts:** Custom Toast notifications and SweetAlert2 interfaces used for all success/error user feedback.

