# AI-Powered Citizen Complaint & Service Portal

A full-stack web application designed to provide citizens with a centralized platform for accessing government services, submitting complaints, and tracking service requests.

## Current Progress

### Week 1 — Project Setup & Authentication

- React frontend
- Node.js + Express backend
- MongoDB database
- User registration
- Secure password hashing
- User login
- JWT authentication
- Protected API routes
- Protected dashboard
- CORS configuration
- Responsive authentication interface

## Technology Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- JWT
- bcrypt

### Database
- MongoDB
- Mongoose

## Project Structure

```text
ai-citizen-service-portal/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── server.js
│   └── package.json
│
└── README.md