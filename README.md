# MakeCV - Professional Resume Builder Web Application

A full-stack Resume Builder web application built with **React**, **TypeScript**, **Redux Toolkit**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB**.

---

## 🚀 Key Features

### 1. Authentication & Strong Password Security
- User registration and login protected with **bcryptjs** password hashing and **JWT** session tokens.
- **Strict Strong Password Enforcement**:
  - Minimum 8 characters
  - At least 1 uppercase letter (`A-Z`)
  - At least 1 lowercase letter (`a-z`)
  - At least 1 number (`0-9`)
  - At least 1 special character (`!@#$%^&*...`)
- **Real-time Password Strength Meter**: 4-segment dynamic progress bar with color transitions and interactive criteria checklist.
- Quick **Instant Demo Account** button for testing without registering.

### 2. Main Page (Resumes Dashboard)
- **Dashboard Metrics**: Total Resumes, Downloaded Count, Last Modified info.
- **Search & Filter**: Real-time search across resume title, target role, candidate name, email, and skills.
- **Filter Dropdowns**: Filter by target roles and formats.
- **Bulk Actions**: Select All, Bulk DOCX Download, Bulk Delete with confirmation modal.
- **Tabular View**: Candidate avatars with initials, name, role, email, skills badges, DOCX format badge, last edited timestamp with author, and actions (Download DOCX, Edit, Preview, Delete).
- **Pagination**: Easy pagination across large resume databases.

### 3. Interactive Resume Builder (Add & Edit)
- **4-Step Wizard**:
  1. *Personal Details*: Full Name, Email, Phone, Location, LinkedIn, GitHub, Portfolio.
  2. *Education*: Multiple degree entries with Institution, Degree, Dates, GPA, and Coursework.
  3. *Experience*: Multiple work experience entries with Company, Role, Location, Dates, Current checkbox, and interactive bullet points.
  4. *Skills*: Dynamic tag-based skill input with quick-add suggestions.
- **Live Synchronized Document Preview**:
  - Real-time rendering matching the **Standard Executive** template.
  - Zoom controls (`-`, `100%`, `+`, `Standard A4`).
  - Print / Save as PDF capability.
  - One-click Plain Text clipboard copy.
- Edit existing resumes with pre-populated form state.

### 4. High-Fidelity DOCX & PDF Export
- Generates clean, Microsoft Word compatible `.docx` files using the `docx` library.
- Formatted with centered executive headers, horizontal borders, tabular alignment for dates/titles, and bullet points.
- Client-side and server-side DOCX export options.
- Browser print-to-PDF support with dedicated print stylesheets.

---

## 🛠 Tech Stack

- **Frontend**:
  - React 19 + TypeScript
  - Vite
  - Redux Toolkit & React-Redux
  - React Router v7
  - Tailwind CSS v4
  - Axios
  - Lucide React (Icons)
  - `docx` & `file-saver` (Word document generation)
- **Backend**:
  - Node.js & Express
  - TypeScript
  - Mongoose & MongoDB
  - `bcryptjs` (Password hashing)
  - `jsonwebtoken` (JWT Authentication)
  - `docx` (Server-side document generation)
  - `cors` & `dotenv`

---

## 📦 Getting Started

### Prerequisites
1. **Node.js** (v18 or higher recommended)
2. **MongoDB** running locally on port `27017` (e.g. `mongodb://127.0.0.1:27017/makecv`)

### Installation

From the root project directory:

```bash
# Install root dependencies
npm install

# Install server dependencies
npm run install:server

# Install client dependencies
npm run install:client
```

---

## 🏃 Running the Application

### 1. Start the Backend Server (Port 5000)
```bash
npm run dev:server
```
*The server will automatically connect to MongoDB and seed initial sample data on first run.*

### 2. Start the Frontend Client (Port 5173)
```bash
npm run dev:client
```

Visit **http://localhost:5173** in your web browser.

---

## 🔑 Default Demo Credentials

For quick evaluation, click the **Instant Demo Account** button on the Login page or use:
- **Email**: `demo@makecv.com`
- **Password**: `Password@2026!`

Or register a new account ensuring your password satisfies the strong password criteria!

---

## 🧪 Testing the API

Run the automated test suite verifying health check, strong password rejection/acceptance, JWT auth, resume CRUD, and DOCX generation:

```bash
npm test
```
