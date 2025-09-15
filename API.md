# 📡 API Documentation – College Resource Hub

Base URL: `/api`

---

## 🔑 Auth Routes

### POST `/auth/register`
Register a new student.
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "student"
}
```

### POST `/auth/login`
Login and receive JWT.
```json
{
  "token": "jwt-token",
  "role": "student",
  "name": "John Doe"
}
```

---

## 📂 Resource Routes

- **POST** `/resources/upload` – Upload PDF (auth required)  
- **GET** `/resources` – List all resources  
- **GET** `/resources/top-rated` – Get top-rated resources  
- **GET** `/resources/most-downloaded` – Get most downloaded  
- **GET** `/resources/:id/view` – Inline PDF view  
- **GET** `/resources/:id/download` – Download + increment counter  
- **DELETE** `/resources/:id` – Delete (admin only)  

---

## 👨‍💼 Admin Routes

- **GET** `/admin/users` – List all users  
- **PUT** `/admin/users/:id/role` – Promote/demote user  
- **PUT** `/admin/users/:id/status` – Activate/deactivate user  
- **GET** `/admin/resources` – List all resources  
- **GET** `/admin/stats` – Platform stats (users, downloads, resources)  
