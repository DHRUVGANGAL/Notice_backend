# Notice Board Backend API

This is a RESTful API backend service for a Notice Board application that enables administrators to post, update, and manage notices while allowing users to view them.

## Features

- **User Authentication**: Secure signup and signin for both admins and regular users
- **Notice Management**: Create, read, update, and delete notices 
- **File Uploads**: Support for document attachments (PDF, DOC, DOCX, images)
- **Cloud Storage**: Cloudinary integration for file storage
- **Data Validation**: Input validation using Zod schema

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads handling
- **Cloudinary** - Cloud storage for files
- **Zod** - Schema validation

## Project Structure

```
├── .gitignore             # Git ignore file
├── Controller/            # Route controllers
│   ├── admin.js           # Admin authentication & middleware
│   ├── notice.js          # Notice CRUD operations
│   └── user.js            # User authentication & middleware
├── Models/                # Database models
│   ├── admin.js           # Admin schema
│   ├── notice.js          # Notice schema
│   └── user.js            # User schema
├── Route/                 # API routes
│   ├── admin.js           # Admin routes
│   └── user.js            # User routes
├── config.js              # Application configuration
├── index.js               # Entry point
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation
```

## API Endpoints

### Admin Routes

- **POST /admin/signup** - Register a new admin
- **POST /admin/signin** - Admin login
- **POST /admin/notices** - Create a new notice
- **PUT /admin/update-notices/:id** - Update an existing notice
- **DELETE /admin/delete-notices/:id** - Delete a notice
- **GET /admin/get-notices** - Get all notices created by the admin

### User Routes

- **POST /user/signup** - Register a new user
- **POST /user/signin** - User login
- **GET /user/notices** - Get all notices (for users)

## Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- MongoDB
- Cloudinary account

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd notice-board-backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```
   
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGOOSE_URL=mongodb://localhost:27017/notice_board
   JWT_ADMIN_PASSWORD=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the server
   ```bash
   node index.js
   ```
   
   For development with auto-reload:
   ```bash
   npm install -g nodemon
   nodemon index.js
   ```

## API Documentation

### Admin Authentication

#### Register Admin
```
POST /admin/signup
```
Request body:
```json
{
  "email": "admin@example.com",
  "password": "securepassword",
  "firstName": "Admin",
  "lastName": "User",
  "departmentName": "IT",
  "post": "System Administrator"
}
```

#### Admin Login
```
POST /admin/signin
```
Request body:
```json
{
  "email": "admin@example.com",
  "password": "securepassword"
}
```
Response:
```json
{
  "token": "jwt_token_here"
}
```

### Notice Management

#### Create Notice
```
POST /admin/notices
```
Headers:
```
token: jwt_token_here
```
Body (form-data):
```
title: Notice Title
content: Notice content details
category: General
isImportant: true/false
noticeFile: [file upload]
```

#### Update Notice
```
PUT /admin/update-notices/:id
```
Headers:
```
token: jwt_token_here
```
Body (form-data):
```
title: Updated Title
content: Updated content
category: Academic
isImportant: true/false
noticeFile: [file upload]
```

#### Delete Notice
```
DELETE /admin/delete-notices/:id
```
Headers:
```
token: jwt_token_here
```

#### Get Admin Notices
```
GET /admin/get-notices
```
Headers:
```
token: jwt_token_here
```

### User Authentication

#### Register User
```
POST /user/signup
```
Request body:
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "Regular",
  "lastName": "User",
  "departmentName": "Finance"
}
```

#### User Login
```
POST /user/signin
```
Request body:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
Response:
```json
{
  "token": "jwt_token_here"
}
```

## Security

- Passwords are hashed using bcrypt
- Authentication handled via JWT tokens
- Input validation with Zod

## License

[MIT License](LICENSE)

## Contributors

- Your Name or Team Name
