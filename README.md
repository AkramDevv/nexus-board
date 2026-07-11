# NexusBoard

A modern **Project Management Dashboard** built with **Next.js 16**, **TypeScript**, **Prisma ORM**, **SQLite**, **NextAuth**, and **Tailwind CSS**.

NexusBoard allows users to manage projects, tasks, team members, comments, workspace activity, and analytics through a modern dashboard.

---

# Technologies

* Next.js 16 (App Router)
* React 19
* TypeScript
* Prisma ORM
* SQLite
* NextAuth
* Tailwind CSS
* Recharts
* Zod
* Lucide React
* date-fns

---

# Features

## Authentication

* User Registration
* Secure Login
* Logout
* Password hashing with bcrypt
* Protected routes using NextAuth

---

## Dashboard

* Workspace overview
* Total projects
* Completed projects
* Total tasks
* Completed tasks
* Pending tasks
* Recent projects
* Recent tasks
* Analytics charts
* Responsive dashboard

---

## Project Management

* Create Project
* Update Project
* Delete Project
* Project Details
* Project Settings
* Project Search
* Status Filtering
* Color Selection

---

## Task Management

* Create Task
* Edit Task
* Delete Task
* Task Details
* Status Updates
* Priority Levels
* Due Dates
* Task Assignment
* Search
* Status Filtering

---

## Team Management

* Add Members
* Remove Members
* Update Member Roles
* Owner / Admin / Member permissions
* Authorization checks

---

## Comments

* Add comments
* Delete comments
* Member discussion
* Permission-based access

---

## Activity Feed

Tracks all important workspace events including:

* Project Created
* Project Updated
* Task Created
* Task Updated
* Task Deleted
* Task Status Changed
* Member Added
* Member Removed
* Member Role Updated
* Comment Added

Includes:

* Filtering
* Pagination
* Project links
* Timeline view

---

## Analytics

Interactive charts built with Recharts.

* Task Status Distribution
* Task Priority Distribution
* Project Completion Progress

---

## Security

* Authentication using NextAuth
* Authorization based on project roles
* Protected Server Actions
* Input validation with Zod
* Prisma ORM for database safety

---

# Project Structure

```
src
 ├── actions
 ├── app
 ├── components
 ├── lib
 ├── prisma
 ├── auth.ts
 └── middleware.ts
```

---

# Installation

Clone the repository.

```bash
git clone https://github.com/AkramDevv/nexus-board.git
```

Open the project.

```bash
cd nexus-board
```

Install dependencies.

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL="file:./dev.db"

NEXTAUTH_URL="http://localhost:3000"

NEXTAUTH_SECRET="YOUR_SECRET_KEY"
```

Generate a secret if needed:

```bash
npx auth secret
```

Copy the generated secret into:

```env
NEXTAUTH_SECRET=YOUR_SECRET
```

---

# Database Setup

Generate Prisma Client.

```bash
npx prisma generate
```

Run database migrations.

```bash
npx prisma migrate dev
```

Seed the database.

```bash
npx prisma db seed
```

Open Prisma Studio.

```bash
npx prisma studio
```

---

# Run the Project

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Start production:

```bash
npm run start
```

Lint project:

```bash
npm run lint
```

---

# Demo Accounts

## Project Owner

Email:

```
admin@nexusboard.dev
```

Password:

```
Demo123!
```

---

## Member

Email:

```
sophia@nexusboard.dev
```

Password:

```
Demo123!
```

---

## Admin Member

Email:

```
daniel@nexusboard.dev
```

Password:

```
Demo123!
```

---

# Permissions

## Owner

* Full project management
* Manage members
* Create/Edit/Delete projects
* Create/Edit/Delete tasks
* Update member roles
* Remove members
* View analytics
* Manage comments

## Admin

* Manage tasks
* Update task status
* Delete tasks
* Manage comments

## Member

* View assigned projects
* Create comments
* Update assigned task status

---

# Database

This project uses:

* SQLite
* Prisma ORM
* Prisma Migrations
* Prisma Studio

---

# Author

**Akram Huseynli**

GitHub:

https://github.com/AkramDevv

---

# Notes

NexusBoard is a modern full-stack project management platform built with Next.js, showcasing a scalable architecture, reusable component design, Server Actions, secure authentication, role-based authorization, Prisma database integration, responsive UI, and modern Next.js development best practices.
