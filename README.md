# 📚 College Resource Hub

A web platform for students and administrators to securely manage and access study materials.  
Students can upload, download, rate, and review resources, while administrators manage users and content.

---

## 🚀 Features

- 🔑 **Secure Authentication** – JWT-based login/register with role-based access (student/admin)  
- 📂 **Resource Management** – Upload/download PDFs (notes, question papers, guides)  
- ⭐ **Rating & Feedback** – Students can rate resources and leave reviews  
- 📊 **Smart Dashboard** – Top rated, most downloaded, personalized recommendations  
- 👨‍💼 **Admin Dashboard** – Manage users (promote/demote/deactivate), view stats, delete resources  
- 📈 **Statistics** – Overview of users, resources, downloads, active users  
- 🎨 **Responsive UI** – Gradient UI with animations, charts, dashboards  

---

## 🛠️ Tech Stack

**Frontend:** React, Tailwind CSS, Vite, Recharts  
**Backend:** Node.js, Express.js  
**Database:** MongoDB Atlas (Mongoose ODM)  
**Authentication:** JWT + bcrypt  
**File Handling:** Multer for uploads  
**Charts:** Recharts  

---

## 📸 Screenshots

> *(Add actual screenshots in repo `/screenshots/` and reference them here)*  

- Login Page  
- Student Dashboard  
- Admin Dashboard  

---

## ⚙️ Installation & Setup

### 🔹 Prerequisites
- Node.js >= 18  
- MongoDB Atlas account (or local MongoDB)  
- Git  

### 🔹 Steps
1. **Clone repo**
   ```bash
   git clone https://github.com/your-username/college-resource-hub.git
   cd college-resource-hub
   ```

2. **Backend setup**
   ```bash
   cd server
   npm install
   ```

   Create `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your-mongodb-uri
   JWT_SECRET=supersecret
   ```

   Start backend:
   ```bash
   npm run dev
   ```

3. **Frontend setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

   Runs on 👉 [http://localhost:5173](http://localhost:5173)

---

## 🔑 Environment Variables

Create `.env` in `server/`:

| Variable     | Description                     |
|--------------|---------------------------------|
| `PORT`       | Backend server port (default 5000) |
| `MONGO_URI`  | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing key                 |

---

## 📡 API Documentation

See 👉 [`docs/API.md`](./docs/API.md)  

---

## 🧩 Project Structure

```
college-resource-hub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page-level components
│   │   └── api.js          # Axios instance
│   └── ...
├── server/                 # Express backend
│   ├── routes/             # API routes (auth, admin, resources)
│   ├── models/             # Mongoose models
│   ├── middleware/         # Auth middlewares
│   └── server.js           # App entry
├── docs/                   # Documentation
│   ├── API.md              # API reference
│   └── ARCHITECTURE.md     # System design
└── README.md
```

---

## 👨‍💻 Usage Guide

**Students:**
- Register/Login  
- Upload notes (PDFs only)  
- Search, download, and rate resources  
- Get personalized recommendations  

**Admins:**
- Manage users (promote/demote/deactivate)  
- Delete inappropriate resources  
- View statistics dashboard  

---

## 🏗️ System Architecture

See 👉 [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)  

---

## 🧑‍🤝‍🧑 Contributors
- [Your Name] – Full Stack Developer  

---

## 📜 License
MIT License.  
