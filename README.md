# QuizMaster Pro - Advanced Quiz Management System

A comprehensive online quiz management system with rich text editing, code compilation, and advanced question types.

## Features

### 🎯 Core Features
- **Complete Quiz Management**: Create, edit, delete, and publish quizzes
- **Multiple Question Types**: Multiple choice and code compilation questions
- **Rich Text Editor**: Quill-based editor with LaTeX support for mathematical expressions
- **Code Editor**: Monaco editor with syntax highlighting for multiple languages
- **Docker-based Code Execution**: Secure code execution for C, C++, Java, and Python
- **User Authentication**: Role-based access control (Admin, Instructor, Student)
- **Real-time Quiz Taking**: Timer-based quiz interface with progress tracking
- **Automatic Grading**: Test case validation for coding questions

### 🎨 Design Features
- **Modern UI**: Glass morphism effects and gradient backgrounds
- **Responsive Design**: Optimized for all device sizes
- **Smooth Animations**: Hover effects and transitions throughout
- **Professional Typography**: Clean, readable fonts with proper hierarchy
- **Comprehensive Color System**: Primary, secondary, accent, and status colors

### 🔧 Technical Features
- **MongoDB Integration**: Robust data persistence with proper schemas
- **RESTful API**: Well-structured backend with Express.js
- **Docker Support**: Containerized code execution environment
- **Security**: JWT authentication, input validation, and secure code execution
- **File Organization**: Modular architecture with clean separation of concerns

## Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- MongoDB (or use Docker Compose)

### Installation

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Start with Docker Compose (Recommended)**
   ```bash
   docker-compose up -d
   ```
   This starts MongoDB and the server with all dependencies.

3. **Or Start Manually**
   ```bash
   # Start MongoDB (if not using Docker)
   mongod

   # Start the development servers
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api
   - MongoDB: localhost:27017

### Default Users
Create accounts through the registration form with these roles:
- **Admin**: Full system access
- **Instructor**: Can create and manage quizzes
- **Student**: Can take published quizzes

## Project Structure

```
├── src/                          # Frontend React application
│   ├── components/              # React components
│   │   ├── Auth/               # Authentication components
│   │   ├── Dashboard/          # Dashboard components
│   │   ├── Quiz/               # Quiz-related components
│   │   ├── Layout/             # Layout components
│   │   └── UI/                 # Reusable UI components
│   ├── stores/                 # Zustand state management
│   └── services/               # API services
├── server/                      # Backend Node.js application
│   ├── src/
│   │   ├── models/             # MongoDB models
│   │   ├── routes/             # Express routes
│   │   ├── middleware/         # Custom middleware
│   │   └── services/           # Business logic services
│   └── Dockerfile              # Server container configuration
└── docker-compose.yml          # Multi-container setup
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Quizzes
- `GET /api/quizzes` - List all quizzes
- `GET /api/quizzes/:id` - Get single quiz
- `POST /api/quizzes` - Create quiz (Instructor/Admin)
- `PUT /api/quizzes/:id` - Update quiz (Instructor/Admin)
- `DELETE /api/quizzes/:id` - Delete quiz (Instructor/Admin)

### Submissions
- `POST /api/submissions` - Submit quiz answers
- `GET /api/submissions/my` - Get user's submissions
- `GET /api/submissions/:id` - Get submission details

### Code Execution
- `POST /api/code/execute` - Execute code
- `POST /api/code/test` - Test code against test cases

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activities` - Get recent activities

## Supported Programming Languages

The system supports secure code execution for:
- **JavaScript** (Node.js 16)
- **Python** (Python 3.9)
- **C++** (GCC latest)
- **C** (GCC latest)
- **Java** (OpenJDK 11)

Each language runs in isolated Docker containers with:
- Memory limits (128MB)
- CPU limits (50%)
- Network isolation
- Execution timeouts
- Read-only file system access

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
```

### Backend (server/.env)
```
MONGODB_URI=mongodb://localhost:27017/quiz-system
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3001
```

## Development

### Running in Development Mode
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:client  # Frontend only
npm run dev:server  # Backend only
```

### Building for Production
```bash
# Build frontend
npm run build

# Build server
npm run build:server
```

### Docker Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for different user roles
- **Input Validation**: Joi-based request validation
- **Secure Code Execution**: Isolated Docker containers with resource limits
- **SQL Injection Prevention**: MongoDB with proper query sanitization
- **XSS Protection**: Content sanitization in rich text editor

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@quizmaster.pro or create an issue in the GitHub repository.