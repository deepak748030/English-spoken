# 📘 English Spoken Backend

This is the backend API for the **English Spoken** learning platform. It powers features like user lessons, topics with downloadable PDFs, free video resources, and eBook ordering.

---

## 🚀 Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** with Mongoose
- **Multer** (PDF Uploads)
- **RESTful APIs**
- **Environment-based Configuration**

---

## 📁 Project Structure

```

/controllers        → All business logic
/models             → Mongoose schemas
/routes             → API route declarations
/middleware         → Multer config, error handling
/utils              → Common response utilities
/uploads/pdfs       → Stores uploaded topic/eBook PDFs
.env                → Environment variables (IMG\_URL etc.)

````

---

## 📌 Features

### 🧠 Course & Topic Management
- CRUD operations for Courses, Lessons, and Topics
- Upload `topicNotes` and `practiceQuestion` PDFs via Multer

### 📽️ Free Videos by Category
- Manage video resources linked to specific subcategories
- Each video includes title, description, author, and link

### 📚 eBooks System
- Add eBooks with title, description, rating, banner
- Upload `demoPdfUrl` and `originalPdfUrl` using Multer
- Associate each eBook with the uploading user

### 🛒 eBook Orders
- Users can place orders for eBooks
- API returns all orders with populated eBook and user details
- Admin can fetch all orders for dashboard view

---

## 📦 APIs Overview

> Full API documentation will be added soon via Postman Collection or Swagger.

**Key API Modules:**
- `/api/topic` – Manage topics and PDFs
- `/api/resources` – Manage free video content
- `/api/ebooks` – Manage eBooks
- `/api/ebook-orders` – Create and track eBook orders

---

## 🔐 Authentication

> ⚠️ Authentication middleware is not implemented yet  
Planned features:
- JWT-based token auth
- Admin vs User roles
- Protected endpoints for sensitive data

---

## 🛠️ Installation & Running Locally

```bash
git clone https://github.com/deepak748030/English-spoken.git
cd English-spoken
npm install
````

### 📂 Create a `.env` file:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
IMG_URL=http://localhost:5000/uploads/
```

### ▶️ Start the server:

```bash
npm run dev
```

---

## 📤 Uploads

* All PDFs (notes/questions/demo/original) are uploaded to:

  ```
  /uploads/pdfs/
  ```

* URLs returned from APIs will be of form:

  ```
  http://localhost:5000/uploads/pdfs/filename.pdf
  ```

---

## 🧑 Future Plans

* [ ] Add authentication and authorization (JWT)
* [ ] Add Swagger UI for documentation
* [ ] Add student performance tracking
* [ ] Add quizzes and practice modules

---

## 🤝 Contributing

Pull requests and feature suggestions are welcome!

---

## 👨‍💻 Author

**Deepak Kushwah**
[GitHub](https://github.com/deepak748030)

---

## 📃 License

This project is licensed under the MIT License.
