# 🛠️ CRM App Backend

This is the backend for the CRM App, built with **Node.js**, **Express**, and **Prisma**.  
It provides a **REST API** for managing customers and leads, with **JWT authentication** and a **MySQL database**.

---

## 📦 Installation

### 1. Navigate to the backend folder:

```bash
cd backend
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Set up environment variables:

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
DATABASE_URL="mysql://root:your_password@localhost:3306/crm_db"
```

### 4. Set up MySQL database:

Create a MySQL database named `crm_db`:

```sql
CREATE DATABASE crm_db;
```

Run Prisma migrations to create tables:

```bash
npx prisma migrate dev --name init
```

### 5. Start the server:

For development (with hot reload):

```bash
npm run dev
```

---

## 🧰 Tech Stack

- **Node.js** + **Express**
- **Prisma ORM**
- **MySQL**
- **JWT Authentication**
- **dotenv** for environment configuration
- **Nodemon** for development

---

## 🔐 Authentication

This backend uses JWT for authentication. Clients must include a valid JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are issued on login and required for protected routes.

---

## 🧪 Testing

You can test the API using Postman. Start the server and use the `/api/auth/login` and `/api/auth/register` endpoints to authenticate.

---

## 📬 Contact

Feel free to reach out at **kostas.chitos@gmail.com** if you have any questions or suggestions.
