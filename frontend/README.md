
# 📱 CRM App Frontend

This is the frontend for the **CRM App**, a React Native mobile application built with Expo.  
It allows users to manage customers and leads with a modern UI, search functionality, and secure authentication.  
Users must register and log in before they can create customers, manage leads, or use other features.

## 📁 Frontend folder

```bash
cd frontend
```

## 📦 Install dependencies

```bash
npm install
```

## ⚙️ Set up environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and set the backend API URL:

```env
API_URL=http://localhost:5000
```

> 💡 Note: Ensure the backend server is running (see Backend README).

## 🚀 Start the app

```bash
npm run android
```

- Scan the QR code with the **Expo Go** app on your Android device, or  
- Press `a` to open the app in an Android emulator.
