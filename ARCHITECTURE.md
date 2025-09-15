# 🏗️ System Architecture – College Resource Hub

---

## 🔹 High-Level Architecture

```
[React Frontend]  <-->  [Express API]  <-->  [MongoDB Atlas]
      │                      │
      │  Auth (JWT)          │
      │  File Upload (Multer)│
      │                      │
      └────────────── File Storage (uploads/)
```

---

## 🔹 Data Models

### User
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "role": "student | admin",
  "status": "active | inactive"
}
```

### Resource
```json
{
  "title": "Math Notes",
  "subject": "Mathematics",
  "fileUrl": "/uploads/math.pdf",
  "downloads": 12,
  "ratings": [ { "score": 5, "feedback": "Great notes!" } ],
  "uploadedBy": "user_id"
}
```

### Rating
```json
{
  "score": 1-5,
  "feedback": "string",
  "user": "user_id"
}
```

---

## 🔹 Key Flows

1. **Authentication Flow**  
   - User registers/login → JWT generated → Used for all requests  

2. **Resource Upload/Download Flow**  
   - Student uploads PDF (Multer saves file)  
   - Metadata stored in MongoDB  
   - Downloads increment count  

3. **Admin Management Flow**  
   - Admin promotes/demotes users  
   - Can deactivate/reactivate users  
   - Can delete inappropriate resources  
