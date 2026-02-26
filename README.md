# DevOverflow

> A community-driven Q&A platform built for developers, by developers.

---

## 📖 Project Description

DevOverflow is a Q&A platform for developers where they can ask programming questions, share knowledge, and help each other solve technical problems. It is designed for programmers, students, and anyone learning or working in software development. Users can post questions with rich-text formatting, browse answers from the community, and get AI-assisted help — all in one place. The platform also features a reputation and badge system that rewards contributors based on their activity and impact, encouraging a healthy and engaged community.

---

## 🚀 Setup Instructions

Follow these steps to run DevOverflow locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A Google and GitHub OAuth app (for social login)
- A Gmail account with an App Password enabled (for email sending)
- A TinyMCE API key
- A Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/your-username/devoverflow.git
cd devoverflow
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project and add the following:

```env
# TinyMCE Editor
NEXT_PUBLIC_TINY_EDITOR_API_KEY=your_tinymce_api_key

# MongoDB
MONGODB_URL=mongodb+srv://your_user:your_password@cluster.mongodb.net/devoverflow

# Better Auth
BETTER_AUTH_SECRET=your_random_secret_string
BETTER_AUTH_URL=http://localhost:3000   # Base URL of your app

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Email (Nodemailer via Gmail)
EMAIL_FROM=your_email@gmail.com
PASS=your_gmail_app_password   # App password from Gmail account settings

# App URL
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

> **Note:** For Gmail, you need to enable 2-Step Verification and generate an App Password from your Google Account settings. Do not use your regular Gmail password.

### 4. Run the development server

```bash
npm run dev
```

The app will be running at [http://localhost:3000](http://localhost:3000).

---

## 🏗️ Architecture Overview

DevOverflow is a full-stack application built entirely within Next.js — there is no separate backend server.

```
┌─────────────────────────────────────────────────┐
│                   Browser (Client)               │
│  - React components + Tailwind CSS + shadcn/ui   │
│  - Forms handled by React Hook Form + Zod        │
│  - TinyMCE rich text editor                      │
│  - Better Auth client (login/session triggers)   │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│               Next.js (Server Layer)             │
│                                                  │
│  Server Actions  ──────────────►  MongoDB        │
│  (CRUD operations, data logic)                   │
│                                                  │
│  API Routes:                                     │
│  - /api/email  ──────────────►  Nodemailer       │
│  - /api/ai     ──────────────►  Gemini API       │
│                                                  │
│  Better Auth (server-side session validation)    │
└─────────────────────────────────────────────────┘
```

**How it connects:**
- The frontend triggers **Server Actions** for all database operations (fetching questions, posting answers, voting, etc.). No REST API is needed for these.
- **API Routes** handle email sending via Nodemailer and AI requests via the Gemini API.
- **Better Auth** handles authentication flows. Login and registration are triggered from the client, but session validation and access to protected data happen server-side.
- All data is stored in **MongoDB**, taking advantage of its flexible document structure for nested data like questions, answers, tags, and comments.

---

## 🧠 Technical Decisions

### 1. MongoDB over a relational database
Since DevOverflow is a Q&A platform, the data is naturally nested and flexible — questions have answers, answers have comments, and tags connect across many questions. MongoDB's document model made it straightforward to store and query this kind of data without the overhead of complex joins. Its scalability also makes it a strong fit for a growing community platform.

### 2. Better Auth over NextAuth
Rather than reaching for the most popular solution, I chose Better Auth to deepen my understanding of how authentication actually works. This decision pushed me to learn about session management, email verification flows, and OAuth integrations at a lower level. The result was a stronger grasp of auth fundamentals rather than treating it as a black box.

### 3. Custom Badges & Reputation System
Rather than using a third-party library, I built a custom badge and reputation system from scratch. Users earn Bronze, Silver, and Gold badges based on six tracked metrics: question count, answer count, question upvotes, answer upvotes, and total profile views. Each metric has tiered thresholds, and badges are recalculated automatically as a user's activity grows. Reputation points are also awarded for positive contributions, giving the community a clear signal of who the most helpful and active members are. Building this myself gave me full control over the logic and made it a natural fit within the existing MongoDB data model.

### 4. Next.js Server Actions over a traditional REST API
Instead of building a separate API layer, I used Next.js Server Actions to handle all database logic. This keeps the codebase clean and organized — backend logic lives alongside the frontend but runs exclusively on the server. It also improves security since database credentials and operations are never exposed to the client.

---

## 📸 Screenshots

> Replace the placeholders below with actual screenshots of your app.

### Home Page
<img width="1920" height="1312" alt="image" src="https://github.com/user-attachments/assets/665d4bed-e13e-45db-bae5-6f9d9b709e72" />

*Browse the latest questions from the community*

### Question Detail Page
<img width="1920" height="1693" alt="image" src="https://github.com/user-attachments/assets/ececdfed-2270-461e-975e-54ef7322f08d" />
*View a question, read answers, and contribute your own*

### Ask a Question
<img width="1920" height="1375" alt="image" src="https://github.com/user-attachments/assets/b8de2c2d-3bf8-47b4-8ddb-7605a1db867d" />
*Rich text editor powered by TinyMCE for writing detailed questions*

### User Profile
<img width="1920" height="1461" alt="image" src="https://github.com/user-attachments/assets/157db376-ac22-42d8-a66f-85a9d87c7545" />
*Track your questions, answers, and reputation*

### Mobile View
<img width="443" height="2466" alt="image" src="https://github.com/user-attachments/assets/7501afae-5549-4f3b-8e65-a8ea0adddca7" />
*Fully responsive design across all screen sizes*

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Forms | React Hook Form + Zod |
| Rich Text Editor | TinyMCE |
| Database | MongoDB |
| Authentication | Better Auth |
| Email | Nodemailer (Gmail) |
| AI | Google Gemini API |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
