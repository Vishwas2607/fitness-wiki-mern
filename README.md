🏋️‍♂️ FitnessWiki

A full-stack MERN fitness planner web application that helps users follow structured workout plans based on their fitness goals.

Users can:

Choose from recommended workout plans

Generate custom workout plans based on personal data (age, height, weight, level, equipment, etc.)

Preview workouts before saving them

Securely manage their saved workout plans

🚧 Currently 50-60% complete — actively under development with continuous improvements.

🚀 Tech Stack
Frontend

React

TypeScript

TailwindCSS

React Query

Zod (Validation)

Context API (Auth state management)

Backend

Node.js

Express.js

MongoDB (Mongoose + MongoDB Atlas)

JWT Authentication (Access + Refresh Tokens)

HTTP-only Cookies

Zod (Validation)

Helmet

Morgan (Environment-based logging)

Rate Limiting (General + Auth specific)

🏗️ Architecture

Backend follows clean layered architecture:

Model → Repository → Service → Controller → Routes

⚡ Express v5 Native Async Error Handling

This project uses Express v5+, which natively supports async error handling.

Unlike Express v4, there is:

❌ No need for express-async-handler

❌ No need for custom async wrappers

✅ Errors can be thrown directly inside async controllers

✅ Automatically caught by the global error handler

📂 Project Structure

Backend Structure
config/
controllers/
middleware/
models/
repositories/
routes/
services/
utils/
app.js
server.js

Frontend Structure
src/
  components/
  context/
  hooks/
  layouts/
  pages/
  services/
  types/
  App.tsx
lib/ (Shared Zod schemas)

🔐 Authentication Flow (Fully Implemented)

User Registration

Login

Logout

JWT Authentication

Access + Refresh Token Rotation

HTTP-only Cookies

Single Session Enforcement

/auth/me backend verification for persistent login

Context-based secure auth state management

Encapsulated setter logic (no direct state manipulation)

🔥 Security Measures

Helmet

Rate limiting (auth & global)

Global error handler

Zod validation (frontend + backend)

Role-based authorization middleware

📦 Database Schemas

User

GlobalExercise (Admin-managed exercise dictionary)

WorkoutPlan

SavedWorkoutPlan

🚧 WorkoutLog (Planned)

✅ Features Completed
👤 User Features

Authentication system (production-level flow)

Dashboard (username + recommended plans)

Workout plan preview (day-wise exercises)

Protected routes

Dark theme responsive UI

Form validation with detailed error messages

Disabled submit buttons until valid input

🏋️ Workout Plan Logic

Backend filtering-based recommended plans

Template-based generation (Push/Pull/Legs logic)

Rule-based exercise selection from GlobalExercise schema

🛠 Admin Capabilities (Backend Implemented)

Create Global Exercises

Read Global Exercises

Delete Global Exercises

Update (Pending)

Role-based access control

💾 Saved Workout

Save plan logic implemented (schema refactor pending update)

Get saved plans

🚧 Work In Progress

Custom workout plan generation (schema redesign ongoing)

Fix saved workout logic after schema redesign

Workout log model

Frontend Admin panel (currently using Postman)

Exercise Update route

Improved exercise filtering logic

Avoid repetition

Balanced number of exercises per day

Score-based selection system

Better randomization logic

🧠 Key Engineering Decisions
1️⃣ Backend-Based Auth Verification

Avoided:

LocalStorage authentication (security risk)

useState-only auth (caused reload issues)

Solution:

/auth/me endpoint verification

Context-based verifyAuth() function

Encapsulated setter logic

Controlled markUnauthenticated() function

No direct state mutation from components

This ensures:

No UI flicker

Secure authentication

Clean state management

⚙️ Environment Variables
Frontend
VITE_BACKEND_URL=

Backend
PORT=
CLIENT_URL=
MONGO_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
ADMIN_SECRET=
NODE_ENV=

🛠 Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/Vishwas2607/fitness-wiki-mern.git
cd FitnessWiki

2️⃣ Backend Setup
cd backend
npm install
npm run dev

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

📌 Current Limitations

Exercise database is still limited (affects filtering accuracy)

Some generated workout days may contain inconsistent exercise counts

Save workout flow temporarily broken due to schema redesign

No workout tracking/logging yet

🎯 Upcoming Features

Smart score-based exercise filtering

Workout logging system

Progress tracking dashboard

Admin dashboard UI

Plan editing functionality

Deployment (Production ready)

Unit & integration testing

CI/CD setup

💡 Future Improvements (Suggestions)

Add pagination for exercises

Add muscle recovery logic between workout days

Add analytics (weekly volume, intensity tracking)

Implement Redis for token blacklist (optional scaling)

Add Docker support

Add Swagger documentation

Add GitHub Actions CI

📊 Project Status

🟡 50% Complete
🚀 Actively Improving & Refactoring

This project demonstrates:

Production-level authentication

Backend architecture structuring

Role-based access control

Advanced filtering logic

Secure state management

Clean folder structure

Usage of Express v5 native async error propagation

Clean global error handling architecture

👨‍💻 Author

Built with consistency and focus on backend architecture, authentication security, and scalable logic.