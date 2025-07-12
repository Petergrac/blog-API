## 📝 Blog API Documentation (REST)

**Base URL:** `http://localhost:3000`

---

## 🔐 Authentication

### Register a New User
- `POST /api/register`
- **Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "your_password"
  "check_password": "your_password"
}
```

### Login
- `POST /api/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "your_password"
}
```
- **Response:** JWT Token

### Get Logged-in User Info
- `GET /api/me`
- **Header:** `Authorization: Bearer <token>`

---

## 📚 Post Routes

### Create a New Post
- `POST /api/posts`
- **Header:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "title": "Post Title",
  "content": "Post content...",
  "imageUrl": "https://...",
  "shared": false,
  "status": "DRAFT"
}
```

### Get All Published Posts
- `GET /api/posts`

### Get All Drafts (Owner Only)
- `GET /api/posts/drafts`
- **Header:** `Authorization: Bearer <token>`

### Get Post by ID
- `GET /api/posts/:id`

### Get Draft Post by ID
- `GET /api/posts/:id/drafts`
- **Header:** `Authorization: Bearer <token>`

### Update a Post
- `PATCH /api/posts/:id`
- **Header:** `Authorization: Bearer <token>`
- **Body:** fields to update

### Publish a Post
- `PATCH /api/posts/:id/publish`
- **Header:** `Authorization: Bearer <token>`

### Delete a Post
- `DELETE /api/posts/:id`
- **Header:** `Authorization: Bearer <token>`

---

## 💬 Comment Routes

### Add Comment to a Post
- `POST /api/posts/:postId/comments`
- **Header:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "content": "This is a comment."
}
```

### Get Comments for a Post
- `GET /api/posts/:postId/comments`

### Update a Comment
- `PATCH /api/comments/:commentId`
- **Header:** `Authorization: Bearer <token>`

### Delete a Comment
- `DELETE /api/comments/:commentId`
- **Header:** `Authorization: Bearer <token>`

---

## 👑 Admin Routes

### Get All Posts (including drafts)
- `GET /api/admin/posts`
- **Header:** `Authorization: Bearer <token>`

### Get All Users
- `GET /api/users`
- **Header:** `Authorization: Bearer <token>`

### Update User Role
- `PATCH /api/users/:id/role`
- **Header:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "role": "AUTHOR" // or "USER"
}
```

---

## 👍 Likes & Shares

### Like a Post
- `POST /api/posts/:id/like`
- **Header:** `Authorization: Bearer <token>`

### Like a Comment
- `POST /api/comments/:id/like`
- **Header:** `Authorization: Bearer <token>`

### Share a Post
- `POST /api/posts/:id/share`
- **Header:** `Authorization: Bearer <token>`

