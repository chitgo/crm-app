CRM App Frontend

This is the frontend for the CRM App, a React Native mobile application built with Expo. It allows users to manage customers and leads with a modern UI, search functionality, and secure authentication. Users must register and log in before they can create customers, manage leads, or use other features.

Frontend folder:

cd frontend



Install dependencies:

npm install



Set up environment variables:





Copy .env.example to .env:

cp .env.example .env



Edit .env with the backend API URL:

API_URL=http://localhost:5000



Note: Ensure the backend server is running (see Backend README).



Start the app:

npm run android





Scan the QR code with the Expo Go app on your Android device, or press a to open in an Android emulator.
