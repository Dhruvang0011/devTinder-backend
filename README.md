# ⚙️ DevTinder Backend

This is the **backend API** for DevTinder — a full-stack developer networking platform that enables users to connect, interact, and chat in real-time.

The backend handles **authentication, user management, and real-time communication** using modern and scalable technologies.

---

## 🚀 Live API

Base URL:

```text
https://your-backend-url.onrender.com
```

---

## ✨ Features

* 🔐 JWT Authentication & Authorization
* 👤 User Profile Management
* 🔎 Developer Search API
* 💬 Real-Time Chat using Socket.io
* 📦 RESTful API Design
* 🔒 Protected Routes with Middleware
* 🌐 CORS Enabled for Frontend Integration

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.io
* JSON Web Token (JWT)

---

## 📁 Project Structure

```text
src
 ├── Config          # Database & app configuration
 ├── middlewares     # Auth & error handling middleware
 ├── models          # Mongoose schemas
 ├── routes          # API routes
 ├── utils           # Helper functions
 └── app.js          # Entry point
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/devTinder-backend.git
cd devTinder-backend
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

---

### 4️⃣ Run the Server

```bash
npm start
```

For development (if using nodemon):

```bash
npm run dev
```

---

## 📡 API Endpoints (Examples)

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| POST   | /api/auth/register | Register user       |
| POST   | /api/auth/login    | Login user          |
| GET    | /api/users         | Get all users       |
| GET    | /api/profile       | Get user profile    |
| GET    | /api/chat          | Fetch chat messages |

---

## 🔐 Authentication

* Uses **JWT tokens** for secure authentication
* Protected routes require valid token in headers or cookies

---

## 🔄 Real-Time Communication

* Powered by **Socket.io**
* Enables instant messaging between users
* Supports live updates without page refresh

---

## 🌐 CORS Configuration

The backend allows requests from:

```text
http://localhost:5173
https://your-frontend-url.vercel.app
```

---

## ⚠️ Important Notes

* ❌ Do NOT upload `.env` file to GitHub
* 🔐 Keep your JWT secret secure
* ⚡ Free tier on Render may cause cold start delays

---

## 📌 Highlights

* Clean and modular architecture
* Scalable backend design
* Real-time chat implementation
* Secure authentication system

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork and submit a pull request.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## ⭐ Support

If you found this project useful, give it a ⭐ on GitHub!
