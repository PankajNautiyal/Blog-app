# Blog App

This is a full-stack Blog application built with **React** for the frontend and **Node.js (Express)** for the backend. It allows users to register, log in, create posts, and manage them. The app also supports themes (light/dark mode) and offers file upload functionality.

## Features

- User Registration and Login
- Post Creation, Viewing, and Deletion
- Light and Dark Theme Toggle
- Responsive Design for Mobile and Desktop
- JWT-based Authentication and Authorization
- File Uploads for Post Covers
- CORS Configuration for Frontend-Backend Communication

## Tech Stack

- **Frontend**: React, TailwindCSS
- **Backend**: Node.js, Express, MongoDB, JWT Authentication, Multer for file uploads
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **File Upload**: Multer (with file renaming and default fallback image)

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB instance (either locally or hosted, e.g., MongoDB Atlas)
- A text editor or IDE (e.g., VSCode)

### Frontend Setup

```bash
// open terminal
cd frontend
npm install
npm run dev
```


### Backend Setup

```bash
// open terminal
cd backend
npm install
npm run dev

