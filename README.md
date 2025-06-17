# 📇 CRM App

A full-stack **Customer Relationship Management (CRM)** application built with **React Native (frontend)** and **Node.js (backend)**.  
The app enables users to manage customers and leads with features such as search, creation, editing, deletion, user authentication, and a modern mobile UI experience with animations.

---

## 🧩 Overview

### 🖼️ Frontend
- Built with **React Native** and **Expo**.
- Styled using **Tailwind CSS** via `nativewind`.
- Smooth UI animations using `react-native-reanimated`.
- Navigation via `@react-navigation/native`.

### 🛠️ Backend
- Built with **Node.js**, **Express**, and **Prisma**.
- **MySQL** as the primary database.
- **JWT-based authentication** and secure password hashing with `bcrypt`.

---

## 📁 Repository Structure

```
crm-app/
├── frontend/   → React Native mobile app
└── backend/    → Node.js REST API server
```

---

## 🚀 Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/chitgo/crm-app.git
cd crm-app
```

2. **Set up the backend**

- Navigate to the `backend/` folder and follow the instructions in [`backend/README.md`](backend/README.md).

3. **Set up the frontend**

- Navigate to the `frontend/` folder and follow the instructions in [`frontend/README.md`](frontend/README.md).

---

## ✅ Features

### 🔷 Frontend
- View all customers and leads.
- Add new leads/customers.
- Edit and delete existing records.
- Search by name.
- Secure login/logout flow with **JWT**.
- Clean, animated UI.

### 🔶 Backend
- Full **CRUD API** for customers and leads.
- **Authentication system** with JWT tokens.
- **MySQL** database schema managed with **Prisma ORM**.
- Passwords securely stored using `bcrypt`.

---

## 🛠 Tech Stack

### 🖼️ Frontend
- React Native + Expo
- Tailwind CSS (`nativewind`)
- React Navigation
- Axios
- AsyncStorage

### 🛠 Backend
- Node.js + Express
- Prisma ORM + MySQL
- JWT for auth
- bcrypt for password encryption

### 🧰 Dev Tools
- Git & GitHub
- Nodemon
- ESLint + Prettier

---

## 📌 Notes

- The project is structured for easy scalability and real-world use.
- Future enhancements can include role-based access control, file uploads, or a web-based dashboard.

---

## 📬 Contact

Feel free to reach out at **kostas.chitos@gmail.com** if you have any questions or suggestions.
