# User Authentication & Role-Based API

A RESTful API built with Node.js, Express, and MongoDB that handles user registration, login, protected profiles, and role-based access control (admin and regular users).

---

## 🚀 Features

- User registration with email and hashed password (using bcrypt).  
- Login with JWT authentication.  
- Protected routes for user profile and admin actions.  
- Role-based access control: only admins can view all users and ban others.  
- User profile update and account deletion (self-service).  
- Basic user banning functionality (admin only).  
- Consistent JSON responses with appropriate HTTP status codes.  
- Custom middleware for token validation and role verification.  
- Centralized error handling.  
- Basic input validation.  
- Optional cookie-based token management for added security.

---

## 🛠 Technologies Used

- Node.js  
- Express  
- MongoDB (Official Driver)  
- bcrypt (password hashing)  
- jsonwebtoken (JWT handling)  
- dotenv (environment variables)  
- cookie-parser (optional, for cookie handling)

---

## ⚙️ Installation

1. Clone the repository:

```bash
git clone https://github.com/Kevon99/APIRest_DataBase.git
cd APIRest_DataBase

    Install dependencies:

npm install

    Create a .env file in the root directory and add the following variables (adjust values accordingly):

PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/your-database
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d

    Start the server:

    For development with auto-reload (if you have nodemon):

npm run dev

    For production:

npm start

📚 API Endpoints
Method	Endpoint	Description	Access
POST	/register	Register a new user	Public
POST	/login	User login and receive JWT token	Public
GET	/profile	Get current logged-in user profile	Authenticated
GET	/users	List all users	Admin only
PUT	/update-password	Update logged-in user's password	Authenticated
DELETE	/logout	Logout user (token invalidation)	Authenticated
DELETE	/ban	Ban a user (admin only)	Admin only
🔒 Security & Authentication

    Passwords are securely hashed with bcrypt before storing.

    JWT tokens are used for authentication and authorization.

    Tokens must be sent in the Authorization header as Bearer <token>.

    Role-based middleware restricts access to sensitive routes.

    Middleware validates tokens and extracts user data for protected routes.

    Optional use of HTTPOnly cookies for storing tokens securely.

    Basic protection against common vulnerabilities (injection, XSS, etc.).

🗂 Project Structure

/routes          # API route definitions
/middlewares     # Authentication, authorization, and error handlers
/controllers     # Business logic (optional)
/connectionDB    # Database connection and models
api.js           # Main server entry point
.env             # Environment variables (not committed)

💻 Usage & Testing

You can test the API using tools like Postman or Thunder Client:

    Register a user by sending a POST request to /register with JSON body:

{
  "email": "user@example.com",
  "password": "yourPassword",
  "adminCode": "optionalAdminCodeIfApplicable"
}

    Login with POST /login and save the returned JWT token.

    For protected routes, add the following header:

Authorization: Bearer <your_token_here>

    Try fetching your profile with GET /profile.

    Only admins can access /users or ban users with DELETE /ban.


## 🧪 API Testing

You can test this API using [Thunder Client](https://www.thunderclient.com/).  
To get started quickly, import the provided collection:

📁 [`APIRest_ThunderCollection.json`](./thunder/APIRest_ThunderCollection.json)

It includes:

- Registration
- Login
- Token-protected routes
- Admin actions


🤝 Contributing

This project is intended for educational and personal use.
Contributions and suggestions are welcome via issues or pull requests.
📞 Contact

Kevin Guzmán
GitHub
kevingonzalezguz10@gmail.com
📄 License

MIT License — see the LICENSE file for details.


---

If you want, I can also help you create example Postman collections or add sample requests/responses. Just let me know!

