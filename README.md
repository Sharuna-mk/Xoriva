# Xoriva E-Commerce Website

Xoriva is a full-stack MERN-based e-commerce platform designed to provide a seamless online shopping experience with modern UI, secure authentication, product management, cart system, and Stripe payment integration.

---

## Features

### User Features

* User registration and login (JWT authentication)
* Browse products with search and filters
* View product details
* Add/remove items from cart
* Manage delivery addresses
* Secure checkout using Stripe
* Order history tracking

### Admin Features (if applicable)

* Add, update, delete products
* Manage inventory
* View orders

---

## Tech Stack

### Frontend

* React.js
* Redux Toolkit
* Tailwind CSS / CSS
* Axios
* React Router DOM

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Bcrypt
* Stripe API

---

## Project Structure

XORIVA/

frontend/

* src/

  * components/
  * pages/
  * redux/
  * services/
  * App.js
* package.json

backend/

* controllers/
* models/
* routes/
* middleware/
* config/
* server.js

README.md

---

## Installation & Setup

### 1. Clone the repository

git clone (repository link)
cd xoriva

### 2. Backend Setup

cd backend
npm install

Create .env file:
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key

Run backend:
npm start

---

### 3. Frontend Setup

cd frontend
npm install
npm start

---

## Payment Integration

* Stripe is used for secure payments
* Checkout session is created from backend
* Frontend redirects user to Stripe checkout page

---

## Authentication Flow

* Users register/login using email and password
* Passwords are hashed using bcrypt
* JWT token is used for protected routes

---

## API Endpoints (Sample)

### Auth

* POST /api/auth/register
* POST /api/auth/login

### Products

* GET /api/products
* POST /api/products
* DELETE /api/products/:id

### Cart

* GET /api/cart
* POST /api/cart/add
* DELETE /api/cart/remove

### Orders

* POST /api/orders/create
* GET /api/orders/user

---

## Future Improvements

* Wishlist feature
* Product reviews and ratings
* Admin dashboard analytics
* Email notifications
* Coupon system

---

## Author

Developed by sharuna M K

