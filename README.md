# Notice Board Backend Application

A backend API for a notice board system allowing administrators to create, manage, and distribute notices with file attachments.

## Features

- User authentication (signup/signin) with JWT tokens
- Admin authentication and authorization
- Notice creation with file uploads (supports various file types)
- File storage using Cloudinary
- Data validation using Zod
- Secure password hashing with bcrypt

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Cloudinary for file storage
- Zod for validation

## Project Structure

```
├── .gitignore
├── Controller
│   ├── admin.js        # Admin authentication
│   ├── notice.js       # Notice management
│   └── user.js         # User management 
├── Models
│   ├── admin.js        # Admin model
│   ├── notice.js       # Notice model
│   └── user.js         # User model
├── Route
│   ├── admin.js        # Admin routes 
│   └── user.js         # User routes
├── config.js           # Application configuration
├── index.js            # Application entry point
├── package.json
└── yarn.lock
```

## Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/notice-board-backend.git
   cd notice-board-backend
   ```

2. Install dependencies
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGOOSE_URL=mongodb://localhost:27017/noticeboard
   JWT_ADMIN_PASSWORD=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the server
   ```
   npm start
   ```
   or for development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

### Admin Authentication

- **POST /admin/signup** - Register a new admin
  - Body: `{ email, password, firstName, lastName, departmentName, post }`
  
- **POST /admin/signin** - Admin login
  - Body: `{ email, password }`
  - Returns: JWT token

### Notice Management

- **POST /admin/notices** - Create a new notice (requires authentication)
  - Headers: `{ token: "JWT_TOKEN" }`
  - Body: Multipart form data with:
    - `title`: Notice title
    - `content`: Notice content
    - `category`: Notice category (optional, default: "General")
    - `isImportant`: Whether the notice is important (optional, default: false)
    - `noticeFile`: File attachment (optional)

## Notice Model

Notices include:
- Title and content
- Creator information (admin ID)
- File attachments with type detection
- Category and importance flags
- Created/updated timestamps
- Expiry date (default: 30 days from creation)
- Active status

## File Uploads

Files are uploaded to Cloudinary cloud storage with the following features:
- File size limit: 10MB
- Supported file types: PDF, DOC, DOCX, images (JPG, PNG, etc.)
- File type detection and categorization
- Secure URL generation

## Authentication

JWT-based authentication is used for securing endpoints. The token contains the admin ID and must be included in the request header as `token`.

## Error Handling

The API includes comprehensive error handling with appropriate status codes and error messages for:
- Validation errors
- Authentication/authorization failures
- File upload issues
- Database errors

## Development

Run the development server with auto-restart:
```
npm run dev
```

## License

[MIT](LICENSE)
