# ⚙️ DevTinder Backend

This is the **backend API** of DevTinder — responsible for authentication, user management, and real-time chat functionality.

---

## 🚀 Live API

Base URL:

```
https://devtinder-backend-dgi8.onrender.com
```

---

## ✨ Features

* 🔐 JWT Authentication & Authorization
* 👤 User Profile Management
* 🔎 Developer Search API
* 💬 Real-Time Chat using Socket.io
* 📦 RESTful API Architecture
* 🔒 Secure Route Protection

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.io
* JSON Web Token (JWT)

---

## ⚙️ Installation & Setup

```bash
git clone https://github.com/YOUR_USERNAME/devTinder-backend.git
cd devTinder-backend
npm install
npm start
```

---

## 🔐 Environment Variables

Create a `.env` file:

```
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

---

## 🏗️ Architecture

* Express handles API routes
* MongoDB stores users & messages
* Socket.io enables real-time communication

---

## ⚠️ Important Notes

* Do not upload `.env` to GitHub
* Use environment variables in production
* Ensure CORS is properly configured

---

## ⭐ Support

If you like this project, give it a ⭐!
