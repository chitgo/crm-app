CRM App Backend

This is the backend for the CRM App, built with Node.js, Express, and Prisma. 
It provides a REST API for managing customers and leads,
with JWT authentication and a MySQL database.

Installation





Navigate to the backend folder:

cd backend



Install dependencies:

npm install



Set up environment variables:





Copy .env.example to .env:

cp .env.example .env



Edit .env with your MySQL credentials and JWT secret:

DATABASE_URL="mysql://root:your_password@localhost:3306/crm_db"
JWT_SECRET="your_jwt_secret"



Set up MySQL database:





Create a MySQL database named crm_db:

CREATE DATABASE crm_db;



Run Prisma migrations to create tables:

npx prisma migrate dev --name init



Start the server:





For development (with hot reload):

npm run dev
